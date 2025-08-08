import mongoose from "mongoose";
const { Schema } = mongoose;

export const organizationProfileSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    orgPresident: { type: Schema.Types.ObjectId, ref: "PresidentProfile" },
    overAllStatus: { type: String, default: "Pending" },
    orgLogo: String,
    orgName: String, // Name used this year
    orgClass: String,
    orgCourse: String,
    orgStatus: String, // Active, Inactive, Disqualified
    orgAcronym: String,
    orgDepartment: String,
    orgSpecialization: String,
    isActive: { type: Boolean, default: true },

    adviserName: String,
    adviserEmail: String,
    adviserDepartment: String,
  },
  { timestamps: true }
);

export const organizationSchema = new Schema(
  {
    originalName: String,
    establishedDate: Date,
    currentName: String,

    organizationProfile: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrganizationProfile",
      },
    ],
  },
  { timestamps: true }
);
