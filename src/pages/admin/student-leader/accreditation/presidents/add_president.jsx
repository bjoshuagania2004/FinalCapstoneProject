import { Check, CodeSquare } from "lucide-react";
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { departments } from "../../initial-registration";
import axios from "axios";
import { API_ROUTER } from "../../../../../App";

export const PhilippineAddressForm = forwardRef((props, ref) => {
  const [addresses, setAddresses] = useState({
    present: {
      region: "",
      province: "",
      city: "",
      barangay: "",
      purok: "",
      street: "",
      houseNumber: "",
    },
    permanent: {
      region: "",
      province: "",
      city: "",
      barangay: "",
      purok: "",
      street: "",
      houseNumber: "",
    },
  });

  const [sameAsPresent, setSameAsPresent] = useState(false);

  const [dropdownData, setDropdownData] = useState({
    regions: [],
    provinces: [],
    cities: [],
    barangays: [],
  });

  const [loading, setLoading] = useState({
    regions: false,
    provinces: false,
    cities: false,
    barangays: false,
  });

  // API Base URL
  const PSGC_API_BASE = "https://psgc.gitlab.io/api";

  // Load regions on component mount
  useEffect(() => {
    loadRegions();
  }, []);

  // Watch for changes in present address when checkbox is checked
  useEffect(() => {
    if (sameAsPresent) {
      setAddresses((prev) => ({
        ...prev,
        permanent: { ...prev.present },
      }));
    }
  }, [sameAsPresent]);

  const handleSameAsPresentChange = (checked) => {
    setSameAsPresent(checked);
    if (checked) {
      // Copy present address to permanent address
      setAddresses((prev) => ({
        ...prev,
        permanent: { ...prev.present },
      }));
    }
  };

  const loadRegions = async () => {
    const regionCodeToRoman = {
      "01": "Region I",
      "02": "Region II",
      "03": "Region III",
      "04": "Region IV-A",
      17: "Region IV-B",
      "05": "Region V",
      "06": "Region VI",
      "07": "Region VII",
      "08": "Region VIII",
      "09": "Region IX",
      10: "Region X",
      11: "Region XI",
      12: "Region XII",
      13: "Region XIII",
      14: "NCR",
      15: "CAR",
      16: "BARMM",
    };

    setLoading((prev) => ({ ...prev, regions: true }));
    try {
      const response = await fetch(`${PSGC_API_BASE}/regions`);
      const data = await response.json();
      const formattedRegions = data.map((region) => {
        const labelPrefix = regionCodeToRoman[region.code] || region.code;
        return {
          ...region,
          name: `${region.regionName} - ${region.name}`,
        };
      });
      setDropdownData((prev) => ({ ...prev, regions: formattedRegions }));
    } catch (error) {
      console.error("Error loading regions:", error);
    }
    setLoading((prev) => ({ ...prev, regions: false }));
  };

  const loadProvinces = async (regionCode) => {
    setLoading((prev) => ({ ...prev, provinces: true }));
    try {
      const response = await fetch(
        `${PSGC_API_BASE}/regions/${regionCode}/provinces`
      );
      const data = await response.json();
      setDropdownData((prev) => ({ ...prev, provinces: data }));
    } catch (error) {
      console.error("Error loading provinces:", error);
    }
    setLoading((prev) => ({ ...prev, provinces: false }));
  };

  const loadCities = async (provinceCode) => {
    setLoading((prev) => ({ ...prev, cities: true }));
    try {
      const response = await fetch(
        `${PSGC_API_BASE}/provinces/${provinceCode}/cities-municipalities`
      );
      const data = await response.json();
      setDropdownData((prev) => ({ ...prev, cities: data }));
    } catch (error) {
      console.error("Error loading cities:", error);
    }
    setLoading((prev) => ({ ...prev, cities: false }));
  };

  const loadBarangays = async (cityCode) => {
    setLoading((prev) => ({ ...prev, barangays: true }));
    try {
      const response = await fetch(
        `${PSGC_API_BASE}/cities-municipalities/${cityCode}/barangays`
      );
      const data = await response.json();
      console.log(data);
      setDropdownData((prev) => ({ ...prev, barangays: data }));
    } catch (error) {
      console.error("Error loading barangays:", error);
    }
    setLoading((prev) => ({ ...prev, barangays: false }));
  };

  const handleAddressChange = (addressType, field, value) => {
    setAddresses((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value,
      },
    }));

    // If permanent address is being changed directly, uncheck the checkbox
    if (addressType === "permanent" && sameAsPresent) {
      setSameAsPresent(false);
    }

    // If changing present address and checkbox is checked, update permanent too
    if (addressType === "present" && sameAsPresent) {
      setAddresses((prev) => ({
        ...prev,
        permanent: {
          ...prev.permanent,
          [field]: value,
        },
      }));
    }

    // Load dependent dropdowns based on selection
    if (field === "region") {
      loadProvinces(value);
      // Clear dependent fields
      const clearedFields = {
        province: "",
        city: "",
        barangay: "",
        purok: "",
        street: "",
      };

      setAddresses((prev) => ({
        ...prev,
        [addressType]: {
          ...prev[addressType],
          ...clearedFields,
        },
        ...(addressType === "present" &&
          sameAsPresent && {
            permanent: {
              ...prev.permanent,
              ...clearedFields,
            },
          }),
      }));
    } else if (field === "province") {
      loadCities(value);
      // Clear dependent fields
      const clearedFields = {
        city: "",
        barangay: "",
        purok: "",
        street: "",
      };

      setAddresses((prev) => ({
        ...prev,
        [addressType]: {
          ...prev[addressType],
          ...clearedFields,
        },
        ...(addressType === "present" &&
          sameAsPresent && {
            permanent: {
              ...prev.permanent,
              ...clearedFields,
            },
          }),
      }));
    } else if (field === "city") {
      loadBarangays(value);
      // Clear dependent fields
      const clearedFields = {
        barangay: "",
        purok: "",
        street: "",
      };

      setAddresses((prev) => ({
        ...prev,
        [addressType]: {
          ...prev[addressType],
          ...clearedFields,
        },
        ...(addressType === "present" &&
          sameAsPresent && {
            permanent: {
              ...prev.permanent,
              ...clearedFields,
            },
          }),
      }));
    } else if (field === "barangay") {
      // Clear dependent fields
      const clearedFields = {
        purok: "",
        street: "",
      };

      setAddresses((prev) => ({
        ...prev,
        [addressType]: {
          ...prev[addressType],
          ...clearedFields,
        },
        ...(addressType === "present" &&
          sameAsPresent && {
            permanent: {
              ...prev.permanent,
              ...clearedFields,
            },
          }),
      }));
    }
  };

  const getFormData = () => {
    // Get human-readable address data
    const getReadableAddress = (addressType) => {
      const addr = addresses[addressType];
      return {
        region:
          dropdownData.regions.find((r) => r.code === addr.region)?.name || "",
        province:
          dropdownData.provinces.find((p) => p.code === addr.province)?.name ||
          "",
        city: dropdownData.cities.find((c) => c.code === addr.city)?.name || "",
        barangay:
          dropdownData.barangays.find((b) => b.code === addr.barangay)?.name ||
          "",
        purok: addr.purok,
        street: addr.street,
        houseNumber: addr.houseNumber,
        // Full address string
        fullAddress: [
          addr.houseNumber,
          addr.street,
          addr.purok,
          dropdownData.barangays.find((b) => b.code === addr.barangay)?.name,
          dropdownData.cities.find((c) => c.code === addr.city)?.name,
          dropdownData.provinces.find((p) => p.code === addr.province)?.name,
          dropdownData.regions.find((r) => r.code === addr.region)?.name,
        ]
          .filter(Boolean)
          .join(", "),
      };
    };

    return {
      presentAddress: getReadableAddress("present"),
      permanentAddress: getReadableAddress("permanent"),
      sameAsPresent: sameAsPresent,
      // Raw codes for database storage
      rawData: {
        present: addresses.present,
        permanent: addresses.permanent,
      },
    };
  };

  const renderAddressFields = (addressType, title) => {
    const addressData = addresses[addressType];
    const isDisabled = addressType === "permanent" && sameAsPresent;

    return (
      <div className="  rounded-lg ">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">{title}</h4>
          {addressType === "permanent" && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sameAsPresent"
                checked={sameAsPresent}
                onChange={(e) => handleSameAsPresentChange(e.target.checked)}
                className="mr-2 rounded border-black bg-white text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="sameAsPresent" className="text-sm text-gray-600">
                Same as present address
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {/* Region */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              value={addressData.region}
              onChange={(e) =>
                handleAddressChange(addressType, "region", e.target.value)
              }
              className="w-full border border-black bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading.regions || isDisabled}
            >
              <option value="">Select Region</option>
              {dropdownData.regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <select
              value={addressData.province}
              onChange={(e) =>
                handleAddressChange(addressType, "province", e.target.value)
              }
              className="w-full border border-black bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading.provinces || !addressData.region || isDisabled}
            >
              <option value="">Select Province</option>
              {dropdownData.provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* City/Municipality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City/Municipality
            </label>
            <select
              value={addressData.city}
              onChange={(e) =>
                handleAddressChange(addressType, "city", e.target.value)
              }
              className="w-full border border-black bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading.cities || !addressData.province || isDisabled}
            >
              <option value="">Select City/Municipality</option>
              {dropdownData.cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Barangay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Barangay
            </label>
            <select
              value={addressData.barangay}
              onChange={(e) =>
                handleAddressChange(addressType, "barangay", e.target.value)
              }
              className="w-full border border-black bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={loading.barangays || !addressData.city || isDisabled}
            >
              <option value="">Select Barangay</option>
              {dropdownData.barangays.map((barangay) => (
                <option key={barangay.code} value={barangay.code}>
                  {barangay.name}
                </option>
              ))}
            </select>
          </div>

          {/* Purok */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purok/street
            </label>
            <input
              type="text"
              value={addressData.purok}
              onChange={(e) =>
                handleAddressChange(addressType, "purok", e.target.value)
              }
              className="w-full border border-black bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter purok/sitio"
              disabled={isDisabled}
            />
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              house No. / Residence
            </label>
            <input
              type="text"
              value={addressData.street}
              onChange={(e) =>
                handleAddressChange(addressType, "street", e.target.value)
              }
              className="w-full border border-black bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter street name"
              disabled={isDisabled}
            />
          </div>

          {/* House Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              House Number
            </label>
            <input
              type="text"
              value={addressData.houseNumber}
              onChange={(e) =>
                handleAddressChange(addressType, "houseNumber", e.target.value)
              }
              className="w-full border border-black bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter house number"
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
    );
  };

  // Expose the getFormData function to parent component
  useImperativeHandle(ref, () => ({
    getFormData,
  }));

  return (
    <div className="bg-amber-100 p-4 border flex flex-col gap-4 rounded-lg">
      <h3 className="text-lg font-semibold  text-amber-800">
        Address Information
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Present Address */}
        {renderAddressFields("present", "Present Address")}

        {/* Permanent Address */}
        {renderAddressFields("permanent", "Permanent Address")}
      </div>
    </div>
  );
});

export default function AddStudentPresident({
  orgInfo,
  AccreditationId,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    // Name fields
    firstName: "",
    middleName: "",
    lastName: "",

    department: "",
    course: "",
    yearLevel: "",
    birthDate: "",
    age: "",
    sex: "",
    religion: "",
    customReligion: "", // Temporary internal use only

    nationality: "",

    // Birthplace fields
    birthPlace: "",

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
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDone, setIsUploadDone] = useState(false);

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

    const permanentAddressdata = formRef.current.getFormData().permanentAddress;
    const currentAddressdata = formRef.current.getFormData().presentAddress;

    const birthDate = new Date(formData.birthDate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const mergedData = {
      organizationProfile: orgInfo._id,
      organization: orgInfo.organization,
      name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
      department: formData.department,
      course: formData.course,
      year: formData.yearLevel,
      birthDate: formData.birthDate,
      age: age,
      sex: formData.sex,
      religion:
        formData.religion === "Other"
          ? formData.customReligion
          : formData.religion,
      nationality: formData.nationality,
      birthplace: formData.birthPlace,
      currentAddress: currentAddressdata,
      AccreditationId: AccreditationId,
      permanentAddress: permanentAddressdata,
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

    try {
      // Show uploading popup
      setIsUploading(true);
      setIsUploadDone(false);

      // Optional delay to simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axios.post(
        `${API_ROUTER}/addPresident`,
        mergedData
      );
      console.log("Success:", response.data);

      // Show success popup
      setIsUploading(false);
      setIsUploadDone(true);

      // Hide success popup after 3 seconds and call onSuccess
      setTimeout(() => {
        setIsUploadDone(false);
        onSuccess(); // Callback after success
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      alert("An error occurred while uploading.");
    }
  };

  const formRef = useRef();

  return (
    <div className="max-w-3/4 min-w-1/4 min-h-1/4  flex flex-col   items-center max-h-9/10 overflow-auto mx-auto p-6 space-y-6  bg-white shadow-lg rounded-lg">
      {!isUploading && !isUploadDone && (
        <>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            President Profile Form
          </h2>
          <div className="flex flex-col gap-6 ">
            <div className="border p-6 rounded-lg col-span-2 bg-blue-50">
              <h3 className="text-xl font-semibold mb-6 text-blue-800">
                Personal Information
              </h3>

              {/* Name Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                  <label className="block text-sm font-medium text-gray-700">
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
                  <label className="block text-sm font-medium text-gray-700">
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

              {/* Demographic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Birthplace *
                  </label>
                  <input
                    type="text"
                    name="birthplace"
                    value={formData.Birthplace}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    birthDate *
                  </label>
                  <input
                    type="date"
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
                  <label className="block text-sm font-medium text-gray-700">
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
              </div>

              {/* Religion and Nationality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Religion
                  </label>
                  <div className="flex flex-col gap-2 md:flex-row">
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a religion</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Islam">Islam</option>
                      <option value="Hinduism">Hinduism</option>
                      <option value="Buddhism">Buddhism</option>
                      <option value="Judaism">Judaism</option>
                      <option value="Atheism">Atheism</option>
                      <option value="Agnosticism">Agnosticism</option>
                      <option value="Other">Other</option>
                    </select>
                    {formData.religion === "Other" && (
                      <input
                        type="text"
                        name="customReligion"
                        placeholder="Please specify"
                        value={formData.customReligion}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
              </div>

              {/* Academic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Course *
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.department}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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

            {/* Addresses */}
            <PhilippineAddressForm ref={formRef} />
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
                    type="text"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      handleInputChange({
                        target: {
                          name: "contactNo",
                          value: onlyNums,
                        },
                      });
                    }}
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
                    inputMode="numeric"
                    pattern="\d*"
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
              <div className="overflow-auto">
                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="p-2 text-left border">Subject</th>
                      <th className="p-2 text-left border">Place</th>
                      <th className="p-2 text-left border">Time</th>
                      <th className="p-2 text-left border">Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classSchedules.map((cls, index) => (
                      <tr key={index} className="even:bg-white odd:bg-gray-50">
                        <td className="p-2 border">
                          <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={cls.subject}
                            onChange={(e) => handleClassChange(index, e)}
                            className="w-full px-2 py-1.5 rounded focus:ring focus:ring-gray-500 "
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            type="text"
                            name="place"
                            placeholder="Place"
                            value={cls.place}
                            onChange={(e) => handleClassChange(index, e)}
                            className="w-full px-2 py-1.5 rounded focus:ring focus:ring-gray-500 "
                          />
                        </td>
                        <td className="p-2 border">
                          <input
                            type="time"
                            name="time"
                            value={cls.time}
                            onChange={(e) => handleClassChange(index, e)}
                            className="w-full px-2 py-1.5 rounded focus:ring focus:ring-gray-500 "
                          />
                        </td>
                        <td className="p-2 border">
                          <div className="flex gap-2">
                            <select
                              name="day"
                              value={cls.day}
                              onChange={(e) => handleClassChange(index, e)}
                              className="w-full px-2 py-1.5 rounded focus:ring focus:ring-gray-500 "
                            >
                              <option value="" disabled>
                                Select Day
                              </option>
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                            </select>
                            {classSchedules.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeClassSchedule(index)}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                              >
                                ×
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

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 focus:ring-4 focus:ring-blue-300"
            >
              Submit Application
            </button>
          </div>
        </>
      )}

      {isUploading && (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-lg font-semibold text-gray-800">
            Uploading...
          </div>
          {/* Optionally add spinner */}
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isUploadDone && (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-lg font-semibold text-gray-800">
            Upload Complete
          </div>
          {/* Optionally add spinner */}
          <div className="p-4 rounded-full  bg-green-200 text-green-700 ">
            <Check size={24} className="font-bold " />
          </div>
        </div>
      )}
    </div>
  );
}
