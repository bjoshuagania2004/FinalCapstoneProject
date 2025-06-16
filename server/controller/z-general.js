import { User as userModel, Organization } from "../models/index.js";
import { customAlphabet } from "nanoid";
import { NodeEmail } from "../middleware/emailer.js";

const verificationStore = {};

export const CreateAccreditation = async (req, res) => {};

export const RequestTester = async (req, res) => {
  try {
    const { body } = req;
    res.status(200).json({
      message: "Request received successfully.",
      receivedBody: body,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while processing the request.",
      error: error.message,
    });
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

  const user = await userModel.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  console.log(user);
  req.session.user = {
    userId: user._id,
    position: user.position,
    organization: user.organization,
  };

  console.log(req.session);
  return res.json({
    user: req.session.user,
  });
};

export const Logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};

export const SendRegistrationConfirmationCode = async (req, res) => {
  console.log("Request body:", req.body);

  const { email } = req.body;
  console.log("Received email for OTP:", email);

  const generateNumericOTP = customAlphabet("0123456789", 6);
  const otpString = generateNumericOTP();
  const otpInt = Number(otpString);

  verificationStore[email] = otpString;

  const org_email_subject = "Organization Accreditation Confirmation";
  const org_email_message = `Hello, your accreditation OTP is ${otpString}. Please use this code to confirm your accreditation.`;

  try {
    const emailResult = await NodeEmail(
      email,
      org_email_subject,
      org_email_message
    );

    if (emailResult?.success) {
      console.log(`Email sent successfully to ${email}`);
      res.status(200).json({ otp: otpInt, otpString });
    } else {
      console.error(`Failed to send email to ${email}`, emailResult);
      res
        .status(500)
        .json({ error: "Failed to send confirmation code email." });
    }
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    res.status(500).json({
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

    const newUser = new userModel({
      email,
      password,
      position,
      organization: null,
      delivery_unit: null,
    });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const GetUserInformation = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel.findOne({ userId });
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

export const GetOrganizationInformation = async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findById(id)
      .populate("proposals")
      .populate("accreditation")
      .populate("accomplishments")
      .populate("posts");

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
