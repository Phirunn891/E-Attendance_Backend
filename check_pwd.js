const User = require('./models/userModel');
const sequelize = require('./Config/db');

(async () => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { username: 'Admin' } });
        if (user) {
            console.log(`User Found: Admin`);
            const pwd = user.password;
            if (pwd.startsWith('$2a$') || pwd.startsWith('$2b$') || pwd.startsWith('$2y$')) {
                console.log('Password Hash Format: VALID (Bcrypt detected)');
            } else {
                console.log(`Password Hash Format: INVALID (Plain text or unknown: ${pwd.substring(0, 3)}...)`);
            }
        } else {
            console.log('User Not Found: Admin');
            const allUsers = await User.findAll({ attributes: ['username'] });
            console.log('Available users:', JSON.stringify(allUsers));
        }
        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
