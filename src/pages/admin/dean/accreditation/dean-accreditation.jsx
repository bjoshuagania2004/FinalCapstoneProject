import { useState, useEffect } from "react";
import { API_ROUTER, DOCU_API_ROUTER } from "../../../../App";
import axios from "axios";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { School2 } from "lucide-react";

export function DeanMainAccreditation({ selectedOrg }) {
  const tabs = [
    { to: ".", label: "Overview", end: true },
    { to: "president-information", label: "President's Information Sheet" },
    { to: "financial-report", label: "Financial Report" },
    { to: "roster-of-members", label: "Roster of Members" },
    { to: "proposed-action-plan", label: "Proposed Action Plan" },
    { to: "document", label: "Accreditation Documents" },
  ];

  const [isTabsOpen, setTabsOpen] = useState(false);
  const [isManageRosterOpen, setManageRosterOpen] = useState(false);
  const [accreditationStatus, setAccreditationStatus] = useState(null);
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(
        `${API_ROUTER}/checkAccreditationApprovalStatuses/${selectedOrg._id}`
      );

      setAccreditationStatus(res.data);

      if (res.data.isEverythingApproved) {
        setShowApprovalPopup(true);
      }
    } catch (error) {
      console.error("Failed to fetch accreditation data", error);
    }
  };

  const location = useLocation();
  useEffect(() => {
    if (selectedOrg?._id) {
      fetchStatus();
    }
  }, [location, selectedOrg]);

  const sendApprovalLetter = async () => {
    try {
      const res = await axios.post(
        `${API_ROUTER}/sendAccreditationConfirmationEmail/${selectedOrg._id}`,
        {
          orgName: selectedOrg.orgName,
          orgId: selectedOrg._id,
        }
      );

      console.log("Approval letter sent:", res.data);
      setShowApprovalPopup(false);
      alert("Approval letter has been sent successfully!");
    } catch (error) {
      console.error("Failed to send approval letter:", error);
      alert("Something went wrong while sending the approval letter.");
    }
  };

  return (
    <div className="flex  h-full w-full transition-all duration-1000 relative">
      <div className="h-full w-full flex flex-col">
        {/* Navigation */}
        <nav className="flex justify-end gap-4 px-6 py-4 items-center bg-white border-b relative z-10">
          {/* Tabs Dropdown */}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setTabsOpen((prev) => !prev)}
              className={`px-4 py-2 bg-cnsc-primary-color w-56 text-white transition-colors hover:bg-cnsc-secondary-color ${
                isTabsOpen ? "rounded-t-lg" : "rounded-lg"
              }`}
            >
              Accreditation Tabs
            </button>

            {isTabsOpen && (
              <div className="absolute left-0 top-full z-20 bg-white border border-gray-200 rounded-b-lg shadow-lg w-56">
                {tabs.map((tab) => (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    end={tab.end}
                    className={({ isActive }) =>
                      `block w-full text-left px-4 py-2 text-sm ${
                        isActive
                          ? "bg-gray-200 text-cnsc-primary-color font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setTabsOpen(false)}
                  >
                    {tab.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          <Outlet context={{ accreditationStatus, selectedOrg }} />
        </div>

        {/* Approval Popup Modal */}
        {showApprovalPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-[90vw] text-center">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Accreditation Complete
                </h3>
                <p className="text-gray-600">
                  The accreditation of "{selectedOrg.orgName}" is complete.
                  Would you like to send them a notification?
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowApprovalPopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendApprovalLetter}
                  className="px-4 py-2 bg-cnsc-primary-color text-white rounded-lg hover:bg-cnsc-primary-color-dark transition-colors"
                >
                  Send Approval Letter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
