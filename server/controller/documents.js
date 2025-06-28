import { Document } from "../models/index.js";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import multer from "multer";
import { CodeSquare } from "lucide-react";

const now = new Date();
const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
  now.getMonth() + 1
).padStart(2, "0")}/${now.getFullYear()}`;

console.log(formattedDate);

const formatDate = formattedDate;

const hours = now.getHours();
const minutes = String(now.getMinutes()).padStart(2, "0");
const ampm = hours >= 12 ? "PM" : "AM";
const formatTime = `${((hours + 11) % 12) + 1}:${minutes} ${ampm}`;

const formatDateTime = () => {
  const now = new Date();
  const formatDate = now.toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
  });
  const formatTime = now.toLocaleTimeString("en-PH", {
    timeZone: "Asia/Manila",
  });
  return { formatDate, formatTime };
};

const ensureDirExists = (dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (error) {
    console.error("Error creating directory:", error);
  }
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const orgId =
      req.body?.organizationProfile ||
      req.params?.organizationProfile ||
      "default-folder";
    const uploadPath = path.join(process.cwd(), "./../public", orgId); // Adjust to your correct public path
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, "_"); // safer filename
    const uniqueName = `${timestamp}-${originalName}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export const uploadFileAndAddDocument = (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({
        error: "File upload failed",
        details: err.message,
      });
    }

    const documentFile = req.file;

    if (!documentFile) {
      return res.status(400).json({
        error: "File is required",
      });
    }

    try {
      const {
        organizationProfile,
        label,
        revisionNotes,
        isPinned,
        logs,
        status,
      } = req.body;

      const document = new Document({
        organizationProfile,
        label,
        fileName: documentFile.filename,
        revisionNotes,
        isPinned: isPinned === "true" || isPinned === true, // Ensure boolean
        logs: Array.isArray(logs) ? logs : logs ? [logs] : [], // Ensure array
        status: status || "Pending",
      });

      await document.save();

      res.locals.documentId = document._id;
      next(); // Pass control to the next middleware (e.g., createReceipt)
    } catch (error) {
      console.error("Document creation error:", error);
      return res.status(400).json({ error: error.message });
    }
  });
};

export const uploadFileAndUpdateDocument = (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({
        error: "File upload failed",
        details: err.message,
      });
    }

    const documentFile = req.file;

    const {
      organization, // Folder or ID used in file path (ensure it's passed from client)
      documentId,
      label,
      revisionNotes,
      isPinned,
      logs = [],
      status,
    } = req.body;

    try {
      const existingDoc = await Document.findById(documentId);
      if (!existingDoc) {
        return res.status(404).json({ error: "Document not found" });
      }

      const updatedLogs = [
        ...(existingDoc.logs || []),
        ...(Array.isArray(logs) ? logs : [logs]),
      ];
      const { formatDate, formatTime } = formatDateTime();

      // Delete old file if new one is uploaded
      if (documentFile && existingDoc.fileName) {
        const oldFilePath = path.join(
          process.cwd(),
          "./../public",
          organization || existingDoc.organizationProfile?.toString(),
          existingDoc.fileName
        );

        try {
          const stats = await fs.promises.stat(oldFilePath);
          if (stats.isFile()) {
            await fs.promises.unlink(oldFilePath);
            updatedLogs.push(
              `Deleted previous file: ${existingDoc.fileName} on ${formatDate} at ${formatTime}`
            );
          }
        } catch (fileErr) {
          console.error("File deletion error:", fileErr);
          updatedLogs.push(
            `Failed to delete file: ${existingDoc.fileName} on ${formatDate} at ${formatTime}`
          );
        }
      }

      // Log new file upload
      if (documentFile) {
        updatedLogs.push(
          `Uploaded new file: ${documentFile.filename} on ${formatDate} at ${formatTime}`
        );
      }

      const updateData = {
        ...(organization && { organizationProfile: organization }),
        ...(label && { label }),
        ...(revisionNotes && { revisionNotes }),
        ...(typeof isPinned !== "undefined" && {
          isPinned: isPinned === "true" || isPinned === true,
        }),
        ...(status && { status }),
        logs: updatedLogs,
      };

      if (documentFile) {
        updateData.fileName = documentFile.filename;
      }

      const updatedDoc = await Document.findByIdAndUpdate(
        documentId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      res.locals.documentId = updatedDoc._id;
      res.locals.updatedDocument = updatedDoc;
      next();
    } catch (error) {
      console.error("Document update error:", error);
      return res.status(400).json({ error: error.message });
    }
  });
};

