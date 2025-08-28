import { ProposalConduct } from "../models/index.js";

export const postProposalConduct = async (req, res) => {
  try {
    const {
      ProposedActionPlanSchema,
      ProposedIndividualActionPlan,
      organization,
      organizationProfile,
      overallStatus,
    } = req.body;

    const documentId = res.locals.documentId; // 👈 from uploadFileAndAddDocument

    if (!documentId) {
      return res.status(400).json({ error: "No document uploaded" });
    }

    // Create new ProposalConduct (or update existing)
    const proposalConduct = new ProposalConduct({
      ProposedActionPlanSchema,
      ProposedIndividualActionPlan,
      organization,
      organizationProfile,
      overallStatus: overallStatus || "Pending",
      document: [documentId], // attach uploaded document
    });

    await proposalConduct.save();

    return res.status(201).json({
      success: true,
      message: "Proposal Conduct created with document",
      proposalConduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getProposalConductByOrgProfile = async (req, res) => {
  try {
    const { orgProfileId } = req.params;

    const conducts = await ProposalConduct.find({
      organizationProfile: orgProfileId, // 🔹 direct match
    })
      .populate("document") // include file metadata
      .populate("ProposedIndividualActionPlan"); // optional, if you want Proposal info

    if (!conducts || conducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No ProposalConduct found for this organization profile",
      });
    }

    res.json(conducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getDoneProposalConductsByOrgProfile = async (req, res) => {
  try {
    const { orgProfileId } = req.params;

    const doneConducts = await ProposalConduct.find({
      organizationProfile: orgProfileId,
      overallStatus: "Ready For Accomplishments", // ✅ filter only completed conducts
    })
      .populate("document") // include uploaded document(s)
      .populate("ProposedIndividualActionPlan"); // optional for extra details

    if (!doneConducts || doneConducts.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No completed ProposalConduct found for this organization profile",
      });
    }

    res.json(doneConducts);
  } catch (error) {
    console.error("Error fetching done ProposalConducts:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
