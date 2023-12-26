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
const PassGradeChart = ({ students }) => {
    const classStudents = students;
    const [showAttendanceOverlay, setShowAttendanceOverlay] = useState(false);
    const { presentPercentage, absentPercentage, presentCount, totalCount, absentees } = calculateOverallAttendance(
        students
    );
    Chart.register(LinearScale, CategoryScale, DoughnutController, ArcElement, LineController, LineElement);
    useEffect(() => {
        createOverallClassPerformanceChart();
    }, [students]);

    function calculateStudentTestAverage(student) {
        const maxScore = 100;
        const subjectScores = student.subjects.map((subject) => {
            const { scores } = subject;
            if (!scores || typeof scores !== "object") {
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
            const average = (subject.scores / maxScore) * 100; return {
                subject_name: subject.subject_name,
                average_score: average,
            };
        });
        const overallAverage =
            subjectAverages.reduce((total, subject) => total + subject.average_score, 0) /
            subjectAverages.length;
        return overallAverage;
    }



    const createOverallClassPerformanceChart = () => {
        Chart.register(LinearScale, CategoryScale, DoughnutController, ArcElement);
        const canvas = document.getElementById('class-chart-test');
        const ctx = canvas.getContext('2d');
        if (typeof canvas.chart !== 'undefined') {
            canvas.chart.destroy();
        }
        const chartWidth = 350;
        const chartHeight = 250;
        canvas.width = chartWidth;
        canvas.height = chartHeight;
        const classStudents = students;
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

    function calculateStudentAverage(student) {
        const totalAttendance = student.total_attendance;
        const totalDays = student.total_days;
        const presentPercentage = ((totalAttendance / totalDays) * 100).toFixed(2);
        const maxScore = 100;
        const subjectScores = student.subjects.map((subject) => {
            const { scores } = subject;
            if (!scores || typeof scores !== "object") {
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
            const average = (subject.scores / maxScore) * 100; return {
                subject_name: subject.subject_name,
                average_score: average,
            };
        });
        const overallAverage = subjectAverages.reduce((total, subject) => total + subject.average_score, 0) / subjectAverages.length;
        const hasTestScore = !isNaN(overallAverage);
        let overall_score;
        if (hasTestScore) {
            overall_score = ((parseFloat(presentPercentage) + parseFloat(overallAverage)) / 2).toFixed(2);
        } else {
            overall_score = parseFloat(presentPercentage).toFixed(2);
        }
        return overall_score;
    }


    return (
        <div>
            <div className='overall-department-performance-chart-container-class-wise'>
                <div className='inside-container'>
                    <div className='sub-charts-container'>
                        <canvas id="class-chart-test"></canvas>
                        <p className='chart-heads'>Test Performance</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PassGradeChart;
