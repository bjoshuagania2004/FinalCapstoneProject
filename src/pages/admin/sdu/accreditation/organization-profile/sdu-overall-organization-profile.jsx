import axios from "axios";
import { useState, useEffect } from "react";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../../../App";
import { School2, User } from "lucide-react";

export function SduOverallOrganizationProfile({ selectedOrg, onSelectOrg }) {
  const [activeOrganization, setActiveOrganization] = useState([]);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_ROUTER}/getAllAccreditationId/`);
      console.log(res.data);
      setActiveOrganization(res.data);
    } catch (error) {
      console.error("Failed to fetch accreditation data", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Helper to get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      Approved: "bg-green-100 text-green-700 border-green-200",
      Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Revision From SDU": "bg-red-100 text-red-700 border-red-200",
      Rejected: "bg-red-100 text-red-700 border-red-200",
    };

    return statusStyles[status] || "bg-gray-100 text-gray-600 border-gray-200";
  };

  // Helper to handle specialization/department display
  const renderAcademicInfo = (org) => {
    const profile = org.organizationProfile;
    if (!profile) return null;

    if (profile.orgClass === "System-wide") {
      if (profile.orgSpecialization?.toLowerCase() === "student government") {
        return (
          <>
            <p>
              <span className="font-medium text-gray-600">Specialization:</span>{" "}
              <span className="text-gray-800">{profile.orgSpecialization}</span>
            </p>
            <p>
              <span className="font-medium text-gray-600">Department:</span>{" "}
              <span className="text-gray-800">
                {profile.orgDepartment || "N/A"}
              </span>
            </p>
          </>
        );
      }
      return (
        <p>
          <span className="font-medium text-gray-600">Specialization:</span>{" "}
          <span className="text-gray-800">
            {profile.orgSpecialization || "N/A"}
          </span>
        </p>
      );
    }

    // Local and other orgClass types
    return (
      <>
        <p>
          <span className="font-medium text-gray-600">Course:</span>{" "}
          <span className="text-gray-800">{profile.orgCourse || "N/A"}</span>
        </p>
        <p>
          <span className="font-medium text-gray-600">Department:</span>{" "}
          <span className="text-gray-800">
            {profile.orgDepartment || "N/A"}
          </span>
        </p>
      </>
    );
  };

  // Helper to render president information
  const renderPresidentInfo = (org) => {
    const president = org.PresidentProfile;
    if (!president) {
      return (
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">👤 No president assigned</p>
        </div>
      );
    }

    return (
      <div className="bg-blue-50 p-3 rounded-lg space-y-1">
        <div className="flex items-center gap-2">
          {president.profilePicture ? (
            <img
              src={`${DOCU_API_ROUTER}/${org.organizationProfile._id}/${president.profilePicture}`}
              alt="President"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 aspect-square  bg-blue-200 rounded-full flex items-center justify-center">
              <User />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-800">
              {president.name}
            </p>
            <p className="text-xs text-gray-600">
              {president.year} - {president.course}
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-gray-600">
          <span>📞 {president.contactNo}</span>
          <span className={`px-2 py-1 rounded text-xs font-medium border`}>
            {president.overAllStatus}
          </span>
        </div>
      </div>
    );
  };

  // Helper to render document status
  const renderDocumentStatus = (org) => {
    const documents = [
      { name: "Joint Statement", data: org.JointStatement },
      { name: "Constitution & By-Laws", data: org.ConstitutionAndByLaws },
      { name: "Pledge Against Hazing", data: org.PledgeAgainstHazing },
    ];

    return (
      <div className="flex flex-col gap-2 bg-amber-50 p-4">
        <p className="text-sm font-medium text-gray-700">📄 Document Status</p>
        <div className="flex flex-col gap-2 text-sm">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex justify-between items-center gap-4 "
            >
              <span className="text-gray-600">{doc.name}:</span>
              {doc.data ? (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadge(
                    doc.data.status
                  )}`}
                >
                  {doc.data.status}
                </span>
              ) : (
                <span className="text-gray-400">Not submitted</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper to render financial information
  const renderFinancialInfo = (org) => {
    const financial = org.FinancialReport;
    if (!financial) return null;

    const balance = financial.initialBalance || 0;
    const reimbursements = financial.reimbursements?.length || 0;
    const disbursements = financial.disbursements?.length || 0;

    return (
      <div className="bg-green-50 p-3 rounded-lg space-y-1">
        <p className="text-sm font-medium text-gray-700">
          💰 Financial Overview
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <p className="text-gray-600">Balance</p>
            <p
              className={`font-medium ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₱{balance.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Reimbursements</p>
            <p className="font-medium text-blue-600">{reimbursements}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Disbursements</p>
            <p className="font-medium text-orange-600">{disbursements}</p>
          </div>
        </div>
      </div>
    );
  };

  // Separate organizations by active status
  const activeOrgs = activeOrganization.filter(
    (org) => org.organizationProfile?.isActive === true
  );
  const inactiveOrgs = activeOrganization.filter(
    (org) => org.organizationProfile?.isActive === false
  );

  const renderOrganizationCard = (org) => {
    const isSelected = selectedOrg?._id === org._id;
    const isActive = org.organizationProfile?.isActive;
    const overallStatus =
      org.overallStatus || org.organizationProfile?.overAllStatus;

    return (
      <div
        key={org._id}
        onClick={() =>
          selectedOrg === org.organizationProfile._id
            ? onSelectOrg(null)
            : onSelectOrg(org.organizationProfile)
        }
        className={`shadow-md rounded-xl min-w-fit flex-1 bg-white cursor-pointer transition-all duration-200 ${
          isSelected
            ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200 transform scale-[1.02]"
            : isActive
            ? "border-gray-200 hover:shadow-xl hover:border-blue-300"
            : "border-gray-300 hover:shadow-lg hover:border-gray-400 opacity-90"
        }`}
      >
        <div className="p-4 flex flex-col gap-4 ">
          {/* Header with Logo and Basic Info */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {org.organizationProfile.orgLogo ? (
                <img
                  src={`${DOCU_API_ROUTER}/${org.organizationProfile._id}/${org.organizationProfile.orgLogo}`}
                  alt={`${org.organizationProfile.orgName} Logo`}
                  className="w-16 h-16 object-cover rounded-full border-3 border-white shadow-md"
                />
              ) : (
                <div className="w-16 h-16 bg-cnsc-primary-color flex justify-center items-center text-white rounded-full border shadow-md">
                  <School2 className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="w-full">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-800 leading-tight">
                  {org.organizationProfile?.orgName || "Unnamed Organization"}
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">
                      {org.organizationProfile?.orgAcronym}
                    </span>
                    {" • "}
                    <span className="font-normal italic">
                      {org.organizationProfile?.orgClass}
                    </span>
                  </p>
                </h2>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                    overallStatus
                  )}`}
                >
                  {overallStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="text-sm space-y-1 ">
            {renderAcademicInfo(org)}
            <p>
              <span className="font-medium text-gray-600">Adviser:</span>{" "}
              <span className="text-gray-800">
                {org.organizationProfile?.adviserName || "Not assigned"}
                {org.organizationProfile?.adviserEmail &&
                  ` (${org.organizationProfile.adviserEmail})`}
              </span>
            </p>
          </div>

          {/* President Information */}
          <div>{renderPresidentInfo(org)}</div>

          {/* Roster Status */}
          <div className="bg-purple-50 p-3 rounded-lg ">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Roster Status
                </p>
                <div className="flex gap-4 text-xs text-gray-600 mt-1">
                  <span
                    className={`px-2 py-1 rounded font-medium border ${getStatusBadge(
                      org.Roster?.overAllStatus || "N/A"
                    )}`}
                  >
                    {org.Roster?.overAllStatus || "N/A"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded font-medium ${
                      org.Roster?.isComplete
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-orange-100 text-orange-700 border-orange-200"
                    }`}
                  >
                    {org.Roster?.isComplete ? "✅ Complete" : "⏳ Incomplete"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Document Status */}
          <div>{renderDocumentStatus(org)}</div>

          {/* Financial Information */}
          <div>{renderFinancialInfo(org)}</div>

          {/* Timestamps */}
          <div className="text-xs text-gray-500 space-y-1 border-t pt-3">
            <div className="flex justify-between">
              <span>Created:</span>
              <span>
                {new Date(org.createdAt).toLocaleDateString()} at{" "}
                {new Date(org.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span>
                {new Date(org.updatedAt).toLocaleDateString()} at{" "}
                {new Date(org.updatedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 overflow-auto bg-gray-200 space-y-8">
      {activeOrganization.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4"></div>
          <p className="text-gray-500 text-lg">No accreditation data found.</p>
          <p className="text-gray-400 text-sm mt-2">
            Organizations will appear here once they submit their accreditation
            requirements.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Statistics */}
          <div className="shadow-md rounded-xl bg-white p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Accreditation Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {activeOrganization.length}
                </div>
                <div className="text-sm text-gray-600">Total Organizations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {activeOrgs.length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {inactiveOrgs.length}
                </div>
                <div className="text-sm text-gray-600">Inactive</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    activeOrganization.filter(
                      (org) => org.overallStatus === "Pending"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
            </div>
          </div>

          {/* Active Organizations Section */}
          {activeOrgs.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Active Organizations
                </h3>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                  {activeOrgs.length} organization
                  {activeOrgs.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex gap-4 p-4 overflow-y-auto">
                {activeOrgs.map(renderOrganizationCard)}
              </div>
            </div>
          )}

          {/* Inactive Organizations Section */}
          {inactiveOrgs.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gray-400 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-800">
                  Inactive Organizations
                </h3>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                  {inactiveOrgs.length} organization
                  {inactiveOrgs.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {inactiveOrgs.map(renderOrganizationCard)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
