const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "E_Attendance", // Database name
  "root",         // Username
  "AqiqNpNYyDShwnynbtrfIPSkYvWZTwuC", // Password
  {
    host: "yamabiko.proxy.rlwy.net",
    port: 26983, // IMPORTANT: Railway port
    dialect: "mysql",
    logging: console.log // Enable SQL logging
  }
);

// TEST connection
if (process.env.NODE_ENV !== "test") {
  sequelize
    .authenticate()
    .then(() => console.log("✅ Sequelize connected to database."))
    .catch(err => {
      console.error("❌ DB Connection Error details:", err.message);
      console.error("❌ SQL Query failed or connection timed out.");
    });
}

module.exports = sequelize;