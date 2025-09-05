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

export function DeanPage() {
  const { user } = useOutletContext();
  const [selectedOrg, setSelectedOrg] = useState(null);

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <div className="flex h-full w-1/5 justify-between bg-cnsc-primary-color overflow-hidden">
        <DeanMainNavigation />
      </div>
      <div className="w-full h-full">
        <DeanComponent
          selectedOrg={selectedOrg}
          onSelectOrg={setSelectedOrg}
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

function DeanComponent({ selectedOrg, onSelectOrg, user }) {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch organizations
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_ROUTER}/getOrganizations/${user.deliveryUnit}`
      );
      setOrgs(res.data.data);
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
    <div className="flex-1 w-full bg-white h-full overflow-auto">
      {/* Selected Organization Display */}
      {selectedOrg && (
        <div className="p-4 bg-gray-100 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={`${DOCU_API_ROUTER}/${selectedOrg._id}/${selectedOrg.orgLogo}`}
              alt="Selected Organization"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">{selectedOrg.orgName}</span>
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
      <div className="p-4">
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
            <Route
              path="/accreditation/"
              element={<div>Dean Accreditation Main</div>}
            >
              <Route
                index
                element={
                  <div>Dean Accreditation Info for {selectedOrg.orgName}</div>
                }
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
          <div>
            <h2 className="text-xl font-bold mb-4">Select an Organization</h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading organizations...</p>
              </div>
            ) : orgs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orgs.map((org) => (
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
                      <h3 className="font-medium text-gray-800">
                        {org.orgName}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No organizations found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
