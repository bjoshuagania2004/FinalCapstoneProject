import mongoose from "mongoose";
import { defaultAllowedOrigins } from "vite";
const { Schema } = mongoose;

export const rosterMembersSchema = new Schema(
  {
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "organizationProfile",
    },

    isComplete: { type: Boolean, default: false },
    overAllStatus: { type: String, default: "Pending" },
    rosterMembers: [
      {
        name: String,
        email: String,
        address: String,
        position: String,
        birthDate: Date,
        status: String,
        studentId: String,
        contactNumber: String,
        status: { type: String, default: "Active" },
      },
    ],
  },
  { timestamps: true }
);
