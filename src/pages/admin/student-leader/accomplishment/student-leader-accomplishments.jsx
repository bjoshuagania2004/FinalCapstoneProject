import axios from "axios";
import { API_ROUTER } from "../../../../App";

import { useState, useEffect } from "react";
import { OrganizationalDevelopmentModal } from "./add-organizational-development";
import { OrganizationalPerformanceModal } from "./add-organizational-performance";
import { ServiceCommunityModal } from "./add-service-community";
import { Award, Target, Users, FileText, Heart, Calendar } from "lucide-react";
import { StudentAccomplishmentDetailed } from "./detailed-accomplishment";

// Category icon mapping
const getCategoryIcon = (category) => {
  switch (category) {
    case "Proposed Action Plan":
      return <Target className="w-5 h-5" />;
    case "Organizational Performance":
      return <Award className="w-5 h-5" />;
    case "Organizational Development":
      return <Users className="w-5 h-5" />;
    case "Meetings & Assemblies":
      return <FileText className="w-5 h-5" />;
    case "Service Community":
      return <Heart className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

// Category color mapping
const getCategoryColor = (category) => {
  switch (category) {
    case "Proposed Action Plan":
      return "bg-blue-100 text-blue-800 shadow-xl-blue-200";
    case "Organizational Performance":
      return "bg-green-100 text-green-800 shadow-xl-green-200";
    case "Organizational Development":
      return "bg-purple-100 text-purple-800 shadow-xl-purple-200";
    case "Meetings & Assemblies":
      return "bg-orange-100 text-orange-800 shadow-xl-orange-200";
    case "Service Community":
      return "bg-pink-100 text-pink-800 shadow-xl-pink-200";
    default:
      return "bg-gray-100 text-gray-800 shadow-xl-gray-200";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function StudentLeaderAccomplishmentReport({ orgData }) {
  const [proposals, setProposals] = useState([]);
  const [accomplishmentData, setAccomplishmentData] = useState(null); // ✅ store report object
  const [accomplishments, setAccomplishments] = useState([]); // ✅ store sub accomplishments
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAccomplishment, setSelectedAccomplishment] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showOrgDevelopmentModal, setShowOrgDevelopmentModal] = useState(false);
  const [showOrgPerformanceModal, setShowOrgPerformanceModal] = useState(false);
  const [showServiceCommunityModal, setShowServiceCommunityModal] =
    useState(false);

  const fetchInformation = async () => {
    try {
      // Proposals
      const res = await axios.get(
        `${API_ROUTER}/getStudentLeaderAccomplishmentReady/${orgData._id}`
      );

      // Accomplishment Report
      const getAccomplishment = await axios.get(
        `${API_ROUTER}/getAccomplishment/${orgData._id}`
      );

      console.log(getAccomplishment.data);

      setAccomplishmentData(getAccomplishment.data); // ✅ full report
      setAccomplishments(getAccomplishment.data.accomplishments || []); // ✅ safe list
      setProposals(res.data);
    } catch (error) {
      console.error(error.response || error);
    }
  };

  useEffect(() => {
    fetchInformation();
  }, []);

  // ✅ Categories
  const categories = [
    "All",
    ...new Set(accomplishments.map((acc) => acc.category)),
  ];

  // ✅ Filtered
  const filteredAccomplishments =
    selectedCategory === "All"
      ? accomplishments
      : accomplishments.filter((acc) => acc.category === selectedCategory);

  // ✅ Stats
  const categoryStats = accomplishments.reduce((acc, accomplishment) => {
    acc[accomplishment.category] = (acc[accomplishment.category] || 0) + 1;
    return acc;
  }, {});

  const handleSelect = (type) => {
    console.log("Selected type:", type);
    setShowModal(false);

    if (type === "Organizational Development") {
      setShowOrgDevelopmentModal(true);
    } else if (type === "Organizational Performance") {
      setShowOrgPerformanceModal(true);
    } else if (type === "Service Community") {
      setShowServiceCommunityModal(true);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden  flex flex-col bg-gray-100">
      {/* Header Section */}
      <div className="flex-shrink-0 border-b p-4 border-gray-200 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl font-bold text-gray-900">
            Accomplishment Reports Analytics
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-amber-500 py-2 px-4 rounded-lg text-white font-semibold hover:bg-amber-600 transition-colors"
          >
            Add Accomplishment
          </button>
        </div>
        <p className="text-gray-600">
          Total Accomplishments: {accomplishments.length} | Grand Total Points:{" "}
          {accomplishmentData?.grandTotal || 0}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1  py-4 px-2 space-y-4 overflow-auto flex flex-col ">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Accomplishments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {accomplishments.length}
                </p>
              </div>
              <Award className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Points
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {accomplishmentData?.grandTotal || 0}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(categoryStats).length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Most Recent</p>
                <p className="text-sm font-bold text-gray-900">
                  {accomplishments.length > 0
                    ? formatDate(
                        Math.max(
                          ...accomplishments.map(
                            (acc) => new Date(acc.createdAt)
                          )
                        )
                      )
                    : "N/A"}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedCategory === category
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200"
              }`}
            >
              {category}{" "}
              {category !== "All" && `(${categoryStats[category] || 0})`}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex gap-2">
            {/* Left: Accomplishments List */}
            <div className="flex  gap-4 flex-col overflow-auto">
              {filteredAccomplishments.length > 0 ? (
                filteredAccomplishments.map((accomplishment) => (
                  <div
                    key={accomplishment._id}
                    onClick={() => setSelectedAccomplishment(accomplishment)}
                    className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border cursor-pointer ${
                      selectedAccomplishment?._id === accomplishment._id
                        ? "border-blue-500 ring-1 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {/* Category Badge */}
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 ${getCategoryColor(
                        accomplishment.category
                      )}`}
                    >
                      {getCategoryIcon(accomplishment.category)}
                      {accomplishment.category}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {accomplishment.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm leading-relaxed">
                      {accomplishment.description}
                    </p>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {accomplishment.awardedPoints} Points
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {accomplishment.documents &&
                          accomplishment.documents.length > 0 && (
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {accomplishment.documents.length}
                            </div>
                          )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(accomplishment.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty State */
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No accomplishments found
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    {selectedCategory === "All"
                      ? "Get started by adding your first accomplishment."
                      : `No accomplishments match the "${selectedCategory}" category.`}
                  </p>
                </div>
              )}
            </div>
            <div className="flex-3/4  overflow-auto">
              <StudentAccomplishmentDetailed
                getCategoryIcon={getCategoryIcon}
                formatDate={formatDate}
                getCategoryColor={getCategoryColor}
                selectedAccomplishment={selectedAccomplishment}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <AccomplishmentChoiceModal
          onClose={() => setShowModal(false)}
          onSelect={handleSelect}
        />
      )}

      {showOrgDevelopmentModal && (
        <OrganizationalDevelopmentModal
          orgData={orgData}
          accomplishmentId={accomplishmentData?._id}
          proposals={proposals}
          onClose={() => setShowOrgDevelopmentModal(false)}
        />
      )}

      {showOrgPerformanceModal && (
        <OrganizationalPerformanceModal
          accomplishmentId={accomplishmentData?._id}
          orgData={orgData}
          onClose={() => setShowOrgPerformanceModal(false)}
        />
      )}

      {showServiceCommunityModal && (
        <ServiceCommunityModal
          accomplishmentId={accomplishmentData?._id}
          orgData={orgData}
          onClose={() => setShowServiceCommunityModal(false)}
        />
      )}
    </div>
  );
}

