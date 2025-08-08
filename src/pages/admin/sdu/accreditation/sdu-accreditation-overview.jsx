import { NavLink, Outlet } from "react-router-dom";

export function SduAccreditationOverview() {
  return <>moto</>;
}

export function SduAccreditationDevOrgOverview({ selectedOrg }) {
  return <>moto2</>;
}

export function OrganizationAccreditation() {
  const tabs = [
    { to: ".", label: "Overview", end: true },
    { to: "financial-report", label: "Financial Report" },
    { to: "roster-of-members", label: "Roster of Members" },
    { to: "president-information", label: "President's Information Sheet" },
  ];

  return (
    <div className="h-full flex flex-col p-4">
      {/* Navigation */}
      <nav className="flex justify-between gap-4 p-4 bg-white rounded-t-2xl pb-4 border-b">
        <div>
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `text-lg font-semibold px-4 pt-2 ${
                  isActive
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
        <NavLink
          key="history"
          to={"history"}
          end={false}
          className={({ isActive }) =>
            `text-lg font-semibold px-4 pt-2 ${
              isActive
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`
          }
        >
          History
        </NavLink>
      </nav>

      {/* Tab Content */}
      <div className="h-full overflow-hidden  flex flex-col ">
        <Outlet />
      </div>
    </div>
  );
}
