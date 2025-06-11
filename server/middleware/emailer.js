import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

// Set __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Fix: Add tls.rejectUnauthorized = false for development with self-signed certs
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // <-- this is important for bypassing cert check
  },
});

export const NodeEmail = async (emailAddress, emailSubject, emailMessage) => {
  if (!emailAddress) {
    console.error("NodeEmail: No recipient email address provided.");
    return { success: false, error: "Missing recipient" };
  }
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Exists" : "Missing");

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailAddress,
      subject: emailSubject,
      text: emailMessage + "\n\nThis is an auto-generated email. DO NOT REPLY.",
    });
    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
};
