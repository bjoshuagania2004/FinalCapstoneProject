import React, { useState } from "react";
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
    <div className="bg-white h-full p-6 border border-gray-200 rounded-lg">
      <h3 className="font-bold text-gray-800 mb-6 text-lg">
        Accreditation Timeline
      </h3>
      <div className="relative max-h-96 overflow-y-auto">
        {/* Vertical line */}
        <div className="absolute left-[130px] transform -translate-x-0.5 top-0 h-full w-0.5 bg-gray-300"></div>

        <div className="space-y-6">
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
              <div key={index} className="flex items-center w-full">
                {/* Left side - Date */}
                <div className="text-right pr-4">
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>

                {/* Center - Dot */}
                <div className="relative z-10">
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white shadow ${iconBg}`}
                  ></div>
                </div>

                {/* Right side - Status */}
                <div className="w-1/2 pl-4">
                  <p className="text-sm font-medium text-gray-900">
                    {item.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RequirementDetails({ requirement }) {
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
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
            <p className="text-gray-500 text-sm italic">No file uploaded yet</p>
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
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2" />
          Reviewer Comments
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          {requirement.comments}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
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
      </div>
    </div>
  );
}

function OrganizationRequirements() {
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  const handleRequirementClick = (requirement) => {
    setSelectedRequirement(requirement);
  };

  return (
    <div className="bg-gray-50 h-full">
      <div className="flex h-full gap-6">
        {/* Right Panel - Requirements Navigation and Details */}
        <div className="w-2/3 flex flex-col gap-6">
          {/* Requirements Navigation Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 flex items-center text-lg">
                <FileText className="w-6 h-6 mr-3 text-blue-600" />
                Accreditation Requirements
              </h3>
            </div>
            <div className="overflow-auto max-h-80">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
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

          {/* Requirement Details */}
          {selectedRequirement ? (
            <RequirementDetails requirement={selectedRequirement} />
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 flex items-center justify-center">
              <p className="text-gray-400 text-center">
                Select a requirement from the table above to view detailed
                information.
              </p>
            </div>
          )}
        </div>
        {/* Left Panel - Timeline */}
        <div className="w-1/3">
          <OrganizationRequirementsTimeline />
        </div>
      </div>
    </div>
  );
}

export default function StudentAccreditationSection() {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-1 h-full p-4">
        <OrganizationRequirements />
      </div>
    </div>
  );
}
