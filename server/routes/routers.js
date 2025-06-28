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
  GetUserInformation,
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
  PostInitialOrganizationProfile,
  AddMultipleRosterMembers,
  GetOrganizationProfileInformation,
  GetAllPresidents,
  GetPresidentByOrg,
  GetPresidentById,
  UpdatePresidentProfile,
} from "../controller/index.js";

const router = express.Router();

const storage = multer.memoryStorage(); // or use diskStorage for local saving
const upload = multer({ storage });

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

router.post("/sendVerification", SendRegistrationConfirmationCode);
router.post("/confirmVerification", ConfirmRegistration, RegisterUser);
router.post("/initialRegistration", PostInitialOrganizationProfile);

router.get(
  "/getOrganizationProfile/:orgProfileId",
  GetOrganizationProfileInformation
);

/* ========== PRESIDENTS ========== */
router.post("/addPresident", AddPresident);
router.get("/getPresidents", GetAllPresidents);
router.get("/getPresidentByOrg/:orgId", GetPresidentByOrg);
router.get("/getPresidentById/:orgPresidentId", GetPresidentById);

/* ========== STUDENT LEADER ========== */
router.get("/userInfo/:userId", GetUserInformation);

router.post(
  "/upload-profile/:presidentId",
  UploadSingleFile,
  UpdatePresidentProfile
);

/* ========== ACCREDITATION ========== */
router.get("/Accreditation/:OrgId", GetAllAccreditationDetails);

/* ========== Reciept ========== */
router.post(
  "/AddReceipt/:organizationProfile",
  uploadFileAndAddDocument,
  createReceipt
);
router.post(
  "/UpdateReceipt/:organizationProfile",
  uploadFileAndUpdateDocument,
  updateReceipt
);

/* ========== DOCUMENTS ========== */
router.put(
  "/UpdateDocument/:id",
  ArchiveFile,
  UploadSingleFile,
  updateDocument
);

/* ========== ROSTER MEMBERS ========== */
router.post("/addRosterMember", AddNewRosterMember);
router.post("/addRosterMembers", AddMultipleRosterMembers);
router.get("/getRosterMember/:rosterMemberId", GetSingleRosterMember);
router.get("/getRosterMembers/:organizationId", GetRosterMembersByOrganization);
router.patch("/updateRosterMember/:rosterMemberId", UpdateRosterMember);
router.delete("/deleteRosterMember/:rosterMemberId", DeleteRosterMember);

/* ========== FINANCIAL REPORT ========== */
router.post("/addFinancialReport", UploadMultipleFiles, createFinancialReport);
router.get("/getFinancialreport/:Id", getAllFinancialReports);
router.get("/getFinancialreport/:Id", getFinancialReportById);
router.patch("/updateFinancialReport/:Id", updateFinancialReport);
router.delete("/deleteFinancialReport/:Id", deleteFinancialReport);

export default router;
