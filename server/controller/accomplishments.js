import {
  Accomplishment,
  SubAccomplishment,
  Document,
  User,
} from "../models/index.js";

// ✅ Update Accomplishment status (similar to ProposalConduct)
export const updateAccomplishmentStatus = async (req, res) => {
  try {
    const { accomplishmentId } = req.params;
    const {
      overallStatus,
      inquiryText,
      inquirySubject,
      userName,
      userPosition,
      orgProfileId,
      orgName,
    } = req.body;

    // 🔎 Find Accomplishment by ID
    const accomplishment = await SubAccomplishment.findById(
      accomplishmentId
    ).populate("documents");

    if (!accomplishment) {
      return res
        .status(404)
        .json({ success: false, message: "Accomplishment not found" });
    }

    // ✅ Update Accomplishment
    if (overallStatus) {
      accomplishment.overallStatus = overallStatus;
    }

    if (inquiryText) {
      accomplishment.revision = inquiryText;
    }

    // ✅ Update all linked Documents
    if (accomplishment.documents?.length > 0) {
      for (let doc of accomplishment.documents) {
        if (overallStatus) {
          doc.status = overallStatus; // or map status differently if needed
        }
        if (inquiryText) {
          doc.revisionNotes = inquiryText;
        }

        // optional log entry
        doc.logs.push(
          `[${new Date().toISOString()}] Updated by ${userName} (${userPosition}) → Status: ${overallStatus}`
        );

        await doc.save();
      }
    }

    await accomplishment.save();

    // 📧 Optional: Send email inquiry
    if (inquiryText && inquirySubject) {
      const users = await User.find({
        organizationProfile: orgProfileId,
        position: { $ne: "Adviser" },
      }).select("email");

      if (users?.length > 0) {
        const recipientEmails = users.map((u) => u.email).filter(Boolean);

        if (recipientEmails.length > 0) {
          const message = `
Hello ${orgName},

An accomplishment status update has been submitted.

Details:
- From: ${userName} || ${userPosition}
- Status: ${accomplishment.overallStatus}
- Message:
${inquiryText}

Please log in to the system to review.

Thank you,
Accreditation Support Team
          `;

          await NodeEmail(recipientEmails, inquirySubject, message);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Accomplishment and documents updated successfully",
      accomplishment,
    });
  } catch (error) {
    console.error("❌ Error updating Accomplishment:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAccomplishmentReport = async (req, res) => {
  try {
    const { OrgProfileId } = req.params;
    console.log(OrgProfileId);

    if (!OrgProfileId) {
      return res.status(400).json({ error: "Missing organizationProfile ID." });
    }

    let report = await Accomplishment.findOne({
      organizationProfile: OrgProfileId,
    })
      .populate({
        path: "accomplishments",
        populate: [
          { path: "proposal" },
          { path: "documents" }, // ✅ corrected
        ],
      })
      .select("accomplishments grandTotal");

    if (!report) {
      report = new Accomplishment({
        organizationProfile: OrgProfileId,
        accomplishments: [],
        totalOrganizationalDevelopment: 0,
        totalOrganizationalPerformance: 0,
        totalServiceCommunity: 0,
        grandTotal: 0,
      });

      await report.save();

      report = await Accomplishment.findById(report._id).populate({
        path: "accomplishments",
        populate: [
          { path: "proposal" },
          { path: "documents" }, // ✅ corrected
        ],
      });
    }

    return res.status(200).json(report);
  } catch (error) {
    console.error("❌ Error fetching/creating accomplishment report:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve or create accomplishment report." });
  }
};

// ✅ Add a Sub-Accomplishment (PPA, Meeting, Award, etc.)
export const addAccomplishment = async (req, res) => {
  try {
    const {
      accomplishmentId,
      category,
      title,
      level,
      proposal,
      description,
      date,
      documents,
      organization,
      organizationProfile,
      awardedPoints,
    } = req.body;

    // ✅ Validate required fields
    if (!accomplishmentId || !category) {
      return res.status(400).json({
        error: "Missing required fields (accomplishmentId or category).",
      });
    }

    // ✅ Find parent accomplishment report
    const report = await Accomplishment.findById(accomplishmentId);
    if (!report) {
      return res
        .status(404)
        .json({ error: "Accomplishment report not found." });
    }

    // ✅ Build only the provided fields
    const subAccData = {
      category,
      ...(title && { title }),
      ...(proposal && { proposal }),
      ...(level && { level }),
      ...(description && { description }),
      ...(date && { date }),
      ...(documents && documents.length > 0 && { documents }),
      ...(organization && { organization }),
      ...(organizationProfile && { organizationProfile }),
      ...(typeof awardedPoints === "number" && { awardedPoints }),
    };

    // ✅ Create SubAccomplishment
    const subAcc = new SubAccomplishment(subAccData);
    await subAcc.save();

    // ✅ Link to parent report
    report.accomplishments.push(subAcc._id);
    await report.save();

    return res.status(201).json({
      message: "Sub-accomplishment added successfully.",
      subAccomplishment: subAcc,
    });
  } catch (error) {
    console.error("❌ Error adding sub-accomplishment:", error);
    return res.status(500).json({ error: "Failed to add sub-accomplishment." });
  }
};

export const AddDocumentToSubAccomplishment = async (req, res) => {
  try {
    const { subAccomplishmentId } = req.body;
    const documentId = res.locals.documentId;

    if (!subAccomplishmentId) {
      return res
        .status(400)
        .json({ error: "Missing subAccomplishmentId in request body." });
    }

    const subAcc = await SubAccomplishment.findById(subAccomplishmentId);
    if (!subAcc) {
      return res.status(404).json({ error: "Sub-accomplishment not found." });
    }

    // ✅ Push the new document into documents array
    subAcc.documents.push(documentId);
    await subAcc.save();

    return res.status(201).json({
      message: "Document uploaded and linked to sub-accomplishment.",
      documentId,
      subAccomplishment: subAcc,
    });
  } catch (error) {
    console.error("❌ Error linking document:", error);
    return res.status(500).json({ error: "Failed to link document." });
  }
};

export const updateAccomplishment = async (req, res) => {
  const { id } = req.params;
  const { logMessage } = req.body; // pass new fileName from frontend

  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const oldFileName = res.locals.fileName;
    const newFileName = document.fileName; // current file before replacement
    // ✅ Format the current date/time
    const formattedDate = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short", // "Sep"
      day: "numeric", // "14"
      hour: "2-digit", // "09"
      minute: "2-digit", // "49"
      hour12: true, // AM/PM
    });

    // ✅ Push log with detailed info
    document.logs.push(
      logMessage ||
        `Document replaced from "${oldFileName}" to "${newFileName}" at ${formattedDate}`
    );

    await document.save();

    return res.status(200).json({
      message: "Log added to document successfully",
      document,
    });
  } catch (error) {
    console.error("❌ Error updating document logs:", error);
    return res.status(500).json({
      error: "Failed to update document logs",
      details: error.message,
    });
  }
};
