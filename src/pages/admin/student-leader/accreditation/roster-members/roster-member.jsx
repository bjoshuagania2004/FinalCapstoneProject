import { useEffect, useState } from "react";
import AddRosterForm from "./add-roster-member";
import { API_ROUTER } from "../../../../../App";
import axios from "axios";
import { CodeSquare } from "lucide-react";

export default function StudentLeaderRosters({ orgData }) {
  const [showModal, setShowModal] = useState(false);
  const [rosterData, setRosterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(orgData);
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_ROUTER}/getRosterMembers/${orgData._id}`
        );
        console.log(response.data);
        setRosterData(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch organization info:", err);
        setError("Failed to load roster members");
      } finally {
        setLoading(false);
      }
    };

    if (orgData._id) {
      fetchOrganization();
    }
  }, [orgData._id]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
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

  const rosterMembers = rosterData?.rosterMembers || [];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex w-full justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Roster Management</h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={() => setShowModal(true)}
        >
          Add Roster Member
        </button>
      </div>

      {!rosterData || rosterMembers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No roster has been started yet.</p>
          <p className="text-gray-400 mb-4">
            Click the button below to begin creating your student leader roster.
          </p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={() => setShowModal(true)}
          >
            Start Roster
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
          {rosterMembers.map((member) => (
            <RosterMemberCard
              key={member._id}
              member={member}
              orgId={orgData._id}
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <AddRosterForm
            orgData={orgData}
            onClose={() => setShowModal(false)}
          />
        </div>
      )}
    </div>
  );
}

const RosterMemberCard = ({ member, orgId }) => {
  console.log(`/${orgId}/${member.profilePicture}`);
  return (
    <div className="bg-white rounded-lg flex flex-col gap-2 items-center shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <img
          src={
            member.profilePicture
              ? `/${orgId}/${member.profilePicture}`
              : "/cnsc-logo.png"
          }
          alt="Profile Picture"
          className="max-h-32 aspect-square border object-cover rounded"
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          Name: {member.name}
        </h3>
        <p className="text-sm font-medium text-indigo-600">{member.position}</p>
        <p className="text-sm text-gray-600">{member.email}</p>
        <p className="text-sm text-gray-600">{member.contactNumber}</p>
        <p className="text-sm text-gray-500">{member.address}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
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
