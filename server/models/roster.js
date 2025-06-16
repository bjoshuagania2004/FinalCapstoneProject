import mongoose from "mongoose";
const { Schema } = mongoose;

export const rosterMembersSchema = new Schema(
  {
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "organizationProfile",
    },
    name: String,
    email: String,
    address: String,
    position: String,
    birthDate: Date,
    studentId: String,
    contactNumber: String,

    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);
