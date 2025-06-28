import { Organization, OrganizationProfile, User } from "../models/index.js";

export const PostInitialOrganizationProfile = async (req, res) => {
  try {
    const {
      userId, // User who created this profile
      adviserName,
      adviserEmail,
      adviserDepartment,
      orgName,
      orgClass,
      orgCourse,
      orgAcronym,
      orgDepartment,
      orgSpecialization,
      academicYearStart,
      academicYearEnd,
      logo,
      orgStatus, // Active, Inactive, Disqualified

      originalName = orgName,
      currentName = orgName,
      firstApplication = true,
      isActive = true, // optional default
    } = req.body;

    // Create new Organization
    const newOrg = new Organization({
      originalName,
      currentName,
      firstApplication,
      isActive,
    });

    const organizationDoc = await newOrg.save();

    const newOrgProfile = new OrganizationProfile({
      adviserName,
      adviserEmail,
      adviserDepartment,
      orgName,
      orgClass,
      orgCourse,
      orgAcronym,
      orgPresident: null,
      orgDepartment,
      orgSpecialization,
      organization: organizationDoc._id,
      academicYear: {
        start: academicYearStart,
        end: academicYearEnd,
      },
      logo,
      orgStatus,
    });

    const savedOrgProfile = await newOrgProfile.save();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { organizationProfile: savedOrgProfile._id },
      { new: true }
    );

    res.status(200).json({
      message: "Organization profile created and linked to user.",
      organizationProfile: savedOrgProfile,
      updatedUser,
    });
  } catch (error) {
    console.error("Error in PostOrganizationProfile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const GetOrganizationProfileInformation = async (req, res) => {
  const { orgProfileId } = req.params;

  try {
    const organization = await OrganizationProfile.findById(orgProfileId);

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.status(200).json(organization);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch organization", details: error.message });
  }
};
