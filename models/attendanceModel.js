const { DataTypes } = require("sequelize");
const sequelize = require('../Config/db');

const Attendance = sequelize.define("Attendance",{
    att_id : {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id : {
        type : DataTypes.INTEGER,
        references: {
            model: "students",
            key: "student_id"
        }
    },
    subject_id: {
        type: DataTypes.INTEGER,
        references : {
            model: "subjects",
            key: "subject_id"
        }
    },
    teacher_id : {
        type : DataTypes.INTEGER,
        references: {
            model: "teachers",
            key:"teacher_id"
        }
    },
    att_date: DataTypes.DATE,
    status: {
        type: DataTypes.TINYINT,
        allowNull : false
    },
},{
    tableName:"attendances",
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['student_id', 'subject_id', 'att_date']
        }
    ]
});

module.exports = Attendance;