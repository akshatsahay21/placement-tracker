const express = require("express");
const router = express.Router();
const { matchResume } = require("../controllers/match.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/:driveId", protect, authorizeRoles("student"), upload.single("resume"), matchResume);

module.exports = router;