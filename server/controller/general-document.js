import { Document } from "../models/index.js";
import path from "path";
import fs from "fs";
import multer from "multer";

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const orgId =
      req.body?.organizationProfile ||
      req.params?.organizationProfile ||
      "default-folder";
    const uploadPath = path.join(process.cwd(), "./uploads", orgId);
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  },
});

const upload = multer({ storage });

export const uploadFileAndAddDocument = async (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "File upload failed", details: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }
    console.log("saywhat", req.file);

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
        fileName: req.file.filename,
        revisionNotes,
        isPinned: isPinned === "true" || isPinned === true,
        logs: Array.isArray(logs) ? logs : logs ? [logs] : [],
        status: status || "Pending",
      });

      await document.save();

      res.locals.documentId = document._id;
      res.locals.fileName = req.file.filename;

      next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  });
};

export const getDocumentById = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    return res.status(200).json(document);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch document", details: error.message });
  }
};

export const getDocuments = async (req, res) => {
  const { organizationProfile } = req.params;

  try {
    const query = organizationProfile ? { organizationProfile } : {};
    const documents = await Document.find(query).sort({ createdAt: -1 });

    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
