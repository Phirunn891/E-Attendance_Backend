const { DataTypes } = require("sequelize");
const sequelize = require('../Config/db');

const Class = sequelize.define("Class",{
    class_id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    class_name: DataTypes.STRING
}, {
    tablename: "class_tbl",
    timestamp: false
});

module.exports = Class;