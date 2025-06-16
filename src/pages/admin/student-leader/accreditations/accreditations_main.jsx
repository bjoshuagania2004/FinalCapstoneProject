import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Eye,
  Calendar,
  User,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

const timelineData = [
  {
    date: "2025-06-01 10:00 AM",
    status: "Initial Application Submitted",
    type: "success",
  },
  {
    date: "2025-06-01 02:30 PM",
    status: "Application Acknowledgment Sent",
    type: "info",
  },
  {
    date: "2025-06-02 09:15 AM",
    status: "Document Review Phase Started",
    type: "info",
  },
  {
    date: "2025-06-03 11:30 AM",
    status: "Constitution & Bylaws Approved",
    type: "success",
  },
  {
    date: "2025-06-04 03:45 PM",
    status: "Financial Documents Under Review",
    type: "warning",
  },
  {
    date: "2025-06-05 10:20 AM",
    status: "Activity Report Revision Requested",
    type: "warning",
  },
  {
    date: "2025-06-06 01:15 PM",
    status: "Revised Activity Report Submitted",
    type: "info",
  },
  {
    date: "2025-06-07 04:00 PM",
    status: "Faculty Adviser Verification Complete",
    type: "success",
  },
  {
    date: "2025-06-08 09:30 AM",
    status: "Final Review in Progress",
    type: "info",
  },
  {
    date: "2025-06-08 12:45 PM",
    status: "Accreditation Status: Approved",
    type: "success",
  },
];

const requirementsData = [
  {
    id: 1,
    requirement: "Constitution and By-laws",
    fileName: "SORG_Constitution_Bylaws_2025.pdf",
    status: "Approved",
    uploadDate: "2025-06-01",
    fileSize: "2.4 MB",
    description:
      "Official constitution and bylaws document outlining organizational structure, governance, and operational procedures.",
    reviewer: "Dr. Administrative Officer",
    comments:
      "Document is comprehensive and meets all institutional requirements. Well-structured governance framework.",
  },
  {
    id: 2,
    requirement: "Activity Report (Previous Year)",
    fileName: "SORG_Activity_Report_2024.pdf",
    status: "Approved",
    uploadDate: "2025-06-02",
    fileSize: "5.8 MB",
    description:
      "Comprehensive report of all organizational activities, events, and achievements from the previous academic year.",
    reviewer: "Student Affairs Committee",
    comments:
      "Excellent documentation of activities. Strong community engagement and academic support programs demonstrated.",
  },
  {
    id: 3,
    requirement: "Financial Statements",
    fileName: "SORG_Financial_Report_Q1_2025.pdf",
    status: "Revision Required",
    uploadDate: "2025-06-03",
    fileSize: "1.2 MB",
    description:
      "Financial statements including income, expenses, and budget allocation for the current fiscal year.",
    reviewer: "Financial Audit Team",
    comments:
      "Please provide additional documentation for miscellaneous expenses category. Budget projections need clarification.",
  },
  {
    id: 4,
    requirement: "Faculty Adviser Endorsement",
    fileName: "Faculty_Endorsement_Letter.pdf",
    status: "Approved",
    uploadDate: "2025-06-01",
    fileSize: "0.3 MB",
    description:
      "Official endorsement letter from the assigned faculty adviser confirming support and oversight commitment.",
    reviewer: "Academic Affairs",
    comments:
      "Strong endorsement from Dr. Cruz. Faculty adviser qualifications exceed requirements.",
  },
  {
    id: 5,
    requirement: "Member Registration List",
    fileName: "SORG_Member_List_2025.xlsx",
    status: "Approved",
    uploadDate: "2025-06-02",
    fileSize: "0.8 MB",
    description:
      "Complete list of current organizational members with contact information and academic standing verification.",
    reviewer: "Student Records Office",
    comments:
      "All member records verified. Good academic standing confirmed for all members.",
  },
  {
    id: 6,
    requirement: "Risk Management Plan",
    fileName: "",
    status: "Pending",
    uploadDate: "",
    fileSize: "",
    description:
      "Comprehensive risk assessment and management plan for organizational activities and events.",
    reviewer: "Safety Committee",
    comments:
      "Document submission pending. Please submit before June 15, 2025.",
  },
  {
    id: 7,
    requirement: "Code of Conduct",
    fileName: "SORG_Code_of_Conduct.pdf",
    status: "Approved",
    uploadDate: "2025-06-01",
    fileSize: "0.6 MB",
    description:
      "Organizational code of conduct outlining behavioral expectations and disciplinary procedures.",
    reviewer: "Ethics Committee",
    comments:
      "Comprehensive code of conduct. Disciplinary procedures are fair and well-defined.",
  },
  {
    id: 8,
    requirement: "Training Certificates",
    fileName: "Leadership_Training_Certificates.pdf",
    status: "Revision Required",
    uploadDate: "2025-06-04",
    fileSize: "3.1 MB",
    description:
      "Training certificates for key organizational officers including leadership and safety training.",
    reviewer: "Training Department",
    comments:
      "Missing certificates for 2 officers. Please provide complete documentation for all key personnel.",
  },
];

