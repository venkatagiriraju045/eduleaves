import React, { useEffect, useState } from 'react';
import { Chart, LinearScale, CategoryScale, DoughnutController, ArcElement, LineController, LineElement } from 'chart.js/auto';
import DepartmentClassWise from './DepartmentClassWise.js';
import AdvisorClassWise from './AdvisorClassWise.js';


function calculateStudentAverage(student) {
    const totalAttendance = student.total_attendance;
    const totalDays = student.total_days;
    const presentPercentage = ((totalAttendance / totalDays) * 100).toFixed(2);

    const maxScore = 100;
    const subjectScores = student.subjects.map((subject) => {
        const { scores } = subject;
        if (!scores || typeof scores !== "object") {
            // If scores are missing or not an object, return NaN for this subject
            return {
                subject_name: subject.subject_name,
                scores: "NaN",
            };
        }
        const validScores = Object.values(scores).filter((score) => !isNaN(parseInt(score)));
        const subjectScore =
            validScores.length > 0
                ? validScores.reduce((total, score) => total + parseInt(score), 0) / validScores.length
                : "NaN";
        return {
            subject_name: subject.subject_name,
            scores: subjectScore,
        };
    });

    const subjectAverages = subjectScores.map((subject) => {
        if (subject.scores === "NaN") {
            return {
                subject_name: subject.subject_name,
                average_score: "NaN",
            };
        }
        const average = (subject.scores / maxScore) * 100; // Scale the average score based on the maximum score
        return {
            subject_name: subject.subject_name,
            average_score: average,
        };
    });

    const overallAverage =
        subjectAverages.reduce((total, subject) => total + subject.average_score, 0) /
        subjectAverages.length;

    const hasTestScore = !isNaN(overallAverage);

    let overall_score;

    if (hasTestScore) {
        // Calculate overall score with test score
        overall_score = ((parseFloat(presentPercentage) + parseFloat(overallAverage)) / 2).toFixed(2);
    } else {
        // Calculate overall score only with attendance, without test 
        overall_score = parseFloat(presentPercentage).toFixed(2);
    }

    return overall_score;
}
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
    const absentees = []; // Array to store the names of absentees

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
        absentees, // Include the list of absentees in the result
    };
};
const calculateYearWiseAttendance = (students) => {
    const currentDate = new Date();

    // Initialize variables to store attendance counts for each class
    let firstYearPresentCount = 0;
    let firstYearAbsentCount = 0;
    let secondYearPresentCount = 0;
    let secondYearAbsentCount = 0;
    let thirdYearPresentCount = 0;
    let thirdYearAbsentCount = 0;
    let finalYearPresentCount = 0;
    let finalYearAbsentCount = 0;

    // Loop through the students and calculate attendance for each class
    students.forEach((student) => {
        if (student.role === 'student') {
            const year = student.class; // Assuming the student object has the 'class' property indicating the year of study

            // Determine if the student is present or absent for the current date
            const isPresent = student.present_array.some((dateStr) => new Date(dateStr).toDateString() === currentDate.toDateString());
            const isAbsent = student.leave_array.some((dateStr) => new Date(dateStr).toDateString() === currentDate.toDateString());

            // Update the attendance counts based on the student's class and attendance status
            if (year === 'First year') {
                if (isPresent) {
                    firstYearPresentCount++;
                } else if (isAbsent) {
                    firstYearAbsentCount++;
                }
            } else if (year === 'Second year') {
                if (isPresent) {
                    secondYearPresentCount++;
                } else if (isAbsent) {
                    secondYearAbsentCount++;
                }
            } else if (year === 'Third year') {
                if (isPresent) {
                    thirdYearPresentCount++;
                } else if (isAbsent) {
                    thirdYearAbsentCount++;
                }
            } else if (year === 'Final year') {
                if (isPresent) {
                    finalYearPresentCount++;
                } else if (isAbsent) {
                    finalYearAbsentCount++;
                }
            }
        }
    });

    // Calculate percentages for each class using the existing calculateAttendancePercentage function
    const firstYearAttendance = calculateAttendancePercentage(firstYearPresentCount, firstYearAbsentCount);
    const secondYearAttendance = calculateAttendancePercentage(secondYearPresentCount, secondYearAbsentCount);
    const thirdYearAttendance = calculateAttendancePercentage(thirdYearPresentCount, thirdYearAbsentCount);
    const finalYearAttendance = calculateAttendancePercentage(finalYearPresentCount, finalYearAbsentCount);

    return {
        firstYear: {
            presentPercentage: firstYearAttendance.percentage,
            presentCount: firstYearAttendance.count,
            totalCount: firstYearPresentCount + firstYearAbsentCount,
        },
        secondYear: {
            presentPercentage: secondYearAttendance.percentage,
            presentCount: secondYearAttendance.count,
            totalCount: secondYearPresentCount + secondYearAbsentCount,
        },
        thirdYear: {
            presentPercentage: thirdYearAttendance.percentage,
            presentCount: thirdYearAttendance.count,
            totalCount: thirdYearPresentCount + thirdYearAbsentCount,
        },
        finalYear: {
            presentPercentage: finalYearAttendance.percentage,
            presentCount: finalYearAttendance.count,
            totalCount: finalYearPresentCount + finalYearAbsentCount,
        },
    };
};


