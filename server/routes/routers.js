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
  upload,
  Login,
  Logout,
  RegisterUser,
  SendRegistrationConfirmationCode,
  AddNewRosterMember,
  DeleteRosterMember,
  GetRosterMembersByOrganization,
  GetSingleRosterMember,
  UpdateRosterMember,
  AddPresident,
  GetAllAccreditationDetails,
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
  updateDocument,
  uploadFileAndAddDocument,
  uploadFileAndUpdateDocument,
  PostOrganizationProfile,
} from "../controller/index.js";

const router = express.Router();

/* ========== TESTING ROUTES========== */
router.get("/get-accreditation-details/:orgId", GetAllAccreditationDetails);
router.post(
  "/add-reciept-accreditation/:accreditationId",
  GetAllAccreditationDetails
);

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
router.post("/initial-registration", upload.any(), PostOrganizationProfile);

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

/* ========== ROSTERMemberS ========== */
router.post("/add-rosterMember-member", AddNewRosterMember);
router.get("/get-rosterMember-member/:rosterMemberId", GetSingleRosterMember);
router.get(
  "/get-rosterMember-members/:organizationId",
  GetRosterMembersByOrganization
);
router.patch("/update-rosterMember-member/:rosterMemberId", UpdateRosterMember);
router.delete(
  "/delete-rosterMember-member/:rosterMemberId",
  DeleteRosterMember
);

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
