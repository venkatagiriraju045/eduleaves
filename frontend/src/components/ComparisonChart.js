import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart, LinearScale, CategoryScale, BarController, BarElement } from 'chart.js';

import './CSS/Test_Score.css';

const ComparisonChart = ({department, year, testScores }) => {
const [students, setStudents] = useState([]);

useEffect(() => {
    // Fetch student data
    const fetchStudentData = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/students_data');
        const studentData = response.data.filter(
        data => data.role === 'student' && data.department === department && data.class === year
        );
        setStudents(studentData);
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
    };

    fetchStudentData();
}, [department, year]);

const calculateLowestAndHighestScores = (iatType) => {
    let lowestScores = [];
    let highestScores = [];

    if (students.length > 0) {
    for (let i = 0; i < testScores.length; i++) {
        const subject = testScores[i];

        // Initialize with high and low values
        let lowestIAT = Infinity;
        let highestIAT = -Infinity;

        for (let j = 0; j < students.length; j++) {
        const student = students[j];

        if (student.subjects && student.subjects.length > 0) {
            for (let k = 0; k < student.subjects.length; k++) {
            const studentSubject = student.subjects[k];

            if (studentSubject.subject_name === subject.subject_name) {
                const iat = parseInt(studentSubject.scores[iatType]) || 0;

                lowestIAT = Math.min(lowestIAT, iat);
                highestIAT = Math.max(highestIAT, iat);
            }
            }
        }
        }

        lowestScores.push(lowestIAT);
        highestScores.push(highestIAT);
    }
    }
    return { lowestScores, highestScores };
};

// ...

useEffect(() => {
    if (testScores.length > 0 && students.length > 0) {
        const iat1Data = calculateLowestAndHighestScores('iat_1');
        if (iat1Data.lowestScores.some(score => score !== 0) || iat1Data.highestScores.some(score => score !== 0)) {
            createChart('iat_1', iat1Data);
        }
        
        const iat2Data = calculateLowestAndHighestScores('iat_2');
        if (iat2Data.lowestScores.some(score => score !== 0) || iat2Data.highestScores.some(score => score !== 0)) {
            createChart('iat_2', iat2Data);
        }
        
        const iat3Data = calculateLowestAndHighestScores('iat_3');
        if (iat3Data.lowestScores.some(score => score !== 0) || iat3Data.highestScores.some(score => score !== 0)) {
            createChart('iat_3', iat3Data);
        }
    }
}, [testScores, students]);

function calculateClassIATSubjectAverages(students, iatType) {
    const classAverages = []; // Initialize an array to store averages for each subject

    students[0]?.subjects.forEach((subject) => {
        const iatTotal = students.reduce((total, student) => {
            const iat = parseInt(student?.subjects?.find((sub) => sub.subject_name === subject.subject_name)?.scores[iatType]) || 0;
            return total + iat;
        }, 0);

        const totalScore = iatTotal / students.length;
        classAverages.push(totalScore);
    });

    return classAverages;
}


const createChart = (iatType, { lowestScores, highestScores }) => {
    // Register the required scales and controllers
    Chart.register(LinearScale, CategoryScale, BarController, BarElement);

    const canvas = document.getElementById(`iat-performance-student-chart-${iatType}`);
    const ctx = canvas.getContext('2d');
    if (typeof canvas.chart !== 'undefined') {
    canvas.chart.destroy();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const chartWidth = 800;
    const chartHeight = 510;

    canvas.width = chartWidth;
    canvas.height = chartHeight;

    const labels = testScores.map((subject) => subject?.subject_name || '');
    const iatScores = testScores.map((subject) => subject?.scores[iatType] || 0);
    const classIatAverages = calculateClassIATSubjectAverages(students, iatType);

    canvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `Lowest score (IAT ${iatType})`,
                    data: lowestScores,
                    backgroundColor: 'rgba(255, 206, 86, 0.5)', // Classic Blue
                    borderColor: 'rgba(255, 206, 86, 0.5)', // Classic Blue
                    borderWidth: 0,
                },
                {
                    label: `Your score (IAT ${iatType})`,
                    data: iatScores,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)', // Sky Blue
                    borderColor: 'rgba(75, 192, 192, 0.5)', // Sky Blue
                    borderWidth: 0,
                },
                {
                    label: `Class average (IAT ${iatType})`,
                    data: classIatAverages,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)', // Light Blue
                    borderColor: 'rgba(54, 162, 235, 0.5)', // Light Blue
                    borderWidth: 0,
                },
                {
                    label: `Highest score (IAT ${iatType})`,
                    data: highestScores,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)', // Navy Blue
                    borderColor: 'rgba(255, 99, 132, 0.5)', // Navy Blue
                    borderWidth: 0,
                },
            ],
        },
    options: {
        responsive: false,
        maintainAspectRatio: true,
        scales: {
        x: {
            beginAtZero: true,
            max: 100,
            ticks: {
            color: 'rgba(0,0,0, 0.7)',
            },
        },
        y: {
            beginAtZero: true,
            max: 100,
            ticks: {
            color: 'rgba(0,0,0, 0.7)',
            },
        },
        },
        plugins: {
        legend: {
            display: true,
            labels: {
            color: 'rgba(0,0,0, 0.7)',
            },
        },
        },
    },
    });
};

return (
    <div className="iat-comparison-with-class">
        {testScores.length > 0 && students.length > 0 ? (
            <>
                <div className="chart-container">
                    <h2>IAT 1</h2>
                    {calculateLowestAndHighestScores('iat_1').lowestScores.some(score => score !== 0) ||
                    calculateLowestAndHighestScores('iat_1').highestScores.some(score => score !== 0) ? (
                        <canvas id="iat-performance-student-chart-iat_1"></canvas>
                    ) : (
                        <p>No data available for IAT 1</p>
                    )}
                </div>
                <div className="chart-container">
                    <h2>IAT 2</h2>
                    {calculateLowestAndHighestScores('iat_2').lowestScores.some(score => score !== 0) ||
                    calculateLowestAndHighestScores('iat_2').highestScores.some(score => score !== 0) ? (
                        <canvas id="iat-performance-student-chart-iat_2"></canvas>
                    ) : (
                        <p>No data available for IAT 2</p>
                    )}
                </div>
                <div className="chart-container">
                    <h2>IAT 3</h2>
                    {calculateLowestAndHighestScores('iat_3').lowestScores.some(score => score !== 0) ||
                    calculateLowestAndHighestScores('iat_3').highestScores.some(score => score !== 0) ? (
                        <canvas id="iat-performance-student-chart-iat_3"></canvas>
                    ) : (
                        <p>No data available for IAT 3</p>
                    )}
                </div>
            </>
        ) : (
            <p>Loading data...</p>
        )}
    </div>
);

};

export default ComparisonChart;
