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
import StudentHomeSection, { Header } from "./student_leader_home_page";
import { GetUser } from "../../../api/student_leader_api";
import Sandbox from "./sandbox";

export default function StudentAdminPage() {
  const { user } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = user?.userId;
  const [orgId, setOrgId] = useState(user?.organization || null);
  const [showInitialRegistration, setShowInitialRegistration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cnsc-primary-color"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen text-xl overflow-hidden bg-gray-100">
      {/* Show registration modal if needed */}
      {showInitialRegistration && (
        <InitialRegistration
          userData={userData}
          onComplete={() => window.location.reload()}
        />
      )}
      <Header />
      <div className="flex w-full h-full">
        {/* side Navigation Bar */}
        <header className="flex flex-col justify-between min-w-fit text-white shadow bg-cnsc-primary-color/90">
          <div>
            {navigationItems.map(({ key, icon, label, path }) => {
              const isActive = location.pathname === path;
              return (
                <nav
                  key={key}
                  className={`flex w-full items-start pr-8 pl-2 ${
                    isActive ? "bg-white" : "hover:bg-cnsc-hover-color"
                  }`}
                >
                  <Link
                    to={path}
                    className={`flex items-center gap-2 transition w-full p-4 rounded ${
                      isActive
                        ? "text-cnsc-primary-color font-black"
                        : "text-white hover:font-black"
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                </nav>
              );
            })}
          </div>
          <div
            className="flex items-center justify-center mb-6 p-2 bg-white text-cnsc-primary-color font-black cursor-pointer w-full border"
            onClick={() => HandleLogout(navigate)}
          >
            <LogOut className="mr-2 w-5 h-5" />
            Logout
          </div>
        </header>

        <div className=" flex flex-col w-full overflow-hidden  ">
          {/* Nested Routes inside StudentLeaderPage */}
          <Routes>
            <Route index element={<StudentHomeSection orgId={orgId} />} />
            <Route path="proposal" element={<StudentProposalSection />} />
            <Route path="sandbox" element={<Sandbox />} />
            <Route
              path="accreditation"
              element={
                <StudentAccreditationSection StatusBadge={StatusBadge} />
              }
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
