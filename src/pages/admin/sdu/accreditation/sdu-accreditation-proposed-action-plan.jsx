import React, { useEffect, useState } from "react";

import axios from "axios";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../../App";

import {
  ChevronDown,
  ChevronRight,
  Target,
  School2,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Eye,
  Edit,
  Plus,
  Pencil,
  Trash2,
  Download,
  Clock,
  FileTextIcon,
} from "lucide-react";

export function SduProposedActionPlanOverview({ selectedOrg, onSelectOrg }) {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState([]);
  const [selectedIndividualProposal, setSelectedIndividualProposal] = useState(
    {}
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ShowEditModal, setShowEditModal] = useState(false);
  const [ShowDeleteModal, setShowDeleteModal] = useState(false);
  const [ShowDetailedModal, setShowDetailedModal] = useState(false);
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

  const setSelectedOrg = ({ proposal }) => {
    console.log("Row clicked!", proposal);
    onSelectOrg(proposal.organizationProfile);
  };
  const handleEdit = (proposal) => {
    setShowEditModal(proposal); // open edit modal
    setSelectedProposal(proposal);
    setShowDeleteModal(false); // make sure delete modal is closed
    setShowDetailedModal(false);
  };
  const handleDetailed = (proposal) => {
    setSelectedProposal(proposal);
    setShowDetailedModal(proposal); // open edit modal
  };

  const handleDelete = (proposal) => {
    setShowDeleteModal(proposal); // open delete modal
    setShowDetailedModal(false);
    setSelectedProposal(proposal);
    setShowEditModal(false); // make sure edit modal is closed
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowDetailedModal(false);
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
                {proposals.map((proposal) => (
                  <React.Fragment key={proposal._id}>
                    <tr
                      className="hover:bg-gray-50 "
                      onClick={() => setSelectedOrg({ proposal: proposal })}
                    >
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
                          <span className="text-xs text-gray-500">plans</span>
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
                                onClick={(e) => {
                                  e.stopPropagation(); // ⬅️ prevent triggering row click
                                  handleEdit(proposal);
                                }}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(proposal);
                                }}
                                className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-xs font-medium rounded text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </button>
                            </>
                          )}

                          {/* View/Expand button - always available */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowExpansion(proposal._id);
                            }}
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
                        <td colSpan={6} className="  ">
                          {proposal.ProposedIndividualActionPlan.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              {proposal.ProposedIndividualActionPlan.map(
                                (plan) => (
                                  <div
                                    key={plan._id}
                                    className=" bg-blue-50 p-4   "
                                    onClick={(e) => {
                                      e.stopPropagation(); // ⬅️ prevent triggering row click
                                      handleDetailed(proposal);
                                      setSelectedIndividualProposal(plan);
                                    }}
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="text-lg flex gap-4 font-medium ">
                                        <p>{plan.activityTitle}</p>
                                        <p>
                                          {getStatusBadge(plan.overallStatus)}
                                        </p>
                                      </div>
                                      <div className="text-xs ">
                                        Created: {formatDate(plan.createdAt)} |
                                        Updated: {formatDate(plan.updatedAt)}
                                      </div>
                                    </div>

                                    <div className="flex w-full justify-between gap-4 mb-4">
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>
                                          Target Date:{" "}
                                          {formatDate(plan.proposedDate)}
                                        </span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                        <span> Target Venue: {plan.venue}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>
                                          Estimated Budget:
                                          {formatCurrency(
                                            plan.budgetaryRequirements
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex flex-col text-sm text-gray-600">
                                        {plan.document?.map((doc) => (
                                          <div className="flex  gap-1 pl-6">
                                            <FileText size={16} />
                                            <p>Proposal:</p> {doc.fileName}
                                          </div>
                                        ))}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {ShowEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Proposal</h2>
            {/* Your edit form or content goes here */}
            <button
              onClick={handleCloseModals()}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {ShowDetailedModal && (
        <div className="fixed inset-0 bg-black backdrop-blur-2xl flex items-center justify-center z-50">
          <ViewProposal selectedProposal={selectedIndividualProposal} />
        </div>
      )}

      {/* Delete Modal */}
      {ShowDeleteModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-2xl  flex items-center justify-center z-50">
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
        `${API_ROUTER}/getProposalsBySdu/${selectedOrg._id}`
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Under Review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleView = (proposal) => {
    setSelectedProposal(proposal);
    setShowViewModal(true);
  };

  const handleEdit = (proposal) => {
    setSelectedProposal(proposal);
    setEditForm(proposal);
    setShowEditModal(true);
  };

  const handleDelete = (proposal) => {
    setSelectedProposal(proposal);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Action Plan Proposals
          </h2>
          <p className="text-gray-600 mt-1">
            Organization: {selectedOrg?.name || "Selected Organization"}
          </p>
        </div>
        <button
          onClick={() => setShowManageModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Proposal
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No proposals found for this organization
            </p>
          </div>
        ) : (
          proposals.map((proposal) => (
            <div
              key={proposal._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Proposal Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {proposal.activityTitle}
                  </h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
                      proposal.overallStatus
                    )}`}
                  >
                    {proposal.overallStatus}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(proposal)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(proposal)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                    title="Edit Proposal"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proposal)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete Proposal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Proposal Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {formatDate(proposal.proposedDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Venue:</span>
                  <span className="font-medium">{proposal.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">
                    {formatCurrency(proposal.budgetaryRequirements)}
                  </span>
                </div>
              </div>

              {/* SDG Alignment */}
              <div className="mt-3">
                <span className="text-gray-600 text-sm">Aligned SDGs:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {proposal.alignedSDG.map((sdg, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {sdg}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal placeholders - These would be separate components */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              View Proposal Details
            </h3>
            <p className="text-gray-600">
              Modal content for viewing proposal details...
            </p>
            <button
              onClick={() => setShowViewModal(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Proposal</h3>
            <p className="text-gray-600">
              Modal content for editing proposal...
            </p>
            <button
              onClick={() => setShowEditModal(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this proposal?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle delete logic here
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showManageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Proposal</h3>
            <p className="text-gray-600">
              Modal content for creating new proposal...
            </p>
            <button
              onClick={() => setShowManageModal(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ViewProposal({ selectedProposal }) {
  console.log(selectedProposal);

  const getStatusStyle = (status) => {
    const styles = {
      Approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      Pending: "bg-amber-50 text-amber-700 border border-amber-200",
      default: "bg-gray-50 text-gray-500 border border-gray-200",
    };
    return styles[status] || styles.default;
  };

  const getStatusIcon = (status) => {
    return status === "Approved" ? (
      <CheckCircle className="w-4 h-4" />
    ) : status === "Pending" ? (
      <Clock className="w-4 h-4" />
    ) : null;
  };

  const getSDGWithDescription = (sdg) => {
    const sdgDescriptions = {
      "SDG 1": "SDG 1 - No Poverty",
      "SDG 2": "SDG 2 - Zero Hunger",
      "SDG 3": "SDG 3 - Good Health and Well-being",
      "SDG 4": "SDG 4 - Quality Education",
      "SDG 5": "SDG 5 - Gender Equality",
      "SDG 6": "SDG 6 - Clean Water and Sanitation",
      "SDG 7": "SDG 7 - Affordable and Clean Energy",
      "SDG 8": "SDG 8 - Decent Work and Economic Growth",
      "SDG 9": "SDG 9 - Industry, Innovation and Infrastructure",
      "SDG 10": "SDG 10 - Reduced Inequalities",
      "SDG 11": "SDG 11 - Sustainable Cities and Communities",
      "SDG 12": "SDG 12 - Responsible Consumption and Production",
      "SDG 13": "SDG 13 - Climate Action",
      "SDG 14": "SDG 14 - Life Below Water",
      "SDG 15": "SDG 15 - Life on Land",
      "SDG 16": "SDG 16 - Peace, Justice and Strong Institutions",
      "SDG 17": "SDG 17 - Partnerships for the Goals",
    };
    return sdgDescriptions[sdg] || sdg;
  };

  const openDocumentDetails = (doc, label) => {
    console.log("Opening document details:", doc, label);
    // Add your document details logic here
  };

  // Handle case where selectedProposal is not provided or has no documents
  if (
    !selectedProposal ||
    !selectedProposal.document ||
    selectedProposal.document.length === 0
  ) {
    return (
      <div className="grid grid-cols-1 gap-6 h-full">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">
            No proposal selected or no documents available.
          </p>
        </div>
      </div>
    );
  }

  // Get the first document from the proposal
  const doc = selectedProposal.document[0];
  const label = doc.label;

  return (
    <div className="flex h-9/10 w-3/4">
      {/* Left: Document Viewer */}
      <div className="flex-1 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex font-bold text-2xl items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-amber-600" />
                {selectedProposal.activityTitle} Proposal
              </div>
              <p className="text-sm text-gray-500">
                Uploaded{" "}
                {new Date(doc.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-col gap-6 justify-end items-end">
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusStyle(
                  doc.status
                )}`}
              >
                {getStatusIcon(doc.status)}
                <span>{doc.status}</span>
              </div>
              <div className="flex gap-4">
                <button className="border rounded-full px-4 py-2">
                  Approve
                </button>
                <button className="border rounded-full px-4 py-2">
                  Send Revision
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full h-full">
          <div className="p-6 w-1/3">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Proposal Details
            </h2>

            <div className="space-y-4 flex flex-wrap gap-12">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Activity Title
                </label>
                <p className="text-gray-900">
                  {selectedProposal.activityTitle}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Proposed Date
                </label>
                <p className="text-gray-900">
                  {new Date(selectedProposal.proposedDate).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Venue
                </label>
                <p className="text-gray-900">{selectedProposal.venue}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Budget
                </label>
                <p className="text-gray-900">
                  ₱{selectedProposal.budgetaryRequirements.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Aligned SDGs
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedProposal.alignedSDG.map((sdg, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {getSDGWithDescription(sdg)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* PDF Viewer (takes remaining height) */}
          <div className="flex-1 bg-gray-50 border-t border-gray-200 overflow-hidden">
            <iframe
              src={`${DOCU_API_ROUTER}/${doc.organizationProfile}/${doc.fileName}#navpanes=0`}
              title={`${label} PDF Viewer`}
              className="w-full h-full"
              onError={(e) => console.error("PDF loading error:", e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Example usage with mock data
const mockProposal = {
  _id: "68aa401577523510dfd2bb08",
  organization: "68a7599e91ab6eae72d451cb",
  ProposedActionPlanSchema: "68aa401577523510dfd2bb06",
  organizationProfile: "68a7599e91ab6eae72d451d1",
  accreditation: "68a759a391ab6eae72d451de",
  overallStatus: "Pending",
  activityTitle: "General Assembly",
  alignedSDG: ["SDG 3", "SDG 9", "SDG 11"],
  budgetaryRequirements: 50000,
  venue: "Amphitheater",
  proposalType: "huh",
  proposedDate: "2025-11-01T00:00:00.000Z",
  Proponents: [],
  document: [
    {
      _id: "68aa401577523510dfd2bb03",
      organizationProfile: "68a7599e91ab6eae72d451d1",
      label: "proposal",
      fileName: "1755987989821-Bookstore_MSAccess_Project.pdf",
      revisionNotes: null,
      isPinned: false,
      logs: [],
      status: "Pending",
      createdAt: "2025-08-23T22:26:29.838Z",
      updatedAt: "2025-08-23T22:26:29.838Z",
      __v: 0,
    },
  ],
  createdAt: "2025-08-23T22:26:29.857Z",
  updatedAt: "2025-08-23T22:26:29.857Z",
  __v: 0,
};
