import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

export * from "./Presidents.js";
export * from "./accreditation.js";
export * from "./documents.js";
export * from "./financialReport.js";
export * from "./post.js";
export * from "./roster.js";
export * from "./organization.js ";
export * from "./z-general.js";

// Ensure the target directory exists
export const ensureDirExists = (dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (error) {
    console.error("Error creating directory:", error);
  }
};

// Multer storage configuration
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = path.join(process.cwd(), "public", req.body.userId);

    let subDir = "";
    if (file.fieldname === "document") {
      subDir = "documents";
    } else if (file.fieldname === "photo") {
      subDir = "photos";
    } else {
      subDir = "others";
    }

    const uploadPath = path.join(baseDir, subDir);
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
