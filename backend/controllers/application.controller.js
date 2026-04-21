const Application = require("../models/Application.model");
const Drive = require("../models/Drive.model");

const applyToDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.driveId);
    if (!drive) return res.status(404).json({ message: "Drive not found" });
    if (drive.status === "closed") return res.status(400).json({ message: "Drive is closed" });

    const student = req.user;
    const { minCgpa, allowedBranches, maxBacklogs } = drive.eligibility;

    if (student.cgpa < minCgpa)
      return res.status(400).json({ message: `Minimum CGPA required: ${minCgpa}` });

    if (allowedBranches.length > 0 && !allowedBranches.includes(student.branch))
      return res.status(400).json({ message: `Your branch is not eligible for this drive` });

    if (student.backlogsCount > maxBacklogs)
      return res.status(400).json({ message: `Maximum backlogs allowed: ${maxBacklogs}` });

    const alreadyApplied = await Application.findOne({ drive: drive._id, student: student._id });
    if (alreadyApplied) return res.status(400).json({ message: "Already applied to this drive" });

    const application = await Application.create({
      drive: drive._id,
      student: student._id,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("drive", "companyName jobRole ctc location deadline status");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDriveApplications = async (req, res) => {
  try {
    const applications = await Application.find({ drive: req.params.driveId })
      .populate("student", "name email branch cgpa backlogsCount resumeUrl");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, currentRound } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, currentRound },
      { new: true }
    ).populate("student", "name email").populate("drive", "companyName jobRole");

    if (!application) return res.status(404).json({ message: "Application not found" });

    const io = req.app.get("io");
    if (io) {
      io.to(application.student._id.toString()).emit("statusUpdate", {
        type: "statusUpdate",
        message: getStatusMessage(status, application.drive.companyName),
        status,
        companyName: application.drive.companyName,
        jobRole: application.drive.jobRole,
      });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStatusMessage = (status, companyName) => {
  const messages = {
    shortlisted: `🎯 You've been shortlisted at ${companyName}!`,
    interview:   `📅 Interview scheduled at ${companyName}!`,
    selected:    `🎉 Congratulations! You've been selected at ${companyName}!`,
    rejected:    `Thank you for applying to ${companyName}. Keep going!`,
  };
  return messages[status] || `Your application status updated at ${companyName}`;
};

const getAnalytics = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "branch cgpa")
      .populate("drive", "companyName ctc");

    const totalStudents = await require("../models/User.model").countDocuments({ role: "student" });
    const placed = applications.filter(a => a.status === "selected").length;
    const totalApplications = applications.length;

    const statusBreakdown = {
      applied: 0, shortlisted: 0, interview: 0, selected: 0, rejected: 0
    };
    applications.forEach(a => { if (statusBreakdown[a.status] !== undefined) statusBreakdown[a.status]++; });

    const branchStats = {};
    applications.forEach(a => {
      const branch = a.student?.branch || "Unknown";
      if (!branchStats[branch]) branchStats[branch] = { total: 0, selected: 0 };
      branchStats[branch].total++;
      if (a.status === "selected") branchStats[branch].selected++;
    });

    const companyStats = {};
    applications.forEach(a => {
      const company = a.drive?.companyName || "Unknown";
      if (!companyStats[company]) companyStats[company] = { total: 0, selected: 0, ctc: a.drive?.ctc || 0 };
      companyStats[company].total++;
      if (a.status === "selected") companyStats[company].selected++;
    });

    const ctcData = applications
      .filter(a => a.status === "selected" && a.drive?.ctc)
      .map(a => ({ company: a.drive.companyName, ctc: a.drive.ctc / 100000 }));

    res.json({
      totalStudents,
      placed,
      totalApplications,
      placementRate: totalStudents > 0 ? Math.round((placed / totalStudents) * 100) : 0,
      statusBreakdown,
      branchStats,
      companyStats,
      ctcData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { applyToDrive, getMyApplications, getDriveApplications, updateApplicationStatus, getAnalytics };