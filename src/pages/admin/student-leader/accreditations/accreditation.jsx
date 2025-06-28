import { NavLink, Outlet } from "react-router-dom";
import { LogsComponent } from "./logs";

export default function AccreditationPage() {
  const tabs = [
    { to: ".", label: "Overview", end: true }, // Exact match required
    { to: "financial-report", label: "Financial Report" },
    { to: "roster-of-members", label: "Roster of Members" },
    { to: "president-information", label: "President's Information Sheet" },
    { to: "documents", label: "Documents" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Navigation */}
      <nav className="flex gap-4  pb-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `text-lg font-semibold px-4 pt-2 text-cnsc-primary-color ${
                isActive ? "border-b-2" : "underline-animate"
              }`
            }
          >
            {tab.label}{" "}
          </NavLink>
        ))}
      </nav>

      {/* Render tab content here */}
      <div className="h-full rounded shadow overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
