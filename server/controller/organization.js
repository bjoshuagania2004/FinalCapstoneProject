import { Organization, OrganizationProfile, User } from "../models/index.js";
import { customAlphabet } from "nanoid";
import { NodeEmail } from "../middleware/emailer.js";
const verificationStore = {};

export const PostOrganizationalLogo = async (req, res) => {
  try {
    const { orgId } = req.body;
    const orgLogo = res.locals.fileName;
    if (!orgId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    if (!orgLogo) {
      return res.status(400).json({
        success: false,
        message: "Organization logo is required",
      });
    }

    // Find and update the organization with the new logo
    const updatedOrganization = await OrganizationProfile.findByIdAndUpdate(
      orgId,
      { orgLogo },
      { new: true, runValidators: true }
    );

    if (!updatedOrganization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    console.log({
      message: "Organization logo updated successfully",
      data: {
        orgId: updatedOrganization._id,
        orgLogo: updatedOrganization.orgLogo,
      },
    });

    res.status(200).json({
      success: true,
      message: "Organization logo updated successfully",
      data: {
        orgId: updatedOrganization._id,
        orgLogo: updatedOrganization.orgLogo,
      },
    });
  } catch (error) {
    console.error("Error updating organization logo:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const GetAllOrganizationProfile = async (req, res) => {
  try {
    const search = req.query.search || "";
    const department = req.query.department || "";
    const program = req.query.program || "";
    const specialization = req.query.specialization || "";
    const scope = req.query.scope || ""; // add this line

    const query = {};

    // Search filters (name, acronym, etc.)
    if (search.trim() !== "") {
      query.$or = [
        { orgName: { $regex: search, $options: "i" } },
        { orgAcronym: { $regex: search, $options: "i" } },
        { orgClass: { $regex: search, $options: "i" } },
        { orgCourse: { $regex: search, $options: "i" } },
        { orgDepartment: { $regex: search, $options: "i" } },
        { adviserName: { $regex: search, $options: "i" } },
      ];
    }

    // Dropdown filters
    if (department) query.orgDepartment = department;
    if (program) query.orgCourse = program;
    if (specialization) query.orgSpecialization = specialization;

    // 🔍 Scope filter
    if (scope === "local") {
      query.orgClass = "Local";
    } else if (scope === "systemwide") {
      query.orgClass = "System-wide";
    }

    const organizationProfiles = await OrganizationProfile.find(query);

    if (!organizationProfiles || organizationProfiles.length === 0) {
      return res.status(404).json({ error: "No organizations found" });
    }

    res.status(200).json(organizationProfiles);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch organization profiles",
      details: error.message,
    });
  }
};

export const GetAllOrganization = async (req, res) => {
  try {
    const search = req.query.search || "";

    // Build the query for the organization name fields
    const orgQuery = search
      ? {
          $or: [
            { originalName: { $regex: search, $options: "i" } },
            { currentName: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const organizations = await Organization.find(orgQuery)
      .populate("organizationProfile")
      .sort({ createdAt: -1 }); // optional: sorts by newest first

    if (!organizations || organizations.length === 0) {
      return res.status(404).json({ error: "No organizations found" });
    }

    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch organizations",
      details: error.message,
    });
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

const generateRandomPassword = () => {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const passwordGen = customAlphabet(alphabet, 12);
  return passwordGen();
};

export const PostInitialOrganizationProfile = async (req, res) => {
  try {
    const {
      userId,
      adviserName,
      adviserEmail,
      adviserDepartment,
      orgName,
      orgClass,
      orgCourse,
      orgAcronym,
      orgDepartment,
      orgSpecialization,
      orgStatus,
      orgLogo,

      originalName = orgName,
      currentName = orgName,
      isActive = true,
    } = req.body;

    // Step 1: Check for duplicate organizations
    const existingOrgByOriginalName = await Organization.findOne({
      originalName: { $regex: new RegExp(`^${originalName}$`, "i") },
    });

    const existingOrgByCurrentName = await Organization.findOne({
      currentName: { $regex: new RegExp(`^${currentName}$`, "i") },
    });

    if (existingOrgByOriginalName || existingOrgByCurrentName) {
      return res.status(409).json({
        message: "Organization with this name already exists",
        error: "DUPLICATE_ORGANIZATION_NAME",
      });
    }

    // Step 2: Check for duplicate organization profiles
    const existingOrgProfile = await OrganizationProfile.findOne({
      $or: [
        { orgName: { $regex: new RegExp(`^${orgName}$`, "i") } },
        { orgAcronym: { $regex: new RegExp(`^${orgAcronym}$`, "i") } },
      ],
    });

    if (existingOrgProfile) {
      return res.status(409).json({
        message:
          "Organization profile with this name or acronym already exists",
        error: "DUPLICATE_ORGANIZATION_PROFILE",
      });
    }

    // Step 3: Check if user already has an organization profile
    const userWithOrgProfile = await User.findById(userId);
    if (userWithOrgProfile && userWithOrgProfile.organizationProfile) {
      return res.status(409).json({
        message: "User already has an organization profile",
        error: "USER_ALREADY_HAS_ORGANIZATION",
      });
    }

    const existingAdviserUser = await User.findOne({
      email: { $regex: new RegExp(`^${adviserEmail}$`, "i") },
      position: "adviser",
    });

    if (existingAdviserUser && existingAdviserUser.organizationProfile) {
      return res.status(409).json({
        message: "Adviser is already assigned to another organization",
        error: "ADVISER_ALREADY_ASSIGNED",
      });
    }

    const existingOrgWithSameAdviser = await OrganizationProfile.findOne({
      adviserEmail: { $regex: new RegExp(`^${adviserEmail}$`, "i") },
    });

    if (existingOrgWithSameAdviser) {
      return res.status(409).json({
        message:
          "This adviser email is already used in another organization profile",
        error: "ADVISER_EMAIL_ALREADY_USED",
      });
    }

    // Step 5: Create Organization
    const newOrg = new Organization({
      originalName,
      currentName,
      organizationProfile: [],
    });

    const organizationDoc = await newOrg.save();

    // Step 6: Create OrganizationProfile
    const newOrgProfile = new OrganizationProfile({
      adviserName,
      adviserEmail,
      adviserDepartment,
      orgName,
      orgClass,
      orgCourse,
      orgAcronym,
      orgDepartment,
      orgSpecialization,
      orgStatus,
      orgLogo,
      isActive,
      orgPresident: null, // You may update this later
      organization: organizationDoc._id,
    });

    const savedOrgProfile = await newOrgProfile.save();

    // Step 7: Push OrganizationProfile to Organization
    await Organization.findByIdAndUpdate(
      organizationDoc._id,
      { $push: { organizationProfile: savedOrgProfile._id } },
      { new: true }
    );

    // Step 8: Update creator user's organizationProfile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { organizationProfile: savedOrgProfile._id },
      { new: true }
    );

    // Step 9: Create adviser account if doesn't exist
    let adviserAccount = await User.findOne({
      email: { $regex: new RegExp(`^${adviserEmail}$`, "i") },
    });

    if (!adviserAccount) {
      const randomPassword = generateRandomPassword();

      adviserAccount = new User({
        name: adviserName,
        email: adviserEmail,
        department: adviserDepartment,
        password: randomPassword, // plaintext (for now)
        position: "adviser",
        organizationProfile: savedOrgProfile._id,
      });

      await adviserAccount.save();

      // Step 10: Email credentials to adviser
      const emailSubject = "Your Adviser Account Has Been Created";
      const emailBody = `
          Hello Sir/Ma'am ${adviserName},

          An account has been created for you as an adviser for the organization "${orgName}".

          You may log in using the following credentials:

          Email: ${adviserEmail}
          Password: ${randomPassword}

          Please log in and change your password.

          Regards,
          Organization Accreditation Team
`;

      await NodeEmail(adviserEmail, emailSubject, emailBody);
    } else {
      // Update existing adviser's organization profile
      adviserAccount = await User.findByIdAndUpdate(
        adviserAccount._id,
        { organizationProfile: savedOrgProfile._id },
        { new: true }
      );
    }

    res.status(200).json({
      message: "Organization profile created and adviser notified.",
      organizationProfile: savedOrgProfile,
      updatedUser,
      adviserAccount,
    });
  } catch (error) {
    console.error("Error in PostInitialOrganizationProfile:", error);

    // Handle duplicate key errors from MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate entry detected",
        error: "DUPLICATE_DATABASE_ENTRY",
        details: error.message,
      });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};
