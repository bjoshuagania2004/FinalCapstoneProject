import mongoose from "mongoose";
const { Schema } = mongoose;

export const proposalSchema = new Schema(
  {
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "OrganizationProfile",
    },

    organization: { type: Schema.Types.ObjectId, ref: "Organization" },

    accreditation: {
      type: Schema.Types.ObjectId,
      ref: "accreditations",
    },

    overallStatus: { type: String, default: "Pending" },

    title: String,
    proposedDate: Date,
    description: String,

    documents: [{ type: Schema.Types.ObjectId, ref: "Documents" }],
  },
  { timestamps: true }
);

export const ProposedActionPlanSchema = new Schema(
  {
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "OrganizationProfile",
    },

    organization: { type: Schema.Types.ObjectId, ref: "Organizations" },

    accreditation: {
      type: Schema.Types.ObjectId,
      ref: "Accreditations",
    },
    overallStatus: { type: String, default: "Pending" },

    activityTitle: String,
    alignedOrgObjectives: String,
    venue: String,
    proposedDate: Date,
    briefDetails: String,
    alingedSDG: [String],
    budgetaryRequirements: Number,
    collaboratingEntities: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrganizationProfile",
      },
    ],
  },
  { timestamps: true }
);
