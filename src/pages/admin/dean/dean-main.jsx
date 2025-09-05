import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { API_ROUTER, DOCU_API_ROUTER } from "./../../../App";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Home,
  FolderOpen,
  FileText,
  PenSquare,
  Clock,
  BookMarked,
  Search,
} from "lucide-react";
import { DeanMainAccreditation } from "./accreditation/dean-accreditation";
import { DeanOverviewComponent } from "./accreditation/dean-accreditation-overview";

export function DeanPage() {
  const { user } = useOutletContext();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch organizations
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_ROUTER}/getOrganizations/${user.deliveryUnit}`
      );

      // Transform the API response to match component expectations
      const transformedData = res.data.data.map((item) => ({
        _id: item._id,
        organizationProfile: {
          _id: item._id,
          orgName: item.orgName,
          orgAcronym: item.orgAcronym,
          orgClass: item.orgClass,
          orgCourse: item.orgCourse,
          orgDepartment: item.orgDepartment,
          orgSpecialization: item.orgSpecialization,
          orgLogo: item.orgLogo,
          isActive: item.isActive,
          overAllStatus: item.overAllStatus,
          adviserName: item.adviser?.name,
          adviserEmail: item.adviser?.email,
        },
        PresidentProfile: item.orgPresident
          ? {
              name: item.orgPresident.name,
              course: item.orgPresident.course,
              year: item.orgPresident.year,
              contactNo: item.orgPresident.contactNo,
              profilePicture: item.orgPresident.profilePicture,
              overAllStatus: item.orgPresident.overAllStatus,
            }
          : null,
        overallStatus: item.overAllStatus,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        // Add placeholder data for missing fields
        JointStatement: null,
        ConstitutionAndByLaws: null,
        PledgeAgainstHazing: null,
        Roster: {
          overAllStatus: "N/A",
          isComplete: false,
        },
        FinancialReport: null,
        // Keep original structure for legacy compatibility
        orgName: item.orgName,
        orgLogo: item.orgLogo,
      }));

      setOrgs(transformedData);
    } catch (err) {
      console.error("Error fetching organizations:", err);
      setOrgs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <div className="flex h-full w-1/5 justify-between bg-cnsc-primary-color overflow-hidden">
        <DeanMainNavigation />
      </div>
      <div className="w-full h-full">
        <DeanComponent
          selectedOrg={selectedOrg}
          orgs={orgs}
          onSelectOrg={setSelectedOrg}
          setLoading={setLoading}
          loading={loading}
          user={user}
        />
      </div>
    </div>
  );
}

function DeanMainNavigation() {
  const [activeKey, setActiveKey] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/dean" || path === "/dean/") {
      setActiveKey("home");
    } else if (path.includes("/dean/accreditation")) {
      setActiveKey("accreditations");
    } else if (path.includes("/dean/accomplishment")) {
      setActiveKey("accomplishments");
    } else if (path.includes("/dean/proposal")) {
      setActiveKey("proposals");
    } else if (path.includes("/dean/post")) {
      setActiveKey("post");
    } else if (path.includes("/dean/log")) {
      setActiveKey("logs");
    }
  }, [location.pathname]);

  const navigationItems = [
    {
      key: "home",
      icon: <Home className="w-5 h-5" />,
      label: "Reports/Dashboard",
      path: "/dean",
    },
    {
      key: "accreditations",
      icon: <FolderOpen className="w-5 h-5" />,
      label: "Accreditations",
      path: "/dean/accreditation",
    },
    {
      key: "accomplishments",
      icon: <BookMarked className="w-5 h-5" />,
      label: "Accomplishments",
      path: "/dean/accomplishment",
    },
    {
      key: "proposals",
      icon: <FileText className="w-5 h-5" />,
      label: "Proposals",
      path: "/dean/proposal",
    },
    {
      key: "post",
      icon: <PenSquare className="w-5 h-5" />,
      label: "Posts",
      path: "/dean/post",
    },
    {
      key: "logs",
      icon: <Clock className="w-5 h-5" />,
      label: "Logs",
      path: "/dean/log",
    },
  ];

  return (
    <div className="w-full ">
      <div className="h-24 bg-cnsc-secondary-color"></div>
      <nav className="flex flex-col w-full transition-all duration-500 items-center ">
        {navigationItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActiveKey(item.key);
              navigate(item.path);
            }}
            className={`group relative w-full  h-full p-4 flex items-center gap-3 
                  ${
                    activeKey === item.key
                      ? "bg-white text-cnsc-primary-color  transform"
                      : "text-white hover:bg-amber-700 hover:text-black  hover:shadow-md"
                  }`}
          >
            <span
              className={`transition-colors duration-300 ${
                activeKey === item.key
                  ? "text-cnsc-primary-color"
                  : "text-white group-hover:text-black"
              }`}
            >
              {item.icon}
            </span>
            <span className="text-sm font-semibold tracking-wide">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function DeanComponent({
  selectedOrg,
  orgs,
  onSelectOrg,
  user,
  setLoading,
  loading,
}) {
  // Helper to get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      Approved: "bg-green-100 text-green-700 border-green-200",
      Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Revision From SDU": "bg-red-100 text-red-700 border-red-200",
      Rejected: "bg-red-100 text-red-700 border-red-200",
      "Approved by the Adviser": "bg-blue-100 text-blue-700 border-blue-200",
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
      <div className="bg-blue p-3 rounded-lg space-y-1">
        <div className="flex items-center gap-2">
          {president.profilePicture ? (
            <img
              src={`${DOCU_API_ROUTER}/${org.organizationProfile._id}/${president.profilePicture}`}
              alt="President"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-medium">👤</span>
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
          <span
            className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadge(
              president.overAllStatus
            )}`}
          >
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
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">📄 Document Status</p>
        <div className="grid grid-cols-1 gap-1 text-xs">
          {documents.map((doc, index) => (
            <div key={index} className="flex justify-between items-center">
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
  const activeOrgs = orgs.filter(
    (org) => org.organizationProfile?.isActive === true
  );
  const inactiveOrgs = orgs.filter(
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
        className={`shadow-lg rounded-2xl border bg-white cursor-pointer transition-all duration-200 ${
          isSelected
            ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200 transform scale-[1.02]"
            : isActive
            ? "border-gray-200 hover:shadow-xl hover:border-blue-300"
            : "border-gray-300 hover:shadow-lg hover:border-gray-400 opacity-90"
        }`}
      >
        <div className="p-5 space-y-4">
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
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-bold text-gray-800 leading-tight">
                  {org.organizationProfile?.orgName || "Unnamed Organization"}
                </h2>
                <div className="flex flex-col gap-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                      overallStatus
                    )}`}
                  >
                    {overallStatus}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isActive
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {isActive ? "🟢 Active" : "🔴 Inactive"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">
                  {org.organizationProfile?.orgAcronym}
                </span>
                {" • "}
                <span className="capitalize">
                  {org.organizationProfile?.orgClass}
                </span>
              </p>
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
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  📋 Roster Status
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

  // Simple organization card for selection (original design)
  const renderSimpleOrgCard = (org) => (
    <div
      key={org._id}
      onClick={() => onSelectOrg(org)}
      className="border border-gray-200 rounded p-4 cursor-pointer hover:bg-gray-50 hover:border-gray-300"
    >
      <div className="flex items-center gap-3">
        <img
          src={`${DOCU_API_ROUTER}/${org._id}/${org.orgLogo}`}
          alt="Organization Logo"
          className="w-12 h-12 rounded-full"
        />
        <h3 className="font-medium text-gray-800">{org.orgName}</h3>
      </div>
    </div>
  );

  return (
    <div className="flex-1 w-full  bg-white h-full overflow-auto">
      {/* Selected Organization Display */}
      {selectedOrg && (
        <div className="p-4 bg-amber-100 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={`${DOCU_API_ROUTER}/${selectedOrg._id}/${selectedOrg.orgLogo}`}
              alt="Selected Organization"
              className="w-16 aspect-square rounded-full"
            />
            <div className="flex flex-col ">
              <span className="font-medium text-xl">{selectedOrg.orgName}</span>
              <span className="italic text-xs">Selected Organization</span>
            </div>
          </div>
          <button
            onClick={() => onSelectOrg(null)}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="">
        {selectedOrg ? (
          <Routes>
            {/* Dashboard/Home route */}
            <Route
              path="/"
              element={
                <div>Dean Organization Dashboard for {selectedOrg.orgName}</div>
              }
            />

            {/* Proposals route */}
            <Route
              path="/proposal"
              element={
                <div>Dean Organization Proposals for {selectedOrg.orgName}</div>
              }
            />

            {/* Accreditation routes */}
            <Route path="/accreditation/" element={<DeanMainAccreditation />}>
              <Route
                index
                element={<DeanOverviewComponent selectedOrg={selectedOrg} />}
              />
              <Route
                path="financial-report"
                element={<div>Dean Financial Report</div>}
              />
              <Route
                path="roster-of-members"
                element={<div>Dean Roster for {selectedOrg.orgName}</div>}
              />
              <Route
                path="document"
                element={<div>Dean Documents for {selectedOrg.orgName}</div>}
              />
              <Route
                path="proposed-action-plan"
                element={
                  <div>Dean Proposed Action Plan for {selectedOrg.orgName}</div>
                }
              />
              <Route
                path="president-information"
                element={
                  <div>Dean President Info for {selectedOrg.orgName}</div>
                }
              />
              <Route
                path="settings"
                element={<div>Dean Accreditation Settings</div>}
              />
              <Route
                path="history"
                element={
                  <div>
                    Dean Accreditation History for {selectedOrg.orgName}
                  </div>
                }
              />
            </Route>

            {/* Accomplishments route */}
            <Route
              path="/accomplishment"
              element={
                <div>
                  Dean Organization Accomplishments for {selectedOrg.orgName}
                </div>
              }
            />

            {/* Posts route */}
            <Route
              path="/post"
              element={
                <div>Dean Organization Posts for {selectedOrg.orgName}</div>
              }
            />

            {/* Logs route */}
            <Route path="/log" element={<div>Dean Logs Page</div>} />
          </Routes>
        ) : (
          // Organization Selection View
          <div className="p-6 overflow-auto space-y-8">
            {orgs.length === 0 ? (
              <div className="text-center py-12">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-lg">
                      Loading organizations...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">
                      No accreditation data found.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Organizations will appear here once they submit their
                      accreditation requirements.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* Summary Statistics */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    📊 Accreditation Overview
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {orgs.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Organizations
                      </div>
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
                          orgs.filter((org) => org.overallStatus === "Pending")
                            .length
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        Pending Review
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Organizations Section */}
                {activeOrgs.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Active Organizations
                      </h3>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                        {activeOrgs.length} organization
                        {activeOrgs.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
        )}
      </div>
    </div>
  );
}
