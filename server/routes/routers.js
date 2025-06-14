import multer from "multer";
import express from "express";
import path from "path";
import fs from "fs";

import {
  UploadMultipleFiles,
  GetAllFile,
  GetAllImageFile,
  GetAllOrganizationFile,
  GetAllStudentPostFiles,
  GetOrganizationFiles,
  UploadSingleFile,
  DeleteSingleFile,
  ArchiveFile,
} from "../middleware/files.js";

import {
  CheckSession,
  ConfirmRegistration,
  GetOrganizationInformation,
  GetUserInformation,
  Login,
  Logout,
  RegisterUser,
  SendRegistrationConfirmationCode,
} from "../controller/z-general.js";

import {
  AddNewRoster,
  DeleteRoster,
  GetRostersByOrganization,
  GetSingleRoster,
  UpdateRoster,
} from "../controller/roster.js";

import { AddPresident } from "../controller/Presidents.js";
import { PostInitialRegistration } from "../controller/accreditation.js";
import {
  createFinancialReport,
  createReceipt,
  deleteFinancialReport,
  deleteReceipt,
  getAllFinancialReports,
  getAllReceipts,
  getFinancialReportById,
  getSingleReceipt,
  updateFinancialReport,
  updateReceipt,
} from "../controller/financialReport.js";
import {
  updateDocument,
  uploadFileAndAddDocument,
  uploadFileAndUpdateDocument,
} from "../controller/documents.js";

const router = express.Router();

// Set storage location and filename format
// Ensure the target directory exists (using an absolute path)
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
    const baseDir = path.join(process.cwd(), "../public", req.body.userId);

    // Divide files based on field name: "document" or "photo"
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
    // Prepend a timestamp to the original filename
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

/* ========== TESTING ROUTES========== */

router.delete("/delete-file", DeleteSingleFile, (req, res) => {
  return res.status(200).json({
    message: `File '${req.deletedFile}' deleted successfully.`,
  });
});

/* ========== GENERAL ========== */

router.post("/login", Login);
router.post("/logout", Logout);
router.get("/session-check", CheckSession);

router.post("/send-verification", SendRegistrationConfirmationCode);
router.post("/confirm-verification", ConfirmRegistration, RegisterUser);
router.post("/initial-registration", upload.any(), PostInitialRegistration);

/* ========== STUDENT LEADER ========== */
router.get("/user-info/:userId", GetUserInformation);
router.get("/get-organization/:id", GetOrganizationInformation);

/* ========== SANDBOX ========== */
router.post("/sandbox-update", uploadFileAndUpdateDocument, updateReceipt);
router.post("/sandbox-add", uploadFileAndAddDocument, createReceipt);

/* ========== DOCUEMTNS ========== */
router.post("/add-document", uploadFileAndAddDocument, createReceipt);

router.put(
  "/update-document/:id",
  ArchiveFile,
  UploadSingleFile,
  updateDocument
);

/* ========== ROSTERS ========== */
router.post("/add-roster-member", AddNewRoster);
router.get("/get-roster-member/:rosterId", GetSingleRoster);
router.get("/get-roster-members/:organizationId", GetRostersByOrganization);
router.patch("/update-roster-member/:rosterId", UpdateRoster);
router.delete("/delete-roster-member/:rosterId", DeleteRoster);

/* ========== RECEIPTS ========== */
router.post("/add-receipt", UploadSingleFile, createReceipt);
router.put("/update-receipt/:id", UploadSingleFile, createReceipt);
router.get("/get-all-receipt", getAllReceipts);
router.get("/get-single-receipt/:id", getSingleReceipt);
router.delete("/delete-receipt/:id", deleteReceipt);

/* ========== FINANCIAL REPORT ========== */

router.post(
  "/add-financial-report",
  UploadMultipleFiles,
  createFinancialReport
);
router.get("/get-financial-report/:Id", getAllFinancialReports);
router.get("/get-financial-reports/:Id", getFinancialReportById);
router.patch("/update-financial-report/:Id", updateFinancialReport);
router.delete("/delete-financial-report/:Id", deleteFinancialReport);

/* ========== PRESIDENTS ========== */
router.post("/add-president", AddPresident);

export default router;
