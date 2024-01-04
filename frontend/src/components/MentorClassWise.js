import React, { useEffect, useState } from 'react';
import { Chart, LinearScale, CategoryScale, DoughnutController, ArcElement, LineController, LineElement } from 'chart.js/auto';
import './CSS/DepartmentClassWise.css';
import MentorMessage from './MentorMessage.js';
import MenteeActivityUpdate from './MenteeActivityUpdate.js';

const calculateAttendancePercentage = (presentCount, absentCount) => {
    const totalDays = presentCount + absentCount;
    if (totalDays === 0) return { percentage: 0, count: 0, absentees: [] };
    const percentage = ((presentCount / totalDays) * 100).toFixed(2);
    return { percentage, count: presentCount, absentees: [] };
};
const calculateOverallAttendance = (students) => {
    const studentList = students.filter((student) => student.role === 'student');
    if (studentList.length === 0) {
        return {
            presentPercentage: 0,
            absentPercentage: 0,
            presentCount: 0,
            totalCount: 0,
            absentees: [],
        };
    }
    const currentDate = new Date();
    let presentCount = 0;
    let absentCount = 0;
    const absentees = [];
    studentList.forEach((student) => {
        student.present_array.forEach((dateStr) => {
            const date = new Date(dateStr);
            if (date.toDateString() === currentDate.toDateString()) {
                presentCount++;
            }
        });
        student.leave_array.forEach((dateStr) => {
            const date = new Date(dateStr);
            if (date.toDateString() === currentDate.toDateString()) {
                absentCount++;
                absentees.push(student);
            }
        });
    });
    const presentResult = calculateAttendancePercentage(presentCount, absentCount);
    const absentResult = calculateAttendancePercentage(absentCount, presentCount);
    return {
        presentPercentage: presentResult.percentage,
        absentPercentage: absentResult.percentage,
        presentCount: presentResult.count,
        totalCount: studentList.length,
        absentees,
    };
};
const MentorClassWise = ({ students }) => {
    const classStudents = students;
    const [selectedStudent, setSelectedStudent] = useState(null); // Track the selected student
    const [showAttendanceOverlay, setShowAttendanceOverlay] = useState(false);
    const [showSpecificStudentDetails, setShowSpecificStudentDetails] = useState(false);
    const [showMessageForm, setShowMessageForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const { presentPercentage, absentPercentage, presentCount, totalCount, absentees } = calculateOverallAttendance(
        students
    );
    Chart.register(LinearScale, CategoryScale, DoughnutController, ArcElement, LineController, LineElement);


    const handleCloseOverlay = () => {
        setShowAttendanceOverlay(false);
        setShowSpecificStudentDetails(false);
        setShowUpdateForm(false);
        setShowMessageForm(false);
    };
    const handleTodayClick = () => {
        setShowAttendanceOverlay(true);

    }

    const handleShowSpecicStudentDetails = (student) => {
        setSelectedStudent(student); // Set the selected student
        setShowSpecificStudentDetails(true);
        setShowMessageForm(false);
        setShowAttendanceOverlay(false);
    };
    const handleCopyClassAttendance = () => {
        const classAttendanceText = `
            
            Total Students: ${totalCount}
            Students Present Today: ${presentCount}
            Present Percentage: ${presentPercentage}%
        
        ${absentees.length > 0 ?
                `Absentees:
            ${absentees.map((student, index) => (
                    `
            ${index + 1}. ${student.registerNumber}, ${student.name}`
                )).join('\n')}` : "No absentees."}
        `;
        const textarea = document.createElement('textarea');
        textarea.value = classAttendanceText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Class-wise attendance details copied to the clipboard!');
    };

    // ... (existing code)

    const renderStudentCards = (year) => {
        const yearStudents = students.filter((student) => student.role === 'student' && student.year === year);
        return yearStudents.map((student) => (
            <button key={student._id} className="mentor-student-name-card" onClick={() => handleShowSpecicStudentDetails(student)}>
                <p>{student.name}</p>
            </button>
        ));
    };

    const getTotalStudentsByGenderAndYear = (gender, year) => {
        return students.filter((student) => student.role === 'student' && student.gender === gender && student.year === year).length;
    };

    const renderYearHeading = (year) => {
        const totalMaleStudents = getTotalStudentsByGenderAndYear('male', year);
        const totalFemaleStudents = getTotalStudentsByGenderAndYear('female', year);
        const totalStudents = students.filter((student) => student.role === 'student' && student.year === year).length;
        return (
            <h1 className='mentees-year-heading'>
                {year} ({totalMaleStudents} male and {totalFemaleStudents} female, total {totalStudents} students)
            </h1>
        );
    };
    const getTotalStudentsByGender = (gender) => {
        return students.filter((student) => student.role === 'student' && student.gender === gender).length;
    };

    const totalMaleStudents = getTotalStudentsByGender('male');
    const totalFemaleStudents = getTotalStudentsByGender('female');
    const totalStudents = students.filter((student) => student.role === 'student').length;

    const cellClass = (mark) => {
        if (mark >= 0 && mark <= 40) {
            return 'low-mark';
        } else if (mark >= 41 && mark <= 70) {
            return 'average-mark';
        } else if (mark >= 71 && mark <= 89) {
            return 'good-mark';
        } else if (mark >= 90 && mark <= 100) {
            return 'outstanding-mark';
        } else {
            return ''; // Default class when the mark is outside the specified ranges
        }
    };
    const handleSpecificMessageClick = () => {
        setShowUpdateForm(false);
        setShowMessageForm(true);
        setShowSpecificStudentDetails(false);
        setShowAttendanceOverlay(false);
    };

    const handleUpdateButtonClick = () => {
        setShowMessageForm(false);
        setShowUpdateForm(true);
        setShowSpecificStudentDetails(false);
        setShowAttendanceOverlay(false);
    };


    return (
        <div className='mentor-dashboard'>
            <div className='department-header-container'>
                <div className='class-wise-header'>
                    <h1 className='department-wise-chart-heading'>
                        Mentees details
                        ({totalMaleStudents} male and {totalFemaleStudents} female, total {totalStudents} students)
                    </h1>
                </div>
                <a href="#class-wise-page"><button href="#" className="today-button" onClick={handleTodayClick}>Attendance</button></a>
            </div>
            <div >
                <h1 className='mentees-year-heading'>{renderYearHeading('First year')}</h1>
                <div className="mentor-year-wise-container">
                    {renderStudentCards('First year')}
                </div>
            </div>
            <div >
                <h1 className='mentees-year-heading'>{renderYearHeading('Second year')}</h1>
                <div className="mentor-year-wise-container">
                    {renderStudentCards('Second year')}
                </div>
            </div>
            <div >
                <h1 className='mentees-year-heading'>{renderYearHeading('Third year')}</h1>
                <div className="mentor-year-wise-container">
                    {renderStudentCards('Third year')}
                </div>
            </div>
            <div >
                <h1 className='mentees-year-heading'>{renderYearHeading('Final year')}</h1>
                <div className="mentor-year-wise-container">
                    {renderStudentCards('Final year')}
                </div>
            </div>
            {showAttendanceOverlay && (
                <div className="overlay">
                    <div className="overlay-content">
                        <button className="close-button" id="close-button" onClick={handleCloseOverlay}>
                            Close
                        </button>
                        <div className="attendance-details-container">
                            <div className='main-attendance-details'>
                                <p className='present-details-percentage'>Present Percentage: {presentPercentage}%</p>
                                <p className='absent-details-percentage'>Absent Percentage: {absentPercentage}%</p>
                                <p>Students Present Today: {presentCount}</p>
                                <p>Total Students: {totalCount}</p>
                                <button className="copy-button" onClick={handleCopyClassAttendance}>
                                    Copy Class Report
                                </button>
                            </div>
                            <br></br>
                            <br></br>
                            <br></br>
                            <h2>Absentees:</h2>
                            <div className='admin-table-container'>
                                {absentees.length > 0 ? (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Sl.No</th>
                                                <th>Register number</th>
                                                <th>Name</th>
                                                <th>Year</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {absentees.map((student, index) => (
                                                <tr key={student.registerNumber}>
                                                    <td>{index + 1}</td>
                                                    <td>{student.registerNumber}</td>
                                                    <td>{student.name}</td>
                                                    <td>{student.year}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No absentees for the selected class.</p>
                                )}</div>
                        </div>
                    </div>
                </div>
            )}
            {showSpecificStudentDetails ? (
                <div className="overlay">
                    <div className="overlay-content">
                        <button className="close-button" id="close-button" onClick={handleCloseOverlay}>
                            Close
                        </button>
                        <div className="students-specific-details-container">
                            {selectedStudent && (
                                <>
                                    <div className="specific-details-header-container">
                                        <div className="student-details-heading">
                                            <p className='mentees-year-heading'>{selectedStudent.name} ({selectedStudent.registerNumber}) {selectedStudent.type}</p>
                                        </div>
                                        <a className='message-button-specific-student' onClick={handleSpecificMessageClick}>Message</a>
                                        <a className='message-button-specific-student' onClick={handleUpdateButtonClick}>Update Activity</a>

                                    </div >
                                    <h2>Test Performance : </h2>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                {selectedStudent.subjects.map((subject) => (
                                                    <td key={subject.subject_code}>{subject.subject_code}</td>
                                                ))}
                                            </tr>
                                            {Object.keys(selectedStudent.subjects[0].scores).map((iat, i) => (
                                                <tr key={i}>
                                                    <td>{`IAT-${i + 1}`}</td>
                                                    {selectedStudent.subjects.map((subject) => (
                                                        <td key={subject.subject_code} className={cellClass(subject.scores[iat])}>{subject.scores[iat]}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div>
                                        <h2>Attendance Performance : </h2>
                                        <div className="mentor-student-name-card">
                                            <p>Total days : {selectedStudent.total_days}</p>
                                            <p>Present days : {selectedStudent.total_attendance}</p>
                                            <p>Percentage: {((selectedStudent.total_attendance / selectedStudent.total_days) * 100).toFixed(2)}%</p>
                                        </div>
                                    </div>
                                    {/* Display Internships */}
                                    {selectedStudent.internships && selectedStudent.internships.length > 0 && (
                                        <div>
                                            <h2>Internships:</h2>
                                            {selectedStudent.internships.map((internship, index) => (
                                                <div key={index}>
                                                    <p>Role Name: {internship.role_name}</p>
                                                    <p>Organization: {internship.organization_name}</p>
                                                    <p>Duration: {internship.duration}</p>
                                                    <p>Start Date: {internship.start_date}</p>
                                                    <p>End Date: {internship.end_date}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {/* Display Certifications */}
                                    {selectedStudent.certifications && selectedStudent.certifications.length > 0 && (
                                        <div>
                                            <h2>Certifications:</h2>
                                            {selectedStudent.certifications.map((certification, index) => (
                                                <div key={index}>
                                                    <p>Certification Name: {certification.certification_name}</p>
                                                    <p>Organization: {certification.certification_providing_organization}</p>
                                                    <p>Date of Completion: {certification.date_of_completion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Display Courses */}
                                    {selectedStudent.courses && selectedStudent.courses.length > 0 && (
                                        <div>
                                            <h2>Courses:</h2>
                                            {selectedStudent.courses.map((course, index) => (
                                                <div key={index}>
                                                    <p>Course Name: {course.course_name}</p>
                                                    <p>Duration: {course.course_duration}</p>
                                                    <p>Date of Completion: {course.date_of_completion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Display Achievements */}
                                    {selectedStudent.achievements && selectedStudent.achievements.length > 0 && (
                                        <div>
                                            <h2>Achievements:</h2>
                                            {selectedStudent.achievements.map((achievement, index) => (
                                                <div key={index}>
                                                    <p>Achievement Name: {achievement.achievement_name}</p>
                                                    <p>Held at: {achievement.held_at}</p>
                                                    <p>Prize Got: {achievement.prize_got}</p>
                                                    <p>Date of Happened: {achievement.date_of_happened}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : showMessageForm ? (
                <div className="overlay">
                    <div className="overlay-content">
                        <button className="close-button" id="close-button" onClick={handleCloseOverlay}>
                            Close
                        </button>
                        <div className="students-specific-details-container">
                            {selectedStudent && (
                                <>
                                    <div className="specific-details-header-container">
                                        <div className="student-details-heading">
                                            <p className='mentees-year-heading'>{selectedStudent.name} ({selectedStudent.registerNumber})</p>
                                        </div>
                                    </div >
                                    <MentorMessage student={selectedStudent} />
                                </>
                            )}
                        </div>
                    </div>
                </div>) : showUpdateForm && (
                    <div className="overlay">
                        <div className="overlay-content">
                            <button className="close-button" id="close-button" onClick={handleCloseOverlay}>
                                Close
                            </button>
                            <div className="students-specific-details-container">
                                {selectedStudent && (
                                    <>
                                        <div className="specific-details-header-container">
                                            <div className="student-details-heading">
                                                <p className='mentees-year-heading'>{selectedStudent.name} ({selectedStudent.registerNumber})</p>
                                            </div>
                                        </div >
                                        <MenteeActivityUpdate student={selectedStudent} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    );
};
export default MentorClassWise;
