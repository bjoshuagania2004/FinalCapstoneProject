import mongoose from "mongoose";
const { Schema } = mongoose;

export const proposalSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },

    ProposedActionPlanSchema: {
      type: Schema.Types.ObjectId,
      ref: "ProposedActionPlan",
    },

    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "OrganizationProfile",
    },

    accreditation: {
      type: Schema.Types.ObjectId,
      ref: "Accreditations",
    },

    overallStatus: { type: String, default: "Pending" },

    activityTitle: String,
    alignedSDG: [String],
    budgetaryRequirements: Number,
    venue: String,
    proposedDate: Date,

    Proponents: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrganizationProfile",
      },
    ],

    document: [
      {
        type: Schema.Types.ObjectId,
        ref: "Documents",
      },
    ],
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

    ProposedIndividualActionPlan: [
      { type: Schema.Types.ObjectId, ref: "Proposals" },
    ],

    accreditation: {
      type: Schema.Types.ObjectId,
      ref: "Accreditations",
    },
    overallStatus: { type: String, default: "Pending" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
