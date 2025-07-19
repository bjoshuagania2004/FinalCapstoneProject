import React, { useEffect, useState } from "react";
import {
  NavLink,
  Routes,
  Route,
  useOutletContext,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Home,
  FolderOpen,
  File,
  FileText,
  PenSquare,
  Clock,
  CodeSquare,
  LogOut,
  X,
  ReceiptPoundSterling,
} from "lucide-react";
import axios from "axios";
import { API_ROUTER } from "../../../App";
import InitialRegistration from "./initial-registration";
import StudentLeaderPresidentListComponent from "./accreditation/presidents/president";
import StudentLeaderRosters from "./accreditation/roster-members/roster-member";
import StudentAccreditationPage from "./accreditation/navigation";
import StudentAccreditationMainComponent from "./accreditation/accreditation-main";
import StudentHomePage from "./home";
import FinancialReport from "./accreditation/financial-report.jsx/financial-report";

export default function StudentLeaderMainPage() {
  const { user } = useOutletContext();

  return (
    <div className="flex flex-col h-screen  w-screen overflow-hidden">
      {/* Header with fixed height */}

      {/* Main content area fills the rest of the screen */}
      <div className="flex min-h-24 bg-amber-600 " />
      <div className="flex h-full  overflow-auto">
        {/* Sidebar */}
        <div className="w-1/6 h-full flex flex-col p-4 bg-cnsc-primary-color">
          <StudentNavigation />
          <LogoutButton />
        </div>

        {/* Main content */}
        <div className="flex-1 h-full  overflow-y-auto">
          <StudentComponents />
        </div>
      </div>
    </div>
  );
}

function StudentComponents() {
  const { user } = useOutletContext();
  const [userId, setUserId] = useState(user.userId);
  const [userData, setUserData] = useState({});
  const [orgData, setorgData] = useState({});
  const [orgProfileId, setOrgProfileId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [hasNavigated, setHasNavigated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [accreditationData, setAccreditationData] = useState({});

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;

        setIsLoading(true);

        const response = await axios.get(`${API_ROUTER}/userInfo/${userId}`, {
          withCredentials: true,
        });
        const user = response.data.user;
        setUserData(user);

        if (!orgProfileId && user.organizationProfile) {
          setOrgProfileId(user.organizationProfile);
        }

        if (!hasNavigated) {
          if (
            !user.organizationProfile &&
            location.pathname !== "/student-leader/initial-registration"
          ) {
            navigate("/student-leader/initial-registration");
            setHasNavigated(true);
          } else if (
            user.organizationProfile &&
            location.pathname === "/student-leader/initial-registration"
          ) {
            navigate("/student-leader");
            setHasNavigated(true);
          }
        }

        if (user.organizationProfile) {
          const orgResponse = await axios.get(
            `${API_ROUTER}/getOrganizationProfile/${user.organizationProfile}`,
            { withCredentials: true }
          );
          setorgData(orgResponse.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, location.pathname, navigate, hasNavigated]);

  // Separate useEffect for accreditation info — runs only when orgProfileId changes
  useEffect(() => {
    const GetAccreditationInformation = async () => {
      if (!orgProfileId) return;

      try {
        const response = await axios.get(
          `${API_ROUTER}/getAccreditationInfo/${orgProfileId}`,
          { withCredentials: true }
        );
        setAccreditationData(response.data);
      } catch (err) {
        console.error("Error fetching accreditation info:", err);
      }
    };

    GetAccreditationInformation();
  }, [orgProfileId]);

  const InitialRegistrationComplete = () => {
    setHasNavigated(false); // Reset navigation flag
    navigate("/student-leader");
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render routes until we have user data and have handled navigation
  if (!userData || Object.keys(userData).length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col  w-full h-full bg-gray-200 overflow-hidden ">
      <Routes>
        <Route index element={<StudentHomePage />} />
        <Route
          path="proposal"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Proposals</h1>
              <p>Student proposal section content</p>
            </div>
          }
        />
        <Route
          path="sandbox"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Sandbox</h1>
              <p>Sandbox content</p>
            </div>
          }
        />
        <Route
          path="initial-registration"
          element={
            <InitialRegistration
              user={user}
              onComplete={InitialRegistrationComplete}
            />
          }
        />
        <Route path="accreditation" element={<StudentAccreditationPage />}>
          <Route
            index
            element={
              <StudentAccreditationMainComponent
                orgId={orgData._id}
                accreditationData={accreditationData}
              />
            }
          />
          <Route
            path="financial-report"
            element={<FinancialReport orgData={orgData} />}
          />
          <Route
            path="roster-of-members"
            element={<StudentLeaderRosters orgData={orgData} />}
          />
          <Route
            path="president-information"
            element={
              <StudentLeaderPresidentListComponent
                orgData={orgData}
                accreditationData={accreditationData}
              />
            }
          />
        </Route>
        <Route
          path="accomplishment"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Accomplishments</h1>
              <p>Student accomplishment section content</p>
            </div>
          }
        />
        <Route
          path="post"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Posts</h1>
              <p>Student post section content</p>
            </div>
          }
        />
        <Route
          path="log"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Logs</h1>
              <p>Student logs section content</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

function StudentNavigation() {
  return (
    <div className="bg-cnsc-primary-color h-full w-full flex-col">
      <nav className="flex flex-col space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.key === "home"}
            className={({ isActive }) =>
              `flex items-center py-4 rounded-lg text-lg font-medium transition-all duration-500 ${
                isActive
                  ? "px-4 bg-white text-cnsc-primary-color"
                  : "px-2 text-white hover:bg-amber-500"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      // await axios.post(`${API_ROUTER}/logout`, {}, { withCredentials: true });

      // Optional: redirect or update UI after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Logout Button */}
      <div
        onClick={handleLogoutClick}
        className="flex gap-2 items-center justify-center text-xl text-cnsc-primary-color font-bold px-4 w-full bg-white rounded-lg py-2 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-red-300"
      >
        <LogOut size={16} />
        Logout
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* Modal Content */}
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Logout
              </h3>
              <button
                onClick={handleCancelLogout}
                className="text-gray-400 text-2xl hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                <X />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    Are you sure you want to log out?
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    You'll need to sign in again to access your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={handleCancelLogout}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const navigationItems = [
  {
    key: "home",
    icon: <Home className="mr-2 w-5 h-5" />,
    label: "Reports/Dashboard",
    path: "/student-leader",
  },
  {
    key: "accreditations",
    icon: <FolderOpen className="mr-2 w-5 h-5" />,
    label: "Accreditations",
    path: "/student-leader/accreditation",
  },
  {
    key: "accomplishments",
    icon: <File className="mr-2 w-5 h-5" />,
    label: "Accomplishments",
    path: "/student-leader/accomplishment",
  },
  {
    key: "proposals",
    icon: <FileText className="mr-2 w-5 h-5" />,
    label: "Proposals",
    path: "/student-leader/proposal",
  },
  {
    key: "post",
    icon: <PenSquare className="mr-2 w-5 h-5" />,
    label: "Post",
    path: "/student-leader/post",
  },
  {
    key: "logs",
    icon: <Clock className="mr-2 w-5 h-5" />,
    label: "Logs",
    path: "/student-leader/log",
  },
];
