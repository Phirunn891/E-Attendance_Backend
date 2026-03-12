const User = require('./models/userModel');
const bcrypt = require('bcryptjs');
const sequelize = require('./Config/db');

(async () => {
    try {
        await sequelize.authenticate();
        
        const username = 'admin';
        const password = 'password123';
        const email = 'admin@example.com';

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            console.log('User already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        console.log(`User created: ${username} / ${password}`);
        process.exit();
    } catch (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }
})();
