import multer from "multer";
import express from "express";
import * as Controller from "./controller/index.js";

const router = express.Router();
const storage = multer.memoryStorage(); // or use diskStorage for local saving

/*
**********                                **********
**********                                **********
          STUDENT DEVELOPMENT ORGANIZATION
**********                                **********
**********                                ********** 
*/
/* ********** STUDENT DEVELOPMENT ORGANIZATION ********** */
router.get("/getAllOrganizationProfile", Controller.GetAllOrganizationProfile);
router.get("/getAllOrganization/", Controller.GetAllOrganization);

/* ********** STUDENT DEVELOPMENT ACCREDITATION ********** */
router.get("/getAllAccreditationId", Controller.GetAllAccreditationId);
router.get(
  "/checkAccreditationApprovalStatuses/:orgProfileId",
  Controller.CheckAccreditationApprovalStatus
);
/* ********** STUDENT DEVELOPMENT PRESIDENT ********** */
router.post(
  "/approvePresidentProfile/:presidentId",
  Controller.ApprovePresidentProfile
);

/* ********** STUDENT DEVELOPMENT ROSTER ********** */
router.get("/getAllroster", Controller.GetRosterAllMembers);
router.get(
  "/getRosterByOrg/:orgProfileId",
  Controller.GetRosterMembersByOrganizationIdSDU
);
router.post("/CompleteStudentRoster/:rosterId", Controller.CompleteRosterList);
router.post("/ApproveRosterList/:rosterId", Controller.ApprovedRosterList);
router.post("/RevisionRosterList/:rosterId", Controller.revisionNoteRosterList);

/*
**********              **********
**********              **********
          STUDENT LEADER
**********              **********
**********              ********** 
*/

/* **********  STUDENT LEADER FINANCIAL REPORT ********** */
router.get("/getFinancialReport/:OrgProfileId", Controller.getFinancialReport);
router.post(
  "/addReciept",
  Controller.uploadFileAndAddDocument,
  Controller.AddReceipt
);

/* **********  STUDENT LEADER ACCREDITATION ********** */
router.get(
  "/getAccreditationInfo/:orgProfileId",
  Controller.GetAccreditationDetails
);

/* ********** STUDENT LEADER PROPOSAL ********** */
router.get(
  "/getStudentLeaderProposalById/:accreditationId",
  Controller.getStudentPpaByAccreditationId
);
router.post("/postStudentLeaderProposal", Controller.postStudentLeaderProposal);
router.post(
  "/UpdateStudentLeaderProposal/:ProposalId",
  Controller.updateStudentLeaderProposal
);
/* ********** STUDENT LEADER DOCUMENTS ********** */
router.post(
  "/addAccreditationDocument",
  Controller.uploadFileAndAddDocument,
  Controller.AddAccreditationDocument
);

/* ********** STUDENT LEADER ROSTER MEMBER ********** */
router.get(
  "/getRosterMembers/:orgProfileId",
  Controller.GetRosterMemberByOrganization
);
router.post(
  "/addRosterMember",
  Controller.uploadFileAndAddDocument,
  Controller.AddNewRosterMember
);

/* ********** STUDENT LEADER PRESIDENT ********** */
router.post("/addPresident", Controller.AddPresident);
router.post(
  "/addPresidentProfile/:presidentId",
  Controller.uploadFileAndAddDocument,
  Controller.UpdatePresidentProfile
);
router.get("/getPresidents/:orgId", Controller.GetPresidentByOrg);
router.get("/getPresident/:orgPresidentId", Controller.GetPresidentById);

/* ********** GENERAL ********** */
router.post(
  "/uploadOrganizationLogo",
  Controller.uploadFileAndAddDocument,
  Controller.PostOrganizationalLogo
);
router.get("/userInfo/:userId", Controller.GetUserInformation);
router.get(
  "/getOrganizationProfile/:orgProfileId",
  Controller.GetOrganizationProfileInformation
);
router.post("/login", Controller.Login);
router.post("/logout", Controller.Logout);
router.get("/session-check", Controller.CheckSession);

router.post("/sendVerification", Controller.SendRegistrationConfirmationCode);
router.post(
  "/confirmVerification",
  Controller.ConfirmRegistration,
  Controller.RegisterUser
);
router.post("/initialRegistration", Controller.PostInitialOrganizationProfile);
router.get("/documents/:id", Controller.getDocumentById);

export default router;
