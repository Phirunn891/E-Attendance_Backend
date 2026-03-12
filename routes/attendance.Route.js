
const express = require("express");
const router = express.Router();
const AttendanceController = require("../controllers/attendance.controller");

router.get("/", AttendanceController.getAttendancePage);
router.post("/save", AttendanceController.saveAttendance);
router.get("/logs", AttendanceController.getAttendanceSummary);
router.get("/details", AttendanceController.getAttendanceDetails);


module.exports = router;

