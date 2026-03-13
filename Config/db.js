const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "E_Attendance", // Database name
  "root",         // Username
  "AqiqNpNYyDShwnynbtrfIPSkYvWZTwuC", // Password
  {
    host: "yamabiko.proxy.rlwy.net",
    port: 26983, // IMPORTANT: Railway port
    dialect: "mysql",
    logging: false
  }
);

// TEST connection
if (process.env.NODE_ENV !== "test") {
  sequelize
    .authenticate()
    .then(() => console.log("✅ Sequelize connected.."))
    .catch(err => console.log("❌ DB Error:", err));
}

module.exports = sequelize;