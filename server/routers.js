import multer from "multer";
import express from "express";
import * as Controller from "./controller/index.js";

const router = express.Router();
const storage = multer.memoryStorage();
export const upload = multer({ storage });
/*
**********                                **********
**********                                **********
          STUDENT DEVELOPMENT ORGANIZATION
**********                                **********
**********                                ********** 
*/
/* ********** STUDENT DEVELOPMENT ORGANIZATION ********** */
router.get("/getAllOrganizationProfile", Controller.GetAllOrganizationProfile);
router.get("/getOrganizationProfile", Controller.GetAllOrganizationProfile);
router.get("/getAllProposedActionPlan", Controller.getAllProposedActionPlan);
router.get("/getAllOrganization/", Controller.GetAllOrganization);
router.get(
  "/getAllActiveOrganizationProfile/",
  Controller.GetAllActiveOrganizationsWithDetails
);

/* ********** STUDENT DEVELOPMENT ACCREDITATION ********** */
router.post("/UpdateDocument/:documentId", Controller.UpdateDocumentStatus);
router.post(
  "/DeactivateAllAccreditation/",
  Controller.DeactivateAllAccreditations
);

/* ********** STUDENT DEVELOPMENT DOCUMENTS ********** */
router.get("/getAllAccreditationId", Controller.GetAllAccreditationId);
router.get("/getAccreditation/:id", Controller.GetAccreditationById);
router.post(
  "/sendAccreditationConfirmationEmail/:orgProfileId",
  Controller.SendAccreditationCompletionEmail
);
router.get(
  "/checkAccreditationApprovalStatuses/:orgProfileId",
  Controller.CheckAccreditationApprovalStatus
);
/* ********** STUDENT DEVELOPMENT PRESIDENT ********** */
router.post(
  "/approvePresidentProfile/:presidentId",
  Controller.ApprovePresidentProfile
);
router.post(
  "/revisionPresidentProfile/:presidentId",
  Controller.RevisionPresidentProfile
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
router.get(
  "/getAllCollaboratingOrganizationProfile",
  Controller.GetAllOrganizationProfileStudent
);

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
router.post(
  "/postStudentLeaderProposal",
  Controller.uploadFileAndAddDocument,
  Controller.postStudentLeaderProposal
);
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
router.get(
  "/getPreviousPresident/:orgId",
  Controller.getPreviousPresidentsByOrg
);
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
router.post("/reRegistration", Controller.ReRegisterOrganizationProfile);
router.get("/documents/:id", Controller.getDocumentById);
router.get("/documents/:id", Controller.getDocumentById);

router.post("/CheckUsingAI", upload.single("file"), Controller.getAIFeedback);

export default router;
