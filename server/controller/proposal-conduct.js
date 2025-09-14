import { ProposalConduct, Proposal } from "../models/index.js";

export const postProposalConduct = async (req, res) => {
  try {
    const {
      ProposedActionPlanSchema,
      ProposedIndividualActionPlan: proposedIndividualId, // only ID comes from client
      organization,
      organizationProfile,
      overallStatus,
    } = req.body;

    const documentId = res.locals.documentId;

    if (!documentId) {
      return res.status(400).json({ error: "No document uploaded" });
    }
    Proposal;

    // 1️⃣ Find the ProposedIndividualActionPlan by ID
    const proposedIndividual = await Proposal.findById(proposedIndividualId);
    if (!proposedIndividual) {
      return res
        .status(404)
        .json({ error: "ProposedIndividualActionPlan not found" });
    }

    // 2️⃣ Copy selected fields into the embedded object
    const embeddedIndividual = {
      activityTitle: proposedIndividual.activityTitle,
      alignedSDG: proposedIndividual.alignedSDG,
      budgetaryRequirements: proposedIndividual.budgetaryRequirements,
      venue: proposedIndividual.venue,
      proposalType: proposedIndividual.proposalType,
      ProposalCategory: proposedIndividual.ProposalCategory,
      briefDetails: proposedIndividual.briefDetails,
      AlignedObjective: proposedIndividual.AlignedObjective,
      proposedDate: proposedIndividual.proposedDate,
      Proponents: proposedIndividual.Proponents,
    };

    // 3️⃣ Save new ProposalConduct with embedded details
    const proposalConduct = new ProposalConduct({
      ProposedActionPlanSchema,
      ProposedIndividualActionPlan: embeddedIndividual, // 👈 stored as object
      organization,
      organizationProfile,
      overallStatus: overallStatus || "Pending",
      document: [documentId],
    });

    await proposalConduct.save();

    return res.status(201).json({
      success: true,
      message:
        "Proposal Conduct created with embedded ProposedIndividualActionPlan",
      proposalConduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE ProposalConduct
export const updateProposalConduct = async (req, res) => {
  try {
    const { id } = req.params; // ProposalConduct ID
    const {
      activityTitle,
      briefDetails,
      AlignedObjective,
      alignedSDG,
      budgetaryRequirements,
      venue,
      proposalType,
      proposalCategory,
      proposedDate,
      overallStatus,
      organizationProfile,
      organization,
      accreditation,
      documents,
      collaboratingEntities,
    } = req.body;

    // 🔎 Find ProposalConduct first
    const proposalConduct = await ProposalConduct.findById(id);
    if (!proposalConduct) {
      return res
        .status(404)
        .json({ success: false, message: "ProposalConduct not found" });
    }

    // 🔄 Update embedded ProposedIndividualActionPlan object
    proposalConduct.ProposedIndividualActionPlan = {
      ...proposalConduct.ProposedIndividualActionPlan, // keep existing fields
      activityTitle,
      briefDetails,
      AlignedObjective,
      alignedSDG,
      budgetaryRequirements,
      venue,
      proposalType,
      ProposalCategory: proposalCategory, // match backend schema
      proposedDate,
    };

    // 🔄 Update other top-level fields
    proposalConduct.organizationProfile = organizationProfile;
    proposalConduct.organization = organization;
    proposalConduct.accreditation = accreditation;
    proposalConduct.overallStatus =
      overallStatus || proposalConduct.overallStatus;
    proposalConduct.document =
      documents && documents.length > 0 ? documents : proposalConduct.document;
    proposalConduct.collaboratingEntities = collaboratingEntities || [];
    proposalConduct.overallStatus = "Revision Update from Student Leader";
    await proposalConduct.save();

    return res.status(200).json({
      success: true,
      message: "ProposalConduct updated successfully",
      proposalConduct,
    });
  } catch (error) {
    console.error("Error updating ProposalConduct:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteProposalConduct = async (req, res) => {
  try {
    const { id } = req.params; // 🔹 ProposalConduct ID from URL

    const deletedConduct = await ProposalConduct.findByIdAndDelete(id);

    if (!deletedConduct) {
      return res.status(404).json({
        success: false,
        message: "ProposalConduct not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "ProposalConduct deleted successfully",
      deletedConduct,
    });
  } catch (error) {
    console.error("Error deleting ProposalConduct:", error);
    return res.status(500).json({ success: false, error: error.message });
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
      overallStatus: "Ready for Accomplishments", // ✅ filter only completed conducts
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
