import axios from "axios";
import { API_ROUTER } from "../../../../App";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  X,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

export function StudentLeaderAccomplishmentReport({ orgData }) {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const fetchDoneProposal = async () => {
    try {
      const res = await axios.get(
        `${API_ROUTER}/getStudentLeaderAccomplishmentReady/${orgData._id} `
      );
      console.log(res.data);
      setProposals(res.data);
    } catch (error) {
      console.error(error.response);
    }
  };

  useEffect(() => {
    fetchDoneProposal();
  }, []);

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [`${selectedProposal._id}_${type}`]: {
          file,
          uploadedAt: new Date(),
          status: "pending",
        },
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Ready For Accomplishments":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBudget = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  // Analytics data preparation
  const statusData = proposals.reduce((acc, proposal) => {
    const status = proposal.overallStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    name: status,
    value: count,
    color:
      status === "Completed"
        ? "#10B981"
        : status === "In Progress"
        ? "#F59E0B"
        : status === "Ready For Accomplishments"
        ? "#3B82F6"
        : "#6B7280",
  }));

  const budgetData = proposals.map((proposal) => ({
    name:
      proposal.ProposedIndividualActionPlan.activityTitle.length > 15
        ? proposal.ProposedIndividualActionPlan.activityTitle.substring(0, 15) +
          "..."
        : proposal.ProposedIndividualActionPlan.activityTitle,
    budget: proposal.ProposedIndividualActionPlan.budgetaryRequirements,
    status: proposal.overallStatus,
  }));

  const monthlyData = proposals.reduce((acc, proposal) => {
    const date = new Date(proposal.ProposedIndividualActionPlan.proposedDate);
    const monthYear = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, count: 0, budget: 0 };
    }
    acc[monthYear].count += 1;
    acc[monthYear].budget +=
      proposal.ProposedIndividualActionPlan.budgetaryRequirements;
    return acc;
  }, {});

  const timelineData = Object.values(monthlyData).sort(
    (a, b) => new Date(a.month + " 01") - new Date(b.month + " 01")
  );

  const uploadTypes = [
    {
      id: "pre_activity",
      title: "Pre-Activity Documentation",
      description:
        "Upload preparation materials, permits, and planning documents",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-blue-50 border-blue-200",
      files: ["Planning Documents", "Permits & Approvals", "Budget Breakdown"],
    },
    {
      id: "during_activity",
      title: "During Activity Documentation",
      description: "Upload photos, videos, and real-time documentation",
      icon: <Upload className="w-6 h-6" />,
      color: "bg-green-50 border-green-200",
      files: ["Event Photos", "Activity Videos", "Attendance Sheets"],
    },
    {
      id: "post_activity",
      title: "Post-Activity Documentation",
      description: "Upload final reports, feedback, and evaluation materials",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-purple-50 border-purple-200",
      files: ["Final Report", "Participant Feedback", "Financial Report"],
    },
  ];

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Upload Documentation -{" "}
            {selectedProposal?.ProposedIndividualActionPlan.activityTitle}
          </h2>
          <button
            onClick={() => setShowUploadModal(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {uploadTypes.map((type) => (
            <div
              key={type.id}
              className={`border-2 rounded-xl p-6 ${type.color}`}
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="text-blue-600">{type.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {type.files.map((fileType, index) => (
                  <div key={index} className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-800">
                        {fileType}
                      </span>
                      {uploadedFiles[
                        `${selectedProposal?._id}_${type.id}_${index}`
                      ] && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>

                    {uploadedFiles[
                      `${selectedProposal?._id}_${type.id}_${index}`
                    ] ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>File uploaded successfully</span>
                        </div>
                        <button className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                          Replace File
                        </button>
                      </div>
                    ) : (
                      <label className="block">
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, `${type.id}_${index}`)
                          }
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov"
                        />
                        <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                          <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Click to upload
                          </span>
                        </div>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save All Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full overflow-auto flex flex-col gap-6 bg-gray-100 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Accomplishment Reports Analytics
        </h1>
        <div className="text-sm text-gray-600">
          Total Proposals: {proposals.length}
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Status Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Status Overview
            </h3>
            <PieChart className="w-5 h-5 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusChartData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Budget Distribution
            </h3>
            <BarChart3 className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={budgetData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
              />
              <YAxis
                tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}K`}
                fontSize={12}
              />
              <Tooltip
                formatter={(value) => [`₱${value.toLocaleString()}`, "Budget"]}
                labelStyle={{ color: "#374151" }}
              />
              <Bar dataKey="budget" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Activity Timeline
            </h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                formatter={(value, name) => [
                  name === "count"
                    ? `${value} proposals`
                    : `₱${value.toLocaleString()}`,
                  name === "count" ? "Proposals" : "Total Budget",
                ]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stackId="1"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-amber-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Budget</p>
              <p className="text-2xl font-bold">
                {formatBudget(
                  proposals.reduce(
                    (sum, p) =>
                      sum +
                      p.ProposedIndividualActionPlan.budgetaryRequirements,
                    0
                  )
                )}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-2xl font-bold">
                {
                  proposals.filter((p) => p.overallStatus === "Completed")
                    .length
                }
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">In Progress</p>
              <p className="text-2xl font-bold">
                {
                  proposals.filter((p) => p.overallStatus === "In Progress")
                    .length
                }
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Ready for Report</p>
              <p className="text-2xl font-bold">
                {
                  proposals.filter(
                    (p) => p.overallStatus === "Ready For Accomplishments"
                  ).length
                }
              </p>
            </div>
            <Activity className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="flex gap-6 h-full">
        {/* Proposals List */}
        <div className="w-1/3 h-full overflow-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            All Proposals
          </h2>
          <div className="flex flex-col gap-4">
            {proposals.map((proposal) => (
              <div
                key={proposal._id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedProposal?._id === proposal._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedProposal(proposal)}
              >
                <h3 className="font-semibold text-gray-800 mb-2">
                  {proposal.ProposedIndividualActionPlan.activityTitle}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {formatDate(
                        proposal.ProposedIndividualActionPlan.proposedDate
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {proposal.ProposedIndividualActionPlan.venue}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {formatBudget(
                        proposal.ProposedIndividualActionPlan
                          .budgetaryRequirements
                      )}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-3 ${getStatusColor(
                    proposal.overallStatus
                  )}`}
                >
                  {proposal.overallStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Proposal Details */}
        <div className="w-2/3">
          {selectedProposal ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {
                      selectedProposal.ProposedIndividualActionPlan
                        .activityTitle
                    }
                  </h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedProposal.overallStatus
                    )}`}
                  >
                    {selectedProposal.overallStatus}
                  </span>
                </div>
                {selectedProposal.overallStatus ===
                  "Ready For Accomplishments" && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Documentation</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Brief Details
                    </label>
                    <p className="text-gray-800 mt-1">
                      {
                        selectedProposal.ProposedIndividualActionPlan
                          .briefDetails
                      }
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Aligned Objectives
                    </label>
                    <p className="text-gray-800 mt-1">
                      {
                        selectedProposal.ProposedIndividualActionPlan
                          .AlignedObjective
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Venue
                      </label>
                      <p className="text-gray-800 mt-1">
                        {selectedProposal.ProposedIndividualActionPlan.venue}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Date
                      </label>
                      <p className="text-gray-800 mt-1">
                        {formatDate(
                          selectedProposal.ProposedIndividualActionPlan
                            .proposedDate
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Budget
                    </label>
                    <p className="text-gray-800 mt-1 text-lg font-semibold">
                      {formatBudget(
                        selectedProposal.ProposedIndividualActionPlan
                          .budgetaryRequirements
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Aligned SDGs
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProposal.ProposedIndividualActionPlan.alignedSDG.map(
                        (sdg, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                          >
                            {sdg}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Status */}
              {selectedProposal.overallStatus ===
                "Ready For Accomplishments" && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Documentation Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {uploadTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`border rounded-lg p-4 ${type.color}`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          {type.icon}
                          <span className="font-medium text-gray-800">
                            {type.title}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {
                            type.files.filter(
                              (_, index) =>
                                uploadedFiles[
                                  `${selectedProposal._id}_${type.id}_${index}`
                                ]
                            ).length
                          }{" "}
                          / {type.files.length} files uploaded
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Select a Proposal
              </h3>
              <p className="text-gray-500">
                Choose a proposal from the list to view details and analytics
              </p>
            </div>
          )}
        </div>
      </div>

      {showUploadModal && <UploadModal />}
    </div>
  );
}
