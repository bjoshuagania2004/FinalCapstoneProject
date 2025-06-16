import { RosterMember, Organization } from "../models/index.js";

export const AddNewRosterMember = async (req, res) => {
  const {
    organization,
    name,
    email,
    address,
    position,
    birthDate,
    studentId,
    contactNumber,
  } = req.body;

  console.log("Received request body:", req.body);

  // Basic validation
  if (!organization) {
    console.error("Missing organization ID");
    return res.status(400).json({ message: "Organization ID is required." });
  }

  if (!name || !email) {
    console.error("Missing required RosterMember fields");
    return res.status(400).json({ message: "Name and email are required." });
  }

  const FindOrg = await Organization.findById(organization);

  if (!FindOrg) {
    console.error("Organization not found:", organization);
    return res.status(404).json({ message: "Organization not found." });
  }

  try {
    const newRosterMember = new RosterMember({
      organization,
      name,
      email,
      address,
      position,
      birthDate,
      studentId,
      contactNumber,
    });

    const savedRosterMember = await newRosterMember.save();
    console.log("RosterMember saved:", savedRosterMember);

    const updatedOrg = await Organization.findByIdAndUpdate(
      organization,
      { $push: { RosterMember: savedRosterMember._id } },
      { new: true }
    );

    return res.status(201).json({
      message: "RosterMember added and linked to organization successfully",
      RosterMember: savedRosterMember,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const DeleteRosterMember = async (req, res) => {
  const { RosterMemberId } = req.params;

  console.log("Request to delete RosterMember:", RosterMemberId);

  if (!RosterMemberId) {
    console.error("RosterMember ID not provided");
    return res.status(400).json({ message: "RosterMember ID is required." });
  }

  try {
    const RosterMember = await RosterMember.findById(RosterMemberId);

    if (!RosterMember) {
      console.error("RosterMember not found:", RosterMemberId);
      return res.status(404).json({ message: "RosterMember not found." });
    }

    // Remove the RosterMember reference from the organization
    const organizationId = RosterMember.organization;
    await Organization.findByIdAndUpdate(organizationId, {
      $pull: { RosterMember: RosterMemberId },
    });

    // Delete the RosterMember document itself
    await RosterMember.findByIdAndDelete(RosterMemberId);

    console.log(
      `RosterMember ${RosterMemberId} deleted and removed from organization ${organizationId}`
    );

    return res
      .status(200)
      .json({ message: "RosterMember deleted successfully." });
  } catch (error) {
    console.error("Error deleting RosterMember:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const UpdateRosterMember = async (req, res) => {
  const { RosterMemberId } = req.params;
  const updateData = req.body;

  console.log("PATCH request to update RosterMember:", RosterMemberId);
  console.log("Fields to update:", updateData);

  if (!RosterMemberId) {
    console.error("RosterMember ID not provided");
    return res.status(400).json({ message: "RosterMember ID is required." });
  }

  try {
    const updatedRosterMember = await RosterMember.findByIdAndUpdate(
      RosterMemberId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRosterMember) {
      console.error("RosterMember not found:", RosterMemberId);
      return res.status(404).json({ message: "RosterMember not found." });
    }

    console.log("RosterMember updated successfully:", updatedRosterMember);

    return res.status(200).json({
      message: "RosterMember updated successfully.",
      RosterMember: updatedRosterMember,
    });
  } catch (error) {
    console.error("Error updating RosterMember:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const GetRosterMembersByOrganization = async (req, res) => {
  const { organizationId } = req.params;

  console.log("Fetching RosterMembers for organization:", organizationId);

  if (!organizationId) {
    return res.status(400).json({ message: "Organization ID is required." });
  }

  try {
    const RosterMembers = await RosterMember.find({
      organization: organizationId,
    });

    if (!RosterMembers.length) {
      return res
        .status(404)
        .json({ message: "No RosterMembers found for this organization." });
    }

    return res.status(200).json({ RosterMembers });
  } catch (error) {
    console.error("Error fetching RosterMembers:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const GetSingleRosterMember = async (req, res) => {
  const { RosterMemberId } = req.params;

  console.log("Fetching RosterMember with ID:", RosterMemberId);

  if (!RosterMemberId) {
    return res.status(400).json({ message: "RosterMember ID is required." });
  }

  try {
    const RosterMember = await RosterMember.findById(RosterMemberId);

    if (!RosterMember) {
      return res.status(404).json({ message: "RosterMember not found." });
    }

    return res.status(200).json({ RosterMember });
  } catch (error) {
    console.error("Error fetching RosterMember:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
