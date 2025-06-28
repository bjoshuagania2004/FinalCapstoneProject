import { CodeSquare } from "lucide-react";
import React, { useState, useEffect } from "react";
import { departments } from "../../student_leader_initial_registration";
import axios from "axios";
import { API_ROUTER } from "../../../../../App";
const PresidentForm = ({ orgInfo }) => {
  const [formData, setFormData] = useState({
    // Name fields
    firstName: "",
    middleName: "",
    lastName: "",

    department: "",
    course: "",
    age: "",
    sex: "",
    religion: "",
    nationality: "",

    // Birthplace fields
    birthStreet: "",
    birthBarangay: "",
    birthCity: "",
    birthProvince: "",
    birthCountry: "",

    // Present Address fields
    presentStreet: "",
    presentBarangay: "",
    presentCity: "",
    presentProvince: "",
    presentCountry: "",

    // Permanent Address fields
    permanentStreet: "",
    permanentBarangay: "",
    permanentCity: "",
    permanentProvince: "",
    permanentCountry: "",

    // Guardian fields
    guardianFirstName: "",
    guardianMiddleName: "",
    guardianLastName: "",

    addressPhoneNo: "", // Optional
    sourceOfFinancialSupport: "",
    contactNo: "",
    facebookAccount: "",
  });

  useEffect(() => {
    if (orgInfo) {
      setFormData((prev) => ({
        ...prev,
        department: orgInfo.orgDepartment || "",
        course: orgInfo.orgCourse || "",
      }));
    }
  }, [orgInfo]);

  const [classSchedules, setClassSchedules] = useState([
    { subject: "", place: "", time: "", day: "" },
  ]);

  const [talentSkills, setTalentSkills] = useState([{ skill: "", level: "" }]);

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Financial support options
  const financialSupportOptions = [
    "Parents/Family",
    "Scholarship",
    "Part-time Job",
    "Student Loan",
    "Government Aid",
    "Self-funded",
    "Other",
  ];

  // Skill levels
  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  // Fetch countries for nationality dropdown
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,demonyms"
        );
        const data = await response.json();

        const nationalities = data
          .map((country) => country.demonyms?.eng?.m) // Get English masculine demonym
          .filter(Boolean) // Remove any undefined/null
          .sort(); // Sort alphabetically

        // Remove duplicates using Set
        const uniqueNationalities = [...new Set(nationalities)];

        const countryList = uniqueNationalities.map((nationality) => ({
          value: nationality,
          label: nationality,
        }));

        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
        // Fallback list
        setCountries([
          { value: "Philippines", label: "Philippines" },
          { value: "United States", label: "United States" },
          { value: "Canada", label: "Canada" },
          { value: "United Kingdom", label: "United Kingdom" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClassChange = (index, e) => {
    const updated = [...classSchedules];
    updated[index][e.target.name] = e.target.value;
    setClassSchedules(updated);

    // Add new blank row if the current one is fully filled
    if (
      index === classSchedules.length - 1 &&
      updated[index].subject &&
      updated[index].place &&
      updated[index].time &&
      updated[index].day
    ) {
      setClassSchedules([
        ...updated,
        { subject: "", place: "", time: "", day: "" },
      ]);
    }
  };

  const handleSkillChange = (index, e) => {
    const updated = [...talentSkills];
    updated[index][e.target.name] = e.target.value;
    setTalentSkills(updated);

    // Add new blank row if the current one is fully filled
    if (
      index === talentSkills.length - 1 &&
      updated[index].skill &&
      updated[index].level
    ) {
      setTalentSkills([...updated, { skill: "", level: "" }]);
    }
  };

  const removeClassSchedule = (index) => {
    if (classSchedules.length > 1) {
      setClassSchedules(classSchedules.filter((_, i) => i !== index));
    }
  };

  const removeSkill = (index) => {
    if (talentSkills.length > 1) {
      setTalentSkills(talentSkills.filter((_, i) => i !== index));
    }
  };

  const validateFacebookUrl = (url) => {
    const fbPattern =
      /^(https?:\/\/)?(www\.)?(facebook|fb|m\.facebook)\.com\/.+/i;
    return fbPattern.test(url) || url === "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Facebook URL
    if (
      formData.facebookAccount &&
      !validateFacebookUrl(formData.facebookAccount)
    ) {
      alert("Please enter a valid Facebook URL");
      return;
    }

    // Merge split fields for final payload
    const mergedData = {
      organizationProfile: orgInfo._id,
      organization: orgInfo.organization,
      name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
      courseYear:
        `${formData.department}, ${formData.course}, ${formData.yearLevel}`
          .replace(/,\s*,/g, ",")
          .replace(/^,\s*|,\s*$/g, ""),
      age: formData.age,
      sex: formData.sex,
      religion: formData.religion,
      nationality: formData.nationality,
      birthplace:
        `${formData.birthStreet}, ${formData.birthBarangay}, ${formData.birthCity}, ${formData.birthProvince}, ${formData.birthCountry}`
          .replace(/,\s*,/g, ",")
          .replace(/^,\s*|,\s*$/g, ""),
      presentAddress:
        `${formData.presentStreet}, ${formData.presentBarangay}, ${formData.presentCity}, ${formData.presentProvince}, ${formData.presentCountry}`
          .replace(/,\s*,/g, ",")
          .replace(/^,\s*|,\s*$/g, ""),
      permanentAddress:
        `${formData.permanentStreet}, ${formData.permanentBarangay}, ${formData.permanentCity}, ${formData.permanentProvince}, ${formData.permanentCountry}`
          .replace(/,\s*,/g, ",")
          .replace(/^,\s*|,\s*$/g, ""),
      parentGuardian:
        `${formData.guardianFirstName} ${formData.guardianMiddleName} ${formData.guardianLastName}`.trim(),
      addressPhoneNo: formData.addressPhoneNo || null,
      sourceOfFinancialSupport: formData.sourceOfFinancialSupport,
      talentSkills: talentSkills.filter((skill) => skill.skill && skill.level),
      contactNo: formData.contactNo,
      facebookAccount: formData.facebookAccount,
      classSchedule: classSchedules.filter(
        (cls) => cls.subject && cls.place && cls.time && cls.day
      ),
    };

    console.log("Final Payload:", mergedData);

    // Uncomment below to send to backend

    try {
      const response = await axios.post(
        `${API_ROUTER}/addPresident`,
        mergedData
      );
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const renderAddressFields = (prefix, title) => (
    <div className="border p-4 rounded-lg bg-gray-50">
      <h4 className="font-medium mb-3 text-gray-700">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Street/House No.
          </label>
          <input
            type="text"
            name={`${prefix}Street`}
            value={formData[`${prefix}Street`]}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Barangay
          </label>
          <input
            type="text"
            name={`${prefix}Barangay`}
            value={formData[`${prefix}Barangay`]}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            City/Municipality
          </label>
          <input
            type="text"
            name={`${prefix}City`}
            value={formData[`${prefix}City`]}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Province/State
          </label>
          <input
            type="text"
            name={`${prefix}Province`}
            value={formData[`${prefix}Province`]}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600">
            Country
          </label>
          <input
            type="text"
            name={`${prefix}Country`}
            value={formData[`${prefix}Country`]}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        President Profile Form
      </h2>

      {/* Personal Information */}
      <div className="border p-4 rounded-lg bg-blue-50">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">
          Personal Information
        </h3>

        {/* Name Section */}
        <div className="mb-4">
          <h4 className="font-medium mb-3 text-gray-700">Full Name</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Age *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              min="1"
              max="120"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Sex *
            </label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Religion
            </label>
            <input
              type="text"
              name="religion"
              value={formData.religion}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Nationality *
            </label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">
                {loading ? "Loading..." : "Select Nationality..."}
              </option>
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            {/* Department Selection */}
            <div className="">
              <label className="block text-sm font-medium text-gray-600">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Department...</option>
                {Object.keys(departments).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Selection based on Department */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Course *
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                disabled={!formData.department}
              >
                <option value="">Select Course...</option>
                {formData.department &&
                  departments[formData.department].map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
              </select>
            </div>

            {/* Year Level */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Year Level *
              </label>
              <select
                name="yearLevel"
                value={formData.yearLevel}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Year...</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Address Information
        </h3>

        {/* Birthplace */}
        {renderAddressFields("birth", "Birthplace")}

        {/* Present Address */}
        {renderAddressFields("present", "Present Address")}

        {/* Permanent Address */}
        {renderAddressFields("permanent", "Permanent Address")}
      </div>

      {/* Guardian Information */}
      <div className="border p-4 rounded-lg bg-yellow-50">
        <h3 className="text-lg font-semibold mb-4 text-yellow-800">
          Guardian Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Guardian First Name
            </label>
            <input
              type="text"
              name="guardianFirstName"
              value={formData.guardianFirstName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Guardian Middle Name
            </label>
            <input
              type="text"
              name="guardianMiddleName"
              value={formData.guardianMiddleName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Guardian Last Name
            </label>
            <input
              type="text"
              name="guardianLastName"
              value={formData.guardianLastName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Address Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="addressPhoneNo"
            value={formData.addressPhoneNo}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      {/* Financial & Contact Information */}
      <div className="border p-4 rounded-lg bg-purple-50">
        <h3 className="text-lg font-semibold mb-4 text-purple-800">
          Financial & Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Source of Financial Support *
            </label>
            <select
              name="sourceOfFinancialSupport"
              value={formData.sourceOfFinancialSupport}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select...</option>
              {financialSupportOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Contact Number *
            </label>
            <input
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Facebook Account (URL)
            </label>
            <input
              type="url"
              name="facebookAccount"
              value={formData.facebookAccount}
              onChange={handleInputChange}
              placeholder="https://facebook.com/your-profile"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Talents & Skills */}
      <div className="border p-4 rounded-lg bg-indigo-50">
        <h3 className="text-lg font-semibold mb-4 text-indigo-800">
          Talents & Skills
        </h3>
        {talentSkills.map((skill, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              name="skill"
              placeholder="Skill/Talent"
              value={skill.skill}
              onChange={(e) => handleSkillChange(index, e)}
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
            />
            <select
              name="level"
              value={skill.level}
              onChange={(e) => handleSkillChange(index, e)}
              className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Level</option>
              {skillLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {talentSkills.length > 1 && (
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:ring-2 focus:ring-red-500"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Class Schedule */}
      <div className="border p-4 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Class Schedule
        </h3>
        {classSchedules.map((cls, index) => (
          <div
            key={index}
            className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2"
          >
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={cls.subject}
              onChange={(e) => handleClassChange(index, e)}
              className="p-2 border rounded focus:ring-2 focus:ring-gray-500"
            />
            <input
              type="text"
              name="place"
              placeholder="Place"
              value={cls.place}
              onChange={(e) => handleClassChange(index, e)}
              className="p-2 border rounded focus:ring-2 focus:ring-gray-500"
            />
            <input
              type="text"
              name="time"
              placeholder="Time"
              value={cls.time}
              onChange={(e) => handleClassChange(index, e)}
              className="p-2 border rounded focus:ring-2 focus:ring-gray-500"
            />
            <div className="flex gap-1">
              <input
                type="text"
                name="day"
                placeholder="Day"
                value={cls.day}
                onChange={(e) => handleClassChange(index, e)}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-gray-500"
              />
              {classSchedules.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeClassSchedule(index)}
                  className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 focus:ring-4 focus:ring-blue-300"
      >
        Submit Application
      </button>
    </div>
  );
};

export default PresidentForm;
