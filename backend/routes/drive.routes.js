const express = require("express");
const router = express.Router();
const { createDrive, getAllDrives, getDriveById, updateDrive, deleteDrive } = require("../controllers/drive.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

router.get("/", protect, getAllDrives);
router.get("/:id", protect, getDriveById);
router.post("/", protect, authorizeRoles("tpo"), createDrive);
router.put("/:id", protect, authorizeRoles("tpo"), updateDrive);
router.delete("/:id", protect, authorizeRoles("tpo"), deleteDrive);

module.exports = router;