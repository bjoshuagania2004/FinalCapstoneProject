import {
  Edit,
  Trash2,
  Camera,
  Plus,
  X,
  User,
  Calendar,
  MapPin,
  Award,
  Clock,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../../App";

export function AdviserPresident({ orgData, accreditationData }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [presidents, setPresidents] = useState([]);
  const [currentPresident, setCurrentPresident] = useState(null);
  const [remainingPresidents, setRemainingPresidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const orgId = orgData.organization;

  useEffect(() => {
    const GetAndSetPresidents = async () => {
      if (!orgId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_ROUTER}/getPresidents/${orgId}`
        );
        const data = response.data;

        setPresidents(data);

        if (orgData?.orgPresident?._id) {
          const orgPresidentId = orgData.orgPresident._id;

          const matchedPresident = data.find(
            (president) => president._id === orgPresidentId
          );

          if (matchedPresident) {
            setCurrentPresident(matchedPresident);

            // Remaining presidents (exclude current one)
            const remaining = data.filter(
              (president) => president._id !== orgPresidentId
            );
            setRemainingPresidents(remaining);
          } else {
            // No match found → treat all as previous
            setRemainingPresidents(data);
          }
        } else {
          // No orgPresident → all are previous
          setRemainingPresidents(data);
        }
      } catch (error) {
        console.error("Error fetching presidents:", error);
        setError("Failed to load presidents. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    GetAndSetPresidents();
  }, [orgId, orgData?.orgPresident]);

  const handleEdit = (president) => {
    console.log("Edit clicked for:", president.name);
  };

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const handleDelete = (president) => {
    console.log("Delete clicked for:", president.name);
  };

  // Show loading screen while fetching data
  if (loading) {
    <div className="flex flex-col h-full w-full items-center justify-center min-h-96">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-400 rounded-full animate-spin animation-delay-150"></div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Presidents...
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we fetch the data
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>;
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex flex-col  h-full w-full items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Data
          </h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-4 h-full w-full gap-4 overflow-auto">
      <div className="grid grid-cols-4 gap-4">
        {/* Current President (2 columns) */}
        <div className="col-span-2">
          {currentPresident ? (
            <CurrentPresidentCard
              currentPresident={currentPresident}
              orgData={orgData}
            />
          ) : (
            <div
              className="bg-white gap-4 flex flex-col justify-center items-center p-6 relative cursor-pointer group border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-all duration-300"
              onClick={handleAdd}
            >
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full flex items-center justify-center border-2 border-indigo-200 group-hover:border-indigo-400 transition-all duration-300 group-hover:scale-105">
                <Plus
                  size={48}
                  className="text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                  Add Current President
                </h3>
                <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-300">
                  Click to add a new president
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Previous Presidents (filtered list, excludes current) */}
        {remainingPresidents.map((president) => (
          <div key={president._id} className="col-span-1">
            <PresidentCard
              president={president}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showActions={false} // never show "current" actions
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const CurrentPresidentCard = ({ currentPresident, orgData }) => {
  // Handle empty or missing data gracefully
  const president = currentPresident || {};
  const {
    name = "No Name Available",
    course = "N/A",
    year = "N/A",
    department = "No Department",
    age = "N/A",
    sex = "N/A",
    religion = "N/A",
    nationality = "N/A",
    profilePicture = "/cnscsch.jpg",
    presentAddress = {},
    contactNo = "N/A",
    facebookAccount = "",
    parentGuardian = "N/A",
    sourceOfFinancialSupport = "N/A",
    talentSkills = [],
    classSchedule = [],
  } = president;

  const profilePictureUrl = `${DOCU_API_ROUTER}/${president.organizationProfile}/${profilePicture}`;

  return (
    <div className=" mx-auto bg-white ">
      {/* Header Section */}
      <div className="bg-blue-600 px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white">
            <img
              src={profilePictureUrl}
              alt="President"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Basic Info */}
          <div className="text-center md:text-left text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{name}</h1>
            <p className="text-lg text-blue-100 mb-1">{course}</p>
            <p className="text-blue-200">
              {year} • {department}
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-6 grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Personal Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Age:</span>
              <span className="font-medium">{age}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sex:</span>
              <span className="font-medium">{sex}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Religion:</span>
              <span className="font-medium">{religion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nationality:</span>
              <span className="font-medium">{nationality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contact:</span>
              <span className="font-medium">{contactNo}</span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Additional Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Parent/Guardian:</span>
              <span className="font-medium">{parentGuardian}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Financial Support:</span>
              <span className="font-medium">{sourceOfFinancialSupport}</span>
            </div>
            {facebookAccount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Facebook:</span>
                <a
                  href={facebookAccount}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium truncate max-w-32"
                >
                  View Profile
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Section */}
      {presentAddress?.fullAddress && (
        <div className="px-6 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
            Address
          </h3>
          <p className="text-sm text-gray-700">{presentAddress.fullAddress}</p>
        </div>
      )}

      {/* Skills Section */}
      {talentSkills.length > 0 && (
        <div className="px-6 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
            Skills & Talents
          </h3>
          <div className="flex flex-wrap gap-2">
            {talentSkills.map((talent, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {talent.skill} ({talent.level})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Class Schedule */}
      {classSchedule.length > 0 && (
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
            Class Schedule
          </h3>
          <div className="space-y-2">
            {classSchedule.map((schedule, index) => (
              <div
                key={schedule._id || index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm"
              >
                <div>
                  <span className="font-medium text-gray-800">
                    {schedule.subject}
                  </span>
                  <span className="text-gray-600 ml-2">• {schedule.day}</span>
                </div>
                <div className="text-right text-gray-600">
                  <div>{schedule.time}</div>
                  <div className="text-xs">{schedule.place}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PresidentCard = ({
  president,
  onEdit,
  onDelete,
  showActions = false, // Default to false
}) => {
  if (!president) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <div className="text-gray-500">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <p>No president assigned</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-full w-full duration-200 p-4 relative">
      {/* Action buttons - only show for current president */}
      {showActions && (
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            onClick={() => onEdit(president)}
            className="text-gray-400 hover:text-blue-600 p-1"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(president)}
            className="text-gray-400 hover:text-red-600 p-1"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header with profile picture */}
      <div className="flex items-center justify-center mb-4 relative">
        {president.profilePicture ? (
          <img
            src={`${DOCU_API_ROUTER}/${president.organizationProfile}/${president.profilePicture}`}
            alt={`${president.name}'s profile`}
            className="w-42 h-auto aspect-square rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}

        {/* Fallback avatar with initials */}
        <div
          className={`min-w-32 h-auto aspect-square bg-indigo-100 rounded-full flex items-center justify-center border-2 border-gray-200 ${
            president.profilePicture ? "hidden" : "flex"
          }`}
        >
          <span className="text-2xl font-bold text-indigo-600">
            {president.name ? president.name.charAt(0).toUpperCase() : "P"}
          </span>
        </div>
      </div>

      {/* Main Info */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          {president.name}
        </h3>
        <p
          className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
            president.isCurrent
              ? "text-indigo-600 bg-indigo-50"
              : "text-gray-600 bg-gray-50"
          }`}
        >
          {president.isCurrent ? "Current President" : "Former President"}
        </p>
        <div className="text-sm text-gray-600 space-y-1">
          <p>{president.courseYear}</p>
          <p>Age: {president.age}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <div className="text-sm">
          <p className="text-gray-500">Contact:</p>
          <p className="text-gray-700">{president.contactNo}</p>
        </div>

        {president.facebookAccount && (
          <div className="text-sm">
            <p className="text-gray-500">Facebook:</p>
            <a
              href={president.facebookAccount}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-xs break-all"
            >
              {president.facebookAccount.replace(
                "https://www.facebook.com/",
                "@"
              )}
            </a>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <span className="font-medium">Address:</span>{" "}
            <span>{president.permanentAddress?.fullAddress}</span>
          </p>
          <p>
            <span className="font-medium">Financial Support:</span>{" "}
            {president.sourceOfFinancialSupport}
          </p>
          {president.talentSkills && president.talentSkills.length > 0 && (
            <p>
              <span className="font-medium">Skills:</span>{" "}
              {president.talentSkills.map((skill) => skill.skill).join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
