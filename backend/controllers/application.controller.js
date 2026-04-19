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
    ).populate("student", "name email");

    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyToDrive, getMyApplications, getDriveApplications, updateApplicationStatus };