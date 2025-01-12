const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Adjust the path as needed

// Endpoint for overall attendance data
router.get('/overall-attendance', async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const studentsAttended = await Student.countDocuments({ presence: true });

        res.json({
            studentsAttended: studentsAttended,
            studentsNotAttended: totalStudents - studentsAttended // Calculate students who have not attended
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching overall attendance data', error: error.message });
    }
});


router.get('/program-attendance', async (req, res) => {
    try {
        const programAttendance = await Student.aggregate([
            { $match: { presence: true } }, // Match only students who attended
            { $group: { _id: "$program", attended: { $sum: 1 } } }, // Count the attended students and use 'attended' as the field name
            { $project: { program: "$_id", _id: 0, attended: 1 } } // Include the 'attended' field in the final projection
        ]);

        res.json(programAttendance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching program-specific attendance data', error: error.message });
    }
});



module.exports = router;
