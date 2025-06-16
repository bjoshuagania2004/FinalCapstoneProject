import {
  User,
  Organization,
  Accreditation,
  FinancialReport,
} from "./../models/index.js";

/* ==========
INITIAL REGISTRATION ORGANIZATION
(TEXT ONLY)
========== */

export const CreateAccreditation = async (req, res) => {};

export const GetAllAccreditationDetails = async (req, res) => {
  try {
    const orgId = req.params.orgId; // assuming route like /organization/:orgId

    const organization = await Organization.findById(orgId)
      .select("accreditations") // only fetch the 'accreditations' field
      .populate("accreditations"); // populate with data from Accreditation collection

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({ accreditations: organization.accreditations });
  } catch (error) {
    console.error("Error fetching accreditations:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/* ========== FILE UPLOADING ========== */
