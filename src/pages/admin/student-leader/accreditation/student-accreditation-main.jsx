import { useState, useEffect } from "react";

import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Users,
  Building,
  Mail,
  Phone,
  MapPin,
  Award,
  Star,
} from "lucide-react";
import axios from "axios";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../../App";
import DocumentUploader from "../../../../components/document_uploader";

export default function StudentAccreditationMainComponent({ orgId }) {
  const [accreditationData, setAccreditationData] = useState(null);

  const [uploadingDocType, setUploadingDocType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const GetAccreditationInformation = async () => {
      if (!orgId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log(`${API_ROUTER}/getAccreditationInfo/${orgId}`);
        const response = await axios.get(
          `${API_ROUTER}/getAccreditationInfo/${orgId}`,
          { withCredentials: true }
        );

        console.log(response.data);
        setAccreditationData(response.data);
      } catch (err) {
        console.error("Error fetching accreditation info:", err);
        setError("Failed to load accreditation information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    GetAccreditationInformation();
  }, [orgId]);

  const handleUploadSubmit = async () => {
    if (!selectedFile || !uploadingDocType) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append(
      "organizationProfile",
      accreditationData.organizationProfile._id
    );
    formData.append(
      "organization",
      accreditationData.organizationProfile.organization
    );
    formData.append("file", selectedFile);
    formData.append("accreditationId", accreditationData._id);
    formData.append("docType", uploadingDocType);

    let progressInterval;

    try {
      // Simulate upload progress
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await axios.post(
        `${API_ROUTER}/addAccreditationDocument`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload success:", response.data);

      // Set upload to 100% and update local state
      setUploadProgress(100);

      setAccreditationData((prev) => ({
        ...prev,
        [uploadingDocType]: {
          fileName: selectedFile.name,
          status: "Pending",
          createdAt: new Date().toISOString(),
        },
      }));

      // Reset UI state after short delay
      setTimeout(() => {
        setUploadingDocType(null);
        setSelectedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      if (progressInterval) clearInterval(progressInterval);
    }
  };

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Trigger re-fetch by changing a dependency or calling the effect directly
    const GetAccreditationInformation = async () => {
      if (!orgId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_ROUTER}/getAccreditationInfo/${orgId}`,
          { withCredentials: true }
        );

        console.log(response.data);
        setAccreditationData(response.data);
      } catch (err) {
        console.error("Error fetching accreditation info:", err);
        setError("Failed to load accreditation information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    GetAccreditationInformation();
  };

  // Render loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Render error state
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  // Render main content
  return (
    <div className="h-full mt-4 -t-2xl overflow-auto">
      <div className="w-full">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {/* Overall Status - Takes full width on mobile, 3 columns on xl */}
          <div className="lg:col-span-2 xl:col-span-3">
            <OverallStatus accreditationData={accreditationData} />
          </div>

          {/* President Information */}
          <div className="lg:col-span-1 xl:col-span-2">
            <PresidentInformation accreditationData={accreditationData} />
          </div>

          {/* DocumentDisplayCard */}
          <div className="lg:col-span-2">
            <DocumentDisplayCard
              accreditationData={accreditationData}
              uploadingDocType={uploadingDocType}
              setUploadingDocType={setUploadingDocType}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              handleUploadSubmit={handleUploadSubmit}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </div>

          {/* Organization Info */}
          <div className="lg:col-span-3 ">
            <OrganizationInfo accreditationData={accreditationData} />
          </div>

          {/* Roster Lists */}
          <div className="lg:col-span-5">
            <RosterLists accreditationData={accreditationData} />
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadingDocType && (
        <UploadDocument
          title={`Upload ${uploadingDocType.replace(/([A-Z])/g, " $1").trim()}`}
          onFileSelect={setSelectedFile}
          onSubmit={handleUploadSubmit}
          onCancel={() => {
            setUploadingDocType(null);
            setSelectedFile(null);
          }}
          buttonLabel="Upload"
          buttonClass="bg-blue-600 hover:bg-blue-700"
        />
      )}
    </div>
  );
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200  w-96 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200  w-64 animate-pulse"></div>
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Overall Status Skeleton */}
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="bg-white  shadow-sm p-6">
              <div className="h-6 bg-gray-200  w-48 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200  w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200  w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200  w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* President Information Skeleton */}
          <div className="lg:col-span-1 xl:col-span-2">
            <div className="bg-white  shadow-sm p-6">
              <div className="h-6 bg-gray-200  w-40 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200  w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200  w-2/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200  w-1/3 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* DocumentDisplayCard Skeleton */}
          <div className="lg:col-span-5 xl:col-span-2">
            <div className="bg-white  shadow-sm p-6">
              <div className="h-6 bg-gray-200  w-32 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border border-gray-200  p-4">
                    <div className="h-4 bg-gray-200  w-32 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200  w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Organization Info Skeleton */}
          <div className="lg:col-span-1 xl:col-span-1">
            <div className="bg-white  shadow-sm p-6">
              <div className="h-6 bg-gray-200  w-36 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200  w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200  w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Roster Lists Skeleton */}
          <div className="lg:col-span-2 xl:col-span-2">
            <div className="bg-white  shadow-sm p-6">
              <div className="h-6 bg-gray-200  w-32 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gray-200 -full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200  w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error state component
function ErrorState({ error, onRetry }) {
  <div className="h-full bg-gray-50 p-6 overflow-auto">
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Student Organization Accreditation
        </h1>
        <p className="text-gray-600">
          Manage and track your organization's accreditation status
        </p>
      </div>

      <div className="bg-white  shadow-sm p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 -full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Data
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent  shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>;
}

function OverallStatus({ accreditationData }) {
  const { overallStatus, organizationProfile } = accreditationData;

  const requirements = [
    {
      name: "Joint Statement",
      status: accreditationData.JointStatement?.status || "Not Submitted",
    },
    {
      name: "Pledge Against Hazing",
      status: accreditationData.PledgeAgainstHazing?.status || "Not Submitted",
    },
    {
      name: "Organization Roster",
      status: accreditationData.Roster?.status || "Not Submitted",
    },
    {
      name: "President Profile",
      status: accreditationData.PresidentProfile
        ? "Submitted"
        : "Not Submitted",
    },
  ];

  const completedRequirements = requirements.filter(
    (req) => req.status === "Approved" || req.status === "Submitted"
  ).length;
  const progressPercentage =
    (completedRequirements / requirements.length) * 100;

  return (
    <div className="bg-white  shadow-md p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Accreditation Status
        </h2>
        <div
          className={`px-4 py-2 -full flex items-center gap-2 ${getStatusColor(
            overallStatus
          )}`}
        >
          {getStatusIcon(overallStatus)}
          <span className="font-medium">{overallStatus}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">
            {completedRequirements}/{requirements.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 -full h-3">
          <div
            className="bg-blue-600 h-3 -full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Requirements Checklist
        </h3>
        {requirements.map((req, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 "
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-900">{req.name}</span>
            </div>
            <div
              className={`px-3 py-1 -full text-sm flex items-center gap-2 ${getStatusColor(
                req.status
              )}`}
            >
              {getStatusIcon(req.status)}
              <span>{req.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Organization Summary */}
      <div className="mt-8 p-4 bg-blue-50 ">
        <h4 className="font-semibold text-blue-900 mb-2">
          Organization Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Name:</span>
            <span className="text-blue-900 ml-2">
              {organizationProfile.orgName}
            </span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Acronym:</span>
            <span className="text-blue-900 ml-2">
              {organizationProfile.orgAcronym}
            </span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Department:</span>
            <span className="text-blue-900 ml-2">
              {organizationProfile.orgDepartment}
            </span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Course:</span>
            <span className="text-blue-900 ml-2">
              {organizationProfile.orgCourse}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PresidentInformation({ accreditationData }) {
  const president = accreditationData.PresidentProfile;

  if (!president) {
    return (
      <div className="bg-white  shadow-md p-6 h-full">
        <h2 className="text-xl font-semibold mb-4">President Information</h2>
        <div className="text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No president profile found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white  shadow-md p-6 h-full">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        President Information
      </h2>

      <div className="space-y-4">
        {/* Profile Picture Placeholder */}
        <div className="flex justify-center mb-4">
          <div className="w-32 aspect-square -full  bg-gray-200  flex items-center justify-center">
            <img
              src={`${DOCU_API_ROUTER}/${president.organizationProfile}/${president.profilePicture}`}
              alt="President"
              className="w-full h-full -full"
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {president.name}
          </h3>
          <p className="text-gray-600">{president.course}</p>
          <p className="text-gray-600">{president.year}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{president.contactNo}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">
              {president.presentAddress.city},{" "}
              {president.presentAddress.province}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{president.department}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Skills & Talents
          </h4>
          <div className="space-y-2">
            {president.talentSkills.map((skill, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 "
              >
                <span className="text-sm font-medium">{skill.skill}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 -full">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Support */}
        <div className="mt-4 p-3 bg-green-50 ">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Financial Support: {president.sourceOfFinancialSupport}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentDisplayCard({ accreditationData, setUploadingDocType }) {
  const { JointStatement, PledgeAgainstHazing, ConstitutionAndByLaws } =
    accreditationData;

  const renderDocumentCard = (label, doc, key) => {
    if (doc && doc.fileName) {
      return (
        <div className="border border-gray-200  p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">{label}</h3>
                <p className="text-sm text-gray-500">{doc.fileName}</p>
                <p className="text-xs text-gray-400">
                  Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`px-2 py-1 -full text-xs flex items-center gap-1 ${getStatusColor(
                  doc.status
                )}`}
              >
                {getStatusIcon(doc.status)}
                <span>{doc.status}</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => setUploadingDocType(key)}
        className="border-2 border-dashed border-gray-300  p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <div className="text-center">
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium">Upload {label}</p>
          <p className="text-sm text-gray-500">Click to select file</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white  shadow-md p-6 h-full">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Required DocumentDisplayCard
      </h2>

      <div className="space-y-4">
        {renderDocumentCard(
          "Joint Statement",
          JointStatement,
          "JointStatement"
        )}
        {renderDocumentCard(
          "Constitution and By-Laws",
          ConstitutionAndByLaws,
          "ConstituionAndByLaws"
        )}
        {renderDocumentCard(
          "Pledge Against Hazing",
          PledgeAgainstHazing,
          "PledgeAgainstHazing"
        )}
      </div>
    </div>
  );
}

function OrganizationInfo({ accreditationData }) {
  const { organizationProfile } = accreditationData;

  return (
    <div className="bg-white  shadow-md p-6 h-full">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Building className="w-5 h-5" />
        Organization Info
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">
            {organizationProfile.orgName}
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {organizationProfile.orgAcronym}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-500">Class:</span>
            <span className="ml-2 font-medium">
              {organizationProfile.orgClass}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Department:</span>
            <span className="ml-2 font-medium">
              {organizationProfile.orgDepartment}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Course:</span>
            <span className="ml-2 font-medium">
              {organizationProfile.orgCourse}
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 ">
          <h4 className="font-medium text-gray-900 mb-2">
            Adviser Information
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <span className="ml-2 font-medium">
                {organizationProfile.adviserName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">
                {organizationProfile.adviserEmail}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Department:</span>
              <span className="ml-2 font-medium">
                {organizationProfile.adviserDepartment}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>
            Created:{" "}
            {new Date(organizationProfile.createdAt).toLocaleDateString()}
          </p>
          <p>
            Updated:{" "}
            {new Date(organizationProfile.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function RosterLists({ accreditationData }) {
  const mockRosterData = [
    {
      id: 1,
      name: "Sarah Jane Dela Cruz",
      position: "President",
      year: "4th Year",
      status: "Active",
    },
    {
      id: 2,
      name: "John Michael Santos",
      position: "Vice President",
      year: "3rd Year",
      status: "Active",
    },
    {
      id: 3,
      name: "Maria Elena Rodriguez",
      position: "Secretary",
      year: "2nd Year",
      status: "Active",
    },
    {
      id: 4,
      name: "Carlos Antonio Reyes",
      position: "Treasurer",
      year: "3rd Year",
      status: "Active",
    },
    {
      id: 5,
      name: "Ana Lucia Mendoza",
      position: "Auditor",
      year: "4th Year",
      status: "Active",
    },
  ];

  return (
    <div className="bg-white  shadow-md p-6 h-full">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Organization Roster
      </h2>

      {accreditationData.Roster ? (
        <div className="space-y-4">
          {mockRosterData.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-gray-50 "
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 -full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">
                    {member.position} • {member.year}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 -full text-xs ${getStatusColor(
                    member.status
                  )}`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Roster Submitted
          </h3>
          <p className="text-gray-500 mb-4">
            Upload your organization roster to continue with accreditation
          </p>
          <a
            href="./accreditation/roster-of-members"
            className="bg-blue-600 text-white px-6 py-2  hover:bg-blue-700 transition-colors"
          >
            Upload Roster
          </a>
        </div>
      )}
    </div>
  );
}

function UploadDocument({
  title = "Upload a Document",
  buttonLabel = "Submit",
  buttonClass = "bg-blue-600 hover:bg-blue-700",
  onFileSelect,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="absolute inset-0 h-full flex items-center justify-center 1w-full bg-black/50 backdrop-blur-sm">
      <div className=" bg-white min-w-xl mx-auto p-6 border border-gray-300 -xl">
        <h3 className="text-lg font-medium">{title}</h3>
        <DocumentUploader onFileSelect={onFileSelect} title={title} />

        <div className="flex justify-end mt-4 gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-5 py-2  hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className={`${buttonClass} text-white px-6 py-2  transition-colors font-medium`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "approved":
      return "text-green-600 bg-green-50";
    case "pending":
      return "text-yellow-600 bg-yellow-50";
    case "rejected":
      return "text-red-600 bg-red-50";
    case "submitted":
      return "text-blue-600 bg-blue-50";
    case "active":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

function getStatusIcon(status) {
  switch (status?.toLowerCase()) {
    case "approved":
      return <CheckCircle className="w-4 h-4" />;
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "rejected":
      return <AlertCircle className="w-4 h-4" />;
    case "submitted":
      return <CheckCircle className="w-4 h-4" />;
    case "active":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
}