function AccomplishmentChoiceModal({ onClose, onSelect }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
          Choose Upload Type
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-4">
          {/* Organizational Development */}
          <div
            onClick={() => onSelect("Organizational Development")}
            className="flex items-center gap-4 bg-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-400 transition cursor-pointer"
          >
            <div className="bg-blue-100 text-blue-600 rounded-full p-3">📊</div>
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-gray-800">
                Organizational Development
              </h3>
              <p className="text-sm text-gray-600">
                Covers Programs, Projects & Activities (PPAs), Meetings, and
                Institutional Involvement.
              </p>
            </div>
          </div>

          {/* Organizational Performance */}
          <div
            onClick={() => onSelect("Organizational Performance")}
            className="flex items-center gap-4 bg-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-emerald-400 transition cursor-pointer"
          >
            <div className="bg-emerald-100 text-emerald-600 rounded-full p-3">
              🏆
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-gray-800">
                Organizational Performance
              </h3>
              <p className="text-sm text-gray-600">
                Focuses on awards, recognition, and achievements of the
                organization and its members.
              </p>
            </div>
          </div>

          {/* Service & Community Involvement */}
          <div
            onClick={() => onSelect("Service Community")}
            className="flex items-center gap-4 bg-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-amber-400 transition cursor-pointer"
          >
            <div className="bg-amber-100 text-amber-600 rounded-full p-3">
              🤝
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-gray-800">
                Service & Community Involvement
              </h3>
              <p className="text-sm text-gray-600">
                Participation in outreach and extension programs, providing
                service to external communities and stakeholders.
              </p>
            </div>
          </div>
        </div>

        {/* Cancel button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
