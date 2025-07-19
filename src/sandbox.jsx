import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

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
      console.log(data);
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
      console.log(data);
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
      console.log(data);
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
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">{title}</h4>
          {addressType === "permanent" && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sameAsPresent"
                checked={sameAsPresent}
                onChange={(e) => handleSameAsPresentChange(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="sameAsPresent" className="text-sm text-gray-600">
                Same as present address
              </label>
            </div>
          )}
        </div>

        <div className="space-y-3">
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
    <div className="max-w-6xl mx-auto p-6">
      <h3 className="text-lg font-semibold pt-4 mb-2 text-gray-800">
        Address Information
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Present Address */}
        {renderAddressFields("present", "Present Address")}

        {/* Permanent Address */}
        {renderAddressFields("permanent", "Permanent Address")}
      </div>
    </div>
  );
});

// Example Usage Component
const ExampleUsage = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const formRef = useRef();

  const handleSubmit = () => {
    const data = formRef.current.getFormData();
    console.log("Submitted data:", data);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Philippine Address Form Example
          </h1>

          <div>
            <PhilippineAddressForm ref={formRef} />

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Submit Address
              </button>
            </div>
          </div>

          {/* Display submitted data */}
          {submittedData && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Submitted Address Data (also logged to console):
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">
                    Present Address:
                  </h3>
                  <p className="text-gray-600">
                    {submittedData.presentAddress.fullAddress}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">
                    Permanent Address:
                  </h3>
                  <p className="text-gray-600">
                    {submittedData.permanentAddress.fullAddress}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">
                    Same as Present:
                  </h3>
                  <p className="text-gray-600">
                    {submittedData.sameAsPresent ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;
