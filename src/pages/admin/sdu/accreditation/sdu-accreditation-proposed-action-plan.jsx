import React, { useEffect, useState } from "react";

import axios from "axios";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../../App";

import {
  ChevronDown,
  ChevronRight,
  Calendar,
  MapPin,
  DollarSign,
  Target,
  School2,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";

export function SduProposedActionPlanOverview() {
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ShowEditModal, setShowEditModal] = useState(false);
  const [ShowDeleteModal, setShowDeleteModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        // Simulating API call - replace with your actual API call
        const response = await axios.get(
          `${API_ROUTER}/getAllProposedActionPlan`
        );
        // setProposals(response.data);

        // Using mock data for demonstration
        console.log(response.data);
        setProposals(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch proposals:", err);
        if (err.status === 404 || err.response?.status === 404) {
          setProposals([]);
        } else {
          setError("Failed to load proposals");
        }
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const toggleRowExpansion = (proposalId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(proposalId)) {
      newExpanded.delete(proposalId);
    } else {
      newExpanded.add(proposalId);
    }
    setExpandedRows(newExpanded);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Approved: "bg-green-100 text-green-800 border-green-200",
      Rejected: "bg-red-100 text-red-800 border-red-200",
      "In Review": "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${
          statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {status}
      </span>
    );
  };

  const getActiveBadge = (isActive) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ml-2 ${
          isActive
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-gray-100 text-gray-600 border-gray-300"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const handleEdit = (proposalId) => {
    setShowEditModal(proposalId); // open edit modal
    setShowDeleteModal(false); // make sure delete modal is closed
  };

  const handleDelete = (proposalId) => {
    setShowDeleteModal(proposalId); // open delete modal
    setShowEditModal(false); // make sure edit modal is closed
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Proposals</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 ">
        Proposed Action Plan Overview
      </h1>

      {proposals.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-gray-900 font-medium mb-2">No Proposals Found</h3>
          <p className="text-gray-600">
            There are currently no proposed action plans to display.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Status
                  </th>
                  <th className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action Plans
                  </th>
                  <th className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className=" text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="p bg-white divide-y divide-gray-200">
                {proposals.map(
                  (proposal) => (
                    console.log(proposal.organizationProfile.orgName),
                    (
                      <React.Fragment key={proposal._id}>
                        <tr className="hover:bg-gray-50">
                          <td className=" whitespace-nowrap">
                            <div className="flex p-4 items-center">
                              {proposal.organizationProfile.orgLogo ? (
                                <div className="relative">
                                  <img
                                    src={`${DOCU_API_ROUTER}/${proposal.organizationProfile._id}/${proposal.organizationProfile.orgLogo}`}
                                    alt={`${proposal.organizationProfile.orgName} Logo`}
                                    className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg"
                                  />
                                </div>
                              ) : (
                                <div className="w-20 h-20 bg-cnsc-primary-color flex justify-center items-center text-white rounded-full border">
                                  <School2 className="w-1/2 h-1/2 " />
                                </div>
                              )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {proposal.organizationProfile.orgName ||
                                    "Unknown Organization"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className=" whitespace-nowrap">
                            {getStatusBadge(proposal.overallStatus)}
                          </td>
                          <td className=" whitespace-nowrap">
                            {getActiveBadge(proposal.isActive)}
                          </td>
                          <td className=" whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900 mr-2">
                                {proposal.ProposedIndividualActionPlan.length}
                              </span>
                              <span className="text-xs text-gray-500">
                                plans
                              </span>
                            </div>
                          </td>
                          <td className=" whitespace-nowrap text-sm text-gray-500">
                            {formatDate(proposal.createdAt)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2">
                            <div className="flex items-center justify-end gap-2 h-full">
                              {/* Show Edit and Delete buttons only for active proposals */}
                              {proposal.isActive && (
                                <>
                                  {/* Edit Button */}
                                  <button
                                    onClick={() => handleEdit(proposal._id)}
                                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Edit
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    onClick={() => handleDelete(proposal._id)}
                                    className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-xs font-medium rounded text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </button>
                                </>
                              )}

                              {/* View/Expand button - always available */}
                              <button
                                onClick={() => toggleRowExpansion(proposal._id)}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                {expandedRows.has(proposal._id) ? (
                                  <>
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                    Hide
                                  </>
                                ) : (
                                  <>
                                    <ChevronRight className="h-4 w-4 mr-1" />
                                    View
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedRows.has(proposal._id) && (
                          <tr>
                            <td colSpan={6} className=" bg-gray-50 ">
                              {proposal.ProposedIndividualActionPlan.length >
                              0 ? (
                                <div className="space-y-4">
                                  {proposal.ProposedIndividualActionPlan.map(
                                    (plan) => (
                                      <div
                                        key={plan._id}
                                        className=" bg-blue-50 p-4"
                                      >
                                        <div className="flex items-start justify-between mb-3">
                                          <div className="text-lg flex gap-4 font-medium ">
                                            <p>{plan.activityTitle}</p>
                                            <p>
                                              {getStatusBadge(
                                                plan.overallStatus
                                              )}
                                            </p>
                                          </div>
                                          <div className="text-xs ">
                                            Created:{" "}
                                            {formatDate(plan.createdAt)} |
                                            Updated:{" "}
                                            {formatDate(plan.updatedAt)}
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                          <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                            <span>
                                              {formatDate(plan.proposedDate)}
                                            </span>
                                          </div>
                                          <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                            <span>{plan.venue}</span>
                                          </div>
                                          <div className="flex items-center text-sm text-gray-600">
                                            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                            <span>
                                              {formatCurrency(
                                                plan.budgetaryRequirements
                                              )}
                                            </span>
                                          </div>
                                          <div className="flex items-center text-sm text-gray-600">
                                            <FileText className="h-4 w-4 mr-2 text-gray-400" />
                                            <span>
                                              {plan.document?.length || 0}{" "}
                                              documents
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <div className="p-4 text-center text-gray-500">
                                  <p>
                                    No action plans available for this proposal.
                                  </p>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {ShowEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Proposal</h2>
            {/* Your edit form or content goes here */}
            <button
              onClick={handleCloseModals}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {ShowDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this proposal?</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  // perform delete action
                  handleCloseModals();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={handleCloseModals}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SduProposedActionPlanOrganization({ selectedOrg }) {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_ROUTER}/getAllProposedActionPlan`
      );
      console.log(response.data);
      setProposals(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
      if (err.status === 404 || err.response?.status === 404) {
        setProposals([]);
        setError(null);
      } else {
        setError("Failed to load proposals");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOrg._id) {
      fetchProposals();
    }
  }, [selectedOrg._id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = (proposal) => {
    setSelectedProposal(proposal);
    setEditForm({
      activityTitle: proposal.activityTitle,
      proposedDate: proposal.proposedDate.split("T")[0],
      briefDetails: proposal.briefDetails,
      overallStatus: proposal.overallStatus,
      alignedOrgObjectives: proposal.alignedOrgObjectives,
      venue: proposal.venue,
      budgetaryRequirements: proposal.budgetaryRequirements,
    });
    setShowEditModal(true);
  };

  const handleDelete = (proposal) => {
    setSelectedProposal(proposal);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setProposals(proposals.filter((p) => p._id !== selectedProposal._id));
    setShowDeleteModal(false);
    setSelectedProposal(null);
  };

  const handleView = (proposal) => {
    setSelectedProposal(proposal);
    setShowViewModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  return (
    <div className="p-6 bg-gray-50 w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {orgData.orgName} Proposed Action Plans
        </h1>
        {!loading && proposals.length > 0 && (
          <button
            onClick={() => setShowManageModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add New Proposal
          </button>
        )}
      </div>
      {/* Loading State */}
      {loading ||
        (error && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading proposals...</span>
            </div>
          </div>
        ))}
      {error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}
      {/* Empty State */}
      {!loading && !error && proposals.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Plus size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Proposals Found
            </h3>
            <p className="text-gray-600 mb-6">
              There are currently no proposed action plans for this
              organization.
            </p>
            <button
              onClick={() => setShowManageModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors mx-auto"
            >
              <Plus size={16} />
              Create First Proposal
            </button>
          </div>
        </div>
      )}
      {/* Table */}
      {!loading && !error && proposals.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proposed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {proposals.map((proposal) => (
                  <tr
                    key={proposal._id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(proposal);
                    }}
                  >
                    <td className=" whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {proposal.activityTitle}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {proposal.briefDetails}
                      </div>
                    </td>
                    <td className=" whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          proposal.overallStatus
                        )}`}
                      >
                        {proposal.overallStatus}
                      </span>
                    </td>
                    <td className=" whitespace-nowrap text-sm text-gray-900">
                      {formatDate(proposal.proposedDate)}
                    </td>
                    <td className=" whitespace-nowrap text-sm text-gray-900">
                      {proposal.venue}
                    </td>
                    <td className=" whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(proposal.budgetaryRequirements)}
                    </td>
                    <td className=" whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(proposal);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(proposal);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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
        </div>
      )}
      {/* View Modal */}
      {showViewModal && selectedProposal && (
        <div className="fixed inset-0 bg-black/10  backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">View Proposal</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Title
                  </label>
                  <p className="text-gray-900">
                    {selectedProposal.activityTitle}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedProposal.overallStatus
                    )}`}
                  >
                    {selectedProposal.overallStatus}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposed Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedProposal.proposedDate)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <p className="text-gray-900">{selectedProposal.venue}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Required
                  </label>
                  <p className="text-gray-900">
                    {formatCurrency(selectedProposal.budgetaryRequirements)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aligned Organizational Objectives
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedProposal.alignedOrgObjectives}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brief Details
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedProposal.briefDetails}
                </p>
              </div>

              {selectedProposal.collaboratingEntities &&
                selectedProposal.collaboratingEntities.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Collaborating Organizations
                    </label>
                    <div className="space-y-2">
                      {selectedProposal.collaboratingEntities.map(
                        (entity, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded-md">
                            <p className="font-medium text-gray-900">
                              {entity.orgName} ({entity.orgAcronym})
                            </p>
                            <p className="text-sm text-gray-600">
                              {entity.orgDepartment}
                            </p>
                            <p className="text-sm text-gray-600">
                              Class: {entity.orgClass}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showEditModal && (
        <EditPpa
          selectedProposal={selectedProposal}
          orgData={orgData}
          onClose={() => setShowEditModal(false)}
          accreditationData={accreditationData}
          onFinish={() => fetchProposals()}
        />
      )}
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">
                Delete Proposal
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{selectedProposal?.activityTitle}
              "? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add/Manage Modal */}
      {showManageModal && (
        <AddProposedActionPlan
          orgData={orgData}
          accreditationData={accreditationData}
          onClose={() => setShowManageModal(false)}
          onFinish={() => fetchProposals()}
        />
      )}
    </div>
  );
}
