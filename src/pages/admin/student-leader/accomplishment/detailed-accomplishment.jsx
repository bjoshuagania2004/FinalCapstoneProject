import { Award, FileText, Calendar, X } from "lucide-react";
import { useState } from "react";
import { API_ROUTER } from "../../../../App";
import axios from "axios";
import DocumentUploader from "../../../../components/document_uploader";
export function StudentAccomplishmentDetailed({
  getCategoryIcon,
  formatDate,
  getCategoryColor,
  selectedAccomplishment,
}) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  // 1️⃣ Required documents mapping
  const requiredDocuments = {
    // ✅ Activities Based on PPA
    "Proposed Action Plan": [
      "Attendance Sheet",
      "Narrative Report",
      "Photo Documentation",
      "Financial/Liquidation Report",
      "Summary of Evaluation",
      "Sample evaluation (Minimum Required: 10) ",
      "Resolution (Optional)",
    ],

    // ✅ Institutional Activities
    "Institutional Activities": [
      "Narrative Report",
      "Attendance Sheet",
      "Certificate of Participation",
      "Photo Documentation",
    ],

    // ✅ External Activities
    "External Activities": [
      "Official Invitation",
      "Narrative Report",
      "Photo Documentation",
      "CMO 63 s. 2017 documents",
      "Liquidation Report (Optional - Funds came from the Organization)",
      "Echo Seminar/Training documents (Optional - Funds came from the School)",
    ],

    // ✅ Meetings
    "Meetings & Assemblies": [
      "Minutes",
      "Photo Documentation",
      "Resolution (Optional)",
    ],
  };

  const handleDocClick = (doc) => {
    setSelectedDoc(doc);
    setPopupOpen(true);
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {selectedAccomplishment ? (
        <div className="h-full overflow-y-auto p-6">
          <div className="flex justify-between items-center">
            {/* Category Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium mb-4 ${getCategoryColor(
                selectedAccomplishment.category
              )}`}
            >
              {getCategoryIcon(selectedAccomplishment.category)}
              {selectedAccomplishment.category}
            </div>

            <div>
              <div className="flex w-full text-xs justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>
                    Created: {formatDate(selectedAccomplishment.createdAt)}
                  </span>
                </div>
                {selectedAccomplishment.updatedAt !==
                  selectedAccomplishment.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Updated: {formatDate(selectedAccomplishment.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-100  rounded-full ">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">
                  {selectedAccomplishment.awardedPoints} Points Awarded
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font text-gray-900 mb-3 leading-tight">
            <span className=" font-black">Title:</span>
            {selectedAccomplishment.title}
          </h2>
          {/* Description */}
          <p className="text-gray-700 mb-6">
            <span className="font-semibold">Description:</span>
            <span className=" italic">
              {selectedAccomplishment.description}
            </span>
          </p>
          {/* Points */}

          {/* Documents */}
          {selectedAccomplishment.documents &&
            selectedAccomplishment.documents.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Documents
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded">
                  <FileText className="w-4 h-4" />
                  {selectedAccomplishment.documents.length} file
                  {selectedAccomplishment.documents.length !== 1
                    ? "s"
                    : ""}{" "}
                  attached
                </div>
              </div>
            )}

          {/* 2️⃣ Required Documents Checklist */}
          {requiredDocuments[selectedAccomplishment.category] && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Required Documents
              </h4>
              <ul className="space-y-2">
                {requiredDocuments[selectedAccomplishment.category].map(
                  (doc, index) => {
                    const uploaded = selectedAccomplishment.documents?.some(
                      (d) => d.name?.toLowerCase().includes(doc.toLowerCase())
                    );
                    return (
                      <li
                        key={index}
                        onClick={() => handleDocClick(doc)}
                        className={`flex items-center gap-2 p-2 rounded border ${
                          uploaded
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <FileText
                          className={`w-4 h-4 ${
                            uploaded ? "text-green-600" : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            uploaded
                              ? "text-green-700 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {doc}
                        </span>
                        {uploaded && (
                          <span className="ml-auto text-xs text-green-600">
                            Uploaded
                          </span>
                        )}
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">
            Select an accomplishment to view details
          </p>
        </div>
      )}

      {popupOpen && (
        <DocumentPopup
          popupOpen={popupOpen}
          setPopupOpen={setPopupOpen}
          selectedDoc={selectedDoc}
          selectedAccomplishment={selectedAccomplishment}
        />
      )}
    </div>
  );
}

export function DocumentPopup({
  popupOpen,
  setPopupOpen,
  selectedDoc,
  selectedAccomplishment,
}) {
  const [file, setFile] = useState(null);

  if (!popupOpen) return null;
  console.log(selectedAccomplishment);
  const SubmitFile = async (e) => {
    if (!file) return alert("Please select a file before uploading.");

    try {
      const formData = new FormData();
      formData.append(
        "organizationProfile",
        selectedAccomplishment.proposal.organizationProfile
      );
      formData.append("label", selectedDoc);
      formData.append("file", file);

      // ✅ Log formData entries
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Uncomment when ready to upload
      // const res = await axios.post(`${API_ROUTER}/uploadDocument`, formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      // console.log("Upload Success:", res.data);
      // setPopupOpen(false);
    } catch (error) {
      console.error("Upload Failed:", error.response || error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-1/4 p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => setPopupOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold mb-4">{selectedDoc}</h2>

        {/* Existing Uploaded Files */}
        {selectedAccomplishment.documents?.filter((d) =>
          d.name?.toLowerCase().includes(selectedDoc.toLowerCase())
        ).length > 0 ? (
          <div className="mb-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
            {selectedAccomplishment.documents
              .filter((d) =>
                d.name?.toLowerCase().includes(selectedDoc.toLowerCase())
              )
              .map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>{file.name}</span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">No file uploaded yet.</p>
        )}

        {/* ✅ Replaced file input with DocumentUploader */}
        <DocumentUploader
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // stops form bubbling
          }}
          onFileSelect={(selectedFile) => setFile(selectedFile)}
          acceptedFormats="application/pdf"
          title="Select a document to upload"
          showReset={true}
        />

        <button
          type="submit"
          onClick={() => SubmitFile()}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Upload File
        </button>
      </div>
    </div>
  );
}
