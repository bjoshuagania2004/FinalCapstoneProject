import { Accreditation } from "../../models/index.js";

export const GetAccreditationDetails = async (req, res) => {
  const orgProfileId = req.params.orgProfileId;

  try {
    let accreditation = await Accreditation.findOne({
      organizationProfile: orgProfileId,
    });

    // If not found OR isActive is false, create a new accreditation
    if (!accreditation || !accreditation.isActive) {
      accreditation = new Accreditation({
        organizationProfile: orgProfileId,
        overallStatus: "Pending",
        isActive: true,
        JointStatement: null,
        PledgeAgainstHazing: null,
        Roster: null,
        PresidentProfile: null,
      });

      await accreditation.save();
    }

    // Always populate after the logic above — whether it was created or found
    accreditation = await Accreditation.findById(accreditation._id)
      .populate([
        "organizationProfile",
        "JointStatement",
        "PledgeAgainstHazing",
        "Roster",
        "PresidentProfile",
      ])
      .exec();

    res.status(201).json(accreditation);
  } catch (error) {
    console.error("Error handling accreditation request:", error);
    res.status(500).json({ error: "Server error" });
  }
};
