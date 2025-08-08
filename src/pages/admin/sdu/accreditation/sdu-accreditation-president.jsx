import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_ROUTER } from "../../../../App";
import { X } from "lucide-react";

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

    // You can implement action-specific behavior here
  };

  if (isLoading) {
    return <p className="text-gray-500">Loading president data...</p>;
  }

  if (noPresidentFound) {
    return (
      <p className="text-red-500 font-semibold">
        No president found for this organization.
      </p>
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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div>
        <div className="border-b border-gray-200 mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Organization President
          </h2>

          <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
              onClick={() => setManagePresidentProfileOpen((prev) => !prev)}
              className={`px-4 py-2 bg-cnsc-primary-color w-48 text-white transition-colors hover:bg-cnsc-primary-color-dark ${
                isManagePresidentProfileOpen ? "rounded-t-lg" : "rounded-lg"
              }`}
            >
              Manage Roster
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

        <div className="flex gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
            {profilePicture ? (
              <img
                src={`/${selectedOrg._id}/${profilePicture}`}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm text-gray-700">
          <div>
            <h4 className="text-lg font-medium text-indigo-600 mb-2">
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
            <h4 className="text-lg font-medium text-indigo-600 mb-2">
              Address
            </h4>
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
            <h4 className="text-lg font-medium text-indigo-600 mb-2">
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
            <h4 className="text-lg font-medium text-indigo-600 mb-2">
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
            <div className="mt-2">
              <strong>Skills:</strong>
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

            {showPopup.type === "notes" && <RevisePresidentProfile />}
            {showPopup.type === "history" && <HistoryPresidents />}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApprovePresidentProfile({
  presidentData,
  setShowPopup,
  setPresidentData,
}) {
  const [isLoading, setIsLoading] = useState(false);

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
      setShowPopup({ show: false, type: "", member: null }); // close popup on success
    } catch (error) {
      console.error("Failed to approve president profile", error);
      alert("Failed to approve president profile.");
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
    </div>
  );
}

function RevisePresidentProfile() {
  return <>Revision</>;
}
function HistoryPresidents() {
  return <>Revision</>;
}

export function SduPresidentOverview() {
  return <>without President</>;
}
