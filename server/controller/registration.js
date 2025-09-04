import {
  Adviser,
  Organization,
  OrganizationProfile,
  User,
} from "../models/index.js";
import { NodeEmail } from "../middleware/emailer.js";
import { customAlphabet } from "nanoid";

const verificationStore = {};
const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  10
);
const initialPassword = nanoid();

export const ChangePasswordAdviser = async (req, res) => {
  try {
    const { adviserId, newPassword } = req.body;
    const { userId } = req.params; // ✅ lowercase params

    if (!adviserId || !newPassword || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log(req.body);
    console.log(req.params);
    // 🔒 Hash password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Step 1: Update User password
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Update Adviser firstLogin -> false
    const updatedAdviser = await Adviser.findByIdAndUpdate(
      adviserId,
      { firstLogin: false },
      { new: true }
    );

    if (!updatedAdviser) {
      return res.status(404).json({ message: "Adviser not found" });
    }

    res.status(200).json({
      message:
        "Password updated successfully and first login status set to false",
      user: updatedUser,
      adviser: updatedAdviser,
    });
  } catch (error) {
    console.error("Error in ChangePasswordAdviser:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
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
      orgEmail,
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

    // Step 4: Adviser duplication checks
    const existingAdviser = await Adviser.findOne({
      email: { $regex: new RegExp(`^${adviserEmail}$`, "i") },
    });

    if (existingAdviser && existingAdviser.organizationProfile) {
      return res.status(409).json({
        message: "Adviser is already assigned to another organization",
        error: "ADVISER_ALREADY_ASSIGNED",
      });
    }

    // Step 5: Create Organization
    const newOrg = new Organization({
      originalName,
      currentName,
      organizationProfile: [],
    });

    const organizationDoc = await newOrg.save();

    // Step 6: Ensure Adviser exists (create if not)
    let adviserAccount = existingAdviser;
    if (!adviserAccount) {
      adviserAccount = new Adviser({
        name: adviserName,
        email: adviserEmail,
        deliveryUnit: adviserDepartment,
        password: initialPassword, // 🚨 stored as plain text (your choice)
        organizationProfile: null, // will update below
        Organization: organizationDoc._id,
      });

      adviserAccount = await adviserAccount.save();

      // ✅ Also create a User entry for adviser
      const adviserUser = new User({
        name: adviserName,
        email: adviserEmail,
        password: initialPassword, // 🚨 stored as plain text (your choice)
        position: "Adviser", // You can set a role or type field
        organizationProfile: null, // will update below
        adviser: adviserAccount._id, // link to adviser profile
      });

      await adviserUser.save();
    }

    // Step 7: Create OrganizationProfile linked to adviser
    const newOrgProfile = new OrganizationProfile({
      orgName,
      orgClass,
      orgCourse,
      orgAcronym,
      orgDepartment,
      orgSpecialization,
      orgStatus,
      orgLogo,
      isActive,
      orgPresident: null,
      adviser: adviserAccount._id, // ✅ Save adviser _id
      organization: organizationDoc._id,
    });

    const savedOrgProfile = await newOrgProfile.save();

    // Step 8: Update Organization with OrgProfile
    await Organization.findByIdAndUpdate(
      organizationDoc._id,
      { $push: { organizationProfile: savedOrgProfile._id } },
      { new: true }
    );

    // Step 9: Update user with OrgProfile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { organizationProfile: savedOrgProfile._id },
      { new: true }
    );

    // Step 10: Update adviser with OrgProfile + Org
    await Adviser.findByIdAndUpdate(adviserAccount._id, {
      organizationProfile: savedOrgProfile._id,
      Organization: organizationDoc._id,
    });

    // ✅ Also update adviserUser with orgProfile
    await User.findOneAndUpdate(
      { email: adviserEmail },
      { organizationProfile: savedOrgProfile._id },
      { new: true }
    );

    // Step 11: Send email to adviser with initial password
    const org_email_subject = "Organization Adviser Account Created";
    const org_email_message = `
        Hello ${adviserName},

        Your adviser account has been successfully created for the organization "${orgName}".

        Here are your login details:
        - Email: ${adviserEmail}
        - Initial Password: ${initialPassword}

        Please log in and change your password as soon as possible.

        Thank you.
        `;

    await NodeEmail(adviserEmail, org_email_subject, org_email_message);

    // Step 12: Send email to organization notifying about adviser account
    const org_notify_subject = "Organization Accreditation Update";
    const org_notify_message = `
        Hello ${orgName},

        An adviser account has been successfully created for your organization.

        Adviser Details:
        - Name: ${adviserName}
        - Email: ${adviserEmail}

        The adviser has been notified with their initial login credentials and the system is now waiting for their response.

        You will be updated once your adviser confirms.

        Thank you,
        Accreditation Committee
        `;

    // 📩 send to org email (assuming orgLogo or other field doesn't store email)
    // If you have an `orgEmail` field in your schema, use that instead of adviserEmail
    await NodeEmail(orgEmail, org_notify_subject, org_notify_message);

    res.status(200).json({
      message: "Organization profile created and adviser assigned.",
      organizationProfile: savedOrgProfile,
      updatedUser,
      adviser: adviserAccount,
    });
  } catch (error) {
    console.error("Error in PostInitialOrganizationProfile:", error);

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

export const ReRegisterOrganizationProfile = async (req, res) => {
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
      isActive = true,
    } = req.body;

    // Step 1: Get user + their current org profile
    const user = await User.findById(userId).populate("organizationProfile");
    if (!user || !user.organizationProfile) {
      return res.status(404).json({
        message: "User or organization profile not found",
        error: "USER_OR_PROFILE_NOT_FOUND",
      });
    }

    const oldOrgProfile = await OrganizationProfile.findById(
      user.organizationProfile._id
    ).populate("organization");

    if (!oldOrgProfile) {
      return res.status(404).json({
        message: "Old organization profile not found",
        error: "OLD_ORG_PROFILE_NOT_FOUND",
      });
    }

    // Step 2: Check if org profile allows reuse
    if (!oldOrgProfile.isAllowedForReuse) {
      return res.status(403).json({
        message: "Organization profile cannot be reused",
        error: "ORG_REUSE_NOT_ALLOWED",
      });
    }

    // Step 3: Ensure adviser exists (or create)
    let adviserAccount = await Adviser.findOne({
      email: { $regex: new RegExp(`^${adviserEmail}$`, "i") },
    });

    if (!adviserAccount) {
      adviserAccount = new Adviser({
        name: adviserName,
        email: adviserEmail,
        deliveryUnit: adviserDepartment,
        password: initialPassword, // 🚨 stored as plain text (your choice)
        organizationProfile: null,
        Organization: oldOrgProfile.organization._id,
      });
      adviserAccount = await adviserAccount.save();

      // Also create a user for adviser
      const adviserUser = new User({
        name: adviserName,
        email: adviserEmail,
        role: "Adviser",
        password: initialPassword, // 🚨 stored as plain text (your choice)
        adviser: adviserAccount._id,
        organizationProfile: null,
      });
      await adviserUser.save();
    }

    // Step 4: Create a new OrganizationProfile
    const newOrgProfile = new OrganizationProfile({
      orgName,
      orgClass,
      orgCourse,
      orgAcronym,
      orgDepartment,
      orgSpecialization,
      orgStatus,
      orgLogo,
      isActive,
      adviser: adviserAccount._id,
      organization: oldOrgProfile.organization._id,
      orgPresident: null,
    });

    const savedOrgProfile = await newOrgProfile.save();

    // Step 5: Update Organization schema (push new profile)
    await Organization.findByIdAndUpdate(
      oldOrgProfile.organization._id,
      { $push: { organizationProfile: savedOrgProfile._id } },
      { new: true }
    );

    // Step 6: Update student leader's orgProfile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { organizationProfile: savedOrgProfile._id },
      { new: true }
    );

    // Step 7: Update adviser with orgProfile + org
    await Adviser.findByIdAndUpdate(adviserAccount._id, {
      organizationProfile: savedOrgProfile._id,
      Organization: oldOrgProfile.organization._id,
    });

    // Also update adviserUser with orgProfile
    await User.findOneAndUpdate(
      { email: adviserEmail },
      { organizationProfile: savedOrgProfile._id },
      { new: true }
    );

    res.status(200).json({
      message: "Organization successfully re-registered.",
      organizationProfile: savedOrgProfile,
      updatedUser,
      adviser: adviserAccount,
    });
  } catch (error) {
    console.error("Error in ReRegisterOrganizationProfile:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const SendRegistrationConfirmationCode = async (req, res) => {
  const { email } = req.body;
  console.log("Received email for OTP:", email);

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Email ${email} already exists in the system.`);
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    const generateNumericOTP = customAlphabet("0123456789", 6);
    const otpString = generateNumericOTP();
    const otpInt = Number(otpString);

    verificationStore[email] = otpString;

    const org_email_subject = "Organization Accreditation Confirmation";
    const org_email_message = `Hello, your accreditation OTP is ${otpString}. Please use this code to confirm your accreditation.`;

    const emailResult = await NodeEmail(
      email,
      org_email_subject,
      org_email_message
    );

    if (emailResult?.success) {
      console.log(`Email sent successfully to ${email}`);
      return res.status(200).json({ otp: otpInt, otpString });
    } else {
      console.error(`Failed to send email to ${email}`, emailResult);
      return res.status(500).json({
        error: "Failed to send confirmation code email.",
      });
    }
  } catch (error) {
    console.error(`Error processing request for ${email}:`, error);
    return res.status(500).json({
      error: "An error occurred while sending the confirmation code.",
    });
  }
};

export const ConfirmRegistration = async (req, res, next) => {
  console.log(req.body);
  const { email, code } = req.body;
  const storedCode = verificationStore[email];
  if (storedCode && storedCode === code) {
    delete verificationStore[email];
    next();
  } else {
    res.status(400).json({ error: "Invalid verification code" });
  }
};

export const RegisterUser = async (req, res) => {
  try {
    const { email, password, position } = req.body;

    const newUser = new User({
      email,
      password,
      position,
      organizationProfile: null,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};
