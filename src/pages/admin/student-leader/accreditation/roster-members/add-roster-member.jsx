import React, { useState, useRef } from "react";
import { Save, Upload, X } from "lucide-react";
import { ProportionCropTool } from "../../../../../components/image_uploader";
import axios from "axios";
import { API_ROUTER } from "../../../../../App";

export default function AddRosterForm({ onClose, orgData, onMemberAdded }) {
  // Initial state for resetting
  const initialState = {
    organizationProfile: "",
    isComplete: false,
    overAllStatus: "Pending",
    rosterMember: {
      name: "",
      email: "",
      address: "",
      position: "",
      birthDate: "",
      studentId: "",
      contactNumber: "",
      status: "Active",
    },
  };

  console.log("org ID", orgData.organization);
  console.log("org profile ID", orgData._id);

  const [rosterData, setRosterData] = useState(initialState);
  const [cropData, setCropData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cropRef = useRef();

  const resetForm = () => {
    setRosterData(initialState);
    setCropData(null);
    if (cropRef.current && cropRef.current.reset) {
      cropRef.current.reset();
    }
  };

  const updateMember = (field, value) => {
    setRosterData({
      ...rosterData,
      rosterMember: {
        ...rosterData.rosterMember,
        [field]: value,
      },
    });
  };

  const handleCropComplete = (result) => {
    // Access the original File object
    console.log("Original File:", result.originalFile);
    // Access the cropped File object
    console.log("Cropped File:", result.croppedFile);

    setCropData(result);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      let finalCropData = cropData;

      // If there's an image uploaded but not cropped yet, crop it first
      if (cropRef.current && cropRef.current.hasImage && !cropData) {
        console.log("Cropping image before submit...");
        const result = await cropRef.current.cropImage();
        if (result) {
          finalCropData = result;
          setCropData(result);
          console.log("Crop completed:", result);
        }
      }

      // ============ CREATING FORMDATA OBJECT ============
      const formData = new FormData();

      // Add basic roster information to FormData
      formData.append("organization", orgData.organization);
      formData.append("organizationProfile", orgData._id);
      formData.append("isComplete", String(rosterData.isComplete));
      formData.append("overAllStatus", rosterData.overAllStatus);

      // Add roster member data to FormData
      const member = rosterData.rosterMember;
      formData.append("name", member.name);
      formData.append("email", member.email);
      formData.append("address", member.address);
      formData.append("position", member.position);
      formData.append("birthDate", member.birthDate);
      formData.append("studentid", member.studentId);
      formData.append("contactNumber", member.contactNumber);
      formData.append("status", member.status);

      // Add cropped image file to FormData (if available)
      if (finalCropData && finalCropData.croppedFile) {
        formData.append("file", finalCropData.croppedFile);
        formData.append("profilePicture", finalCropData.croppedFile.name);
      }

      // Add metadata to FormData
      formData.append("submittedAt", new Date().toISOString());
      formData.append("totalMembers", "1");

      // ============ LOG FORMDATA CONTENTS ============
      console.log("=== FormData Contents ===");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            `${key}: [FILE] ${value.name} (${value.size} bytes, ${value.type})`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      // ============ SEND FORMDATA TO BACKEND ============
      const response = await axios.post(
        `${API_ROUTER}/addRosterMember`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // optional: axios/browser will auto-set boundaries
          },
        }
      );
      console.log("Success:", response);
      alert("Roster submitted successfully!");
      // Call the callback to refresh parent component data
      if (onMemberAdded) {
        onMemberAdded();
      } else {
        onClose(); // Fallback to just closing if callback not provided
      }
    } catch (error) {
      console.error("Error during submit:", error);
      alert("Error processing submission. Please try again.");
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <div className="w-4xl max-h-[90vh] overflow-auto relative mx-auto p-6 rounded-xl bg-white">
      <X
        size={20}
        className="text-red absolute top-4 right-4"
        onClick={onClose}
      />
      <div className="">
        <h1 className="text-3xl text-center font-bold text-gray-900 mb-2">
          Add Roster Member
        </h1>
      </div>

      <div className=" flex flex-col gap-4">
        {/* Image Crop Tool */}
        <div className="">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Member Profile Picture
          </h2>
          <ProportionCropTool
            title="Crop Your Image"
            cropRef={cropRef}
            onCropComplete={handleCropComplete}
            maxImageHeight={500}
            showReset={true}
          />
        </div>

        {/* Roster Member */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Member Information
          </h2>

          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={rosterData.rosterMember.name}
                  onChange={(e) => updateMember("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={rosterData.rosterMember.email}
                  onChange={(e) => updateMember("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  value={rosterData.rosterMember.studentId}
                  onChange={(e) => updateMember("studentId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter student ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <input
                  type="text"
                  value={rosterData.rosterMember.position}
                  onChange={(e) => updateMember("position", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., President, Secretary, Member"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={rosterData.rosterMember.contactNumber}
                  onChange={(e) =>
                    updateMember("contactNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter contact number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Date
                </label>
                <input
                  type="date"
                  value={rosterData.rosterMember.birthDate}
                  onChange={(e) => updateMember("birthDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={rosterData.rosterMember.address}
                  onChange={(e) => updateMember("address", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter complete address"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={rosterData.rosterMember.status}
                  onChange={(e) => updateMember("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end ">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Save size={20} />
            {isProcessing ? "Processing..." : "Save Roster"}
          </button>
        </div>
      </div>
    </div>
  );
}
