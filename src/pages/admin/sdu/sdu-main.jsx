import axios from "axios";
import {
  Home,
  FolderOpen,
  File,
  FileText,
  PenSquare,
  Clock,
  Bookmark,
  BookMarked,
  SearchCheck,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { API_ROUTER, DOCU_API_ROUTER } from "./../../../App";
import { SduAccreditationSettings } from "./accreditation/sdu-accreditation-settings";
import { SduAccreditationHistoryOverview } from "./accreditation/sdu-accreditation-history";
import { SduOrganizationInformation } from "./accreditation/sdu-accreditation-organization-profile";
import {
  SduAccreditationOverview,
  OrganizationAccreditation,
} from "./accreditation/sdu-accreditation-overview";

import {
  SduRoster,
  SduRosterOverview,
} from "./accreditation/sdu-accreditation-roster";

import {
  SduPresident,
  SduPresidentOverview,
} from "./accreditation/sdu-accreditation-president";

import {
  SduAccreditationDocumentOrganization,
  SduAccreditationDocumentOverview,
} from "./accreditation/sdu-accreditation-documents";

import {
  SduProposedActionPlanOrganization,
  SduProposedActionPlanOverview,
} from "./accreditation/sdu-accreditation-proposed-action-plan";
import { FinancialReportOverview } from "./accreditation/sdu-accreditation-financial-report";

// This should be used in your main App.js router
export default function StudentDevMainLayout() {
  const [selectedOrg, setSelectedOrg] = useState(null);

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <div className="flex   h-full w-1/5 justify-between bg-cnsc-primary-color  overflow-hidden">
        <StudentDevMainNavigation />
      </div>
      <div className=" w-full h-full">
        <StudentDevUnitComponent
          selectedOrg={selectedOrg}
          onSelectOrg={setSelectedOrg}
        />
      </div>
    </div>
  );
}

function StudentDevUnitComponent({ selectedOrg, onSelectOrg }) {
  return (
    <div className="flex-1 bg-white h-full overflow-auto">
      <Routes>
        {/* Dashboard/Home route */}
        <Route
          path="/"
          element={
            selectedOrg ? (
              <OrganizationDashboard selectedOrg={selectedOrg} />
            ) : (
              <DashboardOverview />
            )
          }
        />

        {/* Proposals routes */}
        <Route
          path="/proposal"
          element={
            selectedOrg ? (
              <OrganizationProposals selectedOrg={selectedOrg} />
            ) : (
              <ProposalsOverview />
            )
          }
        />

        {/* Accreditation routes */}
        <Route
          path="/accreditation/"
          element={
            <OrganizationAccreditation
              selectedOrg={selectedOrg}
              onSelectOrg={onSelectOrg}
            />
          }
        >
          <Route
            index
            element={
              selectedOrg ? (
                <SduOrganizationInformation selectedOrg={selectedOrg} />
              ) : (
                <SduAccreditationOverview
                  selectedOrg={selectedOrg}
                  onSelectOrg={onSelectOrg}
                />
              )
            }
          />
          <Route
            path="financial-report"
            element={<FinancialReportOverview />}
          />

          <Route
            path="roster-of-members"
            element={
              selectedOrg ? (
                <SduRoster selectedOrg={selectedOrg} />
              ) : (
                <SduRosterOverview />
              )
            }
          />
          <Route
            path="document"
            element={
              selectedOrg ? (
                <SduAccreditationDocumentOrganization
                  selectedOrg={selectedOrg}
                />
              ) : (
                <SduAccreditationDocumentOverview />
              )
            }
          />
          <Route
            path="proposed-action-plan"
            element={
              selectedOrg ? (
                <SduProposedActionPlanOrganization selectedOrg={selectedOrg} />
              ) : (
                <SduProposedActionPlanOverview
                  selectedOrg={selectedOrg}
                  onSelectOrg={onSelectOrg}
                />
              )
            }
          />
          <Route
            path="president-information"
            element={
              selectedOrg ? (
                <SduPresident selectedOrg={selectedOrg} />
              ) : (
                <SduPresidentOverview />
              )
            }
          />
          <Route path="Settings" element={<SduAccreditationSettings />} />
          <Route
            path="history"
            element={
              selectedOrg ? (
                <OrganizationAccreditationHistory selectedOrg={selectedOrg} />
              ) : (
                <SduAccreditationHistoryOverview />
              )
            }
          />
        </Route>

        {/* Accomplishments route */}
        <Route
          path="/accomplishment"
          element={
            selectedOrg ? (
              <OrganizationAccomplishments selectedOrg={selectedOrg} />
            ) : (
              <AccomplishmentsOverview />
            )
          }
        />

        {/* Posts route */}
        <Route
          path="/post"
          element={
            selectedOrg ? (
              <OrganizationPosts selectedOrg={selectedOrg} />
            ) : (
              <PostsOverview />
            )
          }
        />
      </Routes>
    </div>
  );
}