const AdvisorDashboard = ({ students }) => {
    const { presentPercentage, absentPercentage, presentCount, totalCount } = calculateOverallAttendance(
        students);
    const [showAttendanceOverlay, setShowAttendanceOverlay] = useState(false);




    const handleCloseOverlay = () => {
        setShowAttendanceOverlay(false);
    };



    const handleCopyClassAttendance = () => {
        const yearWiseAttendance = calculateYearWiseAttendance(students);
        const { firstYear, secondYear, thirdYear, finalYear } = yearWiseAttendance;

        const classAttendanceText = `
          
          Year-wise Attendance:
          
          First Year:
            Total Students: ${firstYear.totalCount}
            Present Count: ${firstYear.presentCount}
            Present Percentage: ${firstYear.presentPercentage}%
            
          Second Year:
            Total Students: ${secondYear.totalCount}
            Present Count: ${secondYear.presentCount}
            Present Percentage: ${secondYear.presentPercentage}%
            
          Third Year:
            Total Students: ${thirdYear.totalCount}
            Present Count: ${thirdYear.presentCount}
            Present Percentage: ${thirdYear.presentPercentage}%
    
          Final Year:
            Total Students: ${finalYear.totalCount}
            Present Count: ${finalYear.presentCount}
            Present Percentage: ${finalYear.presentPercentage}%
    
          Overall Attendance:
    
            Total Students: ${totalCount}
            No. of Students Present: ${presentCount}
            Overall Attendance Percentage: ${presentPercentage}%
            
        `;

        // Create a new textarea element (it's not visible on the page)
        const textarea = document.createElement('textarea');
        textarea.value = classAttendanceText;
        document.body.appendChild(textarea);

        // Select the text inside the textarea and copy it to the clipboard
        textarea.select();
        document.execCommand('copy');

        // Remove the textarea element from the DOM
        document.body.removeChild(textarea);

        // Optionally, show a notification that the text has been copied
        alert('Class-wise attendance details copied to the clipboard!');
    };


    const yearWiseAttendance = calculateYearWiseAttendance(students);
    const { firstYear, secondYear, thirdYear, finalYear } = yearWiseAttendance;


    return (
        <div>

            {showAttendanceOverlay && (
                <div className="dep-admin-overlay">
                    <div className="dep-admin-overlay-content">
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
                                    Copy Report
                                </button>
                            </div>
                            <br></br>
                            <br></br>
                            {/* Display First Year Attendance */}
                            <div className='year-attendance-container'>
                                <h2>First Year Attendance</h2>
                                <p>Total Students: {firstYear.totalCount}</p>
                                <p>Present Count {firstYear.presentCount}</p>
                                <p>Present Percentage: {firstYear.presentPercentage}%</p>

                            </div>

                            {/* Display Second Year Attendance */}
                            <div className='year-attendance-container'>
                                <h2>Second Year Attendance</h2>
                                <p>Total Students: {secondYear.totalCount}</p>
                                <p>Present Count {secondYear.presentCount}</p>
                                <p>Present Percentage: {secondYear.presentPercentage}%</p>
                            </div>

                            {/* Display Third Year Attendance */}
                            <div className='year-attendance-container'>
                                <h2>Third Year Attendance</h2>
                                <p>Total Students: {thirdYear.totalCount}</p>
                                <p>Present Count {thirdYear.presentCount}</p>
                                <p>Present Percentage: {thirdYear.presentPercentage}%</p>
                            </div>

                            {/* Display Final Year Attendance */}
                            <div className='year-attendance-container'>
                                <h2>Final Year Attendance</h2>
                                <p>Total Students: {finalYear.totalCount}</p>
                                <p>Present Count {finalYear.presentCount}</p>
                                <p>Present Percentage: {finalYear.presentPercentage}%</p>
                            </div>
                            <br></br>
                        </div>
                    </div>
                </div>
            )}

            <div id='class-wise-page' className='class-wise-analytics-page'>
                <AdvisorClassWise students={students} />
            </div>


            {/*<div id="department-students-table"></div>*/}
        </div>
    );
};

export default AdvisorDashboard;
