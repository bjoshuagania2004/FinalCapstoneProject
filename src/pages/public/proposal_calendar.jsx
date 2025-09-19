import { useState, useEffect } from "react";
import { API_ROUTER } from "../../App";
import axios from "axios";
import { ChevronLeft, ChevronRight, Calendar, MapPin, X } from "lucide-react";

export function PostComponent() {
  const [proposalCalendar, setProposalCalendar] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState(null); // New state for multiple events

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${API_ROUTER}/getAllProposalConduct/`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        setProposalCalendar(response.data);
      } catch (error) {}
    };

    fetchUserData();
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date) => {
    // Convert the date to YYYY-MM-DD format to match API data
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    return proposalCalendar.filter((event) => {
      // Extract date from ISO string (2025-09-26T00:00:00.000Z -> 2025-09-26)
      const eventDate =
        event.ProposedIndividualActionPlan.proposedDate.split("T")[0];
      return eventDate === dateStr;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Conduct Approved":
        return "bg-gray-800";
      case "Pending":
        return "bg-gray-500";
      case "Revision Update from Student Leader":
        return "bg-gray-600";
      default:
        return "bg-gray-400";
    }
  };

  const formatDateForDisplay = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Updated function to handle day clicks with multiple events
  const handleDayClick = (events, date) => {
    if (events.length === 0) return;

    if (events.length === 1) {
      setSelectedEvent(events[0]);
      setSelectedDayEvents(null);
    } else {
      setSelectedDayEvents({
        events,
        date: formatDateForDisplay(
          events[0].ProposedIndividualActionPlan.proposedDate
        ),
      });
      setSelectedEvent(null);
    }
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Add day headers
    dayNames.forEach((day) => {
      days.push(
        <div
          key={day}
          className="p-3 text-center font-semibold text-gray-800 bg-gray-200"
        >
          {day}
        </div>
      );
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-3 bg-gray-50"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const events = getEventsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`p-2 min-h-[120px] border border-gray-200 cursor-pointer hover:bg-gray-100 ${
            isToday ? "bg-gray-200 border-gray-400" : "bg-white"
          }`}
          onClick={() => handleDayClick(events, date)}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-gray-900" : "text-gray-800"
            }`}
          >
            {day}
          </div>

          {/* Display all events for the day */}
          <div className="space-y-1 overflow-y-auto max-h-[80px]">
            {events.map((event, index) => (
              <div
                key={event._id}
                className={`text-xs p-1 rounded text-white truncate ${getStatusColor(
                  event.overallStatus
                )}`}
                title={`${event.ProposedIndividualActionPlan.activityTitle} - ${event.overallStatus}`}
              >
                {event.ProposedIndividualActionPlan.activityTitle}
              </div>
            ))}

            {/* Show count if there are more events than can fit */}
            {events.length > 3 && (
              <div className="text-xs text-gray-600 text-center bg-gray-100 rounded px-1">
                +{events.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Event Calendar
        </h2>
        <p className="text-base text-gray-600 text-center mb-8">
          View upcoming events and important dates.
        </p>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-xl font-bold">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0">{renderCalendarGrid()}</div>
        </div>

        {/* Multiple Events Modal for Same Day */}
        {selectedDayEvents && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white relative rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Events on {selectedDayEvents.date}
                  </h3>
                  <X
                    onClick={() => setSelectedDayEvents(null)}
                    size={24}
                    className="text-gray-500 absolute top-4 right-4 hover:text-gray-900 cursor-pointer"
                  />
                </div>

                <div className="grid gap-4">
                  {selectedDayEvents.events.map((event, index) => (
                    <div
                      key={event._id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event);
                        setSelectedDayEvents(null);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800">
                          {event.ProposedIndividualActionPlan.activityTitle}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(
                            event.overallStatus
                          )}`}
                        >
                          {event.overallStatus}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>
                            {event.ProposedIndividualActionPlan.venue}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Budget:</span>
                          <span>
                            ₱
                            {event.ProposedIndividualActionPlan.budgetaryRequirements.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2">
                          {event.ProposedIndividualActionPlan.briefDetails}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Click on any event above to view full details
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Single Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
              {/* Header */}
              <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {selectedEvent.ProposedIndividualActionPlan.activityTitle}
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Close"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6 p-6">
                {/* Organization */}
                <div>
                  <p className="text-sm text-gray-500">
                    Proponent Organization
                  </p>
                  <p className="font-medium text-gray-800">
                    {selectedEvent.organizationProfile.orgName}
                  </p>
                </div>

                {/* Date, Venue, Budget */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={16} />
                    <span>
                      {formatDateForDisplay(
                        selectedEvent.ProposedIndividualActionPlan.proposedDate
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={16} />
                    <span>
                      {selectedEvent.ProposedIndividualActionPlan.venue}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Budget:</span>
                    <span>
                      ₱
                      {selectedEvent.ProposedIndividualActionPlan.budgetaryRequirements.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 rounded px-2 py-1 text-xs font-medium text-white ${getStatusColor(
                        selectedEvent.overallStatus
                      )}`}
                    >
                      {selectedEvent.overallStatus}
                    </span>
                  </div>
                </div>

                {/* SDGs */}
                <div>
                  <p className="font-medium text-gray-700">Aligned SDGs</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedEvent.ProposedIndividualActionPlan.alignedSDG.map(
                      (sdg, index) => {
                        try {
                          if (typeof sdg === "string" && sdg.startsWith("[")) {
                            const parsed = JSON.parse(sdg);
                            return parsed.map((parsedSdg, subIndex) => (
                              <span
                                key={`${index}-${subIndex}`}
                                className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-800"
                              >
                                {parsedSdg}
                              </span>
                            ));
                          }
                        } catch {
                          // fallback to string
                        }
                        return (
                          <span
                            key={index}
                            className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-800"
                          >
                            {sdg}
                          </span>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Brief Details */}
                <div>
                  <p className="font-medium text-gray-700">Brief Details</p>
                  <p className="mt-1 text-gray-600">
                    {selectedEvent.ProposedIndividualActionPlan.briefDetails}
                  </p>
                </div>

                {/* Objective */}
                <div>
                  <p className="font-medium text-gray-700">Aligned Objective</p>
                  <p className="mt-1 text-gray-600">
                    {
                      selectedEvent.ProposedIndividualActionPlan
                        .AlignedObjective
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
