import { PresidentProfile, Organization } from "./../models/index.js"; // If you're using CommonJS, use: const StudentProfile = require('../models/studentProfileModel');

export const AddPresident = async (req, res) => {
  try {
    const {
      name,
      organization,
      courseYear,
      age,
      sex,
      religion,
      nationality,
      birthplace,
      presentAddress,
      permanentAddress,
      parentGuardian,
      addressPhoneNo,
      sourceOfFinancialSupport,
      talentSkills,
      contactNo,
      facebookAccount,
      classSchedule, // should be an array of { subject, place, time, day }
    } = req.body;

    const newProfile = new PresidentProfile({
      name,
      organization,
      courseYear,
      age,
      sex,
      religion,
      nationality,
      birthplace,
      presentAddress,
      permanentAddress,
      parentGuardian,
      addressPhoneNo,
      sourceOfFinancialSupport,
      talentSkills,
      contactNo,
      facebookAccount,
      classSchedule,
    });

    // Basic validation
    if (!organization) {
      console.error("Missing organization ID");
      return res.status(400).json({ message: "Organization ID is required." });
    }

    const FindOrg = await Organization.findById(organization);

    if (!FindOrg) {
      console.error("Organization not found:", organization);
      return res.status(404).json({ message: "Organization not found." });
    }

    const savedProfile = await newProfile.save();

    await Organization.findByIdAndUpdate(
      organization,
      { $push: { presidents: savedProfile._id } },
      { new: true }
    );

    res.status(200).json({
      message: "Student profile created successfually.",
      profile: savedProfile,
    });
  } catch (error) {
    console.error("Error in PostStudentProfile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
