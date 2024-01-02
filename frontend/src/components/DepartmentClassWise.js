import React, { useEffect, useState } from 'react';
import { Chart, LinearScale, CategoryScale, DoughnutController, ArcElement, LineController, LineElement } from 'chart.js/auto';
import './CSS/DepartmentClassWise.css';
import ClassAttendance from './ClassAttendance.js';

const calculateAttendancePercentage = (presentCount, absentCount) => {
    const totalDays = presentCount + absentCount;
    if (totalDays === 0) return { percentage: 0, count: 0, absentees: [] };
    const percentage = ((presentCount / totalDays) * 100).toFixed(2);
    return { percentage, count: presentCount, absentees: [] };
};
const calculateOverallAttendance = (classStudents) => {
    const studentList = classStudents;
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
const DepartmentClassWise = ({ students, year }) => {
    const classStudents = students.filter((student) => student.role === 'student' && student.year === year);
    const [showAttendanceOverlay, setShowAttendanceOverlay] = useState(false);
    const { presentPercentage, absentPercentage, presentCount, totalCount, absentees } = calculateOverallAttendance(
        classStudents
    );
    Chart.register(LinearScale, CategoryScale, DoughnutController, ArcElement, LineController, LineElement);
    useEffect(() => {
        createPassFailChart();
        createOverallClassPerformanceChart();
        createClassTable();
        createGenderLineChart();
        createHostelerChart();

    }, [classStudents]);

    const calculatePassFailRatio = (classStudents) => {
        let passCount = 0;
        let failCount = 0;
        let totalSubjects = 0;

        classStudents.forEach((student) => {
            student.subjects.forEach((subject) => {
                for (let i = 1; i <= 3; i++) {
                    const iatScore = parseFloat(subject.scores[`iat_${i}`]);
                    if (!isNaN(iatScore)) {
                        totalSubjects++;
                        if (iatScore >= 50) {
                            passCount++;
                        } else {
                            failCount++;
                        }
                    }
                }
            });
        });

        const passPercentage = (passCount / totalSubjects) * 100;
        const failPercentage = (failCount / totalSubjects) * 100;

        return {
            passCount,
            failCount,
            passPercentage,
            failPercentage,
        };
    };
    const createPassFailChart = () => {
        Chart.register(LinearScale, CategoryScale, DoughnutController, ArcElement);
        const canvas = document.getElementById('pass-fail-chart');
        const ctx = canvas.getContext('2d');
        if (typeof canvas.chart !== 'undefined') {
            canvas.chart.destroy();
        }
        const chartWidth = 350;
        const chartHeight = 225;
        canvas.width = chartWidth;
        canvas.height = chartHeight;
        const passColor = 'rgb(14, 129, 116)';
        const failColor = 'rgb(255, 99, 71)';

        // Calculate pass/fail statistics for all subjects
        const passFailStats = calculatePassFailRatio(classStudents);

        canvas.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Pass', 'Fail'],
                datasets: [
                    {
                        data: [
                            passFailStats.passPercentage,
                            passFailStats.failPercentage
                        ],
                        backgroundColor: [passColor, failColor],
                        borderColor: [
                            'rgb(14, 129, 116)',
                            'rgb(255, 99, 71)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            color: 'black',
                        },
                    },
                    annotation: {
                        annotations: {
                            value: {
                                type: 'text',
                                color: 'black',
                                fontSize: 24,
                                fontStyle: 'bold',
                                textAlign: 'center',
                                value: `${passFailStats.passPercentage.toFixed(2)}% Pass`,
                                x: '50%',
                                y: '50%',
                            },
                        },
                    },
                },
            },
        });
    };
    const calculateStudentAverage = (student) => {
        const subjects = student.subjects;
        if (!subjects || subjects.length === 0) {
            return NaN;
        }
        const totalScores = subjects.reduce((total, subject) => {
            let iatCount = 0;
            for (let i = 1; i <= 3; i++) {
                const iatScore = parseFloat(subject.scores[`iat_${i}`]);
                if (!isNaN(iatScore)) {
                    total += iatScore;
                    iatCount++;
                }
            }
            if (iatCount === 0) {
                return NaN; // No conducted IATs for the subject
            }
            return total;
        }, 0);

        const totalIATs = subjects.reduce((total, subject) => {
            for (let i = 1; i <= 3; i++) {
                if (!isNaN(parseFloat(subject.scores[`iat_${i}`]))) {
                    total++;
                }
            }
            return total;
        }, 0);

        const average = totalScores / totalIATs;
        return isNaN(average) ? NaN : average;
    };
    const createOverallClassPerformanceChart = () => {
        Chart.register(LinearScale, CategoryScale, DoughnutController, ArcElement);
        const canvas = document.getElementById('class-chart-test');
        const ctx = canvas.getContext('2d');
        if (typeof canvas.chart !== 'undefined') {
            canvas.chart.destroy();
        }
        const chartWidth = 350;
        const chartHeight = 225;
        canvas.width = chartWidth;
        canvas.height = chartHeight;
        const tableData = classStudents.map((student) => {
            const studentName = student.name;
            const studentAverage = calculateStudentAverage(student);
            return { studentName, studentAverage };
        });
        const bins = [90, 80, 70, 60, 50, 40, 0];
        const binLabels = bins.map((bin, index) => (index === 0 ? `${bin}+` : `${bin}-${bins[index - 1]}`));
        const testScoreCounts = Array(bins.length).fill(0);
        tableData.forEach((data) => {
            if (!isNaN(data.studentAverage)) {
                const score = parseFloat(data.studentAverage);
                for (let i = 0; i < bins.length; i++) {
                    if (score >= bins[i]) {
                        testScoreCounts[i]++;
                        break;
                    }
                }
            }
        });
        const testScoreColors = [
            'rgb(0, 85, 98)',
            'rgb(14, 129, 116)',
            'rgb(110, 186, 140)',
            'rgb(185, 242, 161)',
            'rgb(147, 193, 160)',
            'rgb(211, 255, 204)',
            'rgb(255, 25, 25)',
        ];
        canvas.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: binLabels,
                datasets: [
                    {
                        data: testScoreCounts,
                        backgroundColor: testScoreColors,
                        borderColor: 'transparent',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    datalabels: {
                        color: 'black',
                        anchor: 'end',
                        align: 'end',
                        font: {
                            weight: 'bold',
                        },
                        formatter: (value) => (value > 0 ? value.toString() : ''),
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'rgba(0, 0, 0, 0.7)',
                        },
                        grid: {
                            display: true,
                        },
                    },
                    y: {
                        grid: {
                            display: true,
                        },
                        ticks: {
                            color: 'black',
                            stepSize: 1,
                            beginAtZero: true,
                        },
                    },
                },
            },
        });
    };
    const calculateAverageByGender = (iatIndex, gender) => {
        const filteredStudents = classStudents.filter((student) => student.gender === gender);
        const studentsWithScores = filteredStudents.filter((student) => student.subjects.some((subject) => subject.scores[`iat_${iatIndex}`]));
        const totalScore = studentsWithScores.reduce((total, student) => {
            const iatScore = parseInt(student.subjects.find((subject) => subject.scores[`iat_${iatIndex}`])?.scores[`iat_${iatIndex}`]);
            return total + iatScore;
        }, 0);
        const averageScore = totalScore / studentsWithScores.length;
        return averageScore;
    };

    const createGenderLineChart = () => {
        Chart.register(LinearScale, CategoryScale, LineController, LineElement);
        const canvas = document.getElementById('iat-performance-chart');
        const ctx = canvas.getContext('2d');
        if (typeof canvas.chart !== 'undefined') {
            canvas.chart.destroy();
        }
        const chartWidth = 350;
        const chartHeight = 225;
        canvas.width = chartWidth;
        canvas.height = chartHeight;
        const maleAverages = [1, 2, 3].map((iatIndex) => calculateAverageByGender(iatIndex, 'male'));
        const femaleAverages = [1, 2, 3].map((iatIndex) => calculateAverageByGender(iatIndex, 'female'));
        canvas.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['iat1', 'iat2', 'iat3'],
                datasets: [
                    {
                        label: 'Male',
                        data: maleAverages,
                        borderColor: 'rgb( 0, 127, 255)',
                        fill: true,
                    },
                    {
                        label: 'Female',
                        data: femaleAverages,
                        borderColor: 'rgb(0, 204, 153)',
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {

                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            color: 'black',
                        },
                    },
                    annotation: {
                        annotations: {
                        },
                    },
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: false,
                            text: 'IAT',
                            color: 'black',
                        },
                        ticks: {
                            color: 'black',
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: false,
                            text: 'Scores',
                            color: 'black',
                        },
                        ticks: {
                            color: 'black',
                            beginAtZero: true,
                            stepSize: 20,
                        },
                    },
                },
            },
        });
    };

    const calculateAverageByType = (iatIndex, type) => {
        const filteredStudents = classStudents.filter((student) => student.type === type);
        const studentsWithScores = filteredStudents.filter((student) => student.subjects.some((subject) => subject.scores[`iat_${iatIndex}`]));
        const totalScore = studentsWithScores.reduce((total, student) => {
            const iatScore = parseInt(student.subjects.find((subject) => subject.scores[`iat_${iatIndex}`])?.scores[`iat_${iatIndex}`]);
            return total + iatScore;
        }, 0);
        const averageScore = totalScore / studentsWithScores.length;
        return averageScore;
    };
    const createHostelerChart = () => {
        Chart.register(LinearScale, CategoryScale, LineController, LineElement);
        const canvas = document.getElementById('iat-performance-hosteler-chart');
        const ctx = canvas.getContext('2d');
        if (typeof canvas.chart !== 'undefined') {
            canvas.chart.destroy();
        }
        const chartWidth = 350;
        const chartHeight = 225;
        canvas.width = chartWidth;
        canvas.height = chartHeight;
        const hostelAverages = [1, 2, 3].map((iatIndex) => calculateAverageByType(iatIndex, 'hostel'));
        const dayScholarAverages = [1, 2, 3].map((iatIndex) => calculateAverageByType(iatIndex, 'day-scholar'));
        canvas.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['iat1', 'iat2', 'iat3'],
                datasets: [
                    {
                        label: 'Hosteler Average',
                        data: hostelAverages,
                        borderColor: 'rgb(255, 79, 0)',
                        borderWidth: 2,
                        fill: true,
                    },
                    {
                        label: 'Day Scholar Average',
                        data: dayScholarAverages,
                        borderColor: 'rgb(253, 255, 0)',
                        borderWidth: 2,
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: false,
                            text: 'IAT',
                            color: 'black',
                        },
                        ticks: {
                            color: 'black',
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: false,
                            text: 'Scores',
                            color: 'black',
                        },
                        ticks: {
                            color: 'black',
                            beginAtZero: true,
                            stepSize: 20,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                },
            },
        });
    };
    const createClassTable = () => {
        const tableElement = document.getElementById('class-students-table');
        if (tableElement) {
            tableElement.innerHTML = '';
            const table = document.createElement('table');
            const headerRow = table.insertRow();
            const nameHeader = headerRow.insertCell();
            nameHeader.textContent = 'Student Name';
            classStudents.forEach((student) => {
                const row = table.insertRow();
                const nameCell = row.insertCell();
                nameCell.textContent = student.name;
            });
            tableElement.appendChild(table);
        }
    };
    const handleCloseOverlay = () => {
        setShowAttendanceOverlay(false);
    };
    const handleTodayClick = () => {
        setShowAttendanceOverlay(true);
    }
    const handleCopyClassAttendance = () => {
        const classAttendanceText = `
        
        Total Students: ${totalCount}
        Students Present Today: ${presentCount}
        Present Percentage: ${presentPercentage}%
    
    ${absentees.length > 0 ?
                `Absentees:
        ${absentees.map((student, index) => (
                    `
        ${index + 1}. ${student.registerNumber}, ${student.name}, ${student.mentor_name}`
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

    return (
        <div>
            <div className='department-header-container'>
                <div className='class-wise-header'>
                    <h1 className='department-wise-chart-heading'>{classStudents[0].year} - {classStudents[0].department}</h1>
                </div>

                <a href="#class-wise-page"><button href="#" className="today-button" onClick={handleTodayClick}>Attendance</button></a>
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
                                                <th>Mentor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {absentees.map((student, index) => (
                                                <tr key={student.registerNumber}>
                                                    <td>{index + 1}</td>
                                                    <td>{student.registerNumber}</td>
                                                    <td>{student.name}</td>
                                                    <td>{student.year}</td>
                                                    <td>{student.mentor_name}</td>
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

            <div className='class-wise-overlay-chart-container'>
                <div className='overall-department-performance-chart-container-class-wise'>
                    <div className='inside-container'>
                        <div className='sub-charts-container'>
                            <canvas id="pass-fail-chart"></canvas>
                            <p className='chart-heads'>{year} Pass Fail Ratio (in percentage)</p>
                        </div>
                    </div>
                </div>
                <div className='overall-department-performance-chart-container-class-wise'>
                    <div className='inside-container'>
                        <div className='sub-charts-container'>
                            <canvas id="class-chart-test"></canvas>
                            <p className='chart-heads'>Test Scores Range</p>
                        </div>
                    </div>
                </div>
                <div className='overall-department-performance-chart-container-class-wise'>
                    <div className='inside-container'>
                        <div className='sub-charts-container'>
                            <canvas id="iat-performance-chart"></canvas>
                            <p className='chart-heads'>Gender Wise IAT Performance</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='department-class-wise-hosteler-monthly-container'>
            <div className='overall-department-performance-chart-container-class-wise'>
                    <div className='inside-container'>
                        <div className='sub-charts-container'>
                            <canvas id="iat-performance-hosteler-chart"></canvas>
                            <p className='chart-heads'>Hosteler vs Day-Scholar Performance</p>
                        </div>
                    </div>
                    </div>
                <ClassAttendance classStudents={classStudents} />
            </div>
        </div>
    );
};
export default DepartmentClassWise;
