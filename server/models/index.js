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
const Receipt = mongoose.model("Receipts", ReceiptSchema);
const Document = mongoose.model("Documents", documentSchema);
const User = mongoose.model("Users", userSchema);
const FinancialReport = mongoose.model(
  "FinancialReport",
  financialReportSchema
);
const Organization = mongoose.model("Organizations", organizationSchema);
const OrganizationProfile = mongoose.model(
  "OrganizationProfile",
  organizationProfileSchema
);
const Proposal = mongoose.model("Proposals", proposalSchema);
const PresidentProfile = mongoose.model(
  "PresidentProfile",
  presidentProfileSchema
);
const Accreditation = mongoose.model("Accreditations", accreditationSchema);
const RosterMember = mongoose.model("RosterMembers", rosterMembersSchema);
const Accomplishment = mongoose.model("Accomplishments", accomplishmentSchema);

// Export all models
export {
  Receipt,
  Document,
  FinancialReport,
  Organization,
  OrganizationProfile,
  Proposal,
  User,
  PresidentProfile,
  Accreditation,
  RosterMember,
  Accomplishment,
};
