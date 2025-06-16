import mongoose from "mongoose";
const { Schema } = mongoose;

// ----------------- Accreditation Schema -----------------
export const accreditationSchema = new Schema(
  {
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "organizationProfile",
    },
    isActive: { type: Boolean, default: true },
    rosters: [{ type: Schema.Types.ObjectId, ref: "Roster" }],
    documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
    financialReport: [{ type: Schema.Types.ObjectId, ref: "financialReport" }],
    overallStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);
