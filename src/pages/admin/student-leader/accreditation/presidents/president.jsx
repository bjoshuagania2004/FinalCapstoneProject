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
import AddStudentPresident from "./add_president";
import axios from "axios";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../../../App";
import { ProportionCropTool } from "./../../../../../components/image_uploader";
// Loading Component
const LoadingScreen = () => {
  return (
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
    </div>
  );
};

export default function StudentLeaderPresidentListComponent({
  orgData,
  accreditationData,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [presidents, setPresidents] = useState([]);
  const [currentPresident, setCurrentPresident] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const orgId = orgData.organization;

  useEffect(() => {
    const GetPresident = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_ROUTER}/getPresidents/${orgId}`
        );
        console.log(response.data);
        setPresidents(response.data);
        // assuming the backend sends a JSON array of presidents
      } catch (error) {
        console.error("Error fetching presidents:", error);
        setError("Failed to load presidents. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (orgId) {
      GetPresident();
    }
  }, [orgId]);

  useEffect(() => {
    if (!orgData?.orgPresident || presidents.length === 0) return;

    // Check if either president profile is null/undefined - if so, allow adding new
    if (!accreditationData?.PresidentProfile || !orgData.orgPresident) {
      return; // This allows adding new president
    }

    const matchedPresident = presidents.find(
      (president) => president._id === orgData.orgPresident
    );

    if (matchedPresident) {
      setCurrentPresident(matchedPresident);

      console.log();
      // Remove matched president from the list
      const remainingPresidents = presidents.filter(
        (president) => president._id !== orgData.orgPresident
      );
      setPresidents(remainingPresidents);
    }
  }, [orgData?.orgPresident, presidents, accreditationData?.PresidentProfile]);

  const handleEdit = (president) => {
    console.log("Edit clicked for:", president.name);
  };

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const handleDelete = (president) => {
    console.log("Delete clicked for:", president.name);
  };

  const handleUploadPhoto = (president) => {
    console.log("Upload photo clicked for:", president.name);
  };

  // Show loading screen while fetching data
  if (loading) {
    return <LoadingScreen />;
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center min-h-96">
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
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-4 h-full w-full gap-4 overflow-auto">
      {/* Conditionally render AddPresident if there's no current one */}

      {/* Display all presidents */}

      {orgData.orgPresident ? (
        <CurrentPresidentCard
          currentPresident={currentPresident}
          orgData={orgData}
        />
      ) : (
        // If there is no current president, show the add card
        <div className="h-full flex flex-col gap-4">
          <div
            className="bg-white h-full rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 relative cursor-pointer group border-2 border-dashed border-gray-300 hover:border-indigo-400"
            onClick={handleAdd}
          >
            <div className="flex flex-col items-center h-full space-y-4">
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
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="absolute justify-center z-1 flex items-center inset-0 backdrop-blur-xs bg-black/20">
          <AddStudentPresident
            orgInfo={orgData}
            AccreditationId={accreditationData._id}
            onClose={() => setShowAddForm(false)}
            onSuccess={() => {
              setShowAddForm(false);
              setUploadComplete(true);
              window.location.reload();
              setTimeout(() => setUploadComplete(false), 3000); // hide after 3 seconds
            }}
          />
        </div>
      )}

      <h1 className="text-xl font-black text-center">Previous Presidents</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-center gap-6">
        {presidents.map((president, index) => (
          <PresidentCard
            key={index}
            president={president}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUploadPhoto={handleUploadPhoto}
            showActions={president.isCurrent}
          />
        ))}
      </div>
    </div>
  );
}

const CurrentPresidentCard = ({ currentPresident, orgData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    profilePicture = "/cnscsch.jpg",
    presentAddress = {},
    talentSkills = [],
    classSchedule = [],
  } = president;

  console.log(president);
  const profilePictureUrl = `${DOCU_API_ROUTER}/${president.organizationProfile}/${profilePicture}`;
  console.log("Profile Picture URL:", profilePictureUrl);
  return (
    <div className="">
      <div className="bg-white w-full">
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative group">
                <div
                  className="relative w-40 h-40 rounded-full overflow-hidden cursor-pointer ring-4 ring-white shadow-xl transition-transform duration-300 group-hover:scale-105"
                  onClick={handleImageClick}
                >
                  <img
                    src={profilePictureUrl}
                    alt="President"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <User className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">View Profile</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="text-center lg:text-left text-white">
                <h2 className="text-3xl font-bold mb-2">{name}</h2>
                <p className="text-xl text-blue-100 mb-4">
                  {course} • {year}
                </p>
                <p className="text-lg text-blue-200 mb-4">{department}</p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-sm text-blue-100">Age</p>
                    <p className="text-lg font-semibold">{age}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-sm text-blue-100">Sex</p>
                    <p className="text-lg font-semibold">{sex}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-sm text-blue-100">Religion</p>
                    <p className="text-lg font-semibold">{religion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Talents & Skills */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Talents & Skills
                  </h3>
                </div>

                {talentSkills.length > 0 ? (
                  <div className="space-y-3">
                    {talentSkills.map((talent, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200"
                      >
                        <span className="font-medium text-gray-700">
                          {talent.skill}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            talent.level === "Expert"
                              ? "bg-green-100 text-green-800"
                              : talent.level === "Advanced"
                              ? "bg-blue-100 text-blue-800"
                              : talent.level === "Intermediate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {talent.level}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No skills listed yet</p>
                  </div>
                )}
              </div>

              {/* Class Schedule */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Class Schedule
                  </h3>
                </div>

                {classSchedule.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="text-left p-3 font-semibold text-gray-700 rounded-tl-lg">
                            Subject
                          </th>
                          <th className="text-left p-3 font-semibold text-gray-700">
                            Day
                          </th>
                          <th className="text-left p-3 font-semibold text-gray-700">
                            Time
                          </th>
                          <th className="text-left p-3 font-semibold text-gray-700 rounded-tr-lg">
                            Place
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {classSchedule.map((schedule, index) => (
                          <tr
                            key={schedule._id || index}
                            className={`${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-blue-50 transition-colors duration-200`}
                          >
                            <td className="p-3 border-b border-gray-200">
                              <div className="font-medium text-gray-800">
                                {schedule.subject}
                              </div>
                            </td>
                            <td className="p-3 border-b border-gray-200">
                              <div className="text-gray-600">
                                {schedule.day}
                              </div>
                            </td>
                            <td className="p-3 border-b border-gray-200">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                {schedule.time}
                              </div>
                            </td>
                            <td className="p-3 border-b border-gray-200">
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                {schedule.place}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No schedule available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Address Section */}
            {presentAddress?.fullAddress && (
              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Address
                  </h3>
                </div>
                <p className="text-gray-700">{presentAddress.fullAddress}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <UploadPresidentProfilePicture
          isOpen={isModalOpen}
          onClose={closeModal}
          presidentProfileId={currentPresident._id}
          orgData={orgData}
        />
      )}
    </div>
  );
};

export function UploadPresidentProfilePicture({
  isOpen,
  closeModal,
  orgData,
  presidentProfileId,
}) {
  console.log(orgData);
  const cropRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [cropData, setCropData] = useState(null);

  const handleCropComplete = (result) => {
    console.log("Original File:", result.originalFile);
    console.log("Cropped File:", result.croppedFile);
    setCropData(result);
  };

  const handleUpload = async () => {
    let finalCropData = cropData;

    // if (!cropData || !cropData.croppedFile) {
    //   alert("Please select and crop an image first.");
    //   return;
    // }
    // If the user has uploaded but not manually cropped yet, trigger the crop
    if (!finalCropData && cropRef.current?.hasImage) {
      try {
        console.log("No crop data yet. Cropping now...");
        const result = await cropRef.current.cropImage(); // Should return { croppedFile, ... }
        finalCropData = result;
        console.log("Cropped result:", result);
        setCropData(result); // Cache it
      } catch (err) {
        console.error("❌ Failed to crop image before upload:", err);
        alert("Please crop the image before uploading.");
        return;
      }
    }
    // Still no data? Bail.
    if (!finalCropData || !finalCropData.croppedFile) {
      alert("Please select and crop an image first.");
      return;
    }
    const formData = new FormData();
    console.log("ay", finalCropData.croppedFile);
    formData.append("profilePicture", finalCropData.name);
    formData.append("organization", orgData.organization);
    formData.append("organizationProfile", orgData._id);
    formData.append("file", finalCropData.croppedFile);

    console.log("=== FormData Contents ===");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}: [FILE] ${value.name} (${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    setUploading(true);

    try {
      const res = await axios.post(
        `${API_ROUTER}/addPresidentProfile/${presidentProfileId}`,
        formData
      );

      const data = res.data; // ✅ No need to call .json()
      console.log("✅ Upload successful:", data);
      alert("Profile picture uploaded successfully!");
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-center mb-4">
            Upload & Crop Image
          </h2>

          <ProportionCropTool
            title="Crop Your Image"
            cropRef={cropRef}
            onCropComplete={handleCropComplete}
            maxImageHeight={500}
            showReset={true}
          />

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {uploading ? "Processing..." : "Upload Image"}
            </button>
            <button
              onClick={() => cropRef.current?.resetImage()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const PresidentCard = ({
  president,
  onEdit,
  onDelete,
  orgPresident,
  onUploadPhoto,
  showActions = false, // Default to false
}) => {
  if (!president) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-500">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <p>No president assigned</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-full w-full hover:shadow-lg transition-shadow duration-200 p-6  relative">
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
        <div className="relative group">
          {president.profilePicture ? (
            <img
              src={`/${president.organization}/${president.profilePicture}`}
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

          {/* Upload overlay - only show for current president */}
          {showActions && (
            <div
              className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              onClick={() => onUploadPhoto(president)}
              title="Upload photo"
            >
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}
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
