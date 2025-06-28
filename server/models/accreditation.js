import mongoose from "mongoose";
const { Schema } = mongoose;

// ----------------- Accreditation Schema -----------------
export const accreditationSchema = new Schema(
  {
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "organizationProfile",
    },
    overallStatus: { type: String, default: "Pending" },
    isActive: { type: Boolean, default: true },
    documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
    financialReport: [{ type: Schema.Types.ObjectId, ref: "financialReport" }],
  },
  { timestamps: true }
);
