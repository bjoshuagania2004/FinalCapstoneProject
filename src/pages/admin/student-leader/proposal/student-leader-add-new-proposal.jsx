import { useState } from "react";
import { Upload } from "lucide-react";

export function AddNewProposal({ onClose, orgData }) {
  const [formData, setFormData] = useState({
    activityTitle: "",
    briefDetails: "",
    alignedObjective: "",
    venue: "",
    date: "",
    budget: "",
    alignedSDG: [],
    organizationProfile: "",
    organization: "",
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [errors, setErrors] = useState({});

  const sdgOptions = [
    "1 - No Poverty",
    "2 - Zero Hunger",
    "3 - Good Health and Well-being",
    "4 - Quality Education",
    "5 - Gender Equality",
    "6 - Clean Water and Sanitation",
    "7 - Affordable and Clean Energy",
    "8 - Decent Work and Economic Growth",
    "9 - Industry, Innovation and Infrastructure",
    "10 - Reduced Inequalities",
    "11 - Sustainable Cities and Communities",
    "12 - Responsible Consumption and Production",
    "13 - Climate Action",
    "14 - Life Below Water",
    "15 - Life on Land",
    "16 - Peace, Justice and Strong Institutions",
    "17 - Partnerships for the Goals",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSDGChange = (sdg) => {
    setFormData((prev) => ({
      ...prev,
      alignedSDG: prev.alignedSDG.includes(sdg)
        ? prev.alignedSDG.filter((item) => item !== sdg)
        : [...prev.alignedSDG, sdg],
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      if (errors.file) {
        setErrors((prev) => ({
          ...prev,
          file: "",
        }));
      }
    } else if (file) {
      setErrors((prev) => ({
        ...prev,
        file: "Please upload a PDF file only",
      }));
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.activityTitle.trim()) {
      newErrors.activityTitle = "Activity title is required";
    }

    if (!formData.briefDetails.trim()) {
      newErrors.briefDetails = "Brief details are required";
    }

    if (!formData.alignedObjective.trim()) {
      newErrors.alignedObjective = "Aligned objective is required";
    }

    if (!formData.venue.trim()) {
      newErrors.venue = "Venue is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.budget || formData.budget <= 0) {
      newErrors.budget = "Budget must be a positive number";
    }

    if (!formData.organization.trim()) {
      newErrors.organization = "Organization is required";
    }

    if (!formData.organizationProfile.trim()) {
      newErrors.organizationProfile = "Organization profile is required";
    }

    if (formData.alignedSDG.length === 0) {
      newErrors.alignedSDG = "Please select at least one SDG";
    }

    if (!uploadedFile) {
      newErrors.file = "Please upload a proposal document";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Create the complete proposal data
    const proposalData = {
      ...formData,
      budget: parseFloat(formData.budget),
      file: uploadedFile
        ? {
            name: uploadedFile.name,
            size: uploadedFile.size,
            type: uploadedFile.type,
          }
        : null,
      overallStatus: "Pending",
      submittedAt: new Date().toISOString(),
    };

    console.log("📋 New Proposal Data:", proposalData);
    console.log("📄 Uploaded File:", uploadedFile);

    // Close the modal after logging
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Proposal
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Form Fields */}
            <div className="space-y-6">
              {/* Activity Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Title *
                </label>
                <input
                  type="text"
                  name="activityTitle"
                  value={formData.activityTitle}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.activityTitle ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter activity title"
                />
                {errors.activityTitle && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.activityTitle}
                  </p>
                )}
              </div>

              {/* Brief Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brief Details *
                </label>
                <textarea
                  name="briefDetails"
                  value={formData.briefDetails}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.briefDetails ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Provide brief details about the activity"
                />
                {errors.briefDetails && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.briefDetails}
                  </p>
                )}
              </div>

              {/* Aligned Objective */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aligned Objective *
                </label>
                <textarea
                  name="alignedObjective"
                  value={formData.alignedObjective}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.alignedObjective
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="What objectives does this activity align with?"
                />
                {errors.alignedObjective && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.alignedObjective}
                  </p>
                )}
              </div>

              {/* Venue and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue *
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.venue ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Event venue"
                  />
                  {errors.venue && (
                    <p className="text-red-500 text-sm mt-1">{errors.venue}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.date ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (₱) *
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.budget ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                )}
              </div>
            </div>

            {/* Right Side - SDG Selection and File Upload */}
            <div className="space-y-6">
              {/* Aligned SDG */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Aligned SDG *
                </label>
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-2">
                    {sdgOptions.map((sdg) => (
                      <label
                        key={sdg}
                        className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.alignedSDG.includes(sdg)}
                          onChange={() => handleSDGChange(sdg)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{sdg}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {errors.alignedSDG && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.alignedSDG}
                  </p>
                )}

                {/* Selected SDGs Preview */}
                {formData.alignedSDG.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm font-medium text-gray-600">
                      Selected:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.alignedSDG.map((sdg) => (
                        <span
                          key={sdg}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                        >
                          {sdg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Proposal Document *
                </label>

                {!uploadedFile ? (
                  <div className="flex items-center justify-center w-full">
                    <label
                      className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors ${
                        errors.file ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-700">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF files only (MAX. 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,application/pdf"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border-2 border-green-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">📄</div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-800 truncate">
                            {uploadedFile.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 hover:bg-red-50 rounded transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {errors.file && (
                  <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
