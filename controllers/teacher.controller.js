const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacherModel");

// Get ALL Teachers
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll();
        res.status(200).json({
            success: true,
            total: teachers.length,
            data: teachers
        });
    } catch (err) {
        console.log("Error:", err);
        res.status(404).json({
            success: false,
            total: "Error Server",
            error: err.message

        })
    }
}
// POST ALL TEACHER
const createTeacher = async (req,res) =>{
    try {
        const {teachername_kh, teachername_eng, phone} = req.body;
        const teacher = await Teacher.create({
            teacher_kh,
            teacher_eng,
            phone
        });
        res.status(201).json({
            success: true,
            total: "Teacher create successfully !!!",
            data: teacher
        })
    } catch (error) {
        console.log("Error: ", error);
        res.status(404).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
}
// GET Teacher By Id
const getTeacherById = async (req, res)=>{
    try {
        const teacher = await Teacher
    } catch (error) {
        
    }
}