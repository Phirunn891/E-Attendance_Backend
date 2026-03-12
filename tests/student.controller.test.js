const studentController = require('../controllers/student.controller');
const Student = require('../models/studentModel');
const Class = require('../models/classModel');

// Mock the Sequelize models
jest.mock('../models/studentModel');
jest.mock('../models/classModel');

describe('Student Controller Unit Tests', () => {
    let req, res;

    // Reset mocks before each test
    beforeEach(() => {
        req = {
            body: {},
            params: {},
            query: {},
            file: null
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            render: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('getStudent', () => {
        it('should return all students with 200 status', async () => {
            const mockStudents = [
                { student_id: 1, studentname_kh: 'S1' },
                { student_id: 2, studentname_kh: 'S2' }
            ];
            Student.findAll.mockResolvedValue(mockStudents);

            await studentController.getStudent(req, res);

            expect(Student.findAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 200,
                message: "Get Data Successfully!",
                data: mockStudents
            }));
        });

        it('should return an empty array if no students are found', async () => {
            Student.findAll.mockResolvedValue([]);

            await studentController.getStudent(req, res);

            expect(Student.findAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 200,
                message: "Get Data Successfully!",
                data: []
            }));
        });
    });

    describe('getStudentByID', () => {
        it('should return student if found', async () => {
            const mockStudent = { student_id: 1, studentname_kh: 'Test' };
            req.params.id = '1';
            Student.findByPk.mockResolvedValue(mockStudent);

            await studentController.getStudentByID(req, res);

            expect(Student.findByPk).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith(mockStudent);
        });

        it('should return 404 if student not found', async () => {
            req.params.id = '1';
            Student.findByPk.mockResolvedValue(null);

            await studentController.getStudentByID(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Data not found" });
        });

        it('should return 400 if ID is not a number', async () => {
            req.params.id = 'abc';

            await studentController.getStudentByID(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid parameter!" });
        });
    });

    describe('createStudent', () => {
        it('should create a new student and return 201 status', async () => {
            const mockStudentData = {
                studentname_kh: 'Test KH',
                studentname_eng: 'Test ENG',
                gender: 'M',
                class_id: 1
            };
            req.body = mockStudentData;

            const createdStudent = { ...mockStudentData, student_id: 1 };
            Student.create.mockResolvedValue(createdStudent);

            await studentController.createStudent(req, res);

            expect(Student.create).toHaveBeenCalledWith(mockStudentData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 201,
                message: "Insert Data Successfully!",
                data: createdStudent
            }));
        });

        it('should return 500 if creation fails', async () => {
            const errorMessage = 'Database Error';
            req.body = { studentname_kh: 'Test' };
            Student.create.mockRejectedValue(new Error(errorMessage));

            await studentController.createStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Server error",
                error: errorMessage
            });
        });
    });

    describe('updateStudent', () => {
        it('should update student and return 200 status', async () => {
            req.params.id = '1';
            req.body = { studentname_kh: 'Updated' };
            Student.update.mockResolvedValue([1]); // Sequelize update returns number of affected rows

            await studentController.updateStudent(req, res);

            expect(Student.update).toHaveBeenCalledWith(req.body, {
                where: { student_id: '1' }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 200,
                message: "Data Updated Successfully!"
            }));
        });

        it('should return 500 if update fails', async () => {
            req.params.id = '1';
            const error = new Error('Update Failed');
            Student.update.mockRejectedValue(error);

            await studentController.updateStudent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Server error: "
            }));
        });
    });

    describe('deleteStudent', () => {
        it('should delete student and return 200 status equivalent', async () => {
            req.params.id = '1';
            Student.destroy.mockResolvedValue(1);

            await studentController.deleteStudent(req, res);

            expect(Student.destroy).toHaveBeenCalledWith({
                where: { student_id: '1' }
            });
            expect(res.json).toHaveBeenCalledWith({ message: "Student deleted" });
        });
    });
});
