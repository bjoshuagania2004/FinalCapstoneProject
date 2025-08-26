import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../../App";
import { X } from "lucide-react";
import {
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export function SduPresidentOverview({ onSelectOrg }) {
  const [presidentList, setPresidentList] = useState([]);
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    const fetchPresident = async () => {
      try {
        const res = await axios.get(`${API_ROUTER}/getPresidents`);

        console.log(res.data);
        setPresidentList(res.data);
      } catch (error) {
        console.error("Failed to fetch president data", error);
      }
    };

    fetchPresident();
  }, []);

  // Filter presidents based on selected filter
  const filteredPresidents = presidentList.filter((president) => {
    switch (filterBy) {
      case "approved":
        return president.overAllStatus === "Approved";
      case "pending":
        return president.overAllStatus === "Pending";
      case "rejected":
        return president.overAllStatus === "Rejected";
      case "active_org":
        return president.organizationProfile.isActive;
      case "inactive_org":
        return !president.organizationProfile.isActive;
      default:
        return true; // "all"
    }
  });

  // Chart data calculations
  const statusData = presidentList.reduce((acc, president) => {
    const status = president.overAllStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusData).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const yearData = presidentList.reduce((acc, president) => {
    const year = president.year;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(yearData).map(([year, count]) => ({
    year,
    count,
  }));
  // Step 1: Prepare department data
  const departmentCounts = presidentList.reduce((acc, p) => {
    acc[p.department] = (acc[p.department] || 0) + 1;
    return acc;
  }, {});

  const departmentData = Object.entries(departmentCounts).map(
    ([dept, count]) => ({
      department: dept,
      count,
    })
  );

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  if (presidentList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading president data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto flex flex-col gap-4 bg-gray-100 p-6">
      <h1 className="text-3xl font-bold  text-center text-gray-900 mb-2">
        Student Development Unit President Overview
      </h1>

      <div className="flex w-full justify-between gap-4">
        <div className="bg-white rounded-2xl w-full flex items-center shadow-md p-4">
          <Users className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Total Presidents
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {presidentList.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl w-full flex items-center shadow-md p-4">
          <Award className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Active Organizations
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {
                presidentList.filter((p) => p.organizationProfile.isActive)
                  .length
              }
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl w-full flex items-center shadow-md p-4">
          <Calendar className="h-8 w-8 text-orange-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-gray-900">
              {
                presidentList.filter((p) => p.overAllStatus === "Pending")
                  .length
              }
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl w-full flex items-center shadow-md p-4">
          {" "}
          <BarChart3 className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-gray-900">
              {
                presidentList.filter((p) => p.overAllStatus === "Approved")
                  .length
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Year Level Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
          {" "}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="department"
                className="text-xs"
                interval={0}
                textAnchor="end"
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
          {" "}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-between  ">
        <h1 className="text-3xl font-bold  text-center text-gray-900 ">
          PRESIDENTS
        </h1>

        {/* Filter Dropdown */}
        <div className="flex justify-center ">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Presidents ({presidentList.length})</option>
            <option value="approved">
              Approved (
              {
                presidentList.filter((p) => p.overAllStatus === "Approved")
                  .length
              }
              )
            </option>
            <option value="pending">
              Pending (
              {
                presidentList.filter((p) => p.overAllStatus === "Pending")
                  .length
              }
              )
            </option>
            <option value="rejected">
              Rejected (
              {
                presidentList.filter((p) => p.overAllStatus === "Rejected")
                  .length
              }
              )
            </option>
            <option value="active_org">
              Active Organizations (
              {
                presidentList.filter((p) => p.organizationProfile.isActive)
                  .length
              }
              )
            </option>
            <option value="inactive_org">
              Inactive Organizations (
              {
                presidentList.filter((p) => !p.organizationProfile.isActive)
                  .length
              }
              )
            </option>
          </select>
        </div>
      </div>

      {/* President Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
        {filteredPresidents.map((president) => (
          <div
            key={president._id}
            className="bg-white  rounded-lg shadow-md overflow-hidden"
            onClick={() => {
              console.log(president.organizationProfile._id);
              onSelectOrg(president.organizationProfile);
            }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    {president.profilePicture ? (
                      <img
                        src={`${DOCU_API_ROUTER}/${president.organizationProfile._id}/${president.profilePicture}`}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {president.name}
                    </h3>
                    <p className="text-sm text-gray-600">{president.course}</p>
                    <p className="text-sm text-gray-500">{president.year}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      president.overAllStatus === "Approved"
                        ? "bg-green-100 text-green-800"
                        : president.overAllStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {president.overAllStatus}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      president.organizationProfile.isActive
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {president.organizationProfile.isActive
                      ? "Active Org"
                      : "Inactive Org"}
                  </span>
                </div>
              </div>

              {/* Organization Info */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {president.organizationProfile.orgName} (
                  {president.organizationProfile.orgAcronym})
                </h4>
                <p className="text-sm text-gray-600">
                  {president.organizationProfile.orgDepartment}
                </p>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Age: {president.age}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{president.sex}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {president.nationality}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {president.contactNo}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="mb-4">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Present Address:
                    </p>
                    <p className="text-sm text-gray-600">
                      {president.presentAddress.fullAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {president.talentSkills && president.talentSkills.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Skills & Talents:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {president.talentSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md"
                      >
                        {skill.skill} ({skill.level})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Class Schedule */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Class Schedule:
                </h5>
                <div className="space-y-2">
                  {president.classSchedule.map((schedule) => (
                    <div
                      key={schedule._id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {schedule.subject}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          @ {schedule.place}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {schedule.day}
                        </div>
                        <div className="text-xs text-gray-500">
                          {schedule.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Financial Support: {president.sourceOfFinancialSupport}
                </span>
                <span className="text-xs text-gray-500">
                  Updated: {new Date(president.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredPresidents.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No presidents found for the selected filter
          </p>
        </div>
      )}
    </div>
  );
}
export function SduPresident({ selectedOrg }) {
  const [presidentData, setPresidentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [noPresidentFound, setNoPresidentFound] = useState(false);
  const [showPopup, setShowPopup] = useState({
    show: false,
    type: "",
    member: null,
  });

  const [isManagePresidentProfileOpen, setManagePresidentProfileOpen] =
    useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setPresidentData(null);
    setNoPresidentFound(false);

    if (!selectedOrg?.orgPresident) {
      setNoPresidentFound(true);
      return;
    }

    const fetchPresident = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${API_ROUTER}/getPresident/${selectedOrg.orgPresident}`
        );

        console.log(res);
        setPresidentData(res.data);
      } catch (error) {
        console.error("Failed to fetch president data", error);
        setNoPresidentFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresident();
  }, [selectedOrg]);

  const handleButtonClick = (action) => {
    console.log("Button clicked:", action);
    setShowPopup({ show: true, type: action });
  };

  if (isLoading) {
    return <p className="text-gray-500">Loading president data...</p>;
  }

  if (noPresidentFound) {
    return (
      <div className="flex h-full w-full items-center justify-center text-center">
        <p className="text-red-500 font-semibold">
          No president found for this organization
        </p>
      </div>
    );
  }

  if (!presidentData) {
    return null;
  }

  const {
    name,
    profilePicture,
    department,
    course,
    year,
    age,
    sex,
    religion,
    nationality,
    birthplace,
    presentAddress,
    parentGuardian,
    sourceOfFinancialSupport,
    talentSkills,
    contactNo,
    overAllStatus,
    addressPhoneNo,
    facebookAccount,
    classSchedule,
  } = presidentData;

  return (
    <div className="p-4 ">
      <div className="">
        <div className="border-b pb-4  flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 ">
            Organization President
          </h2>

          <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
              onClick={() => setManagePresidentProfileOpen((prev) => !prev)}
              className={`px-4 py-2 bg-cnsc-primary-color w-48 text-white transition-colors hover:bg-cnsc-primary-color-dark ${
                isManagePresidentProfileOpen ? "rounded-t-lg" : "rounded-lg"
              }`}
            >
              Manage President Profile
            </button>

            {isManagePresidentProfileOpen && (
              <div className="absolute right-0 w-48 bg-white border rounded-b-lg shadow-lg z-10">
                <button
                  onClick={() => handleButtonClick("approve")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleButtonClick("notes")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  Revision Notes
                </button>
                <button
                  onClick={() => handleButtonClick("history")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  View Previous Presidents
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex mt-2 mb-4 items-center p-4  gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
            {profilePicture ? (
              <img
                src={`${DOCU_API_ROUTER}/${selectedOrg._id}/${profilePicture}`}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-indigo-700">{name}</h3>
            <p className="text-gray-600">{department}</p>
            <p className="text-gray-600">
              {course} • {year}
            </p>
            <h3 className=" text-indigo-700">Status: {overAllStatus}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mt-4text-sm text-gray-700">
          <div>
            <h4 className="text-lg font-medium text-indigo-600 ">
              Personal Information
            </h4>
            <p>
              <strong>Age:</strong> {age}
            </p>
            <p>
              <strong>Sex:</strong> {sex}
            </p>
            <p>
              <strong>Religion:</strong> {religion}
            </p>
            <p>
              <strong>Nationality:</strong> {nationality}
            </p>
            <p>
              <strong>Birthplace:</strong> {birthplace || "N/A"}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-indigo-600 ">Address</h4>
            <p>
              <strong>Present:</strong> {presentAddress?.fullAddress || "N/A"}
            </p>
            <p>
              <strong>Contact No.:</strong> {contactNo || "N/A"}
            </p>
            <p>
              <strong>Landline:</strong> {addressPhoneNo || "N/A"}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-indigo-600 ">
              Family / Support
            </h4>
            <p>
              <strong>Parent/Guardian:</strong> {parentGuardian || "N/A"}
            </p>
            <p>
              <strong>Financial Support:</strong>{" "}
              {sourceOfFinancialSupport || "N/A"}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-indigo-600 ">
              Social & Skills
            </h4>
            <p>
              <strong>Facebook:</strong>{" "}
              {facebookAccount ? (
                <a
                  href={facebookAccount}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {facebookAccount}
                </a>
              ) : (
                "N/A"
              )}
            </p>
            <div className="flex flex-wrap">
              <strong className="text-lg font-medium text-indigo-600 ">
                Skills:
              </strong>
              <ul className="list-disc ml-5">
                {talentSkills?.length > 0 ? (
                  talentSkills.map((skillObj, idx) => (
                    <li key={idx}>
                      {skillObj.skill} ({skillObj.level})
                    </li>
                  ))
                ) : (
                  <li>No skills listed</li>
                )}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-indigo-600 mb-2">
              Class Schedule
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border">Subject</th>
                    <th className="px-4 py-2 border">Place</th>
                    <th className="px-4 py-2 border">Time</th>
                    <th className="px-4 py-2 border">Day</th>
                  </tr>
                </thead>
                <tbody>
                  {classSchedule?.length > 0 ? (
                    classSchedule.map((sched, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 border">{sched.subject}</td>
                        <td className="px-4 py-2 border">{sched.place}</td>
                        <td className="px-4 py-2 border">{sched.time}</td>
                        <td className="px-4 py-2 border">{sched.day}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-2 border text-center">
                        No schedule available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showPopup.show && (
        <div className="absolute  top-0 left-0 z-11 w-full h-full flex bg-black/20 items-center justify-center">
          <div className="relative h-fit w-fit px-12 py-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Manage President Profile
            </h3>
            <X
              size={20}
              onClick={() =>
                setShowPopup({ show: false, type: "", member: null })
              }
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
            />

            {showPopup.type === "approve" && (
              <ApprovePresidentProfile
                presidentData={presidentData}
                setShowPopup={setShowPopup}
              />
            )}

            {showPopup.type === "notes" && (
              <RevisePresidentProfile
                presidentData={presidentData}
                setShowPopup={setShowPopup}
              />
            )}
            {showPopup.type === "history" && (
              <HistoryPresidents orgId={selectedOrg.organization} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApprovePresidentProfile({
  presidentData,
  setShowPopup,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(""); // for success/error message
  const [showConfirmation, setShowConfirmation] = useState(false); // toggle popup

  const HandleSubmitApprovalOfPresidentProfile = async () => {
    console.log(
      "Submitting approval for president profile:",
      presidentData._id
    );
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${API_ROUTER}/approvePresidentProfile/${presidentData._id}`
      );
      console.log("Approval response:", res.data);

      setConfirmationMessage("Approved successfully!");
      setShowConfirmation(true);

      // auto-close popup after 1s
      setTimeout(() => {
        setShowConfirmation(false);
        setShowPopup({ show: false, type: "", member: null });
      }, 1000);
    } catch (error) {
      console.error("Failed to approve president profile", error);

      setConfirmationMessage("❌ Failed to approve president profile.");
      setShowConfirmation(true);

      // auto-close popup after 1s
      setTimeout(() => {
        setShowConfirmation(false);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const CancelSubmissionOfPresidentProfile = () => {
    console.log("Cancelling submission for president profile");
    setShowPopup({ show: false, type: "", member: null });
  };

  return (
    <div className="flex flex-col gap-2 w-full justify-start">
      <h1 className="text-lg font-semibold text-gray-800">
        Approve President Profile of {presidentData?.name}?
      </h1>

      <button
        onClick={HandleSubmitApprovalOfPresidentProfile}
        className="border px-4 py-2 bg-green-500 text-white rounded"
        disabled={isLoading}
      >
        {isLoading ? "Approving..." : "Approve"}
      </button>

      <button
        onClick={CancelSubmissionOfPresidentProfile}
        className="border px-4 py-2 bg-gray-300 text-black rounded"
        disabled={isLoading}
      >
        Cancel
      </button>

      {/* Confirmation popup */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white flex items-center justify-center  h-auto aspect-square  px-6 py-4 rounded shadow-lg">
            <p className="text-center text-lg">{confirmationMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function RevisePresidentProfile({ presidentData, setShowPopup }) {
  const [isLoading, setIsLoading] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");

  const HandleSubmitApprovalOfPresidentProfile = async () => {
    console.log(
      "Submitting revision for president profile:",
      presidentData._id,
      "Notes:",
      revisionNotes
    );
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${API_ROUTER}/revisionPresidentProfile/${presidentData._id}`,
        { revisionNotes, status: "Revision From the SDU" } // Send notes to backend
      );
      console.log("Revision response:", res.data);
      setShowPopup({ show: false, type: "", member: null });
    } catch (error) {
      console.error("Failed to revise president profile", error);
      alert("Failed to submit revision notes.");
    } finally {
      setIsLoading(false);
    }
  };

  const CancelSubmissionOfPresidentProfile = () => {
    console.log("Cancelling revision for president profile");
    setShowPopup({ show: false, type: "", member: null });
  };

  return (
    <div className="flex flex-col gap-3 w-full justify-start">
      <h1 className="text-lg font-semibold text-gray-800">
        Send Revision Notes for {presidentData?.name}
      </h1>

      <textarea
        className="border rounded p-2 w-full min-h-[100px]"
        placeholder="Enter your revision notes here..."
        value={revisionNotes}
        onChange={(e) => setRevisionNotes(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          onClick={HandleSubmitApprovalOfPresidentProfile}
          className="border px-4 py-2 bg-green-500 text-white rounded"
          disabled={isLoading || !revisionNotes.trim()}
        >
          {isLoading ? "Sending..." : "Send Notes"}
        </button>
        <button
          onClick={CancelSubmissionOfPresidentProfile}
          className="border px-4 py-2 bg-gray-300 text-black rounded"
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function HistoryPresidents({ orgId }) {
  const [presidents, setPresidents] = useState([]);

  useEffect(() => {
    const fetchPresident = async () => {
      try {
        const res = await axios.get(
          `${API_ROUTER}/getPreviousPresident/${orgId}`
        );

        // Store data directly
        setPresidents(res.data);
      } catch (error) {
        console.error("Failed to fetch president data", error);
      }
    };

    fetchPresident();
  }, [orgId]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Previous Presidents</h2>
      <ul className="space-y-2">
        {presidents.map((p) => (
          <li
            key={p._id}
            className="p-3 border rounded-md shadow-sm bg-white flex justify-between"
          >
            <span>{p.name}</span>
            <span className="text-sm text-gray-600">
              {formatDate(p.createdAt)} - {formatDate(p.updatedAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
