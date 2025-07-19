import mongoose from "mongoose";
const { Schema } = mongoose;

export const rosterSchema = new Schema(
  {
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "organizationProfile",
    },

    isComplete: { type: Boolean, default: false },
    overAllStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export const rosterMembersSchema = new Schema(
  {
    roster: { type: Schema.Types.ObjectId, ref: "Roster" },
    name: String,
    email: String,
    address: String,
    position: String,
    birthDate: Date,
    status: String,
    studentId: String,
    contactNumber: String,
    profilePicture: String,
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);
