import axios from "axios";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../../App";
import { useEffect, useState } from "react";
import {
  Plus,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  X,
  Clock,
} from "lucide-react";

import { AddProposal } from "./student-leader-add-proposal";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export function StudentLeaderProposal({ orgData }) {
  const [proposals, setProposals] = useState([]);
  const [proposalsConduct, setProposalsConduct] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const fetchApprovedProposedActionPlanData = async () => {
    try {
      const { data } = await axios.get(
        `${API_ROUTER}/getApprovedPPA/${orgData._id}`,
        { withCredentials: true }
      );
      setProposals(data);
    } catch (err) {
      console.error("Error fetching proposals:", err);
    }
  };

  const fetchProposedPlanConduct = async () => {
    try {
      const { data } = await axios.get(
        `${API_ROUTER}/getStudentLeaderProposalConduct/${orgData._id}`,
        { withCredentials: true }
      );
      setProposalsConduct(data);
    } catch (err) {
      console.error("Error fetching proposals conduct:", err);
    }
  };

  useEffect(() => {
    fetchApprovedProposedActionPlanData();
    fetchProposedPlanConduct();
  }, []);

  const handleAddLog = () => {
    fetchApprovedProposedActionPlanData();
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

  const formatProposedDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
    });
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved For Conduct":
        return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 shadow-emerald-100";
      case "Pending":
        return "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 shadow-amber-100";
      case "Ready For Accomplishments":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-blue-100";
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200 shadow-gray-100";
    }
  };

  // Chart data preparation
  const statusData = [
    {
      name: "Approved For Conduct",
      value: proposalsConduct.filter(
        (p) => p.overallStatus === "Approved For Conduct"
      ).length,
      color: "#10b981",
    },
    {
      name: "Pending",
      value: proposalsConduct.filter((p) => p.overallStatus === "Pending")
        .length,
      color: "#f59e0b",
    },
    {
      name: "Ready For Accomplishments",
      value: proposalsConduct.filter(
        (p) => p.overallStatus === "Ready For Accomplishments"
      ).length,
      color: "#3b82f6",
    },
  ].filter((item) => item.value > 0);

  // Budget analysis by status
  const budgetByStatus = statusData.map((status) => ({
    name: status.name.replace("For ", ""),
    budget: proposalsConduct
      .filter((p) => p.overallStatus === status.name)
      .reduce(
        (sum, p) =>
          sum + (p.ProposedIndividualActionPlan?.budgetaryRequirements || 0),
        0
      ),
    count: status.value,
    color: status.color,
  }));

  // Monthly proposal trends
  const monthlyData = proposalsConduct
    .reduce((acc, proposal) => {
      const month = new Date(proposal.createdAt).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
      });
      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.count += 1;
        existing.budget +=
          proposal.ProposedIndividualActionPlan?.budgetaryRequirements || 0;
      } else {
        acc.push({
          month,
          count: 1,
          budget:
            proposal.ProposedIndividualActionPlan?.budgetaryRequirements || 0,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  // SDG Distribution
  const sdgData = proposalsConduct.reduce((acc, proposal) => {
    const sdgs = proposal.ProposedIndividualActionPlan?.alignedSDG || [];
    sdgs.forEach((sdg) => {
      const existing = acc.find((item) => item.name === sdg);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: sdg, value: 1 });
      }
    });
    return acc;
  }, []);

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200">
          <p className="text-gray-800 font-semibold">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${
                entry.dataKey === "budget"
                  ? formatCurrency(entry.value)
                  : entry.value
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full w-full overflow-auto bg-gradient-to-br from-amber-50 via-white to-amber-50 min-h-screen">
      {/* Enhanced Header with maroon gradient */}
      <div className="relative p-6 border-b border-amber-200 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-800 text-white shadow-xl">
        <div className="relative flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">
              Student Leader Proposals
            </h1>
            <p className="text-amber-100 text-lg">
              Manage and track student organization proposals
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="group relative bg-amber-500 hover:bg-amber-600 text-[#800000] px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-amber-400 hover:border-amber-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-300/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Plus
              size={22}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            <span className="font-semibold">Add Proposal</span>
          </button>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Total Proposals
              </p>
              <p className="text-3xl font-bold">{proposalsConduct.length}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold">
                {
                  proposalsConduct.filter(
                    (p) => p.overallStatus === "Approved For Conduct"
                  ).length
                }
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold">
                {
                  proposalsConduct.filter((p) => p.overallStatus === "Pending")
                    .length
                }
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Total Budget
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  proposalsConduct.reduce(
                    (sum, p) =>
                      sum +
                      (p.ProposedIndividualActionPlan?.budgetaryRequirements ||
                        0),
                    0
                  )
                )}
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {proposalsConduct.length > 0 && (
        <div className="px-6 mb-6 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution Chart */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Proposal Status Distribution
                  </h3>
                  <p className="text-sm text-gray-600">
                    Overview of proposal statuses
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Budget by Status Chart */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Budget Distribution by Status
                  </h3>
                  <p className="text-sm text-gray-600">
                    Budget allocation across statuses
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="#64748b"
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      `₱${(value / 1000000).toFixed(1)}M`
                    }
                    tick={{ fontSize: 12 }}
                    stroke="#64748b"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="budget" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Trends Chart */}
            {monthlyData.length > 1 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Monthly Proposal Trends
                    </h3>
                    <p className="text-sm text-gray-600">
                      Proposal submissions over time
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient
                        id="colorCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      stroke="#64748b"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorCount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* SDG Distribution Chart */}
            {sdgData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      SDG Alignment
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sustainable Development Goals focus
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl p-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sdgData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12 }}
                      stroke="#64748b"
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      stroke="#64748b"
                      width={60}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#06b6d4" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Table Container */}
      <div className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200/70">
            <h3 className="text-lg font-semibold text-gray-800">
              Proposals Overview
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Click on any proposal to view details
            </p>
          </div>

          {/* Enhanced Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Proposed Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Venue
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/70">
                {proposalsConduct.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-lg font-medium mb-2">
                          No proposals yet
                        </p>
                        <p className="text-sm">
                          Create your first proposal to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  proposalsConduct.map((item, index) => (
                    <tr
                      key={item._id}
                      className="group hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.001]"
                      onClick={() => setSelectedProposal(item)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4 group-hover:scale-110 transition-transform">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 capitalize group-hover:text-blue-700 transition-colors">
                              {item.ProposedIndividualActionPlan.activityTitle}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-gray-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatProposedDate(
                            item.ProposedIndividualActionPlan.proposedDate
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                          {formatCurrency(
                            item.ProposedIndividualActionPlan
                              .budgetaryRequirements
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-gray-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {item.ProposedIndividualActionPlan.venue}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold border shadow-sm ${getStatusColor(
                            item.overallStatus
                          )}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              item.overallStatus === "Approved For Conduct"
                                ? "bg-emerald-500"
                                : item.overallStatus === "Pending"
                                ? "bg-amber-500"
                                : item.overallStatus ===
                                  "Ready For Accomplishments"
                                ? "bg-blue-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                          {item.overallStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enhanced Modals with backdrop blur */}
      {selectedProposal && (
        <ShowDetailedProposal
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusColor={getStatusColor}
        />
      )}

      {showAddForm && (
        <AddProposal
          proposals={proposals}
          onClose={() => setShowAddForm(false)}
          onAddLog={handleAddLog}
        />
      )}
    </div>
  );
}

