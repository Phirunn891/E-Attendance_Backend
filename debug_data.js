const Student = require('./models/studentModel');
const Class = require('./models/classModel');

(async () => {
    try {
        const classes = await Class.findAll();
        console.log('Classes:', JSON.stringify(classes, null, 2));
        const students = await Student.findAll({ limit: 5 });
        console.log('Students:', JSON.stringify(students, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
