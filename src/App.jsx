import "./main.css";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Route,
  Routes,
  Outlet,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/public/home_page";
import StudentAdminPage from "./pages/admin/student-leader/student_leader_main";
import StudentProposalSection from "./pages/admin/student-leader/proposals/view";
import StudentAccreditationSection from "./pages/admin/student-leader/accreditations/accreditations_main";
import StudentAccomplishmentSection from "./pages/admin/student-leader/accomplishments/accomplishment_main";
import StudentPostSection from "./pages/admin/student-leader/post/view";
import StudentLogsSection from "./pages/admin/student-leader/student_leader_logs";
import FileUploadDemo from "./components/demo";
import { NotFoundPage, UnauthorizedPage } from "./components/error";
const MAIN_API_ROUTER = import.meta.env.VITE_API_ROUTER;
import { X, AlertTriangle, LogOut } from "lucide-react";
import { ProportionCropTool } from "./components/image_uploader";

export const API_ROUTER = `${MAIN_API_ROUTER}/api`;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sandbox" element={<ExampleUsage />} />

      <Route element={<ProtectedRoute allowedRoles={["student_leader"]} />}>
        <Route path="/student-leader/*" element={<StudentAdminPage />} />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

const ExampleUsage = () => {
  const handleCropComplete = (result) => {
    // Access the original File object
    console.log("Original File:", result.originalFile);
    console.log("Original file size:", result.originalFile.size);

    // Access the cropped File object
    console.log("Cropped File:", result.croppedFile);
    console.log("Cropped file size:", result.croppedFile.size);

    // Upload to server using FormData
    const formData = new FormData();
    formData.append("organization", result.croppedFile.name);
    formData.append("file", result.croppedFile);
    formData.append("fileName", result.croppedFile.name);

    axios
      .post(`${API_ROUTER}/upload-profile`, formData)
      .then((response) => {
        console.log("Upload response:", response.data);
      })
      .catch((error) => {
        console.error("Upload error:", error);
      });
  };

  return (
    <div className="space-y-8">
      <ProportionCropTool
        title="Crop & Submit Demo"
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

// Option 2: Using sessionStorage (if you want persistence across browser sessions)
const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false); // Add this
  const [userData, setUserData] = useState(() => {
    try {
      const stored = sessionStorage.getItem("userData");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${API_ROUTER}/session-check`, {
          withCredentials: true,
        });
        setIsChecking(true);

        if (res.data.loggedIn) {
          const userRole = res.data.user.position;
          const isAllowed = allowedRoles.includes(userRole);

          if (isAllowed) {
            sessionStorage.setItem("userData", JSON.stringify(res.data.user));
            setUserData(res.data.user);
            setIsAuthenticated(true);
            setShowSessionExpired(false); // Hide popup if session is valid
          } else {
            sessionStorage.removeItem("userData");
            setIsAuthenticated(false);
          }
        } else {
          // Check if user had a previous session
          const hadPreviousSession = sessionStorage.getItem("userData");
          sessionStorage.removeItem("userData");
          setIsAuthenticated(false);

          // Show popup only if user had a previous session
          if (hadPreviousSession) {
            setShowSessionExpired(true);
          }
        }
      } catch (err) {
        const hadPreviousSession = sessionStorage.getItem("userData");
        sessionStorage.removeItem("userData");
        setIsAuthenticated(false);

        // Show popup for session-related errors
        if (
          hadPreviousSession &&
          (err.response?.status === 401 || err.response?.status === 403)
        ) {
          setShowSessionExpired(true);
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
  }, [location.pathname, allowedRoles]);

  if (isChecking)
    return <div className="flex justify-center items-center">Loading...</div>;

  return (
    <>
      {isAuthenticated ? (
        <Outlet context={{ user: userData }} />
      ) : (
        <Navigate to="/unauthorized" replace />
      )}

      {/* Add the session expired popup */}
      <SessionExpiredPopup
        isOpen={showSessionExpired}
        onClose={() => setShowSessionExpired(false)}
        onRedirect={() => {
          setShowSessionExpired(false);
          sessionStorage.clear();
          navigate("/login", { replace: true });
        }}
      />
    </>
  );
};

const SessionExpiredPopup = ({ isOpen, onClose, onRedirect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all ">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Session Expired
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Your session has expired for security reasons. Please log in again
            to continue.
          </p>

          {/* Actions */}
          <div className="flex space-x-3">
            <a
              href="/"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign In Again</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Demo = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Session Expired Popup Demo</h1>

      <div className="space-y-4">
        <button
          onClick={() => setShowPopup(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Show Session Expired Popup
        </button>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-800">Features:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Automatically detects session expiration</li>
            <li>• Only shows popup if user had a previous session</li>
            <li>• Provides clear call-to-action to sign in again</li>
            <li>• Includes proper cleanup of session data</li>
            <li>• Backdrop blur and smooth animations</li>
            <li>• Responsive design</li>
            <li>• Accessible with keyboard navigation</li>
          </ul>
        </div>
      </div>

      <SessionExpiredPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onRedirect={() => {
          setShowPopup(false);
          alert("Would redirect to login page");
        }}
      />
    </div>
  );
};
