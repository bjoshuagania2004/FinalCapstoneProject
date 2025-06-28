import { useEffect, useState } from "react";
import PresidentForm from "./add-president.jsx";
import { API_ROUTER } from "../../../../../App.jsx";
import axios from "axios";
import { ProportionCropTool } from "../../../../../components/image_uploader.jsx";

const PresidentCard = ({
  president,
  onEdit,
  onDelete,
  onUploadPhoto,
  showActions = true,
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

  console.log(president);
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 max-w-sm relative">
      {/* Action buttons */}
      {showActions && (
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            onClick={() => onEdit(president)}
            className="text-gray-400 hover:text-blue-600 p-1"
            title="Edit"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(president)}
            className="text-gray-400 hover:text-red-600 p-1"
            title="Delete"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
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
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                // Fallback to initials if image fails to load
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}

          {/* Fallback avatar with initials */}
          <div
            className={`w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-gray-200 ${
              president.profilePicture ? "hidden" : "flex"
            }`}
          >
            <span className="text-2xl font-bold text-indigo-600">
              {president.name ? president.name.charAt(0).toUpperCase() : "P"}
            </span>
          </div>

          {/* Upload overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            onClick={() => onUploadPhoto(president)}
            title="Upload photo"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          {president.name}
        </h3>
        <p className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block">
          President
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
            {president.presentAddress}
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

const EmptyState = ({ onAddPresident }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
      <svg
        className="w-12 h-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No Presidents Found
    </h3>
    <p className="text-gray-500 mb-6">
      Get started by adding the first president to this organization.
    </p>
    <button
      onClick={onAddPresident}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 inline-flex items-center gap-2"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      Add First President
    </button>
  </div>
);

export const PresidentListComponent = ({ orgInfo, userInfo }) => {
  const [showForm, setShowForm] = useState(false);
  const [presidents, setPresidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPresident, setEditingPresident] = useState(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedPresident, setSelectedPresident] = useState(null);

  useEffect(() => {
    fetchPresidents();
    console.log(orgInfo);
  }, [orgInfo?.organization]);

  const fetchPresidents = async () => {
    if (!orgInfo?.organization) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${API_ROUTER}/getPresidentByOrg/${orgInfo.organization}`,
        {
          withCredentials: true,
        }
      );

      // Handle both single object and array responses
      const data = response.data;
      if (Array.isArray(data)) {
        setPresidents(data);
      } else if (data && typeof data === "object") {
        setPresidents([data]);
      } else {
        setPresidents([]);
      }
    } catch (error) {
      console.error("Error fetching presidents:", error);
      setError("Failed to load president information");
      setPresidents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPresident(null);
    fetchPresidents(); // Refetch data
  };

  const handleEdit = (president) => {
    setEditingPresident(president);
    setShowForm(true);
  };

  const handleDelete = async (president) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${president.name} as president?`
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_ROUTER}/deletePresident/${president._id}`, {
        withCredentials: true,
      });
      fetchPresidents(); // Refetch data
    } catch (error) {
      console.error("Error deleting president:", error);
      alert("Failed to delete president");
    }
  };

  const handleUploadPhoto = (president) => {
    setSelectedPresident(president);
    setShowPhotoUpload(true);
  };

  const handleAddNew = () => {
    setEditingPresident(null);
    setShowForm(true);
  };

  const handleCropComplete = (result) => {
    // Access the original File object
    console.log("Original File:", result.originalFile);
    console.log("Original file size:", result.originalFile.size);

    // Access the cropped File object
    console.log("Cropped File:", result.croppedFile);
    console.log("Cropped file size:", result.croppedFile.size);

    // Upload to server using FormData
    const formData = new FormData();
    formData.append("organization", orgInfo.organization);
    formData.append("file", result.croppedFile);
    formData.append("fileName", result.croppedFile.name);

    axios
      .post(`${API_ROUTER}/upload-profile/${selectedPresident._id}`, formData)
      .then((response) => {
        console.log("Upload response:", response.data);
      })
      .catch((error) => {
        console.error("Upload error:", error);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Organization Presidents
          </h2>
          <p className="text-gray-600">
            {presidents.length === 0
              ? "No presidents assigned"
              : presidents.length === 1
              ? "1 president"
              : `${presidents.length} presidents`}
          </p>
        </div>

        {presidents.length > 0 && (
          <button
            onClick={handleAddNew}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add President
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Content */}
      {presidents.length === 0 ? (
        <EmptyState onAddPresident={handleAddNew} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presidents.map((president, index) => (
            <PresidentCard
              key={president._id || index}
              president={president}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUploadPhoto={handleUploadPhoto}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoUpload && selectedPresident && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <ProportionCropTool
            title="Update Profile Picture"
            onCropComplete={handleCropComplete}
          />
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg max-h-[90vh] overflow-y-auto w-full max-w-4xl relative">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingPresident ? "Edit President" : "Add New President"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPresident(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <PresidentForm
              orgInfo={orgInfo}
              onSuccess={handleFormSuccess}
              existingPresident={editingPresident}
            />
          </div>
        </div>
      )}
    </div>
  );
};
