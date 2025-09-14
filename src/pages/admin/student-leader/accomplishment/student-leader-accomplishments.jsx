import axios from "axios";
import { API_ROUTER } from "../../../../App";

import { useState, useEffect } from "react";
import { OrganizationalDevelopmentModal } from "./add-organizational-development";
import { OrganizationalPerformanceModal } from "./add-organizational-performance";
import { ServiceCommunityModal } from "./add-service-community";

export function StudentLeaderAccomplishmentReport({ orgData }) {
  const [proposals, setProposals] = useState([]);
  const [Accomplishment, setAccomplishment] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [showOrgDevelopmentModal, setShowOrgDevelopmentModal] = useState(false);
  const [showOrgPerformanceModal, setShowOrgPerformanceModal] = useState(false);
  const [showServiceCommunityModal, setShowServiceCommunityModal] =
    useState(false);

  const fetchInformation = async () => {
    try {
      const res = await axios.get(
        `${API_ROUTER}/getStudentLeaderAccomplishmentReady/${orgData._id}`
      );
      const getAccomplishment = await axios.get(
        `${API_ROUTER}/getAccomplishment/${orgData._id}`
      );
      console.log(getAccomplishment.data);
      setProposals(res.data);
    } catch (error) {
      console.error(error.response);
    }
  };

  useEffect(() => {
    fetchInformation();
  }, []);

  const handleSelect = (type) => {
    console.log("Selected type:", type);
    setShowModal(false);

    if (type === "Organizational Development") {
      setShowOrgDevelopmentModal(true);
    } else if (type === "Organizational Performance") {
      setShowOrgPerformanceModal(true);
    } else if (type === "Service Community") {
      setShowServiceCommunityModal(true);
    }
  };

  return (
    <div className="h-full w-full overflow-auto flex flex-col gap-6 bg-gray-200 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Accomplishment Reports Analytics
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-500 py-2 px-4 rounded-lg text-white font-semibold hover:bg-amber-600 transition"
        >
          Add Accomplishment
        </button>
      </div>

      {/* Choice Modal */}
      {showModal && (
        <AccomplishmentChoiceModal
          onClose={() => setShowModal(false)}
          onSelect={handleSelect}
        />
      )}

      {/* Sub-modals */}
      {showOrgDevelopmentModal && (
        <OrganizationalDevelopmentModal
          orgData={orgData}
          proposals={proposals}
          onClose={() => setShowOrgDevelopmentModal(false)}
        />
      )}
      {showOrgPerformanceModal && (
        <OrganizationalPerformanceModal
          orgData={orgData}
          onClose={() => setShowOrgPerformanceModal(false)}
        />
      )}
      {showServiceCommunityModal && (
        <ServiceCommunityModal
          orgData={orgData}
          onClose={() => setShowServiceCommunityModal(false)}
        />
      )}
    </div>
  );
}

function AccomplishmentChoiceModal({ onClose, onSelect }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-200 rounded-2xl shadow-lg p-4 w-1/3 text-center">
        <h2 className="text-lg font-bold mb-4">Choose Upload Type</h2>
        <div className="flex flex-col gap-4 text-left">
          {/* Organizational Development */}
          <div
            className="flex gap-4 bg-white rounded-xl shadow-md hover:cursor-pointer"
            onClick={() => onSelect("Organizational Development")}
          >
            <button className="w-full px-4 py-2 flex-1 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
              Organizational Development
            </button>
            <p className="p-4 w-3/4 text-sm text-gray-600">
              Covers Programs, Projects & Activities (PPAs), Meetings, Required
              Documents, and Institutional Involvement.
            </p>
          </div>

          {/* Organizational Performance */}
          <div
            className="flex gap-4 bg-white rounded-xl shadow-md hover:cursor-pointer"
            onClick={() => onSelect("Organizational Performance")}
          >
            <button className="px-4 py-2 flex-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition">
              Organizational Performance
            </button>
            <p className="p-4 w-3/4 text-sm text-gray-600">
              Focuses on awards, recognition, and achievements of the
              organization and its members.
            </p>
          </div>

          {/* Service & Community Involvement */}
          <div
            className="flex gap-4 bg-white rounded-xl shadow-md hover:cursor-pointer"
            onClick={() => onSelect("Service Community")}
          >
            <button className="w-3/5 px-4 py-2 flex-1 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition">
              Service & Community Involvement
            </button>
            <p className="p-4 w-3/4 text-sm text-gray-600">
              Participation in outreach and extension programs, providing
              service to external communities and stakeholders.
            </p>
          </div>

          {/* Cancel */}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
