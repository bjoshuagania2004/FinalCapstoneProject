import DocumentUploader from "../../../../components/document_uploader";
import { API_ROUTER } from "../../../../App";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Upload,
  Download,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

export default function AccreditationDocuments({ orgData }) {
  const [accreditationData, setAccreditationData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [uploadingDocType, setUploadingDocType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const orgId = orgData?._id;

  useEffect(() => {
    const fetchAccreditationInfo = async () => {
      if (!orgId) return;
      try {
        const { data } = await axios.get(
          `${API_ROUTER}/getAccreditationInfo/${orgId}`,
          {
            withCredentials: true,
          }
        );
        setAccreditationData(data);
      } catch (err) {
        console.error("Error fetching accreditation info:", err);
      }
    };
    fetchAccreditationInfo();
  }, [orgId]);

  const handleUpload = async () => {
    if (!selectedFile || !uploadingDocType || !accreditationData) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append(
      "organizationProfile",
      accreditationData.organizationProfile._id
    );
    formData.append(
      "organization",
      accreditationData.organizationProfile.organization
    );
    formData.append("file", selectedFile);
    formData.append("accreditationId", accreditationData._id);
    formData.append("docType", uploadingDocType);

    try {
      await axios.post(`${API_ROUTER}/addAccreditationDocument`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAccreditationData((prev) => ({
        ...prev,
        [uploadingDocType]: {
          fileName: selectedFile.name,
          status: "Pending",
          createdAt: new Date().toISOString(),
        },
      }));

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowPopup(false);
        setUploadingDocType(null);
        setSelectedFile(null);
        setIsUploading(false);
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setUploadingDocType(null);
    setSelectedFile(null);
    setIsUploading(false);
  };

  const openUpload = (docType) => {
    setUploadingDocType(docType);
    setSelectedFile(null);
    setShowPopup(true);
  };

  const getStatusStyle = (status) => {
    const styles = {
      Approved: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      default: "bg-gray-100 text-gray-500",
    };
    return styles[status] || styles.default;
  };

  const getStatusIcon = (status) => {
    return status === "Approved" ? (
      <CheckCircle className="w-4 h-4" />
    ) : status === "Pending" ? (
      <Clock className="w-4 h-4" />
    ) : null;
  };

  const DocumentCard = ({ label, doc, docKey }) =>
    console.log(accreditationData) || doc?.fileName ? (
      <div className="flex-1 h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-xl text-gray-900">{label}</h3>
          <p className="text-lg text-gray-500">
            Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
          </p>
          <div
            className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusStyle(
              doc.status
            )}`}
          >
            {getStatusIcon(doc.status)}
            <span>{doc.status}</span>
          </div>
        </div>

        <div className="w-full h-full  border rounded-md overflow-hidden mb-4">
          <iframe
            src={`/${accreditationData.organizationProfile._id}/${accreditationData[docKey]?.fileName}#toolbar=0&navpanes=0&scrollbar=0`}
            title={`${label} PDF Viewer`}
            className="w-full h-full"
          />
        </div>
      </div>
    ) : (
      <div
        onClick={() => openUpload(docKey)}
        className="border-2 w-full h-full flex flex-col justify-center items-center border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <div className="text-center">
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium">Upload {label}</p>
          <p className="text-sm text-gray-500">Click to select file</p>
        </div>
      </div>
    );
  if (!accreditationData) return null;

  const { JointStatement, PledgeAgainstHazing } = accreditationData;

  return (
    <div className="mt-4 flex flex-col bg-white rounded-2xl shadow-md p-6 h-full">
      <div className="flex overflow-auto justify-between gap-8 w-full h-full">
        <DocumentCard
          label="Joint Statement"
          doc={JointStatement}
          docKey="JointStatement"
        />
        <DocumentCard
          label="Pledge Against Hazing"
          doc={PledgeAgainstHazing}
          docKey="PledgeAgainstHazing"
        />
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {showSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  Upload Complete!
                </h3>
                <p className="text-gray-600">
                  Your document has been successfully uploaded and is pending
                  review.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  Upload {uploadingDocType?.replace(/([A-Z])/g, " $1")}
                </h3>

                <DocumentUploader
                  onFileSelect={setSelectedFile}
                  acceptedFormats="application/pdf"
                  title={`Select PDF for ${uploadingDocType?.replace(
                    /([A-Z])/g,
                    " $1"
                  )}`}
                />

                {selectedFile && (
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </button>
                    <button
                      onClick={closePopup}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
