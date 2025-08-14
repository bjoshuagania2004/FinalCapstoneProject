import { Accreditation } from "../models/index.js";

export const GetAllAccreditationId = async (req, res) => {
  try {
    const accreditations = await Accreditation.find(
      {},
      { _id: 1, organizationProfile: 1 }
    );

    const ids = accreditations.map((acc) => ({
      _id: acc._id,
      organizationProfile: acc.organizationProfile,
    }));

    res.status(200).json(ids);
  } catch (error) {
    console.error("Error fetching accreditation IDs:", error);
    res.status(500).json({ error: "Server error" });
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
    console.log(error);
    res.status(500).json({ error: error.message });
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

    console.log("Accreditation data:", accreditation);
    if (!accreditation) {
      return res.status(404).json({ message: "Accreditation not found." });
    }

    const rosterStatus = accreditation?.Roster?.overAllStatus;
    const presidentStatus = accreditation?.PresidentProfile?.overAllStatus;
    const orgStatus = accreditation?.organizationProfile?.overAllStatus;

    // Optional: Validate uploaded documents if needed
    const jointStatementPresent = accreditation?.document?.status;
    const hazingPledgePresent = accreditation?.document?.status;

    const allApproved =
      rosterStatus === "Approved" &&
      presidentStatus === "Approved" &&
      orgStatus === "Approved" &&
      jointStatementPresent &&
      hazingPledgePresent;

    if (allApproved) {
      return res.json({ message: "Everything is approved and complete!" });
    } else {
      return res.status(200).json({
        message: "Some parts are still pending or need revision.",
        statuses: {
          rosterStatus,
          presidentStatus,
          orgStatus,
          jointStatement: !!jointStatementPresent,
          hazingPledge: !!hazingPledgePresent,
        },
      });
    }
  } catch (error) {
    console.error("Error checking accreditation status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const GetAccreditationDetails = async (req, res) => {
  const orgProfileId = req.params.orgProfileId;

  try {
    let accreditation = await Accreditation.findOne({
      organizationProfile: orgProfileId,
    });

    // If not found OR isActive is false, create a new accreditation
    if (!accreditation || !accreditation.isActive) {
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
    }

    // Always populate after the logic above — whether it was created or found
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

    res.status(201).json(accreditation);
  } catch (error) {
    console.error("Error handling accreditation request:", error);
    res.status(500).json({ error: "Server error" });
  }
};
