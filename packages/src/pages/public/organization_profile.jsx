import { useState, useEffect } from "react";
import { API_ROUTER, DOCU_API_ROUTER } from "../../App";
import axios from "axios";
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function OrganzationComponent() {
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${API_ROUTER}/getAllOrganizationProfileCard`
      );

      // keep only active organizations
      const activeOrgs = res.data.filter((org) => org.isActive);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleOrgClick = (org) => {
    navigate(`/profile/${org.orgName}`, {
      state: { orgData: org },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-800">Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cnsc-primary-color p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
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
          <div className="flex flex-col sm:grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredOrgs.map((org) => (
              <div
                key={org._id}
                onClick={() => {
                  handleOrgClick(org), console.log(org);
                }}
                className="bg-white flex flex-col sm:flex-row p-4 sm:p-6 gap-4 sm:gap-6 items-start sm:items-center rounded-xl shadow-md border-2 border-gray-300 cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all duration-200"
              >
                {/* Logo Section */}
                <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 flex-shrink-0 mx-auto sm:mx-0">
                  {org.orgLogo ? (
                    <div className="relative">
                      <img
                        src={`${DOCU_API_ROUTER}/${org._id}/${org.orgLogo}`}
                        alt={`${org.orgName} Logo`}
                        className="object-cover rounded-full w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white bg-opacity-20 rounded-full border-4 border-white flex items-center justify-center">
                      <Building2 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-black" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                      {org.orgName}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">
                      Acronym: {org.orgAcronym}
                    </p>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-sm text-gray-800">
                      <span className="font-bold">Department: </span>
                      <span className="break-words">{org.orgDepartment}</span>
                    </div>

                    {org.orgCourse && (
                      <div className="text-sm text-gray-800">
                        <span className="font-bold">Course: </span>
                        <span className="break-words">{org.orgCourse}</span>
                      </div>
                    )}

                    {org.orgSpecialization && (
                      <div className="text-sm text-gray-800">
                        <span className="font-bold">Specialization: </span>
                        <span className="break-words">
                          {org.orgSpecialization}
                        </span>
                      </div>
                    )}

                    {/* Footer Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 pt-2 mt-3 border-t border-gray-100 gap-2 sm:gap-0">
                      <div className="flex items-center justify-center sm:justify-start">
                        <Calendar className="w-3 h-3 mr-1" />
                        Created: {formatDate(org.createdAt)}
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium self-center sm:self-auto ${
                          org.orgClass === "System-wide"
                            ? "bg-amber-100 text-amber-700"
                            : org.orgClass === "Local"
                            ? "bg-red-100 text-red-700"
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
