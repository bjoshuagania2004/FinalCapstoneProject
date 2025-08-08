import {
  RosterMember,
  Organization,
  Roster,
  OrganizationProfile,
} from "../models/index.js";

export const ApprovedRosterList = async (req, res) => {
  console.log("Approving roster list...", req.params);
  try {
    const { rosterId } = req.params;

    // Find and update the roster's overall status
    const updatedRoster = await Roster.findByIdAndUpdate(
      rosterId,
      { overAllStatus: "Approved" },
      { new: true }
    );

    if (!updatedRoster) {
      return res.status(404).json({ message: "Roster not found" });
    }

    res.status(200).json({
      message: "Roster status updated successfully",
      roster: updatedRoster,
    });
  } catch (error) {
    console.error("Error updating roster status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const revisionNoteRosterList = async (req, res) => {
  console.log("Approving roster list...", req.params);
  try {
    const { rosterId } = req.params;
    const { revisionNotes, position } = req.body;

    // Find and update the roster's overall status
    const updatedRoster = await Roster.findByIdAndUpdate(
      rosterId,
      { overAllStatus: `Revision from ${position}`, revisionNotes },
      { new: true }
    );

    if (!updatedRoster) {
      return res.status(404).json({ message: "Roster not found" });
    }

    res.status(200).json({
      message: "Roster status updated successfully",
      roster: updatedRoster,
    });
  } catch (error) {
    console.error("Error updating roster status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const CompleteRosterList = async (req, res) => {
  try {
    const { rosterId } = req.params;

    // Find and update the roster's overall status
    const updatedRoster = await Roster.findByIdAndUpdate(
      rosterId,
      { isComplete: true },
      { new: true }
    );

    if (!updatedRoster) {
      return res.status(404).json({ message: "Roster not found" });
    }

    res.status(200).json({
      message: "Roster status updated successfully",
      roster: updatedRoster,
    });
  } catch (error) {
    console.error("Error updating roster status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const GetRosterMembersByOrganizationIdSDU = async (req, res) => {
  const { orgProfileId } = req.params;

  try {
    // Find the roster tied to the given organization profile
    const roster = await Roster.findOne({ organizationProfile: orgProfileId });

    if (!roster) {
      return res.status(404).json({
        message: "No roster found for this organization.",
      });
    }

    // Find roster members belonging to this roster
    const members = await RosterMember.find({ roster: roster._id });

    return res.status(200).json({
      message: "Roster members fetched successfully.",
      roster: roster,
      rosterMembers: members,
    });
  } catch (error) {
    console.error("Error fetching roster members for organization:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const GetRosterAllMembers = async (req, res) => {
  try {
    // Step 1: Fetch all roster members with populated roster
    const members = await RosterMember.find().populate("roster");

    // Step 2: Group members by organizationProfile ID (from the roster)
    const groupedByOrg = {};

    members.forEach((member) => {
      const orgId = member.roster?.organizationProfile?.toString();
      if (!orgId) return;

      if (!groupedByOrg[orgId]) {
        groupedByOrg[orgId] = [];
      }

      groupedByOrg[orgId].push(member);
    });

    return res.status(200).json({
      message: "Roster members grouped by organization.",
      data: groupedByOrg, // { orgId1: [members...], orgId2: [members...] }
    });
  } catch (error) {
    console.error("Error fetching all roster members:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

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

  const profilePicture = res.locals.fileName;

  // Validate required fields
  if (!organizationProfile || !name || !email) {
    return res.status(400).json({
      message: "organizationProfile, name, and email are required.",
    });
  }

  try {
    // Step 1: Find or create the roster
    let roster = await Roster.findOne({ organizationProfile });

    if (!roster) {
      roster = new Roster({ organizationProfile });
      await roster.save();
    }

    // Step 2: Create new roster member and assign roster ID
    const newMember = new RosterMember({
      roster: roster._id,
      name,
      email,
      address,
      position,
      birthDate,
      status,
      profilePicture,
      studentId,
      contactNumber,
    });

    // Step 3: Save the new member
    const savedMember = await newMember.save();

    return res.status(201).json({
      message: "Roster member added successfully.",
      rosterMember: savedMember,
    });
  } catch (error) {
    console.error("Error adding roster member:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const GetRosterMemberByOrganization = async (req, res) => {
  const { orgProfileId } = req.params;

  try {
    // Step 1: Try to find the existing roster
    let roster = await Roster.findOne({ organizationProfile: orgProfileId });

    // Step 2: If not found, create a new one
    if (!roster) {
      roster = new Roster({
        organizationProfile: orgProfileId,
        createdAt: new Date(),
      });

      await roster.save();
    }

    // Step 3: Find all roster members linked to this roster
    const members = await RosterMember.find({ roster: roster._id });

    return res.status(200).json({
      message: "Roster members fetched successfully.",
      rosterId: roster._id,
      rosterMembers: members,
    });
  } catch (error) {
    console.error("Error fetching or creating roster:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
