import { useEffect, useState } from "react";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../../App";
import axios from "axios";
import { MoreHorizontal, Search } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { DonePopUp } from "../../../../components/components";

export function AdviserRosterData({ orgData }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [revisionModal, setRevisionModal] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [incompleteModal, setIncompleteModal] = useState(false);
  const [popup, setPopup] = useState(null);

  const [rosterData, setRosterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ search state
  const [message, setMessage] = useState(
    `Dear ${orgData.orgName},\n\nWe kindly request you to complete your roster list as part of the accreditation process. Please ensure that all required members and details are submitted at the earliest convenience.\n\nThank you for your cooperation.\n\nSincerely,\nAdviser`
  );
  const [subject, setSubject] = useState("Notification for Roster Lists");

  const fetchRosterMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_ROUTER}/getRosterMembers/${orgData._id}`
      );
      setRosterData(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch organization info:", err);
      setError("Failed to load roster members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orgData._id) {
      fetchRosterMembers();
    }
  }, [orgData._id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const SendNotification = async () => {
    if (!message.trim()) {
      alert("Message cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_ROUTER}/sendNotificationRoster`,
        {
          organizationId: orgData._id,
          subject,
          message,
        }
      );

      setPopup({
        type: "success",
        message: "Your action has been sent successfully!",
      });
      setError(null);
    } catch (err) {
      console.error("❌ Failed to send notification:", err.response?.data);
      setError("Failed to send notification");
      setPopup({
        type: "error",
        message: "Something went wrong while processing your request.",
      });
    } finally {
      setLoading(false);
      setAlertModal(false);
      setIncompleteModal(false);
    }
  };

  const handleExportExcel = async () => {
    if (!rosterMembers || rosterMembers.length === 0) {
      alert("No roster data to export.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Roster Members");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Position", key: "position", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Contact Number", key: "contactNumber", width: 20 },
      { header: "Address", key: "address", width: 40 },
      { header: "Birth Date", key: "birthDate", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ];

    rosterMembers.forEach((member) => {
      worksheet.addRow({
        name: member.name,
        position: member.position,
        email: member.email,
        contactNumber: member.contactNumber,
        address: member.address,
        birthDate: member.birthDate
          ? new Date(member.birthDate).toLocaleDateString()
          : "Not provided",
        status: member.status,
      });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDCE6F1" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "RosterMembers.xlsx");
    setExportModal(false);
  };

  const handleApproval = async ({ status, revisionNotes }) => {
    if (!rosterData?.roster?.isComplete) {
      setIncompleteModal(true);
      return;
    }

    try {
      const payload = { overAllStatus: status };
      if (revisionNotes && revisionNotes.trim() !== "") {
        payload.revisionNotes = revisionNotes;
      }

      const response = await axios.post(
        `${API_ROUTER}/postApproveRoster/${rosterData.roster._id}`,
        payload
      );

      setPopup({
        type: "success",
        message: "Your action has been sent successfully!",
      });
      setError(null);
    } catch (err) {
      setPopup({
        type: "error",
        message: "Something went wrong while processing your request.",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading roster members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleDropdownAction = (id) => {
    setShowDropdown(false);

    if (id === "revision") {
      setRevisionModal(true);
    } else if (id === "Approval") {
      setApprovalModal(true);
    } else if (id === "export") {
      setExportModal(true);
    }
  };

  const rosterMembers = rosterData?.rosterMembers || [];

  // ✅ Filter roster based on search query
  const filteredRoster = rosterMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dropdownItems = [
    { id: "revision", label: "Revision of Roster" },
    { id: "Approval", label: "Approval of Roster" },
    { id: "export", label: "Export Roster as Spread Sheet" },
  ];

  return (
    <div className="flex p-4 flex-col bg-gray-50 h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 w-full bg-gray-200 shadow-md border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Roster Management
            </h1>
            <p className="text-sm font-medium text-gray-600">
              Roster List Status:{" "}
              <span
                className={`${
                  rosterData.roster.isComplete
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {rosterData.roster.isComplete ? "Complete" : "Not Complete"}
              </span>
            </p>
            <p className="text-sm font-medium text-gray-600">
              Approval Status:{" "}
              <span className="text-indigo-600">
                {rosterData.roster.overAllStatus}
              </span>
            </p>
          </div>

          {/* Dropdown Container */}
          <div className="relative dropdown-container">
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MoreHorizontal size={28} className="text-cnsc-primary-color" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border border-gray-300 z-10 rounded-lg overflow-hidden">
                <div className="flex flex-col">
                  {dropdownItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleDropdownAction(item.id)}
                      className="px-4 py-3 text-left hover:bg-amber-200 transition-colors duration-200"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Search Bar */}
        <div className="flex items-center gap-2 w-full max-w-md">
          <Search className="text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search roster by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Content */}
      <div className="h-full overflow-auto">
        {!rosterData || filteredRoster.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center border border-dashed border-gray-300 rounded-lg bg-white p-6">
            <p className="text-gray-500 mb-2">
              {searchQuery
                ? "No members match your search."
                : "No roster has been started yet."}
            </p>
            {!searchQuery && (
              <>
                <p className="text-gray-400 mb-4">
                  Click the Actions button above to begin creating your student
                  leader roster.
                </p>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  onClick={() => setAlertModal(true)}
                >
                  Notify Organization
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 overflow-auto">
            {filteredRoster.map((member) => (
              <RosterMemberCard
                key={member._id}
                member={member}
                orgId={orgData._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ Keep all your modals & popup (unchanged) */}
      {/* Revision Modal, Approval Modal, Alert Modal, Export Modal, Incomplete Modal, Popup */}
      {/* ... same as your original code ... */}

      {popup && (
        <DonePopUp
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

const RosterMemberCard = ({ member, orgId }) => {
  return (
    <div className="bg-white w-full h-full rounded-lg flex flex-col gap-2 items-center shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <img
          src={
            member.profilePicture
              ? `${DOCU_API_ROUTER}/${orgId}/${member.profilePicture}`
              : "/cnsc-logo.png"
          }
          alt="Profile"
          className="max-h-32 aspect-square border object-cover rounded"
        />
      </div>

      <div className="space-y-1 text-center">
        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
        <p className="text-sm font-medium text-indigo-600">{member.position}</p>
        <p className="text-sm text-gray-600">{member.email}</p>
        <p className="text-sm text-gray-600">{member.contactNumber}</p>
        <p className="text-sm text-gray-500">{member.address}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 w-full text-center">
        <p className="text-xs text-gray-500">
          Birth Date:{" "}
          {member.birthDate
            ? new Date(member.birthDate).toLocaleDateString()
            : "Not provided"}
        </p>
        <p className="text-xs text-gray-500">Status: {member.status}</p>
      </div>
    </div>
  );
};
