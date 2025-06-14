import { FinancialReport, Receipt } from "../models/users.js";

/* ========== Receipt ========== */

export const createReceipt = async (req, res) => {
  try {
    const { organization, description, amount, date } = req.body;

    const receipt = new Receipt({
      organization,
      description,
      amount,
      date: date || new Date(),
      document: res.locals.documentId, // Fixed: use 'document' not 'documents'
    });

    const savedReceipt = await receipt.save();

    res.status(201).json({
      success: true,
      data: savedReceipt,
      message: "Receipt and Document created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating receipt",
      error: error.message,
    });
  }
};
// Update a receipt
export const updateReceipt = async (req, res) => {
  try {
    const { description, amount, file, date, receiptId } = req.body;

    const receipt = await Receipt.findByIdAndUpdate(
      receiptId,
      { description, amount, file, date },
      { new: true, runValidators: true }
    );

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found",
      });
    }

    res.status(200).json({
      success: true,
      data: receipt,
      message: "Receipt updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating receipt",
      error: error.message,
    });
  }
};

// Get all receipts
export const getAllReceipts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const receipts = await Receipt.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Receipt.countDocuments();

    res.status(200).json({
      success: true,
      data: receipts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching receipts",
      error: error.message,
    });
  }
};

// Get a single receipt by ID
export const getSingleReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found",
      });
    }

    res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching receipt",
      error: error.message,
    });
  }
};

// Delete a receipt
export const deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndDelete(req.params.id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Receipt deleted successfully",
      data: receipt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting receipt",
      error: error.message,
    });
  }
};

/* ========== FINANCIAL REPORT ========== */

// Get receipts by date range
export const getReceiptsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Both startDate and endDate are required",
      });
    }

    const receipts = await Receipt.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: receipts,
      count: receipts.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching receipts by date range",
      error: error.message,
    });
  }
};

// Create a new financial report
export const createFinancialReport = async (req, res) => {
  try {
    const { organization, beginningBalance } = req.body;

    // Parse stringified arrays from multipart/form-data
    const receipts = JSON.parse(req.body.receipts || "[]");
    const disbursements = JSON.parse(req.body.disbursements || "[]");

    // Access files from multer (files is an object with arrays)
    const files = req.files || {};

    // Attach file names to corresponding receipt entries
    receipts.forEach((receipt, index) => {
      const file = files[`receipts[${index}][file]`]?.[0];
      if (file) {
        receipt.file = file.originalname; // or use file.filename if you renamed it in storage
      }
    });

    // Attach file names to corresponding disbursement entries
    disbursements.forEach((disbursement, index) => {
      const file = files[`disbursements[${index}][file]`]?.[0];
      if (file) {
        disbursement.file = file.originalname;
      }
    });

    const numericBeginning = Number(beginningBalance);
    const totalReceipts = receipts.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
    const totalDisbursement = disbursements.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
    const endingBalance = numericBeginning + totalReceipts - totalDisbursement;

    const report = new FinancialReport({
      organization,
      beginningBalance: numericBeginning,
      receipts,
      disbursements,
      totalReceipts,
      totalDisbursement,
      endingBalance,
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating report", error: err.message });
  }
};

// Get all reports
export const getAllFinancialReports = async (req, res) => {
  try {
    const reports = await FinancialReport.find().populate("organization");
    res.status(200).json(reports);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching reports", error: err.message });
  }
};

// Get a report by ID
export const getFinancialReportById = async (req, res) => {
  try {
    const report = await FinancialReport.findById(req.params.id).populate(
      "organization"
    );
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching report", error: err.message });
  }
};

// Update a report by ID
export const updateFinancialReport = async (req, res) => {
  try {
    const { beginningBalance, receipts, disbursements } = req.body;

    const totalReceipts = receipts.reduce((sum, item) => sum + item.amount, 0);
    const totalDisbursement = disbursements.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const endingBalance = beginningBalance + totalReceipts - totalDisbursement;

    const updated = await FinancialReport.findByIdAndUpdate(
      req.params.id,
      {
        beginningBalance,
        receipts,
        disbursements,
        totalReceipts,
        totalDisbursement,
        endingBalance,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating report", error: err.message });
  }
};

// Delete a report
export const deleteFinancialReport = async (req, res) => {
  try {
    const deleted = await FinancialReport.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting report", error: err.message });
  }
};
