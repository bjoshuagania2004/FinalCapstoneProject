import { NodeEmail } from "../middleware/emailer.js";
import {
  User,
  Accreditation,
  OrganizationProfile,
  Organization,
} from "../models/index.js";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const SendFinancialEmailInquiry = async (req, res) => {
  try {
    const {
      orgId,
      orgName,
      inquiryText,
      userPosition,
      userName,
      selectedTransaction,
    } = req.body;

    // Find the active user linked to the organization profile, return only email
    const organization = await User.findOne({
      organizationProfile: orgId,
    });

    if (!organization || !organization.email) {
      return res.status(404).json({
        success: false,
        error: "Organization email not found.",
      });
    }

    const orgEmail = organization.email;

    // Destructure relevant transaction details
    const { description, amount, type, date, document } = selectedTransaction;

    const documentInfo = document
      ? `Attached Document: ${document.fileName} (Status: ${document.status})`
      : "No attached document.";

    // --- Email to Adviser ---
    const Subject = "New Financial Report Inquiry";
    const Message = `
Hello ${orgName},

A new inquiry has been submitted regarding a transaction in your organization's financial report.

Transaction Details:
- Type: ${type}
- Description: ${description}
- Amount: ₱${amount.toLocaleString()}
- Date: ${new Date(date).toLocaleDateString()}
- ${documentInfo}

Inquiry Details:
- From: ${userPosition} ${userName}  
- Message: ${inquiryText}

Please log in to the system to review.

Thank you.
    `;

    await NodeEmail(orgEmail, Subject, Message);

    return res.status(200).json({
      success: true,
      message: "Inquiry emails sent successfully.",
    });
  } catch (error) {
    console.error("❌ Error sending inquiry emails:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to send inquiry emails.",
    });
  }
};

export const CheckAccreditationApprovalStatus = async (req, res) => {
  const { orgProfileId } = req.params;

  try {
    // Find the accreditation and populate referenced documents
    const accreditation = await Accreditation.findOne({
      organizationProfile: orgProfileId,
    })
      .populate("Roster")
      .populate("PresidentProfile")
      .populate("organizationProfile")
      .populate("JointStatement")
      .populate("PledgeAgainstHazing");

    if (!accreditation) {
      return res.status(404).json({ message: "Accreditation not found." });
    }

    // ✅ First check Accreditation's overallStatus
    if (accreditation.overallStatus === "Approved") {
      return res.status(200).send(null); // send nothing if already approved
    }

    // Check individual statuses only if accreditation is not approved
    const rosterStatus = accreditation?.Roster?.overAllStatus;
    const presidentStatus = accreditation?.PresidentProfile?.overAllStatus;
    const orgStatus = accreditation?.organizationProfile?.overAllStatus;
    const jointStatementStatus = accreditation?.JointStatement?.status;
    const hazingPledgeStatus = accreditation?.PledgeAgainstHazing?.status;

    const allApproved =
      rosterStatus === "Approved" &&
      presidentStatus === "Approved" &&
      orgStatus === "Approved" &&
      jointStatementStatus === "Approved" &&
      hazingPledgeStatus === "Approved";

    return res.status(200).json({
      message: allApproved
        ? "Everything is approved and complete!"
        : "Some parts are still pending or need revision.",
      isEverythingApproved: allApproved,
      statuses: {
        roster: rosterStatus,
        presidentProfile: presidentStatus,
        organizationProfile: orgStatus,
        jointStatement: jointStatementStatus,
        pledgeAgainstHazing: hazingPledgeStatus,
      },
    });
  } catch (error) {
    console.error("Error checking accreditation status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const SendAccreditationCompletionEmail = async (req, res) => {
  const { orgProfileId } = req.params;

  try {
    // ✅ Find accreditation record tied to the org
    const accreditation = await Accreditation.findOne({
      organizationProfile: orgProfileId,
    });

    if (!accreditation) {
      return res.status(404).json({ message: "Accreditation not found." });
    }

    // ✅ Find users linked to the organization (adviser + student leader, etc.)
    const users = await User.find({ organizationProfile: orgProfileId });

    if (!users || users.length === 0) {
      return res
        .status(400)
        .json({ message: "No users found for this organization." });
    }

    // Email content
    const subject = `Accreditation Approved for ${accreditation.organizationProfile.orgName}`;
    const message = `Good day,

We are pleased to inform you that the accreditation process for "${accreditation.organizationProfile.orgName}" has been completed and approved.

You may now proceed with your official activities under recognized status.

Regards,  
Student Development Unit`;

    // ✅ Send emails to all users
    let results = [];
    for (const user of users) {
      if (user.email) {
        const sendResult = await NodeEmail(user.email, subject, message);
        results.push({
          recipient: user.position,
          name: user.name || "N/A",
          email: user.email,
          ...sendResult,
        });
      }
    }

    // ✅ Update accreditation status to "Approved"
    accreditation.overallStatus = "Approved";
    await accreditation.save();

    return res.status(200).json({
      message: "Completion emails sent and accreditation marked as Approved.",
      accreditation: {
        id: accreditation._id,
        overallStatus: accreditation.overallStatus,
      },
      results,
    });
  } catch (error) {
    console.log("Error sending completion emails:", error);
    return res.status(500).json({ message: "Failed to send emails", error });
  }
};

export const GetUserInformation = async (req, res) => {
  const { userId } = req.params;

  try {
    // Step 1: Find user
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Find the organization and populate all profiles
    const organization = await OrganizationProfile.findOne({
      _id: user.organizationProfile,
    })
      .populate("adviser")
      .populate("orgPresident");
    if (!organization) {
      return res.status(404).json({
        message: "Organization not found for this profile",
        organization: false,
      });
    }
    console.log(organization);

    return res.status(200).json({
      message: "Organization profile found",
      organization,
    });
  } catch (error) {
    console.error("Error finding organization by profile:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const CheckSession = (req, res) => {
  if (req.session?.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("User:", user);

    // Set session (name is optional)
    req.session.user = {
      userId: user._id,
      name: user.name || null, // fallback if name is missing
      position: user.position,
      email: user.email,
      deliveryUnit: user.deliveryUnit,
      organizationProfile: user.organizationProfile,
    };

    console.log("Session:", req.session);

    return res.json({
      user: req.session.user,
    });
  } catch (err) {
    console.log("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const Logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};

import OpenAI from "openai";
import PdfParse from "pdf-parse";

export const getAIFeedback = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 👇 Use buffer from multer
    const pdfBuffer = req.file.buffer;
    const pdfData = await PdfParse(pdfBuffer);
    const documentText = pdfData.text;

    const prompt = `
You are an AI text detector. 
Analyze the following document and provide structured JSON feedback.

Document content:
---
${documentText}
---

Return ONLY valid JSON in this exact format:

{
  "feedback": "Short explanation whether the content seems AI-generated or human-written.",
  "aiGenerated": true or false, // true if majority seems AI generated
  "aiProbability": number // percentage (0-100) of how likely the text is AI-generated
}
`;

    const client = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY,
      dangerouslyAllowBrowser: true, // ⚠️ only for demo, move to backend later!
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // force JSON
    });

    const aiResult = JSON.parse(response.choices[0].message.content);

    res.json(aiResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get AI feedback" });
  }
};
