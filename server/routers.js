import multer from "multer";
import express from "express";
import { UploadSingleFile } from "./middleware/files.js";
import {
  ConfirmRegistration,
  RegisterUser,
  SendRegistrationConfirmationCode,
  CheckSession,
  Login,
  PostInitialOrganizationProfile,
  GetUserInformation,
  GetOrganizationProfileInformation,
  Logout,
} from "./controller/general.js";
import {
  AddPresident,
  GetPresidentByOrg,
} from "./controller/student-leader/president.js";
import {
  AddNewRosterMember,
  GetRosterMemberByOrganization,
} from "./controller/student-leader/roster-member.js";
import {
  getDocumentById,
  uploadFileAndAddDocument,
} from "./controller/general-document.js";

import { AddAccreditationDocument } from "./controller/student-leader/accreditation-documents.js";
import { GetAccreditationDetails } from "./controller/student-leader/index-student-leader.js";
import {
  AddReceipt,
  getFinancialReport,
} from "./controller/student-leader/financial-report.js";

const router = express.Router();
const storage = multer.memoryStorage(); // or use diskStorage for local saving
const upload = multer({ storage });

/* ========== STUDENT LEADER ========== */

/* ========== FINANCIAL REPORT ========== */
router.get("/getFinancialReport/:OrgProfileId", getFinancialReport);
router.post("/addReciept", uploadFileAndAddDocument, AddReceipt);

/* ========== ACCREDITATION========== */
router.get("/getAccreditationInfo/:orgProfileId", GetAccreditationDetails);

/* ========== DOCUMENTS ========== */
router.post(
  "/addAccreditationDocument",
  uploadFileAndAddDocument,
  AddAccreditationDocument
);

/* ========== ROSTER MEMBER ========== */
router.get("/getRosterMembers/:orgProfileId", GetRosterMemberByOrganization);
router.post("/addRosterMember", uploadFileAndAddDocument, AddNewRosterMember);

/* ========== PRESIDENT ========== */
router.post("/addPresident", AddPresident);
router.get("/getPresidents/:orgId", GetPresidentByOrg);

/* ========== GENERAL ========== */
router.get("/userInfo/:userId", GetUserInformation);

router.get(
  "/getOrganizationProfile/:orgProfileId",
  GetOrganizationProfileInformation
);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/session-check", CheckSession);

router.post("/sendVerification", SendRegistrationConfirmationCode);
router.post("/confirmVerification", ConfirmRegistration, RegisterUser);
router.post("/initialRegistration", PostInitialOrganizationProfile);
// router.post("/initialRegistration", PostInitialOrganizationProfile);
router.get("/documents/:id", getDocumentById);

export default router;
