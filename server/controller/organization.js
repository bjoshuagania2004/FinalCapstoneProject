import { Organization, User } from "../models/index.js";

export const PostOrganizationProfile = async (req, res) => {
  try {
    const {
      adviserName,
      adviserEmail,
      adviserDepartment,
      orgName,
      orgEmail,
      orgClass,
      orgCourse,
      orgAcronym,
      orgPresident,
      orgDepartment,
      orgSpecialization,
      user_id,
    } = req.body;

    const newOrg = new Organization({
      adviserName,
      adviserEmail,
      adviserDepartment,
      orgName,
      orgEmail,
      orgClass,
      orgCourse,
      orgAcronym,
      orgPresident,
      orgDepartment,
      orgSpecialization,
    });

    const savedOrg = await newOrg.save();

    // Step 2: Update the user with the new organization's ID
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { organization: savedOrg._id },
      { new: true }
    ).populate("organization"); // Populate if you want to return full org details

    res.status(200).json({
      message: "Organization registered and linked to user.",
      organization: savedOrg,
      updatedUser,
    });
  } catch (error) {
    console.error("Error in PostInitialRegistration:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
