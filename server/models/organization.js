import mongoose from "mongoose";
const { Schema } = mongoose;

export const organizationProfileSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    orgPresident: { type: Schema.Types.ObjectId, ref: "PresidentProfile" },

    academicYear: {
      start: Number,
      end: Number,
    },

    logo: String,
    orgName: String, // Name used this year
    orgClass: String,
    orgCourse: String,
    orgStatus: String, // Active, Inactive, Disqualified
    orgAcronym: String,
    orgDepartment: String,
    orgSpecialization: String,

    adviserName: String,
    adviserEmail: String,
    adviserDepartment: String,
  },
  { timestamps: true }
);

export const organizationSchema = new Schema(
  {
    orgCode: { type: String, unique: true }, // Permanent identifier
    originalName: String,
    establishedDate: Date,
    currentName: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
