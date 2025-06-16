import mongoose from "mongoose";
const { Schema } = mongoose;

// ----------------- Document Schema -----------------
export const documentSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    label: String,
    name: String,
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
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  { timestamps: true }
);
