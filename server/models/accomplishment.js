import mongoose from "mongoose";
const { Schema } = mongoose;

// Sub-schema for Program/Project/Activity, Meetings, etc.
const subAccomplishmentSchema = new Schema(
  {
    category: {
      type: String,
      enum: [
        "PPA", // Program, Projects, and Activities
        "Meetings",
        "Documents",
        "InstitutionalInvolvement",
        "Awards",
        "Outreach",
      ],
      required: true,
    },
    title: String,
    description: String,
    date: Date,

    // For Awards specifically
    level: {
      type: String,
      enum: ["International", "National", "Regional", "Institutional", "Local"],
    },
    numberOfAwardees: Number, // useful for auto-computing score tiers

    // For PPAs and Outreach
    isApprovedActionPlan: { type: Boolean, default: false },

    // Documents
    documentRefs: [{ type: Schema.Types.ObjectId, ref: "Document" }],

    // Scoring
    maxPoints: Number,
    awardedPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Main schema to group everything by organization/year
export const accomplishmentSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "OrganizationProfile",
    },

    academicYear: String, // e.g., "2024-2025"

    overallStatus: { type: String, default: "Pending" },

    // Store all sub accomplishments (PPAs, awards, outreach, etc.)
    accomplishments: [
      { type: Schema.Types.ObjectId, ref: "SubAccomplishment" },
    ],

    // Aggregated scores
    totalOrganizationalDevelopment: { type: Number, default: 0 },
    totalOrganizationalPerformance: { type: Number, default: 0 },
    totalServiceCommunity: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);
