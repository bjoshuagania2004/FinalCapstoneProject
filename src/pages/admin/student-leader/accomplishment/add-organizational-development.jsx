import { useState } from "react";
import { X } from "lucide-react";
import { API_ROUTER } from "../../../../App";
import axios from "axios";

export function OrganizationalDevelopmentModal({
  proposals,
  accomplishmentId,
  orgData,
  onClose,
}) {
  console.log(accomplishmentId);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    proposal: "",
    accomplishmentId,
  });

  // Category options based on the requirements
  const categoryOptions = [
    {
      value: "Programs, Projects, and Activities (PPAs)",
      label: "Programs, Projects, and Activities (PPAs)",
    },
    { value: "Meetings & Assemblies", label: "Meetings & Assemblies" },
    {
      value: "Quality of Required Documents",
      label: "Quality of Required Documents",
    },
    { value: "Institutional Involvement", label: "Institutional Involvement" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If changing category, reset related fields
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        proposal: "", // Reset proposal selection
        title: "", // Reset title when category changes
        description: "", // Reset description when category changes
      }));
    }
    // ✅ If selecting a proposal, populate title and description (only for PPA)
    else if (name === "proposal") {
      const selected = proposals.find((p) => p._id === value);

      console.log(selected);
      setFormData((prev) => ({
        ...prev,
        proposal: value,
        title: selected?.ProposedIndividualActionPlan?.activityTitle || "",
        description: selected?.ProposedIndividualActionPlan?.briefDetails || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const res = await axios.post(`${API_ROUTER}/addAccomplishment`, formData);
      console.log(res.data);
    } catch (error) {
      console.error(error.response);
    }
    onClose();
  };

  // Check if current category is PPA
  const isPPACategory =
    formData.category === "Programs, Projects, and Activities (PPAs)";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[32rem] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add Organizational Development</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            >
              <option value="">-- Select Category --</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Proposal Dropdown - Only show for PPA category */}
          {isPPACategory && (
            <div>
              <label className="block text-sm font-medium">
                Select Proposal
              </label>
              <select
                name="proposal"
                value={formData.proposal}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required={isPPACategory}
              >
                <option value="">-- Choose a Proposal --</option>
                {proposals.map((proposal) => (
                  <option key={proposal._id} value={proposal._id}>
                    {proposal.ProposedIndividualActionPlan?.activityTitle ||
                      "Untitled Proposal"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
              placeholder={
                isPPACategory
                  ? "Title will auto-populate when you select a proposal"
                  : "Enter title for this " + formData.category.toLowerCase()
              }
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              rows="3"
              placeholder={
                isPPACategory
                  ? "Description will auto-populate when you select a proposal"
                  : "Enter description for this " +
                    formData.category.toLowerCase()
              }
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
