import mongoose from "mongoose";
const { Schema } = mongoose;

export const proposalSchema = new Schema(
  {
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "OrganizationProfile",
    },
    overallStatus: { type: String, default: "Pending" },
    title: String,
    proposedDate: Date,
    description: String,
    documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  },
  { timestamps: true }
);
