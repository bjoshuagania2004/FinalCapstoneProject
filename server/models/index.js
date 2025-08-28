import mongoose from "mongoose";

import {
  organizationSchema,
  organizationProfileSchema,
} from "./organization.js";
import { AdviserSchema, userSchema } from "./users.js";
import {
  proposalConductSchema,
  proposalSchema,
  ProposedActionPlanSchema,
} from "./proposals.js";
import { documentSchema } from "./document.js";
import { accreditationSchema } from "./accreditation.js";
import { rosterMembersSchema, rosterSchema } from "./roster.js";
import { accomplishmentSchema } from "./accomplishment.js";
import { presidentProfileSchema } from "./president_profile.js";
import { ReceiptSchema, financialReportSchema } from "./financial_report.js";
// Compile models
const User = mongoose.model("Users", userSchema);
const Adviser = mongoose.model("Advisers", AdviserSchema);
const Receipt = mongoose.model("Receipts", ReceiptSchema);
const Document = mongoose.model("Documents", documentSchema);
const Proposal = mongoose.model("Proposals", proposalSchema);
const ProposalConduct = mongoose.model(
  "ProposalsConduct",
  proposalConductSchema
);
const Roster = mongoose.model("Roster", rosterSchema);
const RosterMember = mongoose.model("RosterMembers", rosterMembersSchema);
const Organization = mongoose.model("Organizations", organizationSchema);
const Accreditation = mongoose.model("Accreditations", accreditationSchema);
const Accomplishment = mongoose.model("Accomplishments", accomplishmentSchema);

const ProposedActionPlan = mongoose.model(
  "ProposedActionPlan",
  ProposedActionPlanSchema
);
const OrganizationProfile = mongoose.model(
  "OrganizationProfile",
  organizationProfileSchema
);

const PresidentProfile = mongoose.model(
  "PresidentProfile",
  presidentProfileSchema
);
const FinancialReport = mongoose.model(
  "FinancialReport",
  financialReportSchema
);

export {
  User,
  Adviser,
  Proposal,
  Receipt,
  Document,
  Roster,
  RosterMember,
  Organization,
  ProposalConduct,
  Accreditation,
  Accomplishment,
  ProposedActionPlan,
  FinancialReport,
  PresidentProfile,
  OrganizationProfile,
};
