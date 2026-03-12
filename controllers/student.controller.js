const Student = require("../models/studentModel");
const Class = require("../models/classModel");
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

exports.upload = multer({ storage: storage });

// GET ALL 
exports.getStudent = async (req, res) => {
    try {
        const data = await Student.findAll();
        let d = {
            "statusCode": 200,
            "message": "Get Data Successfully!",
            "data": data
        };
        res.json(d);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// GET ONE DATA
exports.getStudentByID = async (req, res) => {
    try {
        const id = req.params.id;
        message = '';
        if(!Number.isNaN(Number(id))){ //if param is number
            const student = await Student.findByPk(id);
            if (!student) {
                
                return res.status(404).json({ message: "Data not found" });
            }
            res.json(student);
        }else{
            //console.log("False");
            return res.status(400).json({ message: "Invalid parameter!" });
        }      
    } catch (err) {
        res.status(500).json({ message: "Server error:", err });
    }
};

// CREATE 
exports.createStudent = async (req, res) => {
    try {
        const { studentname_kh, studentname_eng, gender, class_id } = req.body;
        const student = await Student.create({
            studentname_kh,
            studentname_eng,
            gender,
            class_id
        });
        
        res.status(201).json({
            statusCode: 201,
            message: "Insert Data Successfully!",
            data: student
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// UPDATE
exports.updateStudent = async (req, res) => {
    try{
        await Student.update(req.body, {
            where: { student_id: req.params.id }
        });
        let rs = {
            "statusCode": 200,
            "message": "Data Updated Successfully!",
            "data": req.body
        };
        res.status(200).json(rs);
    }catch(err){
        res.status(500).json({ message: "Server error: ", err });
    }
};

// DELETE 
exports.deleteStudent = async (req, res) => {
    await Student.destroy({
        where: { student_id: req.params.id }
    });
    res.json({ message: "Student deleted" });
};

function normalizeKey(k) {
    return k.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').replace(/__+/g, '_').replace(" ", '_');
}

// Import Student Page
exports.importStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No File Uploaded !!!" });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Fetch existing students for duplicate check
        const existingStudents = await Student.findAll({
            attributes: ['studentname_kh', 'studentname_eng']
        });
        
        const existingSet = new Set(existingStudents.map(s => 
            `${s.studentname_kh || ''}|${s.studentname_eng || ''}`.toLowerCase().trim()
        ));

        const studentsToInsert = [];
        const seenInFile = new Set();
        const classCache = {};
        let duplicateCount = 0;

        for (const rawRow of data) {
            const row = {};
            for (const key in rawRow) {
                row[key.trim().toLowerCase()] = rawRow[key];
            }

            // Map fields (supporting multiple common names)
            const studentname_kh = (row["studentname_kh"] || row["name kh"] || row["first name"])?.toString().trim();
            const studentname_eng = (row["studentname_eng"] || row["name eng"] || row["last name"])?.toString().trim();
            const gender = (row["gender"])?.toString().trim();
            const class_name = (row["class_name"] || row["class"])?.toString().trim();

            if (!studentname_kh && !studentname_eng) continue;

            const nameKey = `${studentname_kh || ''}|${studentname_eng || ''}`.toLowerCase().trim();

            // Skip if duplicate in database
            if (existingSet.has(nameKey)) {
                duplicateCount++;
                continue;
            }

            // Skip if duplicate within the Excel file itself
            if (seenInFile.has(nameKey)) {
                duplicateCount++;
                continue;
            }

            seenInFile.add(nameKey);

            let classId = null;
            if (class_name) {
                classId = classCache[class_name];
                if (!classId) {
                    let foundClass = await Class.findOne({ where: { class_name } });
                    if (!foundClass) {
                        foundClass = await Class.create({ class_name });
                    }
                    classId = foundClass.class_id;
                    classCache[class_name] = classId;
                }
            }

            studentsToInsert.push({
                studentname_kh,
                studentname_eng,
                gender,
                class_id: classId
            });
        }

        if (studentsToInsert.length > 0) {
            await Student.bulkCreate(studentsToInsert);
        }

        res.json({
            message: `Import Completed: ${studentsToInsert.length} students imported, ${duplicateCount} duplicates skipped.`,
            imported: studentsToInsert.length,
            duplicatesSkipped: duplicateCount
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

exports.getImportPage = (req, res) => {
    res.render('import', { title: 'Import Students' });
};
