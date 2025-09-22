export default function StudentHomePage() {
  return (
    <div className="flex-1 p-4  bg-gray-200 flex flex-col overflow-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Welcome to Student Leader Portal
      </h1>
      <div className="flex flex-wrap  gap-4 ">
        {[
          [
            "Reports & Dashboard",
            "View your organization's reports and analytics",
          ],
          ["Accreditations", "Manage your accreditation documents"],
          ["Accomplishments", "Track and showcase achievements"],
          ["Proposals", "Submit and manage project proposals"],
          ["Posts", "Create and manage announcements"],
          ["Activity Logs", "View system activity and history"],
        ].map(([title, desc], i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
