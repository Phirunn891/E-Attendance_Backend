const { DataTypes } = require("sequelize");
const sequelize = require('../Config/db');

const Student = sequelize.define("Student",{
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentname_kh: DataTypes.STRING,
    studentname_eng: DataTypes.STRING,
    gender: DataTypes.STRING,
    class_id: DataTypes.INTEGER,
},{
    tableName:"students",
    timestamps: false
});

module.exports= Student;