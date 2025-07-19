import mongoose from "mongoose";
const { Schema } = mongoose;

export const ReceiptSchema = new mongoose.Schema(
  {
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "organizationProfile",
    },
    description: String,
    amount: Number,
    expenseType: String,
    document: { type: Schema.Types.ObjectId, ref: "Document" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const financialReportSchema = new mongoose.Schema(
  {
    organizationProfile: {
      type: Schema.Types.ObjectId,
      ref: "organizationProfile",
      require: true,
    },

    accreditation: {
      type: Schema.Types.ObjectId,
      ref: "accreditations",
    },

    initialBalance: Number,
    endingBalance: Number,

    reimbursements: [
      {
        type: Schema.Types.ObjectId,
        ref: "Receipts",
      },
    ],
    disbursements: [
      {
        type: Schema.Types.ObjectId,
        ref: "Receipts",
      },
    ],
  },
  { timestamps: true }
);
