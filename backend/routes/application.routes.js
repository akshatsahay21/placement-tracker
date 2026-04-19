const express = require("express");
const router = express.Router();
const {
  applyToDrive,
  getMyApplications,
  getDriveApplications,
  updateApplicationStatus,
} = require("../controllers/application.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

router.post("/apply/:driveId", protect, authorizeRoles("student"), applyToDrive);
router.get("/my", protect, authorizeRoles("student"), getMyApplications);
router.get("/drive/:driveId", protect, authorizeRoles("tpo", "company"), getDriveApplications);
router.put("/:id/status", protect, authorizeRoles("tpo", "company"), updateApplicationStatus);

module.exports = router;