const User = require('./models/userModel');
const sequelize = require('./Config/db');

(async () => {
  try {
    await sequelize.authenticate();
    const count = await User.count();
    console.log(`Diagnostic: User count = ${count}`);
    const users = await User.findAll({ attributes: ['username', 'role'] });
    console.log('Diagnostic: User list:', JSON.stringify(users));
    process.exit(0);
  } catch (err) {
    console.error('Diagnostic error:', err.message);
    process.exit(1);
  }
})();
