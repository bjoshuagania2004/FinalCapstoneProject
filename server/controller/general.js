import { Organization, OrganizationProfile, User } from "../models/index.js";
import { customAlphabet } from "nanoid";
import { NodeEmail } from "../middleware/emailer.js";

const verificationStore = {};

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

export const GetUserInformation = async (req, res) => {
  const { userId } = req.params;

  console.log(userId);
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
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

    if (!email || !password) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

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
    console.log(error);
  }
};

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

export const CheckSession = (req, res) => {
  if (req.session?.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email and populate organizationProfile
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("User:", user);

    // Set session
    req.session.user = {
      userId: user._id,
      position: user.position,
      email: user.email,
      organizationProfile: user.organizationProfile,
    };

    console.log("Session:", req.session);

    return res.json({
      user: req.session.user,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const Logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};
