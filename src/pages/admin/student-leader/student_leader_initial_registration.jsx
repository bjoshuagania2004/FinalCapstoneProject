import React, { useState } from "react";
import { User, Building } from "lucide-react";
import { ReusableFileUpload } from "../../../components/file_manager";
import axios from "axios";
import { API_ROUTER } from "../../../App";

const departments = {
  "College of Arts and Sciences": [
    "Bachelor of Science in Biology",
    "Bachelor of Science in Applied Mathematics",
    "Bachelor of Science in Development Communication",
    "Bachelor of Arts in English Language Studies",
    "Bachelor of Arts in Sociology",
  ],
  "College of Computing and Multimedia Studies": [
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Information Systems",
  ],
  "College of Business and Public Administration": [
    "Bachelor of Science in Business Administration – Business Economics",
    "Bachelor of Science in Business Administration – Financial Management",
    "Bachelor of Science in Business Administration – Marketing Management",
    "Bachelor of Science in Business Administration – Human Resource Management",
    "Bachelor of Science in Accountancy",
    "Bachelor of Science in Hospitality Management",
    "Bachelor of Science in Office Administration",
    "Bachelor of Science in Entrepreneurship",
    "Bachelor in Public Administration",
  ],
  "College of Engineering": [
    "Bachelor of Science in Civil Engineering",
    "Bachelor of Science in Electrical Engineering",
    "Bachelor of Science in Mechanical Engineering",
  ],
  "College of Education": [
    "Bachelor of Elementary Education",
    "Bachelor of Secondary Education – Major in English",
    "Bachelor of Secondary Education – Major in Filipino",
    "Bachelor of Secondary Education – Major in Mathematics",
    "Bachelor of Secondary Education – Major in Social Studies",
    "Bachelor of Secondary Education – Major in Sciences",
    "Bachelor of Technology and Livelihood Education – Home Economics",
    "Bachelor of Physical Education",
  ],
  "College of Trades and Technology": [
    "Bachelor of Technical-Vocational Teacher Education – Garments Fashion and Design",
    "Bachelor of Technical-Vocational Teacher Education – Food Service and Management",
    "Bachelor of Technical-Vocational Teacher Education – Automotive Technology",
    "Bachelor of Technical-Vocational Teacher Education – Electrical Technology",
    "Bachelor of Science in Industrial Technology – Automotive Technology",
    "Bachelor of Science in Industrial Technology – Electrical Technology",
    "Bachelor of Science in Industrial Technology – Computer Technology",
    "Bachelor of Science in Industrial Technology – Electronics Technology",
  ],
  "College of Agriculture and Natural Resources": [
    "Bachelor of Science in Agriculture – Crop Science",
    "Bachelor of Science in Agriculture – Animal Science",
    "Bachelor of Science in Environmental Science",
    "Bachelor in Agricultural Technology",
    "Bachelor of Science in Agricultural and Biosystems Engineering",
  ],
  "Institute of Fisheries and Marine Sciences": [
    "Bachelor of Science in Fisheries",
  ],
  "Alternative Track": [
    "Bachelor of Science in Entrepreneurship (Agricultural Production Track)",
  ],
};

const specializations = [
  "Academic",
  "Lifestyle",
  "Fraternity/Sorority",
  "Environmental",
  "Social-Civic",
  "Spiritual or religious",
  "Student government",
  "Adviser Academic Rank",
];

