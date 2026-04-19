const Drive = require("../models/Drive.model");

const createDrive = async (req, res) => {
  try {
    const drive = await Drive.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(drive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDrives = async (req, res) => {
  try {
    const drives = await Drive.find({ status: { $ne: "closed" } }).sort({ createdAt: -1 });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDriveById = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).json({ message: "Drive not found" });
    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDrive = async (req, res) => {
  try {
    const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!drive) return res.status(404).json({ message: "Drive not found" });
    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDrive = async (req, res) => {
  try {
    await Drive.findByIdAndDelete(req.params.id);
    res.json({ message: "Drive deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDrive, getAllDrives, getDriveById, updateDrive, deleteDrive };