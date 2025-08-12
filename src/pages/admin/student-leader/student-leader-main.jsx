import React, { useEffect, useRef, useState } from "react";
import {
  NavLink,
  Routes,
  Route,
  useOutletContext,
  Outlet,
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
  UserPlus2,
  UserPlus,
  CameraIcon,
  Plus,
} from "lucide-react";
import axios from "axios";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../App";
import InitialRegistration from "./initial-registration";
import StudentLeaderPresidentListComponent from "./accreditation/presidents/president";
import StudentLeaderRosters from "./accreditation/roster-members/roster-member";
import StudentAccreditationMainComponent from "./accreditation/student-accreditation-main";
import StudentHomePage from "./home";
import FinancialReport from "./accreditation/financial-report.jsx/financial-report";
import { ProportionCropTool } from "../../../components/image_uploader";
import AccreditationDocuments from "./accreditation/documents";
import { StudentProposedPlan } from "./accreditation/propose-plan/proposed-plan";

export default function StudentLeaderMainPage() {
  const [orgData, setOrgData] = useState({});
  const [orgProfileId, setOrgProfileId] = useState("");

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Header */}
      <div className="flex min-h-24 bg-amber-600" />

      {/* Main content area */}
      <div className="flex h-full overflow-auto">
        <div className="w-1/5 h-full flex flex-col p-4 bg-cnsc-primary-color">
          <StudentNavigation orgData={orgData} />
          <LogoutButton />
        </div>

        <div className="flex-1 h-full overflow-y-auto">
          <StudentComponents
            orgData={orgData}
            setOrgData={setOrgData}
            orgProfileId={orgProfileId}
            setOrgProfileId={setOrgProfileId}
          />
        </div>
      </div>
    </div>
  );
}
function StudentAccreditationNavigationPage() {
  const tabs = [
    { to: ".", label: "Overview", end: true },
    { to: "financial-report", label: "Financial Report" },
    { to: "documents", label: "Accreditation Documents" },
    { to: "roster-of-members", label: "Roster of Members" },
    { to: "president-information", label: "President's Information Sheet" },
    { to: "PPA", label: "Proposed Action Plan" },
  ];

  return (
    <div className="h-full flex flex-col ">
      {/* Navigation */}
      <nav className="flex gap-4 px-6 py-4 bg-white  ">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `text-lg font-semibold px-4 pt-2 ${
                isActive
                  ? "border-b-2 border-cnsc-primary-color text-cnsc-primary-color"
                  : "text-gray-600 hover:text-cnsc-primary-color"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="h-full overflow-hidden  flex flex-col ">
        <Outlet />
      </div>
    </div>
  );
}

function StudentComponents({
  orgData,
  setOrgData,
  orgProfileId,
  setOrgProfileId,
}) {
  const { user } = useOutletContext();
  const [userId, setUserId] = useState(user.userId);
  const [userData, setUserData] = useState({});
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
          setOrgData(orgResponse.data);
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
    <div className="flex flex-col   w-full h-full bg-gray-200 overflow-hidden ">
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
          path="initial-registration"
          element={
            <InitialRegistration
              user={user}
              onComplete={InitialRegistrationComplete}
            />
          }
        />
        <Route
          path="accreditation"
          element={<StudentAccreditationNavigationPage />}
        >
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

          <Route
            path="Documents"
            element={
              <AccreditationDocuments
                orgData={orgData}
                accreditationData={accreditationData}
              />
            }
          />
          <Route
            path="PPA"
            element={
              <StudentProposedPlan
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

function StudentNavigation({ orgData }) {
  // Add safety check for orgData
  if (!orgData) {
    return <div>Loading...</div>;
  }

  const imageSrc =
    orgData._id && orgData.orgLogo
      ? `${DOCU_API_ROUTER}/${orgData._id}/${orgData.orgLogo}`
      : "";
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedData, setCroppedData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const cropRef = useRef();

  const handleUploadClick = () => {
    setIsUploadingLogo(true);
  };

  const cancelUploadLogo = () => {
    setIsUploadingLogo(false);
    setSelectedFile(null);
    setCroppedData(null);
  };

  const handleCropComplete = (cropData) => {
    setCroppedData(cropData);
  };

  const handleSubmitOrgLogo = async () => {
    setIsUploading(true);

    try {
      let finalCropData = croppedData;

      // If there's an image uploaded but not cropped yet, crop it first
      if (cropRef.current && cropRef.current.hasImage && !croppedData) {
        console.log("Cropping image before submit...");
        const result = await cropRef.current.cropImage();
        if (result) {
          finalCropData = result;
          setCroppedData(result); // Fixed: was setCropData
          console.log("Crop completed:", result);
        }
      }

      const formData = new FormData();
      formData.append("orgId", orgData._id); // Add organization ID if needed
      formData.append("organizationProfile", orgData._id); // Add organization ID if needed

      // Add cropped image file to FormData (if available)
      if (finalCropData && finalCropData.croppedFile) {
        formData.append("file", finalCropData.croppedFile);
        formData.append("profilePicture", finalCropData.croppedFile.name);
      }

      console.log("=== FormData Contents ===");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      // Send to backend
      const response = await axios.post(
        `${API_ROUTER}/uploadOrganizationLogo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Logo uploaded successfully:", response.data);

      // Close modal on success
      setIsUploadingLogo(false);
      setSelectedFile(null);
      setCroppedData(null);

      // Optionally show success message
      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Error uploading logo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="bg-cnsc-primary-color h-full w-full flex-col">
        <div className="text-white mt-2 mb-4 font-bold flex items-center space-x-4 hover:cursor-pointer">
          <div className="w-20 aspect-square rounded-full bg-cnsc-secondary-color flex items-center justify-center text-2xl cursor-pointer overflow-hidden hover:bg-white hover:text-cnsc-primary-color transition-all duration-500">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Organization Logo"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span
                className="relative inline-block"
                onClick={handleUploadClick}
              >
                <CameraIcon size={48} />
                <Plus
                  size={24}
                  className="absolute top-0 right-0 transform translate-x-1/3 bg-cnsc-secondary-color rounded-full"
                />
              </span>
            )}
          </div>
          <h1>{orgData.orgName}</h1>
        </div>

        <nav className="flex flex-col space-y-2">
          {[
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
          ].map((item) => (
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

      {isUploadingLogo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded-xl shadow-xl min-w-96 w-fit relative">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold mb-4">
                Upload Organization Logo
              </h2>
              <X
                size={32}
                onClick={cancelUploadLogo}
                className="cursor-pointer hover:text-red-500 transition-colors"
              />
            </div>

            <ProportionCropTool
              cropRef={cropRef}
              file={selectedFile}
              onCropComplete={handleCropComplete}
              initialProportion="1:1"
              acceptedFormats="image/*"
              className="bg-white"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={cancelUploadLogo}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitOrgLogo}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Crop & Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
