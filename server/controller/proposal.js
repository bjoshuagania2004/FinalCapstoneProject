import { Proposal, ProposedActionPlan } from "../models/index.js";

export const postStudentLeaderProposal = async (req, res) => {
  try {
    const proposal = new ProposedActionPlan({
      ...req.body,
    });

    await proposal.save();

    res.status(201).json({
      message: "Proposal created successfully",
      proposal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create proposal" });
  }
};

export const getStudentPpaByAccreditationId = async (req, res) => {
  const { accreditationId } = req.params;

  try {
    const proposals = await ProposedActionPlan.find({
      accreditation: accreditationId,
    }).populate("collaboratingEntities"); // Collaborating org profiles

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
