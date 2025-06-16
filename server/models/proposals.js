import mongoose from "mongoose";
const { Schema } = mongoose;

export const proposalSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    overallStatus: { type: String, default: "Pending" },
    title: String,
    proposedDate: Date,
    description: String,
    documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  },
  { timestamps: true }
);
