const { DataTypes } = require("sequelize");
const sequelize = require('../Config/db');

const Teacher = sequelize.define("Teacher",{
    teacher_id: {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    teachername_kh : DataTypes.STRING,
    studentname_eng : DataTypes.STRING,
    phone: DataTypes.STRING

},{
    tablename:"teacher_tbl",
    timestamp: false
});
module.exports = Teacher;