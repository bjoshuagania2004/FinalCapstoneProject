import mongoose from "mongoose";

// Import schemas
import { ReceiptSchema, financialReportSchema } from "./financialReport.js";
import {
  organizationSchema,
  organizationProfileSchema,
} from "./organization.js";
import { proposalSchema } from "./proposals.js";
import {
  classScheduleSchema,
  presidentProfileSchema,
} from "./presidentProfile.js";
import { accreditationSchema } from "./accreditation.js";
import { rosterMembersSchema } from "./roster.js";
import { accomplishmentSchema } from "./accomplishment.js";
import { userSchema, documentSchema } from "./users.js";
// Compile models
const Receipt = mongoose.model("Receipt", ReceiptSchema);
const Document = mongoose.model("Document", documentSchema);
const User = mongoose.model("User", userSchema);
const FinancialReport = mongoose.model(
  "FinancialReport",
  financialReportSchema
);
const Organization = mongoose.model("Organization", organizationSchema);
const OrganizationProfile = mongoose.model(
  "OrganizationProfile",
  organizationProfileSchema
);
const Proposal = mongoose.model("Proposal", proposalSchema);
const ClassSchedule = mongoose.model("ClassSchedule", classScheduleSchema);
const PresidentProfile = mongoose.model(
  "PresidentProfile",
  presidentProfileSchema
);
const Accreditation = mongoose.model("Accreditation", accreditationSchema);
const RosterMember = mongoose.model("RosterMember", rosterMembersSchema);
const Accomplishment = mongoose.model("Accomplishment", accomplishmentSchema);

// Export all models
export {
  Receipt,
  Document,
  FinancialReport,
  Organization,
  OrganizationProfile,
  Proposal,
  User,
  ClassSchedule,
  PresidentProfile,
  Accreditation,
  RosterMember,
  Accomplishment,
};
