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
    document: { type: Schema.Types.ObjectId, ref: "Document" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const financialReportSchema = new mongoose.Schema(
  {
    currentOrganization: {
      type: Schema.Types.ObjectId,
      ref: "organizationProfile",
    },
    beginningBalance: Number,

    receipts: [
      {
        type: Schema.Types.ObjectId,
        ref: "receipt",
      },
    ],
    disbursements: [
      {
        type: Schema.Types.ObjectId,
        ref: "rfeceipt",
      },
    ],

    totalReceipts: Number,

    totalDisbursement: Number,

    endingBalance: Number,
  },
  { timestamps: true }
);
