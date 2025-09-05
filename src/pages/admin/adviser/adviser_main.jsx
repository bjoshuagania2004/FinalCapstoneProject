import axios from "axios";
import { useEffect, useState } from "react";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../App";
import { useOutletContext, NavLink, Routes, Route } from "react-router-dom";
import { DonePopUp } from "../../../components/components";
import {
  Home,
  FolderOpen,
  File,
  X,
  FileText,
  PenSquare,
  Clock,
  Camera,
  Plus,
  LogOut,
} from "lucide-react";

import { AdviserAccreditationNavigationPage } from "./accreditation.jsx/adviser-accreditation.main";
import { AdviserFinancialReport } from "./accreditation.jsx/adviser-accreditation-financial-report";
import { AdviserAccreditationDocument } from "./accreditation.jsx/adviser-accreditation-documents";
import { AdviserRosterData } from "./accreditation.jsx/adviser-accreditation-roster";
import { AdviserPresident } from "./accreditation.jsx/adviser-accreditation-president";
import { AdviserProposal } from "./accreditation.jsx/adviser-accreditation-Proposal";
import { AdviserAccreditationMainComponent } from "./accreditation.jsx/adviser-accreditation-overview";

export function AdviserPage() {
  const { user } = useOutletContext();
  const [orgData, setOrgData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchOrgInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_ROUTER}/getOrganizationProfile/${user.organizationProfile}`,
        { withCredentials: true }
      );

      setOrgData(response.data);

      if (response.data.adviser?.firstLogin) {
        setShowPasswordModal(true);
      }
    } catch (error) {
      console.error(
        "Error fetching organization data:",
        error.response || error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.organizationProfile) {
      fetchOrgInfo();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col h-screen w-screen overflow-hidden">
        {/* Header */}
        <div className="flex min-h-12 bg-amber-600" />

        {/* Main content area */}
        <div className="flex h-full overflow-auto">
          {/* Sidebar */}
          <div className="w-1/5 h-full flex flex-col bg-cnsc-primary-color">
            <AdviserNavigation orgData={orgData} />
          </div>

          {/* Main content */}
          <div className="flex-1 h-full overflow-y-auto">
            {!orgData ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-amber-600"></div>
              </div>
            ) : (
              <AdviserRoutes orgData={orgData} />
            )}
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <InitialSignInAdviser
          user={user}
          orgData={orgData}
          onFinish={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
}

function AdviserNavigation({ orgData }) {
  // Handle case where orgData is null
  if (!orgData) {
    return (
      <div className="h-full w-full flex-col">
        <div className="text-white mt-2 mb-4 font-bold flex items-center space-x-4">
          <div className="my-1 ml-3 w-15 aspect-square rounded-full bg-cnsc-secondary-color flex items-center justify-center text-2xl">
            <div className="animate-pulse bg-gray-300 rounded-full w-12 h-12"></div>
          </div>
          <div className="animate-pulse bg-gray-300 h-6 w-32 rounded"></div>
        </div>
        <nav className="flex flex-col gap-2">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-300 h-12 mx-6 rounded-xl"
              ></div>
            ))}
        </nav>
      </div>
    );
  }

  const imageSrc =
    orgData._id && orgData.orgLogo
      ? `${DOCU_API_ROUTER}/${orgData._id}/${orgData.orgLogo}`
      : "";

  return (
    <div className="h-full w-full flex-col flex">
      <div className="text-white  px-2 py-4 gap-4 font-bold flex items-center  hover:cursor-pointer">
        <div className="my-1 ml-3 w-15 aspect-square rounded-full bg-cnsc-secondary-color flex items-center justify-center text-2xl cursor-pointer overflow-hidden hover:bg-white hover:text-cnsc-primary-color transition-all duration-500">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Organization Logo"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
          ) : null}
          <span
            className="relative inline-block"
            style={{ display: imageSrc ? "none" : "block" }}
          >
            <Camera size={48} />
            <Plus
              size={24}
              className="absolute top-0 right-0 transform translate-x-1/3 bg-cnsc-secondary-color rounded-full"
            />
          </span>
        </div>
        <h1>{orgData.orgName || "Organization"}</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col h-full flex-1  gap-2">
        {[
          {
            key: "home",
            icon: <Home className="mr-3 w-5 h-5" />,
            label: "Reports / Dashboard",
            path: "/adviser",
          },
          {
            key: "accreditations",
            icon: <FolderOpen className="mr-3 w-5 h-5" />,
            label: "Accreditations",
            path: "/adviser/accreditation",
          },
          {
            key: "accomplishments",
            icon: <File className="mr-3 w-5 h-5" />,
            label: "Accomplishments",
            path: "/adviser/accomplishment",
          },
          {
            key: "proposals",
            icon: <FileText className="mr-3 w-5 h-5" />,
            label: "Proposals",
            path: "/adviser/proposal",
          },
          {
            key: "post",
            icon: <PenSquare className="mr-3 w-5 h-5" />,
            label: "Post",
            path: "/adviser/post",
          },
          {
            key: "logs",
            icon: <Clock className="mr-3 w-5 h-5" />,
            label: "Logs",
            path: "/adviser/log",
          },
        ].map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.key === "home"}
            className={({ isActive }) =>
              `flex items-center   py-4 px-6 text-lg font-medium transition-all duration-300 ${
                isActive
                  ? "bg-white text-cnsc-primary-color shadow-md"
                  : "text-white hover:bg-amber-500/90 hover:pl-8"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <LogoutButton />
    </div>
  );
}
// AdviserRoutes.jsx
function AdviserRoutes({ orgData }) {
  return (
    <div className="flex flex-col w-full h-full bg-gray-200 overflow-hidden">
      <Routes>
        <Route
          index
          element={
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">
                Welcome to {orgData.orgName}
              </h2>
              <p>Main content goes here</p>
            </div>
          }
        />

        <Route
          path="proposal"
          element={
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">
                Welcome to {orgData.orgName}
              </h2>
              <p>Main content goes here</p>
            </div>
          }
        />

        <Route
          path="accreditation"
          element={<AdviserAccreditationNavigationPage />}
        >
          <Route
            index
            element={<AdviserAccreditationMainComponent orgId={orgData._id} />}
          />
          <Route
            path="financial-report"
            element={<AdviserFinancialReport orgData={orgData} />}
          />
          <Route
            path="roster-of-members"
            element={<AdviserRosterData orgData={orgData} />}
          />
          <Route
            path="president-information"
            element={<AdviserPresident orgData={orgData} />}
          />
          <Route
            path="documents"
            element={<AdviserAccreditationDocument orgData={orgData} />}
          />
          <Route path="ppa" element={<AdviserProposal orgData={orgData} />} />
        </Route>

        <Route
          path="accomplishment"
          element={
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">
                Welcome to {orgData.orgName}
              </h2>
              <p>Main content goes here</p>
            </div>
          }
        />

        <Route
          path="post"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Posts</h1>
              <p>Adviser post section content</p>
            </div>
          }
        />

        <Route
          path="log"
          element={
            <div className="p-4">
              <h1 className="text-2xl font-bold">Logs</h1>
              <p>Adviser logs section content</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

function InitialSignInAdviser({ user, orgData, onFinish }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // ✅ state for DonePopUp

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setShowPopup({ type: "error", message: "Passwords do not match!" });
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${API_ROUTER}/adviserChangePassword/${user.userId}`,
        {
          adviserId: orgData.adviser._id,
          newPassword,
        },
        { withCredentials: true }
      );

      // ✅ show success popup instead of alert
      setShowPopup({
        type: "success",
        message: "Password updated successfully!",
      });
    } catch (error) {
      console.error(error.response || error);
      setShowPopup({ type: "error", message: "Failed to update password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            onClick={onFinish}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            onClick={handlePasswordChange}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* ✅ Show popup if state is set */}
      {showPopup && (
        <DonePopUp
          type={showPopup.type}
          message={showPopup.message}
          onClose={() => {
            setShowPopup(false);
            if (showPopup.type === "success") {
              onFinish(); // close modal after success
            }
          }}
        />
      )}
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
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulated API call
      await axios.post(`${API_ROUTER}/logout`, {}, { withCredentials: true });

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
        className="flex gap-2 items-center justify-evenly text-xl text-cnsc-primary-color font-bold px-4 w-full bg-white border-12 border-cnsc-primary-color py-2  hover:text-cnsc-secondary-color transition-all duration-500 cursor-pointer  hover:border-white"
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
