import { User, Organization } from "../models/index.js";
import { customAlphabet } from "nanoid";
import { NodeEmail } from "../middleware/emailer.js";

const verificationStore = {};

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
