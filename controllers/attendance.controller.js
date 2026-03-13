const { QueryTypes } = require('sequelize');
const sequelize = require('../Config/db');
const Attendance = require("../models/attendanceModel");
const Student = require("../models/studentModel");
const Subject = require("../models/subjectModel");
const Teacher = require("../models/teacherModel");

// GET ATTENDANCE PAGE
exports.getAttendancePage = async (req, res) => {
    try {
        const students = await Student.findAll();
        const subjects = await Subject.findAll();
        const teachers = await Teacher.findAll();
        
        res.render('attendance', { 
            title: 'Daily Attendance',
            students: students,
            subjects: subjects,
            teachers: teachers
        });
    } catch (err) {
        res.status(500).send("Error fetching data: " + err.message);
    }
};

// SAVE ATTENDANCE
exports.saveAttendance = async (req, res) => {
    try {
        const { records } = req.body;
        
        if (!records || !Array.isArray(records)) {
            return res.status(400).json({ 
                statusCode: 400,
                message: "Invalid records format. Expected an array of records." 
            });
        }

        await Attendance.bulkCreate(records, {
            updateOnDuplicate: ['status']
        });

        res.status(200).json({
            statusCode: 200,
            message: "Attendance saved successfully!",
            count: records.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            statusCode: 500,
            message: "Error saving attendance: " + err.message
        });
    }
};

// GET ATTENDANCE SUMMARY (Present/Absent counts)
exports.getAttendanceSummary = async (req, res) => {
    try {
        const results = await sequelize.query(`
            SELECT 
                s.student_id, 
                s.studentname_kh, 
                s.studentname_eng, 
                s.gender, 
                s.class_id,
                c.class_name,
                COUNT(CASE WHEN a.status = 1 THEN 1 END) as totalPresent,
                COUNT(CASE WHEN a.status = 0 THEN 1 END) as totalAbsent
            FROM students s
            LEFT JOIN Classes c ON s.class_id = c.class_id
            LEFT JOIN attendances a ON s.student_id = a.student_id
            GROUP BY s.student_id, c.class_name
        `, { type: QueryTypes.SELECT });

        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: results
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            statusCode: 500,
            message: "Error fetching summary: " + err.message 
        });
    }
};
// GET ATTENDANCE DETAILS
exports.getAttendanceDetails = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const results = await sequelize.query(`
            SELECT 
                a.student_id, 
                a.att_date, 
                a.status, 
                sub.subject_name
            FROM attendances a
            JOIN subjects sub ON a.subject_id = sub.subject_id
            WHERE a.att_date BETWEEN :startDate AND :endDate
        `, { 
            replacements: { startDate, endDate },
            type: QueryTypes.SELECT 
        });



        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: results
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            statusCode: 500, 
            message: "Error fetching attendance details: " + err.message 
        });
    }
};
