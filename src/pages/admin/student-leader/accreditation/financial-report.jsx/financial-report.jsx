import React, { useEffect, useState } from "react";
import {
  X,
  Upload,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  User,
  FileText,
  Tag,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DocumentUploader from "../../../../../components/document_uploader";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../../../App";
import axios from "axios";
import { StudentDisbursement } from "./disbursement";
import { StudentReimbursement } from "./reimbursements";

export default function FinancialReport({ orgData }) {
  const [financialReport, setFinancialReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState(null);

  // NEW: view modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const GetFinancialReportApi = async () => {
    try {
      setLoading(true);
      console.log(`${API_ROUTER}/getFinancialReport/${orgData._id}`);
      const response = await axios.get(
        `${API_ROUTER}/getFinancialReport/${orgData._id}`
      );
      console.log(response.data);
      setFinancialReport(response.data);
      setCurrentBalance(response.data.initialBalance);
    } catch (error) {
      console.error("Error fetching financial report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetFinancialReportApi();
  }, [orgData._id]);

  const generateMonthlyData = () => {
    const monthlyStats = {};
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    months.forEach((month) => {
      monthlyStats[month] = {
        month,
        reimbursements: 0,
        disbursements: 0,
        balance: currentBalance,
      };
    });

    financialReport.reimbursements.forEach((item) => {
      const date = new Date(item.date);
      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];
      monthlyStats[monthName].reimbursements += item.amount;
    });

    financialReport.disbursements.forEach((item) => {
      const date = new Date(item.date);
      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];
      monthlyStats[monthName].disbursements += item.amount;
    });

    let runningBalance = currentBalance;
    return months.map((month) => {
      const data = monthlyStats[month];
      runningBalance =
        runningBalance - data.disbursements + data.reimbursements;
      return {
        ...data,
        balance: runningBalance,
      };
    });
  };

  const monthlyData = financialReport ? generateMonthlyData() : [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleAddClick = (type) => {
    setTransactionType(type);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setTransactionType(null);
  };

  const handleTransactionSubmit = async (formData) => {
    try {
      const response = await axios.post(`${API_ROUTER}/addReciept`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Successfully submitted:", response.data);
      window.location.reload();
    } catch (error) {
      console.error(
        "❌ Error submitting transaction:",
        error.response?.data || error.message
      );
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full pt-4 bg-transparent rounded-2xl flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading financial report...</div>
      </div>
    );
  }

  if (!financialReport) {
    return (
      <div className="h-full w-full pt-4 bg-transparent rounded-2xl flex items-center justify-center">
        <div className="text-lg text-red-600">
          Failed to load financial report
        </div>
      </div>
    );
  }

  const totalReimbursements = financialReport.reimbursements.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalDisbursements = financialReport.disbursements.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const createExpenseBreakdown = () => {
    const reimbursementTypes = {};
    const disbursementTypes = {};

    financialReport.reimbursements.forEach((reimbursement) => {
      const expenseType = reimbursement.expenseType || "uncategorized";
      if (!reimbursementTypes[expenseType]) {
        reimbursementTypes[expenseType] = 0;
      }
      reimbursementTypes[expenseType] += reimbursement.amount;
    });

    financialReport.disbursements.forEach((disbursement) => {
      const expenseType = disbursement.expenseType || "uncategorized";
      if (!disbursementTypes[expenseType]) {
        disbursementTypes[expenseType] = 0;
      }
      disbursementTypes[expenseType] += disbursement.amount;
    });

    const greenShades = ["#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"];
    const redShades = ["#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"];

    const result = [];

    Object.entries(reimbursementTypes).forEach(
      ([expenseType, amount], index) => {
        result.push({
          name: `${expenseType}`,
          value: amount,
          color: greenShades[index % greenShades.length],
        });
      }
    );

    Object.entries(disbursementTypes).forEach(
      ([expenseType, amount], index) => {
        result.push({
          name: `${expenseType}`,
          value: amount,
          color: redShades[index % redShades.length],
        });
      }
    );

    return result;
  };

  const expenseBreakdown = financialReport ? createExpenseBreakdown() : [];

  return (
    <div className="h-full w-full pt-4 bg-transparent flex gap-4 ">
      <div className="bg-white flex flex-col flex-1 p-6 shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 ">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Financial Report
            </h2>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 flex-1 min-w-[200px] p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Current Balance
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {formatCurrency(currentBalance)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 flex-1 min-w-[200px] p-4 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Total Reimbursements
                </p>
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(totalReimbursements)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 flex-1 min-w-[200px] p-4 border border-red-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">
                  Total Disbursements
                </p>
                <p className="text-2xl font-bold text-red-800">
                  {formatCurrency(totalDisbursements)}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="flex flex-col gap-6 overflow-auto max-h-[600px]">
          <div className="bg-white p-4 rounded-2xl shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Monthly Comparison
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar
                    dataKey="reimbursements"
                    fill="#22c55e"
                    name="Reimbursements"
                  />
                  <Bar
                    dataKey="disbursements"
                    fill="#ef4444"
                    name="Disbursements"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {expenseBreakdown.length > 0 && (
            <div className="bg-white p-4 rounded-2xl shadow border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Expense Breakdown
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      labelLine={false}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reimbursements and Disbursements */}
      <div className="flex flex-col flex-1 gap-4 h-full overflow-hidden">
        <StudentReimbursement
          financialReport={financialReport}
          handleAddClick={handleAddClick}
          setSelectedTransaction={setSelectedTransaction}
          setSelectedType={setSelectedType}
          setViewModalOpen={setViewModalOpen}
          formatCurrency={formatCurrency}
        />
        <StudentDisbursement
          financialReport={financialReport}
          handleAddClick={handleAddClick}
          setSelectedTransaction={setSelectedTransaction}
          setSelectedType={setSelectedType}
          setViewModalOpen={setViewModalOpen}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        type={transactionType}
        onSubmit={handleTransactionSubmit}
        orgData={orgData}
        financialReportId={financialReport._id}
      />

      <ViewTransactionModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        transaction={selectedTransaction}
        type={selectedType}
      />
    </div>
  );
}

function ViewTransactionModal({ isOpen, onClose, transaction, type }) {
  if (!isOpen || !transaction) return null;

  const isReimbursement = type === "reimbursement";

  // Build file URL (adjust base path if needed for your backend)
  const fileUrl = transaction?.document?.fileName
    ? `${DOCU_API_ROUTER}/${transaction.organizationProfile}/${transaction.document.fileName}`
    : transaction?.file;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${
            isReimbursement
              ? "bg-gradient-to-r from-emerald-500 to-teal-600"
              : "bg-gradient-to-r from-red-500 to-rose-600"
          }`}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {isReimbursement
                ? "Reimbursement Details"
                : "Disbursement Details"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <p className="text-sm font-semibold text-gray-600">Description</p>
            <p className="text-gray-900">{transaction.description}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600">Amount</p>
            <p
              className={`text-lg font-bold ${
                isReimbursement ? "text-green-600" : "text-red-600"
              }`}
            >
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(transaction.amount)}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600">Date</p>
            <p className="text-gray-900">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600">Expense Type</p>
            <p className="text-gray-900">
              {transaction.expenseType || "Uncategorized"}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600">
              {isReimbursement ? "Requestor" : "Recipient"}
            </p>
            <p className="text-gray-900">{transaction.name}</p>
          </div>

          {fileUrl && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Document
              </p>
              <iframe
                src={fileUrl}
                className="w-full h-96 border rounded-lg"
                title="Transaction Document"
              />
              <div className="mt-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open in New Tab
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function TransactionModal({
  orgData = { _id: "demo-org", organization: "Demo Organization" },
  isOpen = true,
  onClose = () => {},
  type = "reimbursement",
  financialReportId = "demo-report",
  onSubmit = (data) => console.log("Form submitted:", data),
}) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    name: "",
    date: new Date().toISOString().split("T")[0],
    expenseType: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (file) {
      setFileError(false); // Clear error when file is selected
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const expenseOptions = {
    reimbursement: [
      { value: "Membership Fee", label: "Membership Fee" },
      { value: "Transportation", label: "Transportation" },
      { value: "Meals", label: "Meals" },
      {
        value: "Materials Purchased by Member",
        label: "Materials Purchased by Member",
      },
      { value: "others", label: "Others" },
    ],
    disbursement: [
      { value: "Supplies", label: "Supplies" },
      { value: "Venue Reservation", label: "Venue Reservation" },
      { value: "Equipment Rental", label: "Equipment Rental" },
      { value: "accommodation", label: "Accommodation" },
      { value: "Honorarium", label: "Honorarium" },
      { value: "Others", label: "Others" },
    ],
  };

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      name: "",
      date: new Date().toISOString().split("T")[0],
      expenseType: "",
    });
    setSelectedFile(null);
    setFileError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if file is selected
    if (!selectedFile) {
      setFileError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Construct FormData object
      const multiForm = new FormData();
      multiForm.append("description", formData.description);
      multiForm.append("expenseType", formData.expenseType);
      multiForm.append("organizationProfile", orgData._id);
      multiForm.append("organization", orgData.organization);
      multiForm.append("amount", formData.amount);
      multiForm.append("financialReportId", financialReportId);
      multiForm.append("name", formData.name);
      multiForm.append("date", formData.date);
      multiForm.append("type", type);

      if (selectedFile) {
        multiForm.append("file", selectedFile);
      }

      // Pass the FormData to the onSubmit handler
      await onSubmit(multiForm);

      // Reset form and close modal on success
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const isReimbursement = type === "reimbursement";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl flex flex-col rounded-3xl shadow-2xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div
          className={`px-8 py-6 border-b border-gray-100 ${
            isReimbursement
              ? "bg-gradient-to-r from-emerald-500 to-teal-600"
              : "bg-gradient-to-r from-blue-500 to-indigo-600"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Add {isReimbursement ? "Reimbursement" : "Disbursement"}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {isReimbursement
                  ? "Request reimbursement for expenses"
                  : "Record disbursement transaction"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
              type="button"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* File Upload */}
            <div className="h-fit">
              <DocumentUploader
                onFileSelect={handleFileSelect}
                title={`Upload ${
                  isReimbursement ? "Reimbursement" : "Disbursement"
                } Document`}
                className="w-full"
              />
              {fileError && (
                <div className="mt-2 text-sm text-red-600 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Please upload a document to proceed with the transaction.
                </div>
              )}
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="inline h-4 w-4 mr-2" />
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="Enter transaction description..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-2" />
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Expense Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="inline h-4 w-4 mr-2" />
                  Type of Expense
                </label>
                <select
                  name="expenseType"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  value={formData.expenseType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select expense type</option>
                  {expenseOptions[type]?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  {isReimbursement ? "Requestor" : "Recipient"}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={`Enter ${
                    isReimbursement ? "requestor" : "recipient"
                  } name...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-3 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                isReimbursement
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              } ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Transaction"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