export const uploadFileAndManageDocument = (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({
        error: "File upload failed",
        details: err.message,
      });
    }

    const documentFile = req.file;
    const isUpdate = req.params.id; // Check if this is an update (has document ID in params)

    try {
      const {
        organization,
        label,
        revisionNotes,
        isPinned = false,
        logs = [],
        status = "Pending",
        fileToDelete, // Previous file to delete
      } = req.body;

      // Handle UPDATE scenario
      if (isUpdate) {
        // Find existing document
        const existingDoc = await Document.findById(isUpdate);
        if (!existingDoc) {
          return res.status(404).json({ error: "Document not found" });
        }

        const updatedLogs = [...logs];

        // Delete old file if specified or if new file is uploaded
        const oldFileToDelete =
          fileToDelete || (documentFile ? existingDoc.file : null);

        if (oldFileToDelete) {
          const filePath = path.join(
            process.cwd(),
            "../public",
            organization || existingDoc.organization,
            oldFileToDelete
          );

          try {
            const stats = await fs.promises.stat(filePath);
            if (stats.isFile()) {
              await fs.promises.unlink(filePath);
              console.log(`File deleted: ${filePath}`);
              updatedLogs.push(
                `Deleted previous file: ${oldFileToDelete} on ${new Date().toISOString()}`
              );
            }
          } catch (fileErr) {
            console.error("File deletion error:", fileErr);
            // Continue with update even if file deletion fails
            updatedLogs.push(
              `Failed to delete file: ${oldFileToDelete} on ${new Date().toISOString()}`
            );
          }
        }

        // Prepare update data
        const updateData = {
          ...(organization && { organization }),
          ...(label && { label }),
          ...(revisionNotes && { revisionNotes }),
          ...(typeof isPinned !== "undefined" && { isPinned }),
          ...(status && { status }),
          logs: updatedLogs,
        };

        // Add new file info if uploaded
        if (documentFile) {
          updateData.name = documentFile.filename;
          updateData.file = documentFile.filename;
          updatedLogs.push(
            `Uploaded new file: ${
              documentFile.filename
            } on ${new Date().toISOString()}`
          );
        }

        // Update document
        const updatedDoc = await Document.findByIdAndUpdate(
          isUpdate,
          updateData,
          { new: true, runValidators: true }
        );

        res.locals.documentId = updatedDoc._id;
        res.locals.isUpdate = true;
        res.locals.updatedDocument = updatedDoc;
      } else {
        // Handle CREATE scenario (original logic)
        if (!documentFile) {
          return res.status(400).json({
            error: "file is required for new document creation",
          });
        }

        const file = documentFile.filename;

        const document = new Document({
          organization,
          label,
          name: file,
          revisionNotes,
          isPinned,
          logs: [
            ...logs,
            `Document created with file: ${file} on ${new Date().toISOString()}`,
          ],
          status,
          file,
        });

        await document.save();

        res.locals.documentId = document._id;
        res.locals.isUpdate = false;
        res.locals.newDocument = document;
      }

      next(); // Proceed to next middleware like createReceipt
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  });
};

// Usage examples:
// For creating new documents:
// router.post('/documents', uploadFileAndAddDocument, createReceipt);

// For updating existing documents:
// router.put('/documents/:id', uploadFileAndUpdateDocument, createReceipt);

// Or using the combined function:
// router.post('/documents', uploadFileAndManageDocument, createReceipt);
// router.put('/documents/:id', uploadFileAndManageDocument, createReceipt);

export const updateDocument = async (req, res) => {
  try {
    const organization = req.params.id;
    const { archivedFile } = req; // comes from MoveFileToArchive
    const documentUpdates = { ...req.body };

    if (archivedFile) {
      documentUpdates.logs = [
        ...(req.body.logs || []),
        `Archived previous file: ${archivedFile} on ${new Date().toISOString()}`,
      ];
    }

    const updatedDoc = await Document.findByIdAndUpdate(
      organization,
      documentUpdates,
      { new: true, runValidators: true }
    );

    if (!updatedDoc)
      return res.status(404).json({ error: "Document not found" });
    res.status(200).json(updatedDoc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate("organization");
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a document by ID
export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate(
      "organization"
    );
    if (!document) return res.status(404).json({ error: "Document not found" });
    res.status(200).json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a document
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ error: "Document not found" });
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pin or unpin a document
export const togglePinDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ error: "Document not found" });

    document.isPinned = !document.isPinned;
    await document.save();

    res.status(200).json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
