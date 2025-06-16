import { useEffect, useState } from "react";
import {
  Link,
  Route,
  useNavigate,
  Routes,
  useLocation,
  useOutletContext,
} from "react-router-dom";

import {
  Home,
  FolderOpen,
  FileText,
  File,
  PenSquare,
  Clock,
  Calendar,
  Shield,
  TrendingUp,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
} from "lucide-react";

import { HandleLogout } from "../../../api/general";

const StatusBadge = ({ status }) => {
  let bgColor = "bg-yellow-100";
  let textColor = "text-yellow-800";
  let icon = <Clock className="w-4 h-4 mr-1" />;

  switch (status?.toLowerCase()) {
    case "approved":
      bgColor = "bg-emerald-100";
      textColor = "text-emerald-800";
      icon = <CheckCircle className="w-4 h-4 mr-1" />;
      break;
    case "rejected":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      icon = <XCircle className="w-4 h-4 mr-1" />;
      break;
    case "revision":
    case "revision required":
      bgColor = "bg-orange-100";
      textColor = "text-orange-800";
      icon = <AlertCircle className="w-4 h-4 mr-1" />;
      break;
    case "pending":
    default:
      bgColor = "bg-amber-100";
      textColor = "text-amber-800";
      icon = <Clock className="w-4 h-4 mr-1" />;
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full ${bgColor} ${textColor} text-sm font-medium shadow-sm`}
    >
      {icon}
      {status || "Pending"}
    </span>
  );
};

import StudentProposalSection from "./proposals/view";
import StudentAccreditationSection from "./accreditations/accreditations_main";
import StudentAccomplishmentSection from "./accomplishments/accomplishment_main";
import StudentPostSection from "./post/view";
import StudentLogsSection from "./student_leader_logs";
import InitialRegistration from "./student_leader_initial_registration";
import StudentHomeSection from "./student_leader_home_page";
import { GetUser } from "../../../api/student_leader_api";
import Sandbox from "./sandbox";
import { Accreditation } from "../../../../server/models/users";
import AccreditationPage from "./accreditations/accreditation";

export default function StudentAdminPage() {
  const { user } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = user?.userId;
  const [orgId, setOrgId] = useState(user?.organization || null);
  const [showInitialRegistration, setShowInitialRegistration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataFetched = await GetUser(userId);
        setUserData(userDataFetched);

        const fetchedOrgId = userDataFetched.organization ?? null;
        setOrgId(fetchedOrgId);

        if (!fetchedOrgId) {
          // Handles null, undefined, or other falsy values
          setShowInitialRegistration(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const navigationItems = [
    {
      key: "home",
      icon: <Home className="mr-2 w-5 h-5" />,
      label: "Reports/Dashboard",
      path: "/student_leader",
    },
    {
      key: "accreditations",
      icon: <FolderOpen className="mr-2 w-5 h-5" />,
      label: "Accreditations",
      path: "/student_leader/accreditation",
    },
    {
      key: "accomplishments",
      icon: <File className="mr-2 w-5 h-5" />,
      label: "Accomplishments",
      path: "/student_leader/accomplishment",
    },
    {
      key: "proposals",
      icon: <FileText className="mr-2 w-5 h-5" />,
      label: "Proposals",
      path: "/student_leader/proposal",
    },
    {
      key: "post",
      icon: <PenSquare className="mr-2 w-5 h-5" />,
      label: "Post",
      path: "/student_leader/post",
    },
    {
      key: "logs",
      icon: <Clock className="mr-2 w-5 h-5" />,
      label: "Logs",
      path: "/student_leader/log",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cnsc-primary-color"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full text-xl overflow-hidden bg-gray-100">
      {/* Show registration modal if needed */}
      {showInitialRegistration && (
        <InitialRegistration
          userData={userData}
          onComplete={() => window.location.reload()}
        />
      )}

      {/* Header Section - Responsive */}
      <div className="bg-gray-900 text-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 shadow-lg">
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              className="w-6 h-6"
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
          </button>

          {/* Logo/Shield */}
          <div className="bg-white rounded-full h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 flex items-center justify-center shadow-xl border-4 border-white/20 flex-shrink-0">
            <div className="bg-cnsc-primary-color rounded-full h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 flex items-center justify-center">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
            </div>
          </div>

          {/* Organization Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold leading-tight mb-1 sm:mb-2 truncate">
              Sample Organization (SORG)
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Last Updated: June 8, 2025</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Next Review: December 2025</span>
              </div>
            </div>
          </div>
          <div className="flex flex-ol border border-white sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm sm:text-base">Overall Status:</span>
              <StatusBadge status="approved" />
            </div>

            <div className="flex flex-col items-center gap-1 text-yellow-300">
              <div className="flex">
                <span className="ml-1 text-xs sm:text-sm mr-2">Rate: </span>
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="ml-1 text-xs sm:text-sm">4.8/5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-full overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <header
          className={`
          flex flex-col justify-between text-white shadow bg-cnsc-primary-color/90 z-50
          ${sidebarOpen ? "fixed inset-y-0 left-0 w-64" : "hidden"}
          lg:flex lg:static lg:w-auto lg:min-w-1/6 max-w-fit
        `}
        >
          <div className="flex-1 overflow-y-auto">
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-end p-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-white/10 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {navigationItems.map(({ key, icon, label, path }) => {
              const isActive = location.pathname === path;
              return (
                <nav
                  key={key}
                  className={`flex w-full items-start ${
                    isActive ? "bg-white" : "hover:bg-cnsc-hover-color"
                  }`}
                >
                  <Link
                    to={path}
                    onClick={() => setSidebarOpen(false)} // Close mobile menu on navigation
                    className={`flex items-center gap-2 transition w-full p-3 lg:p-4 pr-6 lg:pr-8 pl-4 lg:pl-2 ${
                      isActive
                        ? "text-cnsc-primary-color font-black"
                        : "text-white hover:font-black"
                    }`}
                  >
                    <span className="flex-shrink-0">{icon}</span>
                    <span className="text-sm lg:text-base">{label}</span>
                  </Link>
                </nav>
              );
            })}
          </div>

          {/* Logout Button */}
          <div
            className="flex items-center justify-center m-4 lg:mb-6 lg:mx-2 p-3 lg:p-2 bg-white text-cnsc-primary-color font-black cursor-pointer border transition-colors hover:bg-gray-100"
            onClick={() => HandleLogout(navigate)}
          >
            <LogOut className="mr-2 w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            <span className="text-sm lg:text-base">Logout</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-col w-full h-full overflow-hidden p-2 sm:p-4">
          {/* Nested Routes inside StudentLeaderPage */}
          <Routes>
            <Route index element={<StudentHomeSection orgId={orgId} />} />
            <Route path="proposal" element={<StudentProposalSection />} />
            <Route path="sandbox" element={<Sandbox />} />
            <Route
              path="accreditation"
              element={<AccreditationPage StatusBadge={StatusBadge} />}
            />
            <Route
              path="accomplishment"
              element={<StudentAccomplishmentSection />}
            />
            <Route path="post" element={<StudentPostSection />} />
            <Route path="log" element={<StudentLogsSection />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
