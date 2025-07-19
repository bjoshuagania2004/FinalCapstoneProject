import mongoose from "mongoose";
const { Schema } = mongoose;

export const accomplishmentSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },

    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "organizationProfile",
    },

    overallStatus: { type: String, default: "Pending" },

    accomplishmentDate: Date,
    accomplishmentType: String,
    accomplishmentTitle: String,
    accomplishmentDescription: String,

    accomplishmentScore: { type: Number, default: null },
    documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  },
  { timestamps: true }
);
