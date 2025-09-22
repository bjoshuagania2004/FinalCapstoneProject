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

export function OrganzationComponent() {
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterClass, setFilterClass] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${API_ROUTER}/getAllOrganizationProfileCard`
      );

      console.log(res.data);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleOrgClick = (org) => {
    setSelectedOrg(org);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrg(null);
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
    <div className="min-h-screen bg-cnsc-primary-color p-6">
      <div className="w-fit">
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
          <div className="flex flex-wrap justify-between gap-2">
            {filteredOrgs.map((org) => (
              <div
                key={org._id}
                onClick={() => handleOrgClick(org)}
                className="bg-white flex flex-1 p-6 gap-6 items-center rounded-xl shadow-md border-2 border-gray-300 cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all duration-200"
              >
                <div className="h-24 aspect-square">
                  {org.orgLogo ? (
                    <div className="relative">
                      <img
                        src={`${DOCU_API_ROUTER}/${org._id}/${org.orgLogo}`}
                        alt={`${org.orgName} Logo`}
                        className="object-cover rounded-full aspect-square"
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
                      <span className="mr-2 font-black">Department: </span>
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
