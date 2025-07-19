import {
  RosterMember,
  Organization,
  Roster,
  OrganizationProfile,
} from "../../models/index.js";

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
