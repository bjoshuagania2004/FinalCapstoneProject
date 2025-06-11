import mongoose from "mongoose";
const { Schema } = mongoose;

// Shared Enums
const statusEnum = ["Pending", "Approved", "Revision Required"];
const userPositions = [
  "student_leader",
  "adviser",
  "dean",
  "sdu",
  "ossd",
  "ossd_coordinator",
];

// ----------------- Document Schema -----------------
const documentSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    label: String,
    name: String,
    revisionNotes: String,
    isPinned: Boolean,
    logs: [String],
    status: { type: String, enum: statusEnum, default: "Pending" },
  },
  { timestamps: true }
);

// ----------------- Roster Schema -----------------
const rosterSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    name: String,
    email: String,
    address: String,
    position: String,
    birthDate: Date,
    studentId: String,
    contactNumber: String,
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

// ----------------- Accomplishment Schema -----------------
const accomplishmentSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    overallStatus: { type: String, enum: statusEnum, default: "Pending" },
    accomplishmentDate: Date,
    accomplishmentType: String,
    accomplishmentTitle: String,
    accomplishmentDescription: String,
    accomplishmentScore: { type: Number, default: null },
    documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  },
  { timestamps: true }
);

// ----------------- Proposal Schema -----------------
const proposalSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    overallStatus: { type: String, enum: statusEnum, default: "Pending" },
    title: String,
    proposedDate: Date,
    description: String,
    documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  },
  { timestamps: true }
);

// ----------------- Post Schema -----------------
const postSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    status: { type: String },
    tags: [String],
    title: String,
    caption: String,
    content: Schema.Types.Mixed,
    revisionNotes: String,
  },
  { timestamps: true }
);

// ----------------- President Profile Schema -----------------
const classScheduleSchema = new Schema({
  subject: { type: String, required: true },
  place: String,
  time: String,
  day: String,
});

const presidentProfileSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
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
    talentSkills: String,
    contactNo: String,
    addressPhoneNo: String,
    facebookAccount: String,
    classSchedule: [classScheduleSchema],
  },
  { timestamps: true }
);

// ----------------- Accreditation Schema -----------------
const accreditationSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    isActive: { type: Boolean, default: true },
    rosters: [{ type: Schema.Types.ObjectId, ref: "Roster" }],
    documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
    financialReport: [{ type: Schema.Types.ObjectId, ref: "Proposal" }],
    overallStatus: { type: String, enum: statusEnum, default: "Pending" },
  },
  { timestamps: true }
);

// ----------------- Financial Report Schema -----------------

const ReceiptSchema = new mongoose.Schema({
  organization: { type: Schema.Types.ObjectId, ref: "Organization" },

  description: String,
  amount: Number,
  file: String,
  date: Date,
});

const financialReportSchema = new mongoose.Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },

    beginningBalance: {
      type: Number, // Added 'type:' here
    },
    receipts: [ReceiptSchema],
    disbursements: [ReceiptSchema],

    totalReceipts: {
      type: Number,
    },

    totalDisbursement: {
      type: Number, // Added 'type:' here
    },

    endingBalance: {
      type: Number, // Added 'type:' here
      default: function () {
        return (
          this.beginningBalance + this.totalReceipts - this.totalDisbursement
        );
      },
    },
  },
  { timestamps: true }
);

// ----------------- Organization Schema -----------------
const organizationSchema = new Schema(
  {
    adviserName: String,
    adviserEmail: String,
    adviserDepartment: String,

    logo: String,

    orgName: String,
    orgEmail: String,
    orgClass: String,
    orgCourse: String,
    orgAcronym: String,
    orgPresident: String,
    orgDepartment: String,
    orgSpecialization: String,

    orgStatus: String,

    academicYear: { type: Number, default: new Date().getFullYear() },
    proposals: [{ type: Schema.Types.ObjectId, ref: "Proposal" }],

    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    presidents: [{ type: Schema.Types.ObjectId, ref: "PresidentProfile" }],
    accreditations: [{ type: Schema.Types.ObjectId, ref: "Accreditation" }],
    accomplishments: [{ type: Schema.Types.ObjectId, ref: "Accomplishment" }],
    financialReport: [{ type: Schema.Types.ObjectId, ref: "FinancialReport" }],
  },
  { timestamps: true }
);

// ----------------- User Schema -----------------
const userSchema = new Schema(
  {
    name: String,
    email: String,
    deliveryUnit: String,
    password: { type: String, minlength: 6 },
    position: { type: String, enum: userPositions, trim: true },
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  { timestamps: true }
);

// ----------------- Model Exports -----------------
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);
const Roster = mongoose.model("Roster", rosterSchema);
const Proposal = mongoose.model("Proposal", proposalSchema);
const FinancialReport = mongoose.model(
  "FinancialReport",
  financialReportSchema
);
const Document = mongoose.model("Document", documentSchema);
const Receipt = mongoose.model("Reciept", ReceiptSchema);
const Organization = mongoose.model("Organization", organizationSchema);
const Accreditation = mongoose.model("Accreditation", accreditationSchema);
const Accomplishment = mongoose.model("Accomplishment", accomplishmentSchema);

const PresidentProfile = mongoose.model(
  "PresidentProfile",
  presidentProfileSchema
);

export {
  User,
  Post,
  Roster,
  Receipt,
  Proposal,
  Document,
  Organization,
  Accreditation,
  Accomplishment,
  FinancialReport,
  PresidentProfile,
};