function StudentDevMainNavigation() {
  const [activeKey, setActiveKey] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  // Update active key based on current location
  useEffect(() => {
    const path = location.pathname;
    if (path === "/SDU" || path === "/SDU/" || path === "/") {
      setActiveKey("home");
    } else if (path.includes("/accreditation")) {
      setActiveKey("accreditations");
    } else if (path.includes("/accomplishment")) {
      setActiveKey("accomplishments");
    } else if (path.includes("/proposal")) {
      setActiveKey("proposals");
    } else if (path.includes("/post")) {
      setActiveKey("post");
    } else if (path.includes("/log")) {
      setActiveKey("logs");
    }
  }, [location.pathname]);

  const navigationItems = [
    {
      key: "home",
      icon: <Home className="w-5 h-5" />,
      label: "Reports/Dashboard",
      path: "/SDU",
    },
    {
      key: "accreditations",
      icon: <FolderOpen className="w-5 h-5" />,
      label: "Accreditations",
      path: "/SDU/accreditation",
    },

    {
      key: "accomplishments",
      icon: <BookMarked className="w-5 h-5" />,
      label: "Accomplishments",
      path: "/SDU/accomplishment",
    },
    {
      key: "proposals",
      icon: <FileText className="w-5 h-5" />,
      label: "Proposals",
      path: "/SDU/proposal",
    },
    {
      key: "post",
      icon: <PenSquare className="w-5 h-5" />,
      label: "Posts",
      path: "/SDU/post",
    },
    {
      key: "logs",
      icon: <Clock className="w-5 h-5" />,
      label: "Logs",
      path: "/SDU/log",
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

// Dashboard Overview Components
function DashboardOverview() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600">General statistics and trends</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Organization Registration Trends
          </h3>
          <div className="h-48 bg-white rounded border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>Registration trends chart</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Active Organizations</h3>
          <div className="h-48 bg-white rounded border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📈</div>
              <p>Active organizations chart</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProposalsOverview() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Proposals Overview</h2>
        <p className="text-gray-600">
          General statistics and trends for proposals
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Proposal Submission Rates
          </h3>
          <div className="h-48 bg-white rounded border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>Submission trends</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Approval Status Distribution
          </h3>
          <div className="h-48 bg-white rounded border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🥧</div>
              <p>Status pie chart</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccomplishmentsOverview() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Accomplishments Overview
        </h2>
        <p className="text-gray-600">
          General statistics and trends for accomplishments
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Accomplishment Categories
          </h3>
          <div className="h-48 bg-white rounded border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🏅</div>
              <p>Categories chart</p>
            </div>
          </div>
        </div>
        <div className="bg-cyan-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Achievement Timeline</h3>
          <div className="h-48 bg-white rounded border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📅</div>
              <p>Timeline chart</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostsOverview() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Posts Overview</h2>
        <p className="text-gray-600">General statistics and trends for posts</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-violet-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Post Engagement Metrics
          </h3>
          <div className="h-48 bg-white rounded border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">💬</div>
              <p>Engagement chart</p>
            </div>
          </div>
        </div>
        <div className="bg-rose-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Publishing Frequency</h3>
          <div className="h-48 bg-white rounded border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>Frequency chart</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Organization-specific Components
function OrganizationDashboard({ selectedOrg }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {selectedOrg.orgName}
      </h1>
      <p className="text-gray-600 mb-6">Organization Dashboard</p>
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Organization Details</h3>
        <div className="space-y-2">
          <p>
            <strong className="text-gray-700">Adviser:</strong>{" "}
            {selectedOrg.adviserName}
          </p>
          <p>
            <strong className="text-gray-700">Email:</strong>{" "}
            <a
              href={`mailto:${selectedOrg.adviserEmail}`}
              className="text-blue-600 hover:underline"
            >
              {selectedOrg.adviserEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
// Component: OrganizationAccreditationHistory
function OrganizationAccreditationHistory({ selectedOrg }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">
        {selectedOrg?.orgName || "Organization Name"}
      </h1>
      <p className="text-gray-600 mb-6">Organization Dashboard</p>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Organization Details
        </h3>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Adviser:</strong> {selectedOrg?.adviserName || "N/A"}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {selectedOrg?.adviserEmail ? (
              <a
                href={`mailto:${selectedOrg.adviserEmail}`}
                className="text-blue-600 hover:underline"
              >
                {selectedOrg.adviserEmail}
              </a>
            ) : (
              "N/A"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function OrganizationProposals({ selectedOrg }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Proposals - {selectedOrg.orgName}
      </h1>
      <p className="text-gray-600 mb-6">
        Manage and view proposals for {selectedOrg.orgName}
      </p>
      <div className="bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Proposal Management</h3>
        <p>
          Proposal content and management tools for {selectedOrg.orgName} will
          be displayed here.
        </p>
      </div>
    </div>
  );
}

function OrganizationPresidentInfo({ selectedOrg }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        President Information - {selectedOrg.orgName}
      </h1>
      <p className="text-gray-600 mb-6">
        President details and contact information
      </p>
      <div className="bg-indigo-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">President Information</h3>
        <p>
          President information for {selectedOrg.orgName} will be displayed
          here.
        </p>
      </div>
    </div>
  );
}

function OrganizationAccomplishments({ selectedOrg }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Accomplishments - {selectedOrg.orgName}
      </h1>
      <p className="text-gray-600 mb-6">
        Track and manage accomplishments for {selectedOrg.orgName}
      </p>
      <div className="bg-emerald-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Achievement Management</h3>
        <p>
          Accomplishment tracking for {selectedOrg.orgName} will be displayed
          here.
        </p>
      </div>
    </div>
  );
}

function OrganizationPosts({ selectedOrg }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Posts - {selectedOrg.orgName}
      </h1>
      <p className="text-gray-600 mb-6">
        Manage posts and announcements for {selectedOrg.orgName}
      </p>
      <div className="bg-violet-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Post Management</h3>
        <p>
          Post creation and management for {selectedOrg.orgName} will be
          displayed here.
        </p>
      </div>
    </div>
  );
}

export function StudentDevOrganizationProfileCard({
  selectedOrg,
  onSelectOrg,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [searchScope, setSearchScope] = useState("");

  // Function to fetch data
  const fetchData = async () => {
    try {
      if (searchTerm.trim() !== "") {
        setSearching(true);
      } else {
        setLoading(true);
      }
      const res = await axios.get(
        `${API_ROUTER}/getAllOrganizationProfile?search=${encodeURIComponent(
          searchTerm
        )}&department=${encodeURIComponent(
          selectedDepartment
        )}&program=${encodeURIComponent(
          selectedProgram
        )}&specialization=${encodeURIComponent(
          selectedSpecialization
        )}&scope=${encodeURIComponent(searchScope)}`
      );
      setOrgs(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setOrgs([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  // Effect for search term with debounce
  useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId);

    const delay = setTimeout(() => {
      fetchData();
    }, 300);

    setTimeoutId(delay);

    return () => {
      if (delay) clearTimeout(delay);
    };
  }, [searchTerm]);

  // Effect for immediate search on dropdown changes and scope changes
  useEffect(() => {
    fetchData();
  }, [
    selectedDepartment,
    selectedProgram,
    selectedSpecialization,
    searchScope,
  ]);

  // Reset filters when scope changes
  useEffect(() => {
    setSelectedDepartment("");
    setSelectedProgram("");
    setSelectedSpecialization("");
  }, [searchScope]);

  return (
    <div className=" border-l border-gray-700 w-full h-full">
      <h1 className="text-center pt-4 text-2xl text-black font-bold">
        CNSC Organizations
      </h1>
      <div className="flex h-full overflow-auto flex-1  flex-col p-4 w-full gap-4">
        {/* Radio buttons for search scope */}
        <div className="flex justify-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="searchScope"
              value="local"
              checked={searchScope === "local"}
              onChange={(e) => setSearchScope(e.target.value)}
              className="w-4 h-4 text-amber-500 border-amber-400 focus:ring-amber-500"
            />
            <span className="text-gray-700 font-medium">Local</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="searchScope"
              value="systemwide"
              checked={searchScope === "systemwide"}
              onChange={(e) => setSearchScope(e.target.value)}
              className="w-4 h-4 text-amber-500 border-amber-400 focus:ring-amber-500"
            />
            <span className="text-gray-700 font-medium">System Wide</span>
          </label>
        </div>

        {/* Conditional dropdowns based on search scope */}
        {searchScope === "local" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department Dropdown */}
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setSelectedProgram(""); // reset program on department change
              }}
              className="border-2 border-amber-400 rounded-lg px-4 py-2 w-full focus:outline-none"
            >
              <option value="">Select Department</option>
              {Object.keys(departments).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Program Dropdown */}
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              disabled={!selectedDepartment}
              className="border-2 border-amber-400 rounded-lg px-4 py-2 w-full focus:outline-none"
            >
              <option value="">Select Program</option>
              {selectedDepartment &&
                departments[selectedDepartment].map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Specialization Dropdown for System Wide */}
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="border-2 border-amber-400 rounded-lg px-4 py-2 w-full focus:outline-none"
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="relative ">
          <input
            type="text"
            placeholder="Search organization..."
            className="w-full px-4 py-3 pr-10 border-2 border-amber-400 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            size={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500"
          />
        </div>

        {/* Scrollable Organization List */}
        <div className="flex flex-col gap-2  overflow-auto">
          {loading || searching ? (
            <div className="flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
                <p>{searching ? "Searching..." : "Loading..."}</p>
              </div>
            </div>
          ) : orgs.length > 0 ? (
            orgs.map((org) => (
              <div
                key={org._id}
                onClick={() =>
                  selectedOrg?._id === org._id
                    ? onSelectOrg(null)
                    : onSelectOrg(org)
                }
                className={`flex gap-4 items-center  rounded-lg p-4 border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedOrg?._id === org._id
                    ? " border-cnsc-primary-color border-4 bg-amber-300 "
                    : " hover:border-gray-300"
                }`}
              >
                <img
                  src={`${DOCU_API_ROUTER}/${org._id}/${org.orgLogo}`}
                  alt="Organization Logo"
                  className="w-12 h-12 object-cover rounded-full"
                />
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {org.orgName}
                </h3>
                <div className="text-sm text-gray-600"></div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No organizations found</p>
              {searchTerm && (
                <p className="text-sm mt-1">Try adjusting your search terms</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const departments = {
  "College of Arts and Sciences": [
    "Bachelor of Science in Biology",
    "Bachelor of Science in Applied Mathematics",
    "Bachelor of Science in Development Communication",
    "Bachelor of Arts in English Language Studies",
    "Bachelor of Arts in Sociology",
  ],
  "College of Computing and Multimedia Studies": [
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Information Systems",
  ],
  "College of Business and Public Administration": [
    "Bachelor of Science in Business Administration – Business Economics",
    "Bachelor of Science in Business Administration – Financial Management",
    "Bachelor of Science in Business Administration – Marketing Management",
    "Bachelor of Science in Business Administration – Human Resource Management",
    "Bachelor of Science in Accountancy",
    "Bachelor of Science in Hospitality Management",
    "Bachelor of Science in Office Administration",
    "Bachelor of Science in Entrepreneurship",
    "Bachelor in Public Administration",
  ],
  "College of Engineering": [
    "Bachelor of Science in Civil Engineering",
    "Bachelor of Science in Electrical Engineering",
    "Bachelor of Science in Mechanical Engineering",
  ],
  "College of Education": [
    "Bachelor of Elementary Education",
    "Bachelor of Secondary Education – Major in English",
    "Bachelor of Secondary Education – Major in Filipino",
    "Bachelor of Secondary Education – Major in Mathematics",
    "Bachelor of Secondary Education – Major in Social Studies",
    "Bachelor of Secondary Education – Major in Sciences",
    "Bachelor of Technology and Livelihood Education – Home Economics",
    "Bachelor of Physical Education",
  ],
  "College of Trades and Technology": [
    "Bachelor of Technical-Vocational Teacher Education – Garments Fashion and Design",
    "Bachelor of Technical-Vocational Teacher Education – Food Service and Management",
    "Bachelor of Technical-Vocational Teacher Education – Automotive Technology",
    "Bachelor of Technical-Vocational Teacher Education – Electrical Technology",
    "Bachelor of Science in Industrial Technology – Automotive Technology",
    "Bachelor of Science in Industrial Technology – Electrical Technology",
    "Bachelor of Science in Industrial Technology – Computer Technology",
    "Bachelor of Science in Industrial Technology – Electronics Technology",
  ],
  "College of Agriculture and Natural Resources": [
    "Bachelor of Science in Agriculture – Crop Science",
    "Bachelor of Science in Agriculture – Animal Science",
    "Bachelor of Science in Environmental Science",
    "Bachelor in Agricultural Technology",
    "Bachelor of Science in Agricultural and Biosystems Engineering",
  ],
  "Institute of Fisheries and Marine Sciences": [
    "Bachelor of Science in Fisheries",
  ],
  "Alternative Track": [
    "Bachelor of Science in Entrepreneurship (Agricultural Production Track)",
  ],
};

export const specializations = [
  "Academic",
  "Lifestyle",
  "Fraternity/Sorority",
  "Environmental",
  "Social-Civic",
  "Spiritual or religious",
  "Student government",
  "Adviser Academic Rank",
];
