import mongoose from "mongoose";
const { Schema } = mongoose;

// ----------------- Document Schema -----------------
export const documentSchema = new Schema(
  {
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "organizationProfile",
      require: true,
    },
    label: String,
    fileName: String,
    revisionNotes: String,
    isPinned: { type: Boolean, default: false },
    logs: [String],
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

// ----------------- User Schema -----------------
export const userSchema = new Schema(
  {
    name: String,
    email: String,
    deliveryUnit: String,
    password: { type: String, minlength: 6 },
    position: { type: String, trim: true },
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "organizationprofiles",
    },
  },
  { timestamps: true }
);
