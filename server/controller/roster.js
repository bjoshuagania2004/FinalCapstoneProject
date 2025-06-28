import {
  RosterMember,
  Organization,
  OrganizationProfile,
} from "../models/index.js";

export const AddNewRosterMember = async (req, res) => {
  const {
    organizationProfile,
    name,
    email,
    address,
    position,
    birthDate,
    status,
    studentId,
    contactNumber,
  } = req.body;

  if (!organizationProfile || !name || !email) {
    return res
      .status(400)
      .json({ message: "organizationProfile, name, and email are required." });
  }

  try {
    const parentDoc = await RosterMember.findOne({ organizationProfile });

    const newMember = {
      name,
      email,
      address,
      position,
      birthDate,
      status,
      studentId,
      contactNumber,
    };

    let updatedDoc;

    if (parentDoc) {
      parentDoc.rosterMembers.push(newMember);
      updatedDoc = await parentDoc.save();
    } else {
      const newRosterGroup = new RosterMember({
        organizationProfile,
        rosterMembers: [newMember],
      });
      updatedDoc = await newRosterGroup.save();
    }

    return res.status(201).json({
      message: "Roster member added successfully.",
      RosterMember: updatedDoc,
    });
  } catch (error) {
    console.error("Error adding roster member:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const AddMultipleRosterMembers = async (req, res) => {
  const rosterMembers = req.body;

  if (!Array.isArray(rosterMembers) || rosterMembers.length === 0) {
    return res
      .status(400)
      .json({ message: "Request must contain an array of roster members." });
  }

  try {
    // Validate all members before insertion
    for (const member of rosterMembers) {
      const { organizationProfile, name, email } = member;

      if (!organizationProfile || !name || !email) {
        return res.status(400).json({
          message:
            "Each roster member must include organizationProfile, name, and email.",
        });
      }

      const organizationExists = await OrganizationProfile.findById(
        organizationProfile
      );

      if (!organizationExists) {
        return res.status(404).json({
          message: `Organization with ID ${organizationProfile} not found.`,
        });
      }
    }

    // Insert members in batch
    const savedMembers = await RosterMember.insertMany(rosterMembers);

    return res.status(201).json({
      message: "Roster members added successfully.",
      RosterMembers: savedMembers,
    });
  } catch (error) {
    console.error("Error inserting roster members:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
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
      organizationProfile: organizationId,
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
  const { rosterMemberId } = req.params;

  console.log("Fetching RosterMember with ID:", rosterMemberId);

  if (!rosterMemberId) {
    return res.status(400).json({ message: "RosterMember ID is required." });
  }

  try {
    const member = await RosterMember.findById(rosterMemberId); // ✅ use different name

    if (!member) {
      return res.status(404).json({ message: "RosterMember not found." });
    }

    return res.status(200).json({ member }); // use the new variable name
  } catch (error) {
    console.error("Error fetching RosterMember:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
