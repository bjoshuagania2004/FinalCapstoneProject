import { Proposal, ProposedActionPlan } from "../models/index.js";

export const updateStudentLeaderProposal = async (req, res) => {
  try {
    const { id } = req.params; // Proposal ID
    const {
      activityTitle,
      alignedSDG,
      budgetaryRequirements,
      briefDetails,
      venue,
      proposedDate,
      AlignedObjective,
      proposalType,
      proposalCategory,
    } = req.body;

    // Normalize alignedSDG
    let normalizedSDG = req.body["alignedSDG[]"] || alignedSDG;
    if (normalizedSDG && !Array.isArray(normalizedSDG)) {
      normalizedSDG = [normalizedSDG];
    }

    const updatedProposal = await Proposal.findByIdAndUpdate(
      id,
      {
        activityTitle,
        alignedSDG: normalizedSDG,
        budgetaryRequirements,
        briefDetails,
        venue,
        proposedDate,
        AlignedObjective,
        proposalType,
        proposalCategory,
      },
      { new: true } // return the updated doc
    );

    if (!updatedProposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    res.status(200).json({
      message: "Proposal updated successfully",
      proposal: updatedProposal,
    });
  } catch (error) {
    console.error("❌ Error updating proposal:", error);
    res.status(500).json({ error: "Failed to update proposal" });
  }
};

export const postStudentLeaderProposal = async (req, res) => {
  try {
    console.log("=== BACKEND LOG ===");
    console.log("req.body:", req.body);
    console.log("===================");
    console.log("req.file:", req.file);
    console.log("===================");

    const DocumentId = res.locals.documentId;

    const {
      activityTitle,
      alignedSDG,
      budgetaryRequirements,
      briefDetails,
      venue,
      proposedDate,
      AlignedObjective,
      organizationProfile,
      proposalType,
      proposalCategory,
      organization,
      accreditation,
    } = req.body;

    // Normalize alignedSDG
    let normalizedSDG = req.body["alignedSDG[]"] || alignedSDG;
    if (normalizedSDG && !Array.isArray(normalizedSDG)) {
      normalizedSDG = [normalizedSDG];
    }

    // 🔎 Step 1: Find existing ProposedActionPlan
    let existingPlan = await ProposedActionPlan.findOne({
      organizationProfile,
      organization,
      accreditation,
      isActive: true,
    });

    // 🆕 Step 2: If none exists or inactive, create new
    if (!existingPlan) {
      existingPlan = new ProposedActionPlan({
        organizationProfile,
        organization,
        accreditation,
        overallStatus: "Pending",
        isActive: true,
      });
      await existingPlan.save();
    }

    // 📝 Step 3: Create new Proposal referencing ProposedActionPlan
    const proposal = new Proposal({
      activityTitle,
      alignedSDG: normalizedSDG,
      budgetaryRequirements,
      AlignedObjective,
      venue,
      proposalCategory,
      proposedDate,
      briefDetails,
      organizationProfile,
      proposalType,
      organization,
      accreditation,
      ProposedActionPlanSchema: existingPlan._id, // link to the action plan
      overallStatus: "Pending",
      document: DocumentId ? [DocumentId] : [], // 👈 add the document here
    });

    await proposal.save();

    // 🔗 Step 4: Push proposal into ProposedActionPlan.ProposedIndividualActionPlan
    existingPlan.ProposedIndividualActionPlan.push(proposal._id);
    await existingPlan.save();

    res.status(201).json({
      message: "Proposal created successfully",
      proposal,
    });
  } catch (error) {
    console.error("❌ Error saving proposal:", error);
    res.status(500).json({ error: "Failed to create proposal" });
  }
};

export const getAllProposedActionPlan = async (req, res) => {
  try {
    const proposals = await ProposedActionPlan.find({})
      .populate({
        path: "ProposedIndividualActionPlan",
        populate: { path: "document" }, // 👈 populate documents inside individual action plan
      })
      .populate({
        path: "organizationProfile", // 👈 fixed populate syntax
      });

    if (!proposals || proposals.length === 0) {
      return res.status(404).json({ error: "No proposals found" });
    }

    return res.status(200).json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return res.status(500).json({ error: "Failed to fetch proposals" });
  }
};

export const getStudentPpaByAccreditationId = async (req, res) => {
  const { accreditationId } = req.params;

  try {
    const proposals = await Proposal.find({
      accreditation: accreditationId,
    }); // Collaborating org profiles

    if (!proposals || proposals.length === 0) {
      return res.status(404).json({ error: "No proposals found" });
    }

    return res.status(200).json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return res.status(500).json({ error: "Failed to fetch proposals" });
  }
};

export const getPpaBySdu = async (req, res) => {
  const { id } = req.params;

  try {
    const proposals = await Proposal.find({ organizationProfile: id }).populate(
      "document"
    ); // Mongoose query

    if (!proposals || proposals.length === 0) {
      return res.status(404).json({ error: "No proposals found" });
    }

    return res.status(200).json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return res.status(500).json({ error: "Failed to fetch proposals" });
  }
};

export const getPpaByOrganizationProfile = async (req, res) => {
  const { organizationProfile } = req.params;

  try {
    const proposals = await ProposedActionPlan.find({ organizationProfile })
      .populate("organizationProfile")
      .populate("organization");
    if (!proposals || proposals.length === 0) {
      return res.status(404).json({ error: "No proposals found" });
    }
    return res.status(200).json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return res.status(500).json({ error: "Failed to fetch proposals" });
  }
};

export const getApprovedPPA = async (req, res) => {
  const { orgId } = req.params; // make sure your route passes orgProfileId

  try {
    const proposals = await Proposal.find({
      organizationProfile: orgId, // ✅ filter by organizationProfile
      overallStatus: "Approved For Conduct", // ✅ only approved
    });

    if (!proposals || proposals.length === 0) {
      return res.status(404).json({ error: "No approved proposals found" });
    }

    return res.status(200).json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return res.status(500).json({ error: "Failed to fetch proposals" });
  }
};
