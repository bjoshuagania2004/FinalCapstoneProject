import axios from "axios";
import { X } from "lucide-react";
import { useState } from "react";
import { API_ROUTER } from "../../../../App";

export function OrganizationalPerformanceModal({
  onClose,
  onSelect,
  accomplishmentId,
}) {
  const [formData, setFormData] = useState({
    category: "Organizational Performance",
    title: "",
    description: "",
    date: "",
    proposal: "",
    accomplishmentId,
    level: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const res = await axios.post(`${API_ROUTER}/addAccomplishment`, formData);
      console.log(res.data);
      onClose();
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white relative rounded-2xl shadow-lg p-6 w-1/3">
        <h2 className="text-lg font-bold mb-4">Organizational Performance</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Category */}
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* Award Level */}
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Level</option>
            <option value="International">International</option>
            <option value="National">National</option>
            <option value="Regional">Regional</option>
            <option value="Institutional">Institutional</option>
            <option value="Local">Local</option>
          </select>
          <p className="text-gray-400">
            {" "}
            * Document can be uploaded once this has been set up{" "}
          </p>
          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
        <X size={24} onClick={onClose} className="absolute top-4 right-4" />
      </div>
    </div>
  );
}
