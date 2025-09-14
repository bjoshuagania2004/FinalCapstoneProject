import { Accomplishment, SubAccomplishment } from "../models/index.js";

export const getAccomplishmentReport = async (req, res) => {
  try {
    const { OrgProfileId } = req.params;

    if (!OrgProfileId) {
      return res.status(400).json({ error: "Missing organizationProfile ID." });
    }

    // 1️⃣ Ensure Accomplishment Report exists
    let report = await Accomplishment.findOne({
      organizationProfile: OrgProfileId,
    })
      .populate({
        path: "accomplishments",
        populate: {
          path: "proposal", // ✅ populate proposal inside accomplishments
        },
      })
      .select("accomplishments grandTotal");

    if (!report) {
      // Create new if not exists
      report = new Accomplishment({
        organizationProfile: OrgProfileId,
        accomplishments: [],
        totalOrganizationalDevelopment: 0,
        totalOrganizationalPerformance: 0,
        totalServiceCommunity: 0,
        grandTotal: 0,
      });

      await report.save();

      report = await Accomplishment.findById(report._id).populate({
        path: "accomplishments",
        populate: { path: "proposal" },
      });
    }

    return res.status(200).json(report);
  } catch (error) {
    console.error("❌ Error fetching/creating accomplishment report:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve or create accomplishment report." });
  }
};

// ✅ Add a Sub-Accomplishment (PPA, Meeting, Award, etc.)
export const addAccomplishment = async (req, res) => {
  try {
    const { accomplishmentId, category, title, level, proposal, description } =
      req.body;

    if (!accomplishmentId || !category) {
      return res.status(400).json({
        error: "Missing required fields (accomplishmentId or category).",
      });
    }

    const report = await Accomplishment.findById(accomplishmentId);
    if (!report) {
      return res
        .status(404)
        .json({ error: "Accomplishment report not found." });
    }

    // ✅ Build only the fields that are provided
    const subAccData = { category };
    if (title) subAccData.title = title;
    if (proposal) subAccData.proposal = proposal;
    if (level) subAccData.level = level;
    if (description) subAccData.description = description;

    // 1️⃣ Create SubAccomplishment doc
    const subAcc = new SubAccomplishment(subAccData);
    await subAcc.save();

    // 2️⃣ Link it to parent report
    report.accomplishments.push(subAcc._id);
    await report.save();

    return res.status(201).json({
      message: "Sub-accomplishment added successfully.",
      subAccomplishment: subAcc,
    });
  } catch (error) {
    console.error("❌ Error adding sub-accomplishment:", error);
    return res.status(500).json({ error: "Failed to add sub-accomplishment." });
  }
};
