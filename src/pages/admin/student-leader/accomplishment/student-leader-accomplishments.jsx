import axios from "axios";
import { API_ROUTER } from "../../../../App";

import { useState, useEffect } from "react";
export function StudentLeaderAccomplishmentReport({ orgData }) {
  const [proposals, setProposals] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchDoneProposal = async () => {
    try {
      const res = await axios.get(
        `${API_ROUTER}/getStudentLeaderAccomplishmentReady/${orgData._id}`
      );
      setProposals(res.data);
    } catch (error) {
      console.error(error.response);
    }
  };

  useEffect(() => {
    fetchDoneProposal();
  }, []);

  const handleSelect = (type) => {
    console.log("Selected type:", type);

    setShowModal(false);
    // ✅ Navigate or open upload form depending on `type`
    // Example: open different modals/forms for each type
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

      {/* Modal */}
      {showModal && (
        <AccomplishmentChoiceModal
          onClose={() => setShowModal(false)}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}

function AccomplishmentChoiceModal({ onClose, onSelect }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
        <h2 className="text-lg font-bold mb-4">Choose Upload Type</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSelect("proposed plan")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Financial Report
          </button>
          <button
            onClick={() => onSelect("instutional")}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
          >
            Narrative Report
          </button>
          <button
            onClick={() => onSelect("external")}
            className="px-4 py-2 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition"
          >
            Attendance Report
          </button>
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
