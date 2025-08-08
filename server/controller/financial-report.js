import { Receipt, FinancialReport } from "../models/index.js";

export const getFinancialReport = async (req, res) => {
  try {
    const { OrgProfileId } = req.params;

    if (!OrgProfileId) {
      return res.status(400).json({ error: "Missing organizationProfile." });
    }

    let report = await FinancialReport.findOne({
      organizationProfile: OrgProfileId,
    })
      .populate("reimbursements")
      .populate("disbursements");

    // If not found, create a new one
    if (!report) {
      report = new FinancialReport({
        organizationProfile: OrgProfileId,
        receipts: [],
        expenses: [],
        initialBalance: 0,
      });

      await report.save();

      // Repopulate after saving
      report = await FinancialReport.findById(report._id).populate(
        "reimbursements"
      );
    }

    return res.status(200).json(report);
  } catch (error) {
    console.error("❌ Error fetching/creating financial report:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve or create financial report." });
  }
};

export const AddReceipt = async (req, res) => {
  try {
    const {
      description,
      amount,
      name,
      expenseType,
      date,
      organizationProfile,
      type, // "reimbursement" or "disbursement"
      financialReportId, // may or may not exist
    } = req.body;

    const documentId = res.locals.documentId;

    console.log("📥 Form Data:", req.body);
    console.log("🧾 Linked Document ID:", documentId);

    // Create and save the receipt
    const newReceipt = new Receipt({
      description,
      amount,
      name,
      expenseType,
      date,
      organizationProfile,
      document: documentId,
    });

    await newReceipt.save();

    // Determine which field to update and balance adjustment
    const updateField =
      type === "reimbursement" ? "reimbursements" : "disbursements";

    // Calculate balance adjustment: reimbursement adds, disbursement subtracts
    const balanceAdjustment = type === "reimbursement" ? amount : -amount;

    let updatedFinancialReport;

    if (financialReportId) {
      // Update existing financial report
      updatedFinancialReport = await FinancialReport.findByIdAndUpdate(
        financialReportId,
        {
          $push: { [updateField]: newReceipt._id },
          $inc: { initialBalance: balanceAdjustment },
        },
        { new: true }
      );

      if (!updatedFinancialReport) {
        return res.status(404).json({ error: "Financial report not found." });
      }
    } else {
      // Create new financial report instance
      const newReportData = {
        organizationProfile,
        expenseType,
        initialBalance: balanceAdjustment, // Set initial balance based on first transaction
        endingBalance: 0,
        [updateField]: [newReceipt._id],
      };

      updatedFinancialReport = new FinancialReport(newReportData);
      await updatedFinancialReport.save();
    }

    return res.status(201).json({
      message: "Receipt successfully created and linked to financial report.",
      receipt: newReceipt,
      financialReport: updatedFinancialReport,
    });
  } catch (error) {
    console.error("❌ Error creating receipt and financial report:", error);
    return res.status(500).json({ error: "Failed to create receipt." });
  }
};
