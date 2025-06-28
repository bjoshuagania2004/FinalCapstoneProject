const timelineData = [
  {
    date: "2025-06-01 10:00 AM",
    status: "Initial Application Submitted",
    type: "success",
  },
  {
    date: "2025-06-01 02:30 PM",
    status: "Application Acknowledgment Sent",
    type: "info",
  },
  {
    date: "2025-06-02 09:15 AM",
    status: "Document Review Phase Started",
    type: "info",
  },
  {
    date: "2025-06-03 11:30 AM",
    status: "Constitution & Bylaws Approved",
    type: "success",
  },
  {
    date: "2025-06-04 03:45 PM",
    status: "Financial Documents Under Review",
    type: "warning",
  },
  {
    date: "2025-06-05 10:20 AM",
    status: "Activity Report Revision Requested",
    type: "warning",
  },
  {
    date: "2025-06-06 01:15 PM",
    status: "Revised Activity Report Submitted",
    type: "info",
  },
  {
    date: "2025-06-07 04:00 PM",
    status: "Faculty Adviser Verification Complete",
    type: "success",
  },
  {
    date: "2025-06-08 09:30 AM",
    status: "Final Review in Progress",
    type: "info",
  },
  {
    date: "2025-06-08 12:45 PM",
    status: "Accreditation Status: Approved",
    type: "success",
  },
];

export const AccreditationTimeline = () => {
  return (
    <div className="min-w-fit max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">
        Accreditation Timeline
      </h3>

      {/* Scrollable area */}
      <div className="relative w-full max-h-[500px] overflow-y-auto">
        {/* Timeline container */}
        <div className="relative w-full py-4">
          {/* Vertical line */}

          {/* Timeline items */}
          <div className="space-y-8 relative">
            {timelineData.map((item, index) => {
              let iconBg = "bg-gray-400";
              let textColor = "text-gray-600";

              switch (item.type) {
                case "success":
                  iconBg = "bg-green-500";
                  textColor = "text-green-700";
                  break;
                case "warning":
                  iconBg = "bg-yellow-500";
                  textColor = "text-yellow-700";
                  break;
                case "info":
                  iconBg = "bg-blue-500";
                  textColor = "text-blue-700";
                  break;
              }

              return (
                <div key={index} className="relative flex items-center group">
                  {/* Left - Date */}
                  <div className="w-32 text-right pr-4">
                    <p className="text-sm font-medium text-gray-600">
                      {item.date}
                    </p>
                  </div>

                  {/* Right - Status */}
                  <div className="flex-1 pl-4">
                    <div
                      className="bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-100 
                      transition-all duration-200 group-hover:shadow-md group-hover:bg-white"
                    >
                      <p
                        className={`text-sm font-semibold ${textColor} leading-relaxed`}
                      >
                        {item.status}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
