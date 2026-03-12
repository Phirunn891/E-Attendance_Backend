const { DataTypes } = require("sequelize");
const sequelize = require('../Config/db');

const Subject = sequelize.define("Subject",{
    subject_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subject_name : DataTypes.STRING
},{
    tablename:"subject_tbl",
    timestamp : false
});
module.exports = Subject;