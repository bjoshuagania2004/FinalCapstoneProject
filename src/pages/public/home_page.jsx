import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "./login_form";
import { RegistrationForm } from "./registration_form";
import backgroundImage from "./../../assets/cnscsch.jpg";
import { API_ROUTER, DOCU_API_ROUTER } from "../../App";
import axios from "axios";
import { Calendar, CheckCircle, Clock, XCircle, Building2 } from "lucide-react";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  return (
    <div className="relative h-screen w-screen ">
      {/* Desktop Navigation */}
      <div className="hidden md:flex h-full w-full items-center justify-center z-10 relative">
        <DekstopNavigation scrollToSection={scrollToSection} />
      </div>
      <div className="flex md:hidden h-full w-full items-center justify-center z-10 relative">
        <CellphoneNavigation />
      </div>

      {/* Background Image */}
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover brightness-50 z-0"
      />
    </div>
  );
}

function OrganzationComponent() {
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterClass, setFilterClass] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${API_ROUTER}/getAllOrganizationProfileCard`
      );

      // keep only active organizations
      const activeOrgs = res.data.filter((org) => org.isActive);

      console.log(activeOrgs);
      setFilteredOrgs(activeOrgs);
      setOrganizations(activeOrgs);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching organizations:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "Rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status, isActive) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1";

    if (!isActive) {
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          Inactive
        </span>
      );
    }

    switch (status) {
      case "Approved":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {getStatusIcon(status)} Approved
          </span>
        );
      case "Pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            {getStatusIcon(status)} Pending
          </span>
        );
      case "Rejected":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            {getStatusIcon(status)} Rejected
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {getStatusIcon(status)} {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-800">Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-100 p-6">
      <div className="mx-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Student Organizations
          </h1>
        </div>

        {/* Organizations Grid */}
        {filteredOrgs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No organizations found
            </h3>
            <p className="text-gray-800">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrgs.map((org) => (
              <div
                key={org._id}
                className="bg-white flex p-6 gap-6 items-center rounded-xl shadow-md border-2 border-gray-300"
              >
                <div className="h-24 aspect-square">
                  {org.orgLogo ? (
                    <div className="relative">
                      <img
                        src={`${DOCU_API_ROUTER}/${org._id}/${org.orgLogo}`}
                        alt={`${org.orgName} Logo`}
                        className=" object-cover rounded-full aspect-square"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white bg-opacity-20 rounded-full border-4 border-white flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-black" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {org.orgName}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">
                      Acronym: {org.orgAcronym}
                    </p>
                  </div>
                  <div className="">
                    <div className="flex items-center text-sm text-gray-800">
                      <span className="mr-2 font-black">Deparment: </span>
                      <span className="truncate">{org.orgDepartment}</span>
                    </div>

                    {org.orgCourse && (
                      <div className="flex items-center text-sm text-gray-800">
                        <span className="mr-2 font-black">Course: </span>
                        <span className="truncate">{org.orgCourse}</span>
                      </div>
                    )}

                    {org.orgSpecialization && (
                      <div className="text-sm text-gray-800">
                        <span className="font-medium">Specialization: </span>
                        {org.orgSpecialization}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Created: {formatDate(org.createdAt)}
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          org.orgClass === "System-wide"
                            ? "bg-amber-100 text-amber-700"
                            : org.orgClass === "Local"
                            ? "bg-red-100 text--700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {org.orgClass}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCalendarComponent() {
  return (
    <div className="text-center min-h-screen bg-amber-100 p-8">
      <h2 className="text-3xl font-bold text-amber-800 mb-4">
        Latest Posts & Updates
      </h2>
      <p className="text-base text-amber-600">
        Stay updated with the latest news and announcements.
      </p>
    </div>
  );
}
function PostComponent() {
  return (
    <div className="text-center min-h-screen bg-lime-200 p-8">
      <h2 className="text-3xl font-bold text-green-800 mb-4">Event Calendar</h2>
      <p className="text-base text-green-600">
        View upcoming events and important dates.
      </p>
    </div>
  );
}
function DekstopNavigation({ scrollToSection }) {
  const [showRegistration, setShowRegistration] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-screen overflow-x-hidden">
      {/* Fixed Navigation Bar */}
      <div className="fixed top-0 left-0 w-full z-50 text-black font-bold">
        <div className="h-16 flex justify-end items-center px-16">
          <nav className="hidden md:flex items-center justify-center space-x-8 py-4">
            <button
              onClick={() => scrollToSection("section0")}
              className="relative group  hover:text-yellow-300 transition-colors duration-300 "
            >
              Login
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
            <div className="h-6 w-0.5 bg-white/30" />
            <button
              onClick={() => scrollToSection("section1")}
              className="relative group  hover:text-yellow-300 transition-colors duration-300 "
            >
              Organizations
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
            <div className="h-6 w-0.5 bg-white/30" />
            <button
              onClick={() => scrollToSection("section2")}
              className="relative group  hover:text-yellow-300 transition-colors duration-300"
            >
              Latest Posts
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
            <div className="h-6 w-0.5 bg-white/30" />
            <button
              onClick={() => scrollToSection("section3")}
              className="relative group  hover:text-yellow-300 transition-colors duration-300"
            >
              Event Calendar
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content (with top padding so it doesn’t get hidden under nav) */}
      <div id="section0" className="pt-16">
        <div className="h-screen w-full flex justify-center items-center">
          <div className="bg-white container mx-auto w-1 h-1/3" />
          <div className="h-full flex flex-col items-start px-8 justify-center w-1/3">
            <p className="stroked-text-cnsc text-[100px] leading-[90px]">
              CNSC
            </p>
            <p className="stroked-text-codex text-[100px] -mt-6">CODEX</p>
            <h1 className="text-white text-2xl font-bold italic mt-4">
              Document Tracking and Data Management for Student Organizations
            </h1>
          </div>

          <div className="h-full items-center flex justify-center w-1/3">
            {showRegistration ? (
              <RegistrationForm
                onBackToLogin={() => setShowRegistration(false)}
                onShowRegistration={setShowRegistration}
              />
            ) : (
              <Login
                navigate={navigate}
                onShowRegistration={() => setShowRegistration(true)}
              />
            )}
          </div>
          <div className="bg-white container mx-auto w-1 h-full" />
        </div>
      </div>

      {/* Section 1 */}
      <div id="section1">
        <OrganzationComponent />
      </div>

      {/* Section 2 */}
      <div id="section2">
        <EventCalendarComponent />
      </div>

      {/* Section 3 */}
      <div id="section3">
        <PostComponent />
      </div>
    </div>
  );
}

function CellphoneNavigation() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="relative h-screen w-screen ">
      {/* Fixed Background Image - No Movement */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat w-full h-full"
        style={{
          backgroundImage: `url('/cnscbg.jpg')`,
        }}
      />

      {/* Dark Overlay for Better Text Readability */}
      <div className="fixed inset-0 bg-black/30 z-10" />

      {/* Hero Section */}
      <div id="hero" className="relative flex flex-col z-20 min-h-screen ">
        <div className="h-screen flex  px-12 flex-col justify-center items-center">
          <div className="text-white   bg-cnsc-black-color/80 px-6 py-16 text-center flex flex-col items-center space-y-8">
            {/* Title Section */}
            <div className="space-y-2">
              <h1 className="text-cnsc-primary-color font-extrabold text-5xl tracking-wide">
                CNSC{" "}
                <span className="text-cnsc-secondary-color font-bold text-5xl tracking-wide">
                  CODE
                </span>
              </h1>
              <h2></h2>
              <p className="text-sm font-semibold italic max-w-xl mx-auto">
                Document Tracking and Data Management for Student Organizations
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col border items-center justify-center mt-4">
              <button
                onClick={() => scrollToSection("organizations")}
                className="px-4 py-2"
              >
                View Organizations
              </button>
              <div className="w-1/3 border h-full bg-white" />
              <button
                onClick={() => scrollToSection("posts")}
                className="px-4 py-2"
              >
                See Latest Posts & Updates
              </button>
              <div className="w-1/3 border h-full bg-white" />
              <button
                onClick={() => scrollToSection("calendar")}
                className="px-4 py-2"
              >
                View Event Calendar
              </button>
            </div>
          </div>
        </div>
        <div id="organizations" className="min-h-screen bg-blue-100 z-100">
          <OrganzationComponent />
        </div>

        {/* Posts Section */}
        <div id="posts" className="min-h-screen pt-20 bg-green-100 z-100">
          <PostComponent />
        </div>

        {/* Calendar Section */}
        <div id="calendar" className="min-h-screen bg-violet-100 ">
          <EventCalendarComponent />
        </div>
      </div>

      {/* Organizations Section */}
    </div>
  );
}

// Your component implementations remain the same
