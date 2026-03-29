const User = require('./models/userModel');
const bcrypt = require('bcryptjs');
const sequelize = require('./Config/db');

(async () => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { username: 'Admin' } });
        
        if (!user) {
            console.error('User not found in DB: Admin');
            process.exit(1);
        }

        const password = '123456';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();

        console.log('✅ Success: Password for Admin has been hashed and updated to "123456"');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during update:', err.message);
        process.exit(1);
    }
})();
