import { Roster, Organization } from "../models/users.js";

export const AddNewRoster = async (req, res) => {
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
    console.error("Missing required roster fields");
    return res.status(400).json({ message: "Name and email are required." });
  }

  const FindOrg = await Organization.findById(organization);

  if (!FindOrg) {
    console.error("Organization not found:", organization);
    return res.status(404).json({ message: "Organization not found." });
  }

  try {
    const newRoster = new Roster({
      organization,
      name,
      email,
      address,
      position,
      birthDate,
      studentId,
      contactNumber,
    });

    const savedRoster = await newRoster.save();
    console.log("Roster saved:", savedRoster);

    const updatedOrg = await Organization.findByIdAndUpdate(
      organization,
      { $push: { roster: savedRoster._id } },
      { new: true }
    );

    return res.status(201).json({
      message: "Roster added and linked to organization successfully",
      roster: savedRoster,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const DeleteRoster = async (req, res) => {
  const { rosterId } = req.params;

  console.log("Request to delete roster:", rosterId);

  if (!rosterId) {
    console.error("Roster ID not provided");
    return res.status(400).json({ message: "Roster ID is required." });
  }

  try {
    const roster = await Roster.findById(rosterId);

    if (!roster) {
      console.error("Roster not found:", rosterId);
      return res.status(404).json({ message: "Roster not found." });
    }

    // Remove the roster reference from the organization
    const organizationId = roster.organization;
    await Organization.findByIdAndUpdate(organizationId, {
      $pull: { roster: rosterId },
    });

    // Delete the roster document itself
    await Roster.findByIdAndDelete(rosterId);

    console.log(
      `Roster ${rosterId} deleted and removed from organization ${organizationId}`
    );

    return res.status(200).json({ message: "Roster deleted successfully." });
  } catch (error) {
    console.error("Error deleting roster:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const UpdateRoster = async (req, res) => {
  const { rosterId } = req.params;
  const updateData = req.body;

  console.log("PATCH request to update roster:", rosterId);
  console.log("Fields to update:", updateData);

  if (!rosterId) {
    console.error("Roster ID not provided");
    return res.status(400).json({ message: "Roster ID is required." });
  }

  try {
    const updatedRoster = await Roster.findByIdAndUpdate(rosterId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRoster) {
      console.error("Roster not found:", rosterId);
      return res.status(404).json({ message: "Roster not found." });
    }

    console.log("Roster updated successfully:", updatedRoster);

    return res.status(200).json({
      message: "Roster updated successfully.",
      roster: updatedRoster,
    });
  } catch (error) {
    console.error("Error updating roster:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const GetRostersByOrganization = async (req, res) => {
  const { organizationId } = req.params;

  console.log("Fetching rosters for organization:", organizationId);

  if (!organizationId) {
    return res.status(400).json({ message: "Organization ID is required." });
  }

  try {
    const rosters = await Roster.find({ organization: organizationId });

    if (!rosters.length) {
      return res
        .status(404)
        .json({ message: "No rosters found for this organization." });
    }

    return res.status(200).json({ rosters });
  } catch (error) {
    console.error("Error fetching rosters:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const GetSingleRoster = async (req, res) => {
  const { rosterId } = req.params;

  console.log("Fetching roster with ID:", rosterId);

  if (!rosterId) {
    return res.status(400).json({ message: "Roster ID is required." });
  }

  try {
    const roster = await Roster.findById(rosterId);

    if (!roster) {
      return res.status(404).json({ message: "Roster not found." });
    }

    return res.status(200).json({ roster });
  } catch (error) {
    console.error("Error fetching roster:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