export function ShowDetailedProposal({ proposal, onClose }) {
  if (!proposal) return null;

  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const selectedDoc = proposal?.document?.[selectedDocIndex] || null;

  console.log(proposal);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-500 border border-gray-200/50">
        {/* Enhanced Header with gradient */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200/70 bg-gradient-to-r from-slate-50 via-white to-blue-50">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Proposal Details
            </h2>
            <p className="text-gray-600 mt-1">
              Comprehensive proposal information and documents
            </p>
          </div>
          <button
            onClick={onClose}
            className="group text-gray-400 hover:text-gray-600 text-2xl font-bold w-12 h-12 flex items-center justify-center hover:bg-red-50 rounded-2xl transition-all duration-300 hover:scale-110 border border-transparent hover:border-red-200"
          >
            <span className="group-hover:rotate-90 transition-transform duration-300">
              ✕
            </span>
          </button>
        </div>

        {/* Enhanced Content: Split View */}
        <div className="flex flex-1 overflow-hidden">
          {/* Enhanced Left: Details Panel */}
          <div className="w-2/5 border-r border-gray-200/70 overflow-y-auto bg-gradient-to-b from-gray-50/30 to-white">
            <div className="p-8 space-y-8">
              {proposal?.ProposedIndividualActionPlan?.activityTitle && (
                <div className="group">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                      Activity Title
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/70 group-hover:shadow-lg transition-all duration-300">
                    <p className="text-gray-900 text-xl font-bold leading-relaxed">
                      {proposal.ProposedIndividualActionPlan.activityTitle}
                    </p>
                  </div>
                </div>
              )}

              {proposal?.ProposedIndividualActionPlan?.briefDetails && (
                <div className="group">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
                      Brief Details
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/70 group-hover:shadow-lg transition-all duration-300">
                    <p className="text-gray-800 text-base leading-relaxed">
                      {proposal.ProposedIndividualActionPlan.briefDetails}
                    </p>
                  </div>
                </div>
              )}

              {proposal?.ProposedIndividualActionPlan?.AlignedObjective && (
                <div className="group">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2-2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6m2 5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-purple-600 uppercase tracking-wider">
                      Aligned Objectives
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/70 group-hover:shadow-lg transition-all duration-300">
                    <p className="text-gray-800 text-base leading-relaxed">
                      {proposal.ProposedIndividualActionPlan.AlignedObjective}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                {proposal?.ProposedIndividualActionPlan?.venue && (
                  <div className="group">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-red-600 uppercase tracking-wider">
                        Venue
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/70 group-hover:shadow-lg transition-all duration-300">
                      <p className="text-gray-900 text-lg font-semibold">
                        {proposal.ProposedIndividualActionPlan.venue}
                      </p>
                    </div>
                  </div>
                )}

                {proposal?.ProposedIndividualActionPlan?.proposedDate && (
                  <div className="group">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-amber-600 uppercase tracking-wider">
                        Proposed Date
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/70 group-hover:shadow-lg transition-all duration-300">
                      <p className="text-gray-900 text-lg font-semibold">
                        {new Date(
                          proposal.ProposedIndividualActionPlan.proposedDate
                        ).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {proposal?.ProposedIndividualActionPlan
                ?.budgetaryRequirements && (
                <div className="group">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-green-600 uppercase tracking-wider">
                      Budget Requirements
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-green-200/70 group-hover:shadow-lg transition-all duration-300">
                    <p className="text-3xl font-bold text-green-700">
                      ₱
                      {proposal.ProposedIndividualActionPlan.budgetaryRequirements.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="group">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
                    Status
                  </span>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/70 group-hover:shadow-lg transition-all duration-300">
                  <span
                    className={`inline-flex items-center px-6 py-3 rounded-2xl text-base font-bold shadow-lg ${
                      proposal?.overallStatus === "Approved"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        : proposal?.overallStatus === "Pending"
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                        : proposal?.overallStatus === "Approved For Conduct"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        : proposal?.overallStatus ===
                          "Ready For Accomplishments"
                        ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white"
                        : "bg-gradient-to-r from-gray-500 to-slate-600 text-white"
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full mr-3 bg-white/30"></div>
                    {proposal?.overallStatus}
                  </span>
                </div>
              </div>

              {proposal?.ProposedIndividualActionPlan?.alignedSDG &&
                proposal.ProposedIndividualActionPlan.alignedSDG.length > 0 && (
                  <div className="group">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-teal-600 uppercase tracking-wider">
                        Aligned SDGs
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/70 group-hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-wrap gap-2">
                        {proposal.ProposedIndividualActionPlan.alignedSDG.map(
                          (sdg, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm px-4 py-2 rounded-xl font-bold border border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                              {sdg}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Right: Document Preview Panel */}
          <div className="flex-1 flex flex-col">
            {/* Document Header */}
            {proposal?.document?.length > 0 && selectedDoc && (
              <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedDoc.label || "Unnamed Document"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedDoc.fileName}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-lg shadow-sm">
                    Document {selectedDocIndex + 1} of{" "}
                    {proposal.document.length}
                  </span>
                </div>
              </div>
            )}

            {/* PDF Preview */}
            <div className="flex-1 bg-gradient-to-br from-gray-100 to-slate-100">
              {selectedDoc ? (
                <iframe
                  src={`${DOCU_API_ROUTER}/${proposal.organizationProfile}/${selectedDoc.fileName}`}
                  title={`${selectedDoc.label || "Document"} PDF`}
                  className="w-full h-full border-0 rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 mb-6">
                    <svg
                      className="w-16 h-16 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-gray-700 mb-2">
                    No Documents Available
                  </p>
                  <p className="text-sm text-gray-500">
                    This proposal doesn't have any documents attached.
                  </p>
                </div>
              )}
            </div>

            {/* Document Navigation */}
            {proposal?.document?.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-slate-50">
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-1">
                    {/* Previous Button */}
                    <button
                      onClick={() =>
                        setSelectedDocIndex(Math.max(0, selectedDocIndex - 1))
                      }
                      disabled={selectedDocIndex === 0}
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        selectedDocIndex === 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:scale-110"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Page Numbers */}
                    {proposal.document.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDocIndex(index)}
                        className={`w-12 h-12 text-sm font-bold rounded-xl transition-all duration-300 ${
                          selectedDocIndex === index
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-110"
                            : "text-gray-700 hover:bg-blue-50 border border-gray-200 bg-white hover:border-blue-300 hover:scale-105 hover:shadow-md"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    {/* Show ellipsis if more than 7 documents */}
                    {proposal.document.length > 7 &&
                      selectedDocIndex < proposal.document.length - 3 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setSelectedDocIndex(
                          Math.min(
                            proposal.document.length - 1,
                            selectedDocIndex + 1
                          )
                        )
                      }
                      disabled={
                        selectedDocIndex === proposal.document.length - 1
                      }
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        selectedDocIndex === proposal.document.length - 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:scale-110"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="border-t border-gray-200/70 p-6 bg-gradient-to-r from-slate-50 via-white to-blue-50 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Created:</span>{" "}
              {new Date(proposal.createdAt).toLocaleDateString("en-PH")}
            </div>
            {proposal.updatedAt !== proposal.createdAt && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Updated:</span>{" "}
                {new Date(proposal.updatedAt).toLocaleDateString("en-PH")}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold hover:scale-105 hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
