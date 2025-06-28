import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { AccreditationTimeline } from "./timeline";

const initialData = {
  currentOrganization: {
    _id: "org123",
    name: "Proficient Architects of Information Systems",
  },
  beginningBalance: 10000,

  receipts: [
    {
      _id: "r1",
      type: "Sponsorship",
      description: "Received from sponsor XYZ Corporation",
      amount: 5000,
      date: "2025-06-01",
    },
    {
      _id: "r2",
      type: "Ticket Sales",
      description: "Annual Tech Conference tickets",
      amount: 3000,
      date: "2025-06-03",
    },
    {
      _id: "r3",
      type: "Donations",
      description: "Anonymous donor contribution",
      amount: 2500,
      date: "2025-06-05",
    },
    {
      _id: "r4",
      type: "Membership Fees",
      description: "Q2 2025 membership dues",
      amount: 1800,
      date: "2025-06-07",
    },
    {
      _id: "r5",
      type: "Sponsorship",
      description: "ABC Tech Solutions partnership",
      amount: 4200,
      date: "2025-06-08",
    },
    {
      _id: "r6",
      type: "Ticket Sales",
      description: "Workshop registration fees",
      amount: 1500,
      date: "2025-06-10",
    },
    {
      _id: "r7",
      type: "Other",
      description: "Equipment rental income",
      amount: 800,
      date: "2025-06-12",
    },
    {
      _id: "r8",
      type: "Donations",
      description: "Alumni fundraising campaign",
      amount: 3200,
      date: "2025-06-14",
    },
    {
      _id: "r9",
      type: "Sponsorship",
      description: "TechStart Inc. event sponsorship",
      amount: 6000,
      date: "2025-06-15",
    },
    {
      _id: "r10",
      type: "Membership Fees",
      description: "New member registrations",
      amount: 950,
      date: "2025-06-16",
    },
    {
      _id: "r11",
      type: "Ticket Sales",
      description: "Networking event tickets",
      amount: 1200,
      date: "2025-06-18",
    },
    {
      _id: "r12",
      type: "Other",
      description: "Consulting service fees",
      amount: 2800,
      date: "2025-06-20",
    },
  ],

  disbursements: [
    {
      _id: "d1",
      type: "Food and Drinks",
      description: "Catering for General Assembly",
      amount: 2000,
      date: "2025-06-05",
    },
    {
      _id: "d2",
      type: "Printing",
      description: "Conference posters and ID badges",
      amount: 1000,
      date: "2025-06-06",
    },
    {
      _id: "d3",
      type: "Transportation",
      description: "Guest speaker travel expenses",
      amount: 1500,
      date: "2025-06-07",
    },
    {
      _id: "d4",
      type: "Equipment",
      description: "Audio-visual equipment rental",
      amount: 2500,
      date: "2025-06-08",
    },
    {
      _id: "d5",
      type: "Venue",
      description: "Conference hall rental",
      amount: 3500,
      date: "2025-06-09",
    },
    {
      _id: "d6",
      type: "Food and Drinks",
      description: "Workshop refreshments",
      amount: 800,
      date: "2025-06-11",
    },
    {
      _id: "d7",
      type: "Printing",
      description: "Training materials and handouts",
      amount: 750,
      date: "2025-06-12",
    },
    {
      _id: "d8",
      type: "Other",
      description: "Professional photography services",
      amount: 1200,
      date: "2025-06-13",
    },
    {
      _id: "d9",
      type: "Transportation",
      description: "Team transportation to venue",
      amount: 600,
      date: "2025-06-14",
    },
    {
      _id: "d10",
      type: "Equipment",
      description: "Laptops and projectors purchase",
      amount: 4200,
      date: "2025-06-15",
    },
    {
      _id: "d11",
      type: "Venue",
      description: "Meeting room rental fees",
      amount: 900,
      date: "2025-06-17",
    },
    {
      _id: "d12",
      type: "Food and Drinks",
      description: "Networking event catering",
      amount: 1800,
      date: "2025-06-19",
    },
    {
      _id: "d13",
      type: "Other",
      description: "Marketing and promotional materials",
      amount: 1350,
      date: "2025-06-21",
    },
  ],
};

