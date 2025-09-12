import { Accomplishment, SubAccomplishment } from "../models/index.js";

// ✅ Get or Create Accomplishment Report for an OrgProfile
export const getAccomplishmentReport = async (req, res) => {
  try {
    const { OrgProfileId } = req.params;

    if (!OrgProfileId) {
      return res
        .status(400)
        .json({ error: "Missing organizationProfile or academicYear." });
    }

    // 1️⃣ Ensure Accomplishment Report exists
    let report = await Accomplishment.findOne({
      organizationProfile: OrgProfileId,
    });

    if (!report) {
      report = new Accomplishment({
        organizationProfile: OrgProfileId,
        accomplishments: [],
        totalOrganizationalDevelopment: 0,
        totalOrganizationalPerformance: 0,
        totalServiceCommunity: 0,
        grandTotal: 0,
      });

      await report.save();

      report = await Accomplishment.findById(report._id).populate(
        "organization organizationProfile accomplishments documentRefs"
      );
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
    const {
      reportId, // existing accomplishment report id
      category,
      title,
      description,
      date,
      level,
      numberOfAwardees,
      isApprovedActionPlan,
      documentRefs,
      maxPoints,
      awardedPoints,
    } = req.body;

    if (!reportId || !category) {
      return res
        .status(400)
        .json({ error: "Missing required fields (reportId or category)." });
    }

    const report = await Accomplishment.findById(reportId);
    if (!report) {
      return res
        .status(404)
        .json({ error: "Accomplishment report not found." });
    }

    // 1️⃣ Create SubAccomplishment doc
    const subAcc = new SubAccomplishment({
      category,
      title,
      description,
      date,
      level,
      numberOfAwardees,
      isApprovedActionPlan,
      documentRefs,
      maxPoints,
      awardedPoints,
    });

    await subAcc.save();

    // 2️⃣ Link it to parent report
    report.accomplishments.push(subAcc._id);

    // 3️⃣ Update totals automatically (basic version)
    report.grandTotal += awardedPoints || 0;

    await report.save();

    // 4️⃣ Return populated version
    const updatedReport = await Accomplishment.findById(report._id).populate(
      "organization organizationProfile accomplishments documentRefs"
    );

    return res.status(201).json({
      message: "Sub-accomplishment added successfully.",
      subAccomplishment: subAcc,
      report: updatedReport,
    });
  } catch (error) {
    console.error("❌ Error adding sub-accomplishment:", error);
    return res.status(500).json({ error: "Failed to add sub-accomplishment." });
  }
};
