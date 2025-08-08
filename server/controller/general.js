import { Organization, OrganizationProfile, User } from "../models/index.js";
import { customAlphabet } from "nanoid";
import { NodeEmail } from "../middleware/emailer.js";

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