// CollegeCourseDepartments component
const CollegeCourseDepartments = ({ formData, onChange }) => {
  return (
    <div className="flex flex-1 w-full gap-4">
      <div className="flex flex-col gap-1 flex-1 ">
        <label htmlFor="org_department">
          Department <span className="text-red-500">*</span>
        </label>
        <select
          id="org_department"
          name="org_department"
          value={formData.org_department || ""}
          onChange={onChange}
          className="px-3 py-2 border w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select Department</option>
          {Object.keys(departments).map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {formData.org_department && (
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="org_course">
            Course <span className="text-red-500">*</span>
          </label>
          <select
            id="org_course"
            name="org_course"
            value={formData.org_course || ""}
            onChange={onChange}
            className="px-3 py-2 border  w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Course</option>
            {departments[formData.org_department]?.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default function InitialRegistrationComponent({ userData, onComplete }) {
  const [formData, setFormData] = useState({
    adviserName: "",
    adviserEmail: "",
    adviserDepartment: "",
    orgName: "",
    orgAcronym: "",
    orgPresident: "",
    orgEmail: userData.email,
    orgClass: "System-wide", // default selection
    orgDepartment: "",
    orgCourse: "",
    specialization: "",
    userId: userData._id,
  });

  const [errors, setErrors] = useState({});

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

    // Auto-populate adviser department if organization orgClass is "Local"
    if (name === "orgDepartment" && formData.orgClass === "Local") {
      setFormData((prev) => ({
        ...prev,
        orgDepartment: value,
        adviserDepartment: value, // Auto-populate adviser department
      }));
    }
  };

  const handleClassificationChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      orgClass: value,
      // Reset related fields when orgClass changes
      orgDepartment: "",
      orgCourse: "",
      specialization: "",
      adviserDepartment: "", // Reset adviser department
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.adviserName.trim())
      newErrors.adviserName = "Adviser name is required";
    if (!formData.adviserEmail.trim())
      newErrors.adviserEmail = "Adviser email is required";
    if (!formData.adviserDepartment.trim())
      newErrors.adviserDepartment = "Adviser department is required";
    if (!formData.orgName.trim())
      newErrors.orgName = "Organization name is required";
    if (!formData.orgClass)
      newErrors.orgClass = "Organization class is required";
    if (!formData.orgAcronym.trim())
      newErrors.orgAcronym = "Organization acronym is required";
    if (!formData.orgPresident.trim())
      newErrors.orgPresident = "Organization president is required";
    if (!formData.orgEmail.trim())
      newErrors.orgEmail = "Organization email is required";

    // Classification-specific validation
    if (formData.orgClass === "Local") {
      if (!formData.orgDepartment)
        newErrors.orgDepartment = "Organization department is required";
      if (!formData.orgCourse)
        newErrors.orgCourse = "Organization course is required";
    } else if (formData.orgClass === "System-wide") {
      if (!formData.specialization.trim())
        newErrors.specialization = "Specialization is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.adviserEmail && !emailRegex.test(formData.adviserEmail)) {
      newErrors.adviserEmail = "Please enter a valid email address";
    }
    if (formData.orgEmail && !emailRegex.test(formData.orgEmail)) {
      newErrors.orgEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    console.log(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const submitFormData = new FormData();

    if (validateForm()) {
      // Append all text/string fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value && typeof value === "string") {
          submitFormData.append(key, value);
        }
      });

      try {
        const response = await axios.post(
          `${API_ROUTER}/initial-registration`,
          submitFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Success:", response.data);
        onComplete?.();
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("There was an error submitting the form.");
      }
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Building className="mr-3 h-8 w-8" />
              Organization Registration
            </h1>
            <p className="text-blue-100 ">Register your student organization</p>
          </div>

          <div className="p-8 space-y-8 max-h-[80vh] overflow-auto">
            {/* Organization Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Building className="mr-2 h-5 w-5 text-green-600" />
                Organization Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-medium text-gray-700 ">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.orgName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Full organization name"
                  />
                  {errors.orgName && (
                    <p className="text-red-500 text-lg ">{errors.orgName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 ">
                    Acronym *
                  </label>
                  <input
                    type="text"
                    name="orgAcronym"
                    value={formData.orgAcronym}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.orgAcronym ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="ORG"
                  />
                  {errors.orgAcronym && (
                    <p className="text-red-500 text-lg ">{errors.orgAcronym}</p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 ">
                    Organization Email *
                  </label>
                  <input
                    type="email"
                    name="orgEmail"
                    value={formData.orgEmail}
                    readOnly
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.orgEmail ? "border-red-500" : "border-gray-300"
                    } bg-gray-100 cursor-not-allowed`}
                    placeholder="organization@email.com"
                  />
                  {errors.orgEmail && (
                    <p className="text-red-500 text-lg ">{errors.orgEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 ">
                    Organization President *
                  </label>
                  <input
                    type="text"
                    name="orgPresident"
                    value={formData.orgPresident}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.orgPresident ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="President's full name"
                  />
                  {errors.orgPresident && (
                    <p className="text-red-500 text-lg ">
                      {errors.orgPresident}
                    </p>
                  )}
                </div>
              </div>

              {/* Classification Section */}
              <div className="flex flex-col mt-4 w-full md:flex-row gap-6">
                <div className="flex flex-col min-w-fit gap-1 ">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Classification <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {["System-wide", "Local"].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`orgClass${option}`}
                          name="orgClass"
                          value={option}
                          checked={formData.orgClass === option}
                          onChange={handleClassificationChange}
                          className="h-4 w-4 text-blue-600"
                          required
                        />
                        <label
                          htmlFor={`orgClass${option}`}
                          className="text-lg"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.orgClass && (
                    <p className="text-red-500 text-lg ">{errors.orgClass}</p>
                  )}
                </div>

                {/* For Local orgClass, include CollegeCourseDepartments */}
                {formData.orgClass === "Local" && (
                  <div className="flex-1 w-full ">
                    <CollegeCourseDepartments
                      formData={formData}
                      onChange={handleInputChange}
                    />
                    {errors.orgDepartment && (
                      <p className="text-red-500 text-lg ">
                        {errors.orgDepartment}
                      </p>
                    )}
                    {errors.orgCourse && (
                      <p className="text-red-500 text-lg ">
                        {errors.orgCourse}
                      </p>
                    )}
                  </div>
                )}
                {/* For System-wide orgClass */}
                {formData.orgClass === "System-wide" && (
                  <div className="w-full ">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="specialization"
                          className="block text-lg font-medium text-gray-700"
                        >
                          Specialization <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Specialization</option>
                          {specializations.map((spec) => (
                            <option key={spec} value={spec}>
                              {spec}
                            </option>
                          ))}
                        </select>
                        {errors.specialization && (
                          <p className="text-red-500 text-lg ">
                            {errors.specialization}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Adviser Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Adviser Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Adviser Name *
                  </label>
                  <input
                    type="text"
                    name="adviserName"
                    value={formData.adviserName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.adviserName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter adviser's full name"
                  />
                  {errors.adviserName && (
                    <p className="text-red-500 text-lg ">
                      {errors.adviserName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Adviser Email *
                  </label>
                  <input
                    type="email"
                    name="adviserEmail"
                    value={formData.adviserEmail}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.adviserEmail ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="adviser@university.edu"
                  />
                  {errors.adviserEmail && (
                    <p className="text-red-500 text-lg ">
                      {errors.adviserEmail}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Adviser Department *
                  </label>
                  <select
                    name="adviserDepartment"
                    value={formData.adviserDepartment}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.adviserDepartment
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    disabled={
                      formData.orgClass === "Local" && formData.orgDepartment
                    }
                  >
                    <option value="">Select department</option>
                    {Object.keys(departments).map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.adviserDepartment && (
                    <p className="text-red-500 text-lg ">
                      {errors.adviserDepartment}
                    </p>
                  )}
                  {formData.orgClass === "Local" && formData.orgDepartment && (
                    <p className="text-blue-600 text-lg ">
                      Auto-populated from organization department
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200 shadow-lg hover:shadow-xl"
              >
                Register Organization
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
