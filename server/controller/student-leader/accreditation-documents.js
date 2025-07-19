import { Accreditation } from "../../models/index.js";

export const AddAccreditationDocument = async (req, res) => {
  console.log(req.body);
  try {
    const { accreditationId, docType } = req.body; // docType must be one of the valid fields
    const documentId = res.locals.documentId; // from file upload middleware

    if (!documentId) {
      return res.status(400).json({ error: "Missing documentId" });
    }

    if (!accreditationId) {
      return res.status(400).json({ error: "Missing accreditationId" });
    }

    const accreditation = await Accreditation.findById(accreditationId);

    if (!accreditation) {
      return res.status(404).json({ error: "Accreditation not found" });
    }

    // Use if-else to assign based on docType
    if (docType === "JointStatement") {
      accreditation.JointStatement = documentId;
    } else if (docType === "PledgeAgainstHazing") {
      accreditation.PledgeAgainstHazing = documentId;
    } else {
      return res.status(400).json({ error: "Invalid document type" });
    }

    await accreditation.save();

    res.status(200).json({
      message: `${docType} uploaded and linked successfully to accreditation`,
      accreditation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
