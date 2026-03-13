const sequelize = require("./Config/db");
// const Category = require("./models/categoryModels");
const Student = require("./models/studentModel");
const Teacher = require("./models/teacherModel");
const Subject = require("./models/subjectModel");
const Class = require("./models/classModel");
const Ateendance = require("./models/attendanceModel");
const User = require("./models/userModel");
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Migration completed");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  }
})();