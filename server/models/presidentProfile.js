import mongoose from "mongoose";
const { Schema } = mongoose;

// ----------------- President Profile Schema -----------------
export const classScheduleSchema = new Schema({
  subject: { type: String, required: true },
  place: String,
  time: String,
  day: String,
});

export const presidentProfileSchema = new Schema(
  {
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "OrganizationProfile",
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    profilePicture: String,
    courseYear: String,
    name: String,
    age: Number,
    sex: String,
    religion: String,
    nationality: String,
    birthplace: String,
    presentAddress: String,
    permanentAddress: String,
    parentGuardian: String,
    sourceOfFinancialSupport: String,
    talentSkills: [Object],
    contactNo: String,
    addressPhoneNo: String,
    facebookAccount: String,
    classSchedule: [classScheduleSchema],
  },
  { timestamps: true }
);
