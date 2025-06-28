import { Accreditation, Organization } from "./../models/index.js";

/* ==========
INITIAL REGISTRATION ORGANIZATION
(TEXT ONLY)
========== */

export const CreateAccreditation = async (req, res) => {
  const { accreditationId } = req.params;
};

export const GetAllAccreditationDetails = async (req, res) => {
  try {
    2;
    const OrgId = req.params.OrgId; // assuming route like /organization/:orgId

    const organization = await Accreditation.findById(OrgId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({ message: "accreditation Found", accreditations });
  } catch (error) {
    console.error("Error fetching accreditations:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/* ========== FILE UPLOADING ========== */
