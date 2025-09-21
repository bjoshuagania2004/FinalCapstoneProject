import {
  Accreditation,
  Document,
  OrganizationProfile,
  Adviser,
  User,
} from "../models/index.js";

export const GetAccreditationDocuments = async (req, res) => {
  const orgProfileId = req.params.orgProfileId;

  try {
    let accreditation = await Accreditation.findOne({
      organizationProfile: orgProfileId,
      isActive: true, // only fetch if active
    })
      .populate([
        "JointStatement",
        "PledgeAgainstHazing",
        "ConstitutionAndByLaws",
      ])
      .select(" JointStatement PledgeAgainstHazing ConstitutionAndByLaws  ") // only return document fields
      .exec();

    if (!accreditation) {
      return res.status(404).json({
        message: "No active accreditation found for this organization.",
      });
    }

    res.status(200).json(accreditation);
  } catch (error) {
    console.error("Error fetching accreditation documents:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const DeactivateAllAccreditations = async (req, res) => {
  try {
    const result = await Accreditation.updateMany(
      {}, // match all documents
      { $set: { isActive: false } }
    );

    const resultOrganizationProfile = await OrganizationProfile.updateMany(
      {}, // match all documents
      { $set: { isActive: false } }
    );

    res.status(200).json({
      message: "All accreditations have been deactivated",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error deactivating accreditations:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const GetAllAccreditationId = async (req, res) => {
  try {
    const accreditations = await Accreditation.find({}).populate([
      "organizationProfile",
      "FinancialReport",
      "JointStatement",
      "PledgeAgainstHazing",
      "ConstitutionAndByLaws",
      "Roster",
      "PresidentProfile",
    ]);

    res.status(200).json(accreditations);
  } catch (error) {
    console.error("Error fetching accreditation IDs:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const GetAccreditationById = async (req, res) => {
  try {
    const { id } = req.params; // this is the organizationProfile id

    const accreditation = await Accreditation.findOne({
      organizationProfile: id,
    })
      .populate([
        "organizationProfile",
        "FinancialReport",
        "JointStatement",
        "PledgeAgainstHazing",
        "ConstitutionAndByLaws",
        "Roster",
        "PresidentProfile",
      ])
      .populate({
        path: "organizationProfile",
        populate: [
          { path: "adviser" }, // 👈 populate adviser
          { path: "orgPresident" }, // (optional, if you also want president info)
        ],
      });

    if (!accreditation) {
      return res.status(404).json({ error: "Accreditation not found" });
    }

    res.status(200).json(accreditation);
  } catch (error) {
    console.error(
      "Error fetching accreditation by organizationProfile ID:",
      error
    );
    res.status(500).json({ error: "Server error" });
  }
};

export const UpdateDocumentStatus = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { status, revisionNotes } = req.body;

    if (!documentId) {
      return res.status(400).json({ error: "Missing documentId" });
    }
    if (!status) {
      return res.status(400).json({ error: "Missing status" });
    }

    // If status contains "revision", ensure notes exist
    if (status.toLowerCase().includes("revision")) {
      if (!revisionNotes || revisionNotes.trim() === "") {
        return res
          .status(400)
          .json({ error: "Missing revision notes for revision status" });
      }

      const updatedDoc = await Document.findByIdAndUpdate(
        documentId,
        { status, revisionNotes },
        { new: true }
      );

      if (!updatedDoc) {
        return res.status(404).json({ error: "Document not found" });
      }

      return res.status(200).json({
        message: `Document status updated to ${status} with revision notes`,
        document: updatedDoc,
      });
    }

    // Normal status update (no revision)
    const updatedDoc = await Document.findByIdAndUpdate(
      documentId,
      { status },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json({
      message: `Document status updated to ${status}`,
      document: updatedDoc,
    });
  } catch (error) {
    console.error("Error updating document status:", error);
    res.status(500).json({ error: error.message });
  }
};

export const AddAccreditationDocument = async (req, res) => {
  try {
    const { accreditationId, docType } = req.body; // docType must be one of the valid fields
    const documentId = res.locals.documentId; // from file upload middleware

    if (!documentId) {
      return res.status(400).json({ error: "Missing documentId" });
    }

    if (!accreditationId) {
      return res.status(400).json({ error: "Missing accreditationId" });
    }

    const accreditation = await Accreditation.findById(accreditationId);

    if (!accreditation) {
      return res.status(404).json({ error: "Accreditation not found" });
    }

    // Use if-else to assign based on docType
    if (docType === "JointStatement") {
      accreditation.JointStatement = documentId;
    } else if (docType === "PledgeAgainstHazing") {
      accreditation.PledgeAgainstHazing = documentId;
    } else if (docType === "ConstitutionAndByLaws") {
      accreditation.ConstitutionAndByLaws = documentId;
    } else {
      return res.status(400).json({ error: "Invalid document type" });
    }

    await accreditation.save();

    res.status(200).json({
      message: `${docType} uploaded and linked successfully to accreditation`,
      accreditation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const GetAccreditationDetails = async (req, res) => {
  const orgProfileId = req.params.orgProfileId;

  try {
    let accreditation = await Accreditation.findOne({
      organizationProfile: orgProfileId,
    });

    // If not found → create new
    if (!accreditation) {
      accreditation = new Accreditation({
        organizationProfile: orgProfileId,
        overallStatus: "Pending",
        isActive: true,
        JointStatement: null,
        PledgeAgainstHazing: null,
        ConstitutionAndByLaws: null,
        Roster: null,
        PresidentProfile: null,
      });

      await accreditation.save();
    } else if (!accreditation.isActive) {
      // If found but inactive → return inactive response
      return res.status(200).json({
        message: "This accreditation is inactive",
        accreditationId: accreditation._id,
        isActive: false,
      });
    }

    // If active → populate and return
    accreditation = await Accreditation.findById(accreditation._id)
      .populate([
        "organizationProfile",
        "JointStatement",
        "FinancialReport",
        "PledgeAgainstHazing",
        "Roster",
        "ConstitutionAndByLaws",
        "PresidentProfile",
      ])
      .exec();

    console.log(accreditation);
    res.status(200).json(accreditation);
  } catch (error) {
    console.error("Error handling accreditation request:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const SendAccreditationDocumentsInquiryEmailInquiry = async (
  req,
  res
) => {
  try {
    const {
      orgId,
      orgName,
      inquiryText,
      inquirySubject,
      userPosition,
      userName,
    } = req.body;

    // Find the active user linked to the organization profile, return only email
    const recipients = await User.find({
      organizationProfile: orgId,
      position: { $ne: "Adviser" }, // exclude advisers
    }).select("email");

    if (!recipients || !recipients.email) {
      return res.status(404).json({
        success: false,
        error: "recipients email not found.",
      });
    }

    // --- Email to Adviser ---
    const Subject = inquirySubject || "New Financial Report Inquiry";
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

    await NodeEmail(recipients, Subject, Message);

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
