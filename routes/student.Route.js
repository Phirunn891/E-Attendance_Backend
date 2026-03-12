
const express = require("express");
const router = express.Router();
const StudentController = require("../controllers/student.controller");
const auth = require("../middleware/authMiddleware")
router.get("/", auth, StudentController.getStudent);
router.get("/:id", auth, StudentController.getStudentByID);
router.post("/", auth, StudentController.createStudent);
router.put("/:id", auth, StudentController.updateStudent);
router.delete("/:id", auth, StudentController.deleteStudent);
router.get("/import", StudentController.getImportPage);
router.post("/import", StudentController.upload.single('file'), StudentController.importStudents);

module.exports = router;
