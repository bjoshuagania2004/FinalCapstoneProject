import { useState } from "react";

const sampleRosterMembers = [
  {
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    address: "123 Rizal St., Quezon City",
    position: "President",
    birthDate: "2002-05-15",
    studentId: "BSIS-001",
    contactNumber: "09171234567",
    status: "Active",
  },
  {
    name: "Maria Santos",
    email: "maria.santos@example.com",
    address: "456 Mabini Ave., Manila",
    position: "Vice President",
    birthDate: "2001-10-22",
    studentId: "BSIS-002",
    contactNumber: "09281234567",
    status: "Active",
  },
  {
    name: "Pedro Gomez",
    email: "pedro.gomez@example.com",
    address: "789 Bonifacio Blvd., Caloocan",
    position: "Secretary",
    birthDate: "2003-02-11",
    studentId: "BSIS-003",
    contactNumber: "09391234567",
    status: "Active",
  },
  {
    name: "Ana Lopez",
    email: "ana.lopez@example.com",
    address: "101 Katipunan Rd., Makati",
    position: "Treasurer",
    birthDate: "2002-07-09",
    studentId: "BSIS-004",
    contactNumber: "09451234567",
    status: "Active",
  },
  {
    name: "Carlos Reyes",
    email: "carlos.reyes@example.com",
    address: "202 Aguinaldo St., Taguig",
    position: "Auditor",
    birthDate: "2001-03-30",
    studentId: "BSIS-005",
    contactNumber: "09561234567",
    status: "Active",
  },
];

const RosterMemberCard = ({ member }) => {
  return (
    <div className="bg-white rounded-lg flex flex-col gap-2 items-center shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <img
          src="/cnsc-logo.png"
          alt="Background"
          className="p-4 min-h-48 aspect-square border"
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
        <p className="text-sm font-medium text-indigo-600">{member.position}</p>
        <p className="text-sm text-gray-600">{member.studentId}</p>
        <p className="text-sm text-gray-600">{member.email}</p>
        <p className="text-sm text-gray-600">{member.contactNumber}</p>
        <p className="text-sm text-gray-500">{member.address}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Last Update: {new Date(member.birthDate).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-500">
          Last Update: {new Date(member.birthDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

const AddRosterMemberModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Add Roster Member</h2>
        <p className="text-gray-600 mb-4">Modal content goes here...</p>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
};

export const RostersMembersPage = () => {
  const [showModal, setShowModal] = useState(false);

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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {sampleRosterMembers.map((member, index) => (
          <RosterMemberCard key={index} member={member} />
        ))}
      </div>

      {showModal && (
        <AddRosterMemberModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default RostersMembersPage;