function StatusBadge({ status }) {
  const getStatusStyles = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Revision Required":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pending":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
}
function OrganizationRequirementsTimeline() {
  return (
    <div className="w-1/3 min-w-fit max-w-2xl mx-auto bg-white rounded-xl p-4 sm:p-6 flex flex-col items-center">
      <div className="sticky top-0 bg-white font-bold text-gray-800 mb-6 text-lg sm:text-xl text-center py-2 z-20">
        <h3>Accreditation Timeline</h3>
      </div>

      {/* Scrollable area */}
      <div className="relative w-full max-h-[500px] overflow-auto ">
        {/* Timeline container */}
        <div className="relative w-full pt-6 pb-6">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-300 z-0" />

          {/* Timeline items */}
          <div className="space-y-6 sm:space-y-8 relative z-10">
            {timelineData.map((item, index) => {
              let iconBg = "bg-gray-300";

              switch (item.type) {
                case "success":
                  iconBg = "bg-green-500";
                  break;
                case "warning":
                  iconBg = "bg-yellow-500";
                  break;
                case "info":
                  iconBg = "bg-blue-500";
                  break;
              }

              return (
                <div key={index} className="relative flex items-center">
                  {/* Left - Date */}
                  <div className="flex-1 text-right pr-3 sm:pr-4">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      {item.date}
                    </p>
                  </div>

                  {/* Center - Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-md ${iconBg}`}
                    ></div>
                  </div>

                  {/* Right - Status */}
                  <div className="flex-1 pl-3 sm:pl-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 leading-tight">
                      {item.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function RequirementDetailsPopup({ requirement, isOpen, onClose }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Revision Required":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "Pending":
        return <Clock className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !requirement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h1 className="text-2xl font-bold text-gray-900">
            Requirement Details
          </h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {getStatusIcon(requirement.status)}
                <span className="ml-3">{requirement.requirement}</span>
              </h2>
              <StatusBadge status={requirement.status} />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {requirement.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* File Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                File Information
              </h3>
              {requirement.fileName ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Name:</span>
                    <span className="font-medium text-gray-800">
                      {requirement.fileName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium text-gray-800">
                      {requirement.fileSize}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upload Date:</span>
                    <span className="font-medium text-gray-800">
                      {requirement.uploadDate}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No file uploaded yet
                </p>
              )}
            </div>

            {/* Review Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Review Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reviewer:</span>
                  <span className="font-medium text-gray-800">
                    {requirement.reviewer}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-gray-800">
                    {requirement.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Reviewer Comments
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {requirement.comments}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end border-t border-gray-200 pt-4">
            {requirement.fileName ? (
              <>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm font-medium transition-colors">
                  <Eye className="w-4 h-4 mr-2" />
                  View Document
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center text-sm font-medium transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Replace File
                </button>
              </>
            ) : (
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center text-sm font-medium transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccreditationRequirements({
  handleRequirementClick,
  selectedRequirement,
}) {
  return (
    <div className="w-2/3 p-4 bg-white rounded-xl  flex h-full flex-col">
      <div className="overflow-auto">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center text-lg">
            <FileText className="w-6 h-6 mr-3 text-blue-600" />
            Accreditation Requirements
          </h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Requirement
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requirementsData.map((req) => (
              <tr
                key={req.id}
                className={`hover:bg-blue-50 cursor-pointer transition-colors ${
                  selectedRequirement?.id === req.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={() => handleRequirementClick(req)}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {req.requirement}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    {req.fileName ? (
                      <button className="text-blue-600 hover:text-blue-800 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    ) : (
                      <button className="text-emerald-600 hover:text-emerald-800 flex items-center">
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrganizationRequirements() {
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleRequirementClick = (requirement) => {
    setSelectedRequirement(requirement);
    setIsPopupOpen(true); // This was missing!
  };

  return (
    <div className="h-full">
      <div className="flex flex-col h-full gap-6">
        {/* Right Panel - Requirements Navigation and Details */}
        <div className="w-full flex min-h-1/3 overflow-auto gap-4">
          {/* Left Panel - Timeline */}
          <OrganizationRequirementsTimeline />
          {/* Requirement Details */}
          <AccreditationRequirements
            handleRequirementClick={handleRequirementClick}
            selectedRequirement={selectedRequirement}
          />
        </div>

        <RequirementDetailsPopup
          requirement={selectedRequirement}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      </div>
    </div>
  );
}

export default function StudentAccreditationSection() {
  return <OrganizationRequirements />;
}
