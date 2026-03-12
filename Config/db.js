const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
    "db_attendance",   // DB name
    "root",         // DB user
    "",             // DB password
    {
        host: "localhost",
        dialect: "mysql",
        logging: false
    }
);

// TEST connection
if (process.env.NODE_ENV !== 'test') {
    sequelize.authenticate()
      .then(() => console.log("Sequelize connected.."))
      .catch(err => console.log("DB Error: ", err));
}

module.exports = sequelize;