const sequelize = require('./Config/db');

(async () => {
    try {
        const [results, metadata] = await sequelize.query("DESCRIBE students");
        console.log('students structure:', JSON.stringify(results, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
