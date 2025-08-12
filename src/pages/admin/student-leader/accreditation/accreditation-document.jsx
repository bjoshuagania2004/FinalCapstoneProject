import { useState } from "react";
import DocumentUploader, {
  DocumentDisplayCard,
} from "../../../../components/document_uploader";
import { Copy, Upload } from "lucide-react";
import axios from "axios";
import { API_ROUTER } from "../../../../App";

export default function Documents({ accreditationData, orgId }) {
  const { JointStatement, PledgeAgainstHazing, ConstituionAndByLaws } =
    accreditationData || {};

  const [uploadingDocType, setUploadingDocType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleAddClick = (docType) => {
    setUploadingDocType(docType);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile || !uploadingDocType) {
      console.warn("No file or document type selected.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "organizationProfile",
        accreditationData.organizationProfile
      );
      formData.append("organization", orgId);
      formData.append("file", selectedFile);
      formData.append("accreditationId", accreditationData._id);
      formData.append("docType", uploadingDocType); // <- Important
    } catch (error) {
      console.error("Upload error:", error.message);
    }
  };

  const renderOrUploadBox = (label, doc, key) => {
    if (uploadingDocType === key) {
      return (
        <UploadDocument
          title={`Upload ${label}`}
          onFileSelect={handleFileSelect}
          onSubmit={handleUploadSubmit}
          onCancel={() => {
            setUploadingDocType(null);
            setSelectedFile(null);
          }}
        />
      );
    }

    if (doc) {
      return (
        <DocumentDisplayCard
          name={label}
          downloadUrl={doc.downloadUrl}
          size={doc.size}
        />
      );
    }

    return (
      <div
        onClick={() => handleAddClick(key)}
        className="border border-dashed border-gray-400 p-6 rounded-xl cursor-pointer hover:bg-gray-50 flex items-center gap-4"
      >
        <Upload className="text-gray-600" />
        <span className="text-gray-600 italic">Click to upload {label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Organization Documents</h2>

      {renderOrUploadBox("Joint Statement", JointStatement, "JointStatement")}
      {renderOrUploadBox(
        "Constitution and By-Laws",
        ConstituionAndByLaws,
        "Constitution and By-Laws"
      )}
      {renderOrUploadBox(
        "Pledge Against Hazing",
        PledgeAgainstHazing,
        "PledgeAgainstHazing"
      )}
    </div>
  );
}

export function UploadDocument({
  title = "Upload a Document",
  buttonLabel = "Submit",
  buttonClass = "bg-blue-600 hover:bg-blue-700",
  onFileSelect,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="absolute inset-0 h-full flex items-center justify-center 1w-full bg-black/50 backdrop-blur-sm">
      <div className=" bg-white min-w-xl mx-auto p-6 border border-gray-300 rounded-xl">
        <h3 className="text-lg font-medium">{title}</h3>
        <DocumentUploader onFileSelect={onFileSelect} title={title} />

        <div className="flex justify-end mt-4 gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className={`${buttonClass} text-white px-6 py-2 rounded-lg transition-colors font-medium`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