const FinancialTable = () => {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("receipt"); // 'receipt' or 'disbursement'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Pagination states
  const [receiptsPage, setReceiptsPage] = useState(1);
  const [disbursementsPage, setDisbursementsPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate totals
  const totalReceipts = data.receipts.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalDisbursements = data.disbursements.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const endingBalance =
    data.beginningBalance + totalReceipts - totalDisbursements;

  // Pagination calculations
  const receiptsStartIndex = (receiptsPage - 1) * itemsPerPage;
  const receiptsEndIndex = receiptsStartIndex + itemsPerPage;
  const paginatedReceipts = data.receipts.slice(
    receiptsStartIndex,
    receiptsEndIndex
  );
  const totalReceiptsPages = Math.ceil(data.receipts.length / itemsPerPage);

  const disbursementsStartIndex = (disbursementsPage - 1) * itemsPerPage;
  const disbursementsEndIndex = disbursementsStartIndex + itemsPerPage;
  const paginatedDisbursements = data.disbursements.slice(
    disbursementsStartIndex,
    disbursementsEndIndex
  );
  const totalDisbursementsPages = Math.ceil(
    data.disbursements.length / itemsPerPage
  );

  const receiptTypes = [
    "Sponsorship",
    "Ticket Sales",
    "Donations",
    "Membership Fees",
    "Other",
  ];
  const disbursementTypes = [
    "Food and Drinks",
    "Printing",
    "Transportation",
    "Equipment",
    "Venue",
    "Other",
  ];

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({
        type: item.type,
        description: item.description,
        amount: item.amount.toString(),
        date: item.date,
      });
    } else {
      setFormData({
        type: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      type: "",
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
    type,
  }) => {
    return (
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(
            currentPage * itemsPerPage,
            type === "receipts"
              ? data.receipts.length
              : data.disbursements.length
          )}{" "}
          of{" "}
          {type === "receipts"
            ? data.receipts.length
            : data.disbursements.length}{" "}
          entries
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === pageNumber
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const handleSubmit = () => {
    const amount = parseFloat(formData.amount);
    if (
      !formData.type ||
      !formData.description ||
      isNaN(amount) ||
      amount <= 0
    ) {
      alert("Please fill in all fields with valid values");
      return;
    }

    const newItem = {
      _id: editingItem ? editingItem._id : `${modalType[0]}${Date.now()}`,
      type: formData.type,
      description: formData.description,
      amount: amount,
      date: formData.date,
    };

    setData((prev) => {
      if (editingItem) {
        // Edit existing item
        if (modalType === "receipt") {
          return {
            ...prev,
            receipts: prev.receipts.map((item) =>
              item._id === editingItem._id ? newItem : item
            ),
          };
        } else {
          return {
            ...prev,
            disbursements: prev.disbursements.map((item) =>
              item._id === editingItem._id ? newItem : item
            ),
          };
        }
      } else {
        // Add new item
        if (modalType === "receipt") {
          return {
            ...prev,
            receipts: [...prev.receipts, newItem],
          };
        } else {
          return {
            ...prev,
            disbursements: [...prev.disbursements, newItem],
          };
        }
      }
    });

    closeModal();
  };

  const deleteItem = (type, id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setData((prev) => {
        if (type === "receipt") {
          return {
            ...prev,
            receipts: prev.receipts.filter((item) => item._id !== id),
          };
        } else {
          return {
            ...prev,
            disbursements: prev.disbursements.filter((item) => item._id !== id),
          };
        }
      });
    }
  };
  const tabs = [
    { to: ".", label: "All", end: true }, // Exact match required
    { to: "reimbursements", label: "Reimbursement" },
    { to: "disbursements", label: "Disbursement" },
  ];

  return (
    <div className="">
      {/* Header */}

      <div className="mb-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `text-lg font-semibold px-4  text-cnsc-primary-color ${
                isActive ? "border-b-2" : "underline-animate"
              }`
            }
          >
            {tab.label}{" "}
          </NavLink>
        ))}
      </div>

      {/* Tables Container */}
      <div className="flex flex-col gap-6">
        {/* Receipts Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={24} />
              Receipts
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedReceipts.map((receipt) => (
                  <tr
                    key={receipt._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {receipt.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {receipt.description}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ₱{receipt.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{receipt.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal("receipt", receipt)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteItem("receipt", receipt._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            currentPage={receiptsPage}
            totalPages={totalReceiptsPages}
            onPageChange={setReceiptsPage}
            type="receipts"
          />
        </div>

        {/* Disbursements Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingDown size={24} />
              Disbursements
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedDisbursements.map((disbursement) => (
                  <tr
                    key={disbursement._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        {disbursement.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {disbursement.description}
                    </td>
                    <td className="px-6 py-4 font-semibold text-red-600">
                      ₱{disbursement.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {disbursement.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            openModal("disbursement", disbursement)
                          }
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            deleteItem("disbursement", disbursement._id)
                          }
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls
            currentPage={disbursementsPage}
            totalPages={totalDisbursementsPages}
            onPageChange={setDisbursementsPage}
            type="disbursements"
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div
              className={` ${
                modalType === "receipt" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingItem ? "Edit" : "Add"}{" "}
                  {modalType === "receipt" ? "Receipt" : "Disbursement"}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select type...</option>
                  {(modalType === "receipt"
                    ? receiptTypes
                    : disbursementTypes
                  ).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (₱)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`flex-1 px-6 py-3 text-white rounded-xl font-medium transition-colors ${
                    modalType === "receipt"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {editingItem ? "Update" : "Add"}{" "}
                  {modalType === "receipt" ? "Receipt" : "Disbursement"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FinancialReportDummy = () => {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("receipt"); // 'receipt' or 'disbursement'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Pagination states
  const [receiptsPage, setReceiptsPage] = useState(1);
  const [disbursementsPage, setDisbursementsPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate totals
  const totalReceipts = data.receipts.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalDisbursements = data.disbursements.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const endingBalance =
    data.beginningBalance + totalReceipts - totalDisbursements;

  // Pagination calculations
  const receiptsStartIndex = (receiptsPage - 1) * itemsPerPage;
  const receiptsEndIndex = receiptsStartIndex + itemsPerPage;
  const paginatedReceipts = data.receipts.slice(
    receiptsStartIndex,
    receiptsEndIndex
  );
  const totalReceiptsPages = Math.ceil(data.receipts.length / itemsPerPage);

  const disbursementsStartIndex = (disbursementsPage - 1) * itemsPerPage;
  const disbursementsEndIndex = disbursementsStartIndex + itemsPerPage;
  const paginatedDisbursements = data.disbursements.slice(
    disbursementsStartIndex,
    disbursementsEndIndex
  );
  const totalDisbursementsPages = Math.ceil(
    data.disbursements.length / itemsPerPage
  );

  const receiptTypes = [
    "Sponsorship",
    "Ticket Sales",
    "Donations",
    "Membership Fees",
    "Other",
  ];
  const disbursementTypes = [
    "Food and Drinks",
    "Printing",
    "Transportation",
    "Equipment",
    "Venue",
    "Other",
  ];

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({
        type: item.type,
        description: item.description,
        amount: item.amount.toString(),
        date: item.date,
      });
    } else {
      setFormData({
        type: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      type: "",
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
    type,
  }) => {
    return (
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(
            currentPage * itemsPerPage,
            type === "receipts"
              ? data.receipts.length
              : data.disbursements.length
          )}{" "}
          of{" "}
          {type === "receipts"
            ? data.receipts.length
            : data.disbursements.length}{" "}
          entries
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === pageNumber
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-colors ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const handleSubmit = () => {
    const amount = parseFloat(formData.amount);
    if (
      !formData.type ||
      !formData.description ||
      isNaN(amount) ||
      amount <= 0
    ) {
      alert("Please fill in all fields with valid values");
      return;
    }

    const newItem = {
      _id: editingItem ? editingItem._id : `${modalType[0]}${Date.now()}`,
      type: formData.type,
      description: formData.description,
      amount: amount,
      date: formData.date,
    };

    setData((prev) => {
      if (editingItem) {
        // Edit existing item
        if (modalType === "receipt") {
          return {
            ...prev,
            receipts: prev.receipts.map((item) =>
              item._id === editingItem._id ? newItem : item
            ),
          };
        } else {
          return {
            ...prev,
            disbursements: prev.disbursements.map((item) =>
              item._id === editingItem._id ? newItem : item
            ),
          };
        }
      } else {
        // Add new item
        if (modalType === "receipt") {
          return {
            ...prev,
            receipts: [...prev.receipts, newItem],
          };
        } else {
          return {
            ...prev,
            disbursements: [...prev.disbursements, newItem],
          };
        }
      }
    });

    closeModal();
  };
  return (
    <div className="grid grid-cols-2 gap-4 h-full overflow-hidden ">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 text-xl items-center">
          <h1 className="text-4xl text-center font-bold text-gray-800">
            Financial Report
          </h1>
          <div className="flex flex-col flex-1 gap-4">
            <button
              onClick={() => openModal("receipt")}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-4 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus size={20} />
              Add Receipt
            </button>
            <button
              onClick={() => openModal("disbursement")}
              className="flex-1  bg-red-500 hover:bg-red-600 text-white px-4 py-4  rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus size={20} />
              Add Disbursement
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-fit  p-4 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Beginning Balance
                </p>
                <p className="text-2xl font-bold">
                  ₱{data.beginningBalance.toLocaleString()}
                </p>
              </div>
              <DollarSign className="text-blue-200" size={24} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 h-fit  p-4 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Total Receipts
                </p>
                <p className="text-2xl font-bold">
                  ₱{totalReceipts.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="text-green-200" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 h-fit  p-4 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">
                  Total Disbursements
                </p>
                <p className="text-2xl font-bold">
                  ₱{totalDisbursements.toLocaleString()}
                </p>
              </div>
              <TrendingDown className="text-red-200" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-fit  p-4 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Ending Balance
                </p>
                <p className="text-2xl font-bold">
                  ₱{endingBalance.toLocaleString()}
                </p>
              </div>
              <DollarSign className="text-purple-200" size={32} />
            </div>
          </div>
        </div>
      </div>

      <div className="border row-span-1">
        <AccreditationTimeline />
      </div>

      <div className="border col-span-2 row-span-2 overflow-auto">
        <FinancialTable />
      </div>
    </div>
  );
};

export default FinancialReportDummy;
