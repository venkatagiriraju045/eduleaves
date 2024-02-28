const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());

const MONGODB_URI = 'mongodb+srv://Venkatagiriraju:King%40123@kiot.mmjm1ma.mongodb.net/test?retryWrites=true&w=majority';

app.get('/', (req, res) => {
    const message = "mod 7";
    res.send(`<html><body><h1>${message}</h1></body></html>`);
});

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

console.log('Mongoose connected to MongoDB');

const userSchema = new mongoose.Schema({
    email: { type: String },
    name: { type: String },
    studentName: { type: String },
    degreeAndBranch: { type: String },
    password: { type: String },
    DOB: { type: String },
    registerNumber: { type: Number },
    subjects: [
        {
            subject_code: { type: String },
            subject_name: { type: String },
            scores: {
                iat_1: { type: String },
                iat_2: { type: String },
                iat_3: { type: String },
            },
        },
    ],
    semester_results: [
        {
            semester: { type: String },
            code: { type: String },
            name: { type: String },
            credit: { type: String },
            grade: { type: String },
            result: { type: String },
        },
    ],
    year: { type: String },
    section: { type: String },
    department: { type: String },
    degreeAndBranch: { type: String },
    total_attendance: { type: Number },
    total_days: { type: Number },
    regulation: { type: String },
    training_score: { type: Number },
    present_array: [{ type: Date }],
    leave_array: [{ type: Date }],
    mentor_message: { type: String },
    advisor_message: { type: String },
    hod_message: { type: String },
    accomplishments: { type: String },
    institute_name: { type: String },
    role: { type: String },
    mentor_name: { type: String },

    // New Fields
    courses: [
        {
            course_name: { type: String },
            course_duration: { type: String },
            date_of_completion: { type: Date },
        },
    ],
    certifications: [
        {
            certification_name: { type: String },
            certification_providing_organization: { type: String },
            date_of_completion: { type: Date },
        },
    ],
    achievements: [
        {
            achievement_name: { type: String },
            held_at: { type: String },
            prize_got: { type: String },
            date_of_happened: { type: Date },
        },
    ],
    internships: [
        {
            role_name: { type: String },
            organization_name: { type: String },
            duration: { type: String },
            start_date: { type: Date },
            end_date: { type: Date },
        },
    ],
}, { versionKey: false });
const User = mongoose.model('students', userSchema);
app.post('/api/admin-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await User.findOne({ email, admin_password: password });
        if (!admin) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error authenticating admin:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.get('/api/students', async (req, res) => {
    const { email } = req.query;

    try {
        const student = await User.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.get('/api/fetch_student_data', async (req, res) => {
    const { registerNumber } = req.query;

    try {
        const student = await User.findOne({ registerNumber });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.get('/api/students_data', async (req, res) => {
    try {
        // Extract the filtering parameters from the query string
        const { role, department, instituteName } = req.query;

        // Create a filter object to match the specified fields
        const filter = {
            role: role, // Filter by role
            department: department, // Filter by department
            institute_name: instituteName, // Filter by institute_name
        };
        // Use the filter to find students
        const students = await User.find(filter);

        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.get('/api/advisor_students_data', async (req, res) => {
    try {
        // Extract the filtering parameters from the query string
        const { role, department, year, section } = req.query;
        // Create a filter object to match the specified fields
        const filter = {
            role: role, // Filter by role
            department: department, // Filter by department
            year: year,
            section: section,// Filter by institute_name
        };
        // Use the filter to find students
        const students = await User.find(filter);
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.get('/api/mentor_students_data', async (req, res) => {
    try {
        // Extract the filtering parameters from the query string
        const { role, department, instituteName, mentor_name } = req.query;

        // Create a filter object to match the specified fields
        const filter = {
            role: role, // Filter by role
            department: department, // Filter by department
            institute_name: instituteName,
            mentor_name: mentor_name// Filter by institute_name
        };
        // Use the filter to find students
        const students = await User.find(filter);

        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.get('/api/admin_students_data', async (req, res) => {
    try {
        // Extract the filtering parameters from the query string
        const { role, instituteName } = req.query;

        // Create a filter object to match the specified fields
        const filter = {
            role: role, // Filter by role
            institute_name: instituteName, // Filter by institute_name
        };
        // Use the filter to find students
        const students = await User.find(filter);

        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/api/login', async (req, res) => {
    const { registerNumber, DOB } = req.body;
    try {
        const student = await User.findOne({ registerNumber, DOB });
        if (!student) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Error authenticating student:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/api/attendance', async (req, res) => {
    const { registerNumber, date, present } = req.body;
    try {
        const student = await User.findOne({ registerNumber });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (present) {
            // Add the date to the present_array if it doesn't already exist
            await User.updateOne(
                { registerNumber },
                { $addToSet: { present_array: date } }
            );
            // Remove the date from the leave_array if it exists
            await User.updateOne(
                { registerNumber },
                { $pull: { leave_array: date } }
            );
        } else {
            // Add the date to the leave_array if it doesn't already exist
            await User.updateOne(
                { registerNumber },
                { $addToSet: { leave_array: date } }
            );
            // Remove the date from the present_array if it exists
            await User.updateOne(
                { registerNumber },
                { $pull: { present_array: date } }
            );
        }

        // Update total attendance and total days
        const updatedStudent = await User.findOne({ registerNumber });
        const totalAttendance = updatedStudent.present_array.length;
        const totalDays = totalAttendance + updatedStudent.leave_array.length;

        // Update the total attendance and total days fields
        await User.updateOne(
            { registerNumber },
            { $set: { total_attendance: totalAttendance, total_days: totalDays } }
        );

        res.status(200).json({ message: 'Attendance updated successfully' });
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/api/fetch_attendance', async (req, res) => {
    try {
        const { date, registerNumber } = req.query; // Extract from query parameters

        // Convert the string date to a JavaScript Date object
        const queryDate = new Date(date);

        // Find the student by register number
        const student = await User.findOne({ "registerNumber": registerNumber });

        if (student) {
            // Check if the date exists in either the present_array or leave_array
            const isPresent = student.present_array.some(d => new Date(d).toDateString() === queryDate.toDateString());
            const isLeave = student.leave_array.some(d => new Date(d).toDateString() === queryDate.toDateString());

            // Determine if the student is present or absent
            const attendanceStatus = isPresent ? 'Present' : isLeave ? 'Leave' : 'Absent';

            res.status(200).json({ registerNumber, attendanceStatus });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/api/modify_attendance', async (req, res) => {
    const { registerNumber, date, present } = req.body;
    try {
        const student = await User.findOne({ registerNumber });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (present) {
            // Add the date to the present_array if it doesn't already exist
            await User.updateOne(
                { registerNumber },
                { $addToSet: { present_array: date } }
            );
            // Remove the date from the leave_array if it exists
            await User.updateOne(
                { registerNumber },
                { $pull: { leave_array: date } }
            );
        } else {
            // Add the date to the leave_array if it doesn't already exist
            await User.updateOne(
                { registerNumber },
                { $addToSet: { leave_array: date } }
            );
            // Remove the date from the present_array if it exists
            await User.updateOne(
                { registerNumber },
                { $pull: { present_array: date } }
            );
        }

        // Update total attendance and total days
        const updatedStudent = await User.findOne({ registerNumber });
        const totalAttendance = updatedStudent.present_array.length;
        const totalDays = totalAttendance + updatedStudent.leave_array.length;

        // Update the total attendance and total days fields
        await User.updateOne(
            { registerNumber },
            { $set: { total_attendance: totalAttendance, total_days: totalDays } }
        );

        res.status(200).json({ message: 'Attendance updated successfully' });
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/api/update_all_attendance', async (req, res) => {
    const { date, present, selectedDepartment, selectedYear, instituteName } = req.body;

    try {
        const students = await User.find({ department: selectedDepartment, year: selectedYear, institute_name: instituteName });

        // Update attendance for each student one by one
        for (const student of students) {
            if (present[student.email]) {
                if (!student.present_array.includes(date)) {
                    student.present_array.push(date);
                }
                const leaveDateIndex = student.leave_array.indexOf(date);
                if (leaveDateIndex !== -1) {
                    student.leave_array.splice(leaveDateIndex, 1);
                }
            } else {
                if (!student.leave_array.includes(date)) {
                    student.leave_array.push(date);
                }

                const presentDateIndex = student.present_array.indexOf(date);
                if (presentDateIndex !== -1) {
                    student.present_array.splice(presentDateIndex, 1);
                }
            }

            student.total_attendance = student.present_array.length;
            student.total_days = student.present_array.length + student.leave_array.length;

            // Save each student's attendance individually
            await student.save();
        }

        res.status(200).json({ message: 'Attendance updated successfully for the selected department' });
    } catch (error) {
        console.error('Error updating attendance for the selected department:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/api/send_message', async (req, res) => {
    const { message, selectedDepartment } = req.body;

    try {
        const students = await User.find({ department: selectedDepartment });

        for (const student of students) {
            student.messages = message;

            await student.save();
        }

        res.status(200).json({ message: 'Message sent successfully to all students in the selected department' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/api/update_accomplishments', async (req, res) => {
    const { email, accomplishments } = req.body;

    try {
        // Find the student by email
        const student = await User.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update the accomplishments field for the student
        student.accomplishments = accomplishments;

        // Save the updated student document
        await student.save();

        res.status(200).json({ message: 'Accomplishments updated successfully' });
    } catch (error) {
        console.error('Error updating accomplishments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/api/update_messages', async (req, res) => {
    const { registerNumber, messages, sender } = req.body;

    try {
        // Find the student by email
        const student = await User.findOne({ registerNumber });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update the message based on the sender
        if (sender === "mentor") {
            student.mentor_message = messages;
        } else if (sender === "hod") {
            student.hod_message = messages;
        } else if (sender === "advisor") {
            student.advisor_message = messages;
        }

        // Save the updated student document
        await student.save();

        res.status(200).json({ message: 'Message updated successfully' });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/api/update_activity', async (req, res) => {
    const { email, activity_type, activity_details } = req.body;

    try {
        // Find the student by email
        const student = await User.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        // Update the activity details based on the activity type
        switch (activity_type) {
            case 'internship':
                student.internships.push(activity_details);
                break;
            case 'certification':
                student.certifications.push(activity_details);
                break;
            case 'course':
                student.courses.push(activity_details);
                break;
            case 'achievement':
                student.achievements.push(activity_details);
                break;
            // Add more cases for other activity types if needed

            default:
                return res.status(400).json({ message: 'Invalid activity type' });
        }

        // Save the updated student document
        await student.save();

        res.status(200).json({ message: 'Activity details updated successfully' });
    } catch (error) {
        console.error('Error updating activity details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/api/update_students', async (req, res) => {
    try {
        const { studentDataToUpdate } = req.body; // Access studentDataToUpdate from req.body
        // Destructure properties from studentDataToUpdate
        const { regNo, name, mentor, section, year, department, role } = studentDataToUpdate;
        if (!regNo || !name || !mentor || !section || !year || !department || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newUser = new User({
            registerNumber: regNo,
            name: name,
            mentor_name: mentor,
            section: section,
            year: year,
            department: department,
            role: role,
        });
        await newUser.save();
        res.status(200).json({ message: 'New student data created successfully' });
    } catch (error) {
        console.error('Error creating new student data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/api/update_iat', async (req, res) => {
    try {
        const { iatScoresToUpdate } = req.body;

        // Update IAT scores in the database
        for (const data of iatScoresToUpdate) {
            const { registerNumber, iatType, scores } = data;

            // Iterate through each subject and update the score
            for (const subjectCode in scores) {
                const score = parseInt(scores[subjectCode]);

                await User.findOneAndUpdate(
                    {
                        'registerNumber': registerNumber,
                        'subjects.subject_code': subjectCode
                    },
                    {
                        $set: {
                            ['subjects.$[subject].scores.' + iatType]: score
                        }

                    },
                    {
                        arrayFilters: [{ 'subject.subject_code': { $eq: subjectCode } }],
                        upsert: true
                    }
                );
            }
        }

        res.status(200).json({ message: 'IAT scores updated successfully' });
    } catch (error) {
        console.error('Error updating IAT scores:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/api/update_semester_results', async (req, res) => {
    try {
        const { semesterResultsToUpdate } = req.body;

        // Process each register number in the semesterResultsToUpdate object
        for (const registerNumber in semesterResultsToUpdate) {
            const semesterResults = semesterResultsToUpdate[registerNumber];

            // Extract relevant data from semesterResults
            const { DOB, studentName, degreeAndBranch, regulation } = semesterResults[0];

            // Create a new document in the database for the user
            await User.create({
                registerNumber,
                DOB,
                studentName,
                degreeAndBranch,
                regulation,
                semester_results: semesterResults
            });
        }

        res.status(200).json({ message: 'Semester results inserted successfully' });
    } catch (error) {
        console.error('Error inserting semester results:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});