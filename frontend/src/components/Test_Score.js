import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart, LinearScale, CategoryScale, Title, Tooltip, BarController, BarElement, LineController, ScatterController, PointElement, LineElement } from 'chart.js';

import './CSS/Test_Score.css';
import ComparisonChart from './ComparisonChart';
function calculateIATAverages(testScores) {
    const iatAverages = [0, 0, 0];

    testScores.forEach(subject => {
        iatAverages[0] += parseInt(subject?.scores?.iat_1) || 0;
        iatAverages[1] += parseInt(subject?.scores?.iat_2) || 0;
        iatAverages[2] += parseInt(subject?.scores?.iat_3) || 0;
    });

    const iatCounts = [0, 0, 0]; // Initialize array to store subject counts for each IAT

    testScores.forEach(subject => {
        if (subject?.scores?.iat_1 !== undefined) iatCounts[0]++;
        if (subject?.scores?.iat_2 !== undefined) iatCounts[1]++;
        if (subject?.scores?.iat_3 !== undefined) iatCounts[2]++;
    });

    for (let i = 0; i < 3; i++) {
        if (iatCounts[i] > 0) {
            iatAverages[i] /= iatCounts[i];
        }
    }

    return iatAverages;
}

const Test_Score = ({ email, department, year }) => {
    const [testScores, setTestScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClosed, setIsClosed] = useState(false);
    const [error, setError] = useState(null);

    const [students, setStudents] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false); // New state to track data fetching
    const subjectAverages = calculateSubjectAverages(testScores);
    const { highestSubject, lowestSubject } = findHighLowSubjects(subjectAverages);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get('https://eduleaves-api.vercel.app/api/students_data');
                const studentData = response.data.filter((data) => data.role === 'student' && data.department === department && data.class === year);
                setStudents(studentData);
                setLoading(false);
                setIsDataFetched(true); // Set the flag to true after data fetch

            } catch (error) {
                console.error('Error fetching student data:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    useEffect(() => {
        const fetchTestScores = async () => {
            try {
                const response = await axios.get(`https://eduleaves-api.vercel.app/api/students?email=${email}`);
                const { subjects } = response.data;
                setTestScores(subjects);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching test scores:', error);
                setLoading(false);
            }
        };

        if (email) {
            fetchTestScores();
        } else {
            setLoading(false);
        }
    }, [email]);

    const createChart = () => {
        // Register the required scales and controllers
        Chart.register(LinearScale, CategoryScale, Title, Tooltip, LineController, LineElement);

        const canvas = document.getElementById('iat-performance-student-chart');
        const ctx = canvas.getContext('2d');
        if (typeof canvas.chart !== 'undefined') {
            canvas.chart.destroy();
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const chartWidth = 1000;
        const chartHeight = 600;

        canvas.width = chartWidth;
        canvas.height = chartHeight;

        const labels = testScores.map((subject) => subject?.subject_name || '');
        const iat1 = testScores.map((subject) => subject?.scores?.iat_1 || 0);
        const iat2 = testScores.map((subject) => subject?.scores?.iat_2 || 0);
        const iat3 = testScores.map((subject) => subject?.scores?.iat_3 || 0);

        canvas.chart = new Chart(ctx, {
            type: 'line', // Change chart type to 'line' for run chart
            data: {
                labels: labels, // Use dates as labels
                datasets: [
                    {
                        label: 'IAT 1',
                        data: iat1, // Use iat1 values over time
                        borderColor: 'rgb(185, 242, 161)',
                        borderWidth: 2,
                    },
                    {
                        label: 'IAT 2',
                        data: iat2, // Use iat2 values over time
                        borderColor: 'rgb(113, 224, 81)',
                        borderWidth: 2,
                    },
                    {
                        label: 'IAT 3',
                        data: iat3, // Use iat3 values over time
                        borderColor: 'rgb(14, 129, 116)',
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: false,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        beginAtZero: true,
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
                            color: 'rgba(0,0,0, 0.7)', // Set the font color for legend labels
                        },
                    },
                },
                interaction: {
                    mode: 'index', // Display data for multiple datasets at the same index
                },
            },
        });
    };
    const createComparisonChart = () => {
        Chart.register(LinearScale, CategoryScale, BarController, BarElement);

        const canvas = document.getElementById('iat-comparison-chart');
        const ctx = canvas.getContext('2d');
        if (typeof canvas.chart !== 'undefined') {
            canvas.chart.destroy();
        }

        const chartWidth = 560;
        const chartHeight = 450;

        canvas.width = chartWidth;
        canvas.height = chartHeight;

        const iatAverages = calculateIATAverages(testScores);
        const classAverages = calculateClassIATAverages(students);

        const lowestIATScores = [Infinity, Infinity, Infinity];
        const highestIATScores = [-Infinity, -Infinity, -Infinity];

        students.forEach(student => {
            student.subjects.forEach(subject => {
                const iat1 = parseInt(subject.scores.iat_1) || 0;
                const iat2 = parseInt(subject.scores.iat_2) || 0;
                const iat3 = parseInt(subject.scores.iat_3) || 0;

                lowestIATScores[0] = Math.min(lowestIATScores[0], iat1);
                lowestIATScores[1] = Math.min(lowestIATScores[1], iat2);
                lowestIATScores[2] = Math.min(lowestIATScores[2], iat3);

                highestIATScores[0] = Math.max(highestIATScores[0], iat1);
                highestIATScores[1] = Math.max(highestIATScores[1], iat2);
                highestIATScores[2] = Math.max(highestIATScores[2], iat3);
            });
        });

        canvas.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['IAT 1', 'IAT 2', 'IAT 3'],
                datasets: [
                    {
                        label: 'Lowest Score',
                        data: lowestIATScores,
                        backgroundColor: 'rgba(255, 206, 86, 0.5)',
                        borderWidth: 0,
                    },
                    {
                        label: 'Your Performance',
                        data: iatAverages,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderWidth: 0,
                    },
                    {
                        label: 'Class Average',
                        data: classAverages,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderWidth: 0,
                    },
                    {
                        label: 'Highest Score',
                        data: highestIATScores,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
                        ticks: {
                            color: 'rgba(0,0,0, 0.7)',
                        },
                    },
                    y: {
                        beginAtZero: true,
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

    const createLineChart = () => {
        Chart.register(LinearScale, CategoryScale, LineController, LineElement);

        const canvas = document.getElementById('subject-line-chart');
        const ctx = canvas.getContext('2d');
        if (typeof canvas.chart !== 'undefined') {
            canvas.chart.destroy();
        }

        const chartWidth = 560;
        const chartHeight = 600;

        canvas.width = chartWidth;
        canvas.height = chartHeight;

        const labels = testScores.map((subject) => subject?.subject_name || '');
        const studentScores = [];
        const classAverages = calculateClassIATSubjectAverages(students);

        testScores.forEach((subject) => {
            const iat1 = parseInt(subject?.scores?.iat_1) || 0;
            const iat2 = parseInt(subject?.scores?.iat_2) || 0;
            const iat3 = parseInt(subject?.scores?.iat_3) || 0;

            const totalScore = (iat1 + iat2 + iat3) / 3;
            studentScores.push(totalScore);
        });

        canvas.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Your Performance',
                        data: studentScores,
                        borderColor: 'rgb(14, 129, 116)',
                        backgroundColor: 'rgba(14, 129, 116, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                    },
                    {
                        label: 'Your Class Average',
                        data: classAverages,
                        borderColor: 'rgb(113, 224, 81)',
                        backgroundColor: 'rgba(113, 224, 81, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                    },
                ],
            },
            options: {
                responsive: false,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(0,0,0, 0.7)',
                        },
                    },
                    y: {
                        beginAtZero: true,
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

    useEffect(() => {
        if (testScores.length > 0 && isDataFetched) {
            createChart();
            createComparisonChart();
            createLineChart();
        }
    }, [testScores, isDataFetched]);


    const calculateClassIATAverages = (students) => {
        const classIatAverages = [0, 0, 0]; // Initialize array to store averages for each IAT
        const iatCounts = [0, 0, 0];

        students.forEach(student => {
            student.subjects.forEach(subject => {
                if (subject.scores.iat_1 !== undefined) {
                    classIatAverages[0] += parseInt(subject.scores.iat_1);
                    iatCounts[0]++;
                }
                if (subject.scores.iat_2 !== undefined) {
                    classIatAverages[1] += parseInt(subject.scores.iat_2);
                    iatCounts[1]++;
                }
                if (subject.scores.iat_3 !== undefined) {
                    classIatAverages[2] += parseInt(subject.scores.iat_3);
                    iatCounts[2]++;
                }
            });
        });

        for (let i = 0; i < 3; i++) {
            if (iatCounts[i] > 0) {
                classIatAverages[i] /= iatCounts[i];
            }
        }


        return classIatAverages;
    };

    function calculateSubjectAverages(testScores) {
        const subjectAverages = {}; // Create an object to store subject averages

        testScores.forEach((subject) => {
            const subjectName = subject?.subject_name || '';
            const iat1 = parseInt(subject?.scores?.iat_1) || 0;
            const iat2 = parseInt(subject?.scores?.iat_2) || 0;
            const iat3 = parseInt(subject?.scores?.iat_3) || 0;

            const totalScore = iat1 + iat2 + iat3;
            const averageScore = totalScore / 3;

            subjectAverages[subjectName] = averageScore;
        });

        return subjectAverages;
    };

    function findHighLowSubjects(subjectAverages) {
        let highestSubject = null;
        let lowestSubject = null;

        for (const subjectName in subjectAverages) {
            if (!highestSubject || subjectAverages[subjectName] > subjectAverages[highestSubject]) {
                highestSubject = subjectName;
            }

            if (!lowestSubject || subjectAverages[subjectName] < subjectAverages[lowestSubject]) {
                lowestSubject = subjectName;
            }
        }

        return { highestSubject, lowestSubject };
    };
    function calculateClassIATSubjectAverages(students) {
        const classAverages = []; // Initialize array to store averages for each subject

        students[0]?.subjects.forEach((subject) => { // Using the subjects of the first student as a reference
            const iat1Total = students.reduce((total, student) => {
                const iat1 = parseInt(student?.subjects?.find(sub => sub.subject_code === subject.subject_code)?.scores?.iat_1) || 0;
                return total + iat1;
            }, 0);

            const iat2Total = students.reduce((total, student) => {
                const iat2 = parseInt(student?.subjects?.find(sub => sub.subject_code === subject.subject_code)?.scores?.iat_2) || 0;
                return total + iat2;
            }, 0);

            const iat3Total = students.reduce((total, student) => {
                const iat3 = parseInt(student?.subjects?.find(sub => sub.subject_code === subject.subject_code)?.scores?.iat_3) || 0;
                return total + iat3;
            }, 0);

            const totalScore = (iat1Total + iat2Total + iat3Total) / (students.length * 3);
            classAverages.push(totalScore);
        });

        return classAverages;
    }

    if (loading) {
        return <p>Loading test scores...</p>;
    }

    if (isClosed) {
        return null; // Don't render the component if it's closed
    }

    if (!testScores || testScores.length === 0) {
        return <p>No test scores found.</p>;
    }

    return (
        <div className="test-scrollable-container">
            <div className="high-low-score-container">
                <div className="high-score-subjects">
                    <h3>Highest Scoring Subject</h3>
                    <ul>
                        <li><strong>Subject:</strong> {highestSubject}</li>
                        <li><strong>Scored:</strong> {subjectAverages[highestSubject].toFixed(2)}</li>
                    </ul>
                </div>
                <div className="low-score-subjects">
                    <h3>Lowest Scoring Subject</h3>
                    <ul>
                        <li><strong>Subject:</strong> {lowestSubject}</li>
                        <li><strong>Scored: </strong>{subjectAverages[lowestSubject].toFixed(2)}</li>
                    </ul>
                </div>
            </div>

            <div className="test-score-chart-container">
                <h2 id="chart-names">Score table</h2>
                <div className="test-score-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Subject Name</th>
                                <th>IAT 1</th>
                                <th>IAT 2</th>
                                <th>IAT 3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testScores.map((subject, index) => (
                                <tr key={index}>
                                    <td>{subject?.subject_code || ''}</td>
                                    <td>{subject?.subject_name || ''}</td>
                                    <td>{subject?.scores?.iat_1 || 'NaN'}</td>
                                    <td>{subject?.scores?.iat_2 || 'NaN'}</td>
                                    <td>{subject?.scores?.iat_3 || 'NaN'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ComparisonChart email={email} department={department} year={year} testScores={testScores} />
            <div className="test-score-container">
                <div className="test-score-content-container">
                    <div className="test-score-chart-container">
                        <h2 id="chart-names">Subject wise IAT performance</h2>
                        <canvas id="iat-performance-student-chart"></canvas>
                    </div>
                </div>
            </div>
            <div className="test-score-container">
                <div className="test-score-chart-container">
                    <h2 id="chart-names">IAT score comparison with overall class</h2>
                    <canvas id="iat-comparison-chart"></canvas>
                </div>
                <div className="test-score-chart-container">
                    <h2 id="chart-names">Subject score comparison with overall class</h2>
                    <canvas id="subject-line-chart"></canvas>
                </div>
            </div>
        </div>

    );
};
export default Test_Score;
