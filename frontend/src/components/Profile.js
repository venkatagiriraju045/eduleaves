import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Chart, LinearScale, CategoryScale, BarController, BarElement, DoughnutController, ArcElement } from 'chart.js';
import './CSS/Profile_model.css';
import TestScore from './TestScore';
import Accomplishment from './Accomplishment';
import SemesterResult from './SemesterResult';
import SemResult from './SemResult';
import AttendanceCalendar from './AttendanceCalendar';

const Profile = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTestScore, setShowTestScore] = useState(false);
    const [showSemesterResult, setshowSemesterResult] = useState(true);
    const [enableSemesterResult, setEnableSemesterResult] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showAccomplishments, setShowAccomplishments] = useState(false);
    const [showAttendance, setShowAttendance] = useState(false);
    const [showNavBar, setShowNavBar] = useState(true);
    const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
    const overlayClass = `loading-overlay${loading || isLoading ? ' visible' : ''}`;
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    const navigate = useNavigate();

    useEffect(() => {
        // Detect device type and set the state
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        isMobile ? setShowNavBar(false) : setShowNavBar(true)
    }, [showSemesterResult, showAccomplishments, showAttendance, showTestScore]);
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get('https://eduleaves-api.vercel.app/api/fetch_student_data', {
                    params: {
                        registerNumber: loggedInEmail // Filter by institute_name
                    }
                });
                const studentData = response.data;
                setStudent(studentData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching student data:', error);
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [loggedInEmail]);


    /*
        useEffect(() => {
            const createChart = (student) => {
                // Register the required scales and controllers
                Chart.register(LinearScale, CategoryScale, BarController, BarElement, DoughnutController, ArcElement);
    
                const canvas = document.getElementById("scoreChart");
                const ctx = canvas.getContext("2d");
                if (typeof canvas.chart !== 'undefined') {
                    canvas.chart.destroy();
                } 
    
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
    
                const maxScore = 100;
    
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
    
                canvas.chart = new Chart(ctx, {
                    type: "doughnut",
                    data: {
                        labels: ["Scored", "Missed"],
                        datasets: [
                            {
                                data: [isNaN(overallAverage) ? 0 : overallAverage, isNaN(overallAverage) ? 0 : 100 - overallAverage],
                                backgroundColor: ["rgb(30,144,255)", "rgb(68, 89, 98)"],
                                borderColor: ["rgb(30,144,255)", "rgb(68, 89, 98)"],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true, // Allow the chart to be responsive
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                display: false,
                            },
                            annotation: {
                                annotations: {
                                    value: {
                                        type: "text",
                                        fontColor: "white",
                                        fontSize: 24,
                                        fontStyle: "bold",
                                        textAlign: "center",
                                        value: `${isNaN(overallAverage) ? "NaN" : Math.round(overallAverage)}%`,
                                        x: "50%",
                                        y: "50%",
                                    },
                                },
                            },
                        },
                        cutout: "85%",
                    },
                    plugins: [
                        {
                            id: "customLabel",
                            afterDraw: (chart) => {
                                const width = chart.width;
                                const height = chart.height;
                                const ctx = chart.ctx;
    
                                ctx.save();
                                ctx.fillStyle = "rgb(20,20,20)";
                                ctx.textAlign = "center";
                                ctx.textBaseline = "middle";
                                ctx.font = "calc(1rem + 2vw) FjallaOne-Regular";
                                ctx.fillText(`${isNaN(overallAverage) ? "NaN" : Math.round(overallAverage)}%`, width / 2, height / 2);
                                ctx.restore();
                            },
                        },
                    ],
                });
    
            };
            const createAttendanceChart = () => {
                const canvas = document.getElementById('attendanceChart');
                const ctx = canvas.getContext('2d');
    
                // Set the desired fixed dimensions for the chart
                if (typeof canvas.chart !== 'undefined') {
                    canvas.chart.destroy();
                }
    
                const totalAttendance = student.total_attendance;
                const totalDays = student.total_days;
                const absentDays = totalDays - totalAttendance;
                const presentPercentage = ((totalAttendance / totalDays) * 100).toFixed(2);
    
                canvas.chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Present', 'Absent'],
                        datasets: [
                            {
                                data: [totalAttendance, absentDays],
                                backgroundColor: ['rgb(30,144,255)', 'rgb(68, 89, 98)'],
                                borderColor: ['rgb(30,144,255)', 'rgb(68, 89, 98)'],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true, // Allow the chart to be responsive
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                display: false,
                            },
                            annotation: {
                                annotations: {
                                    value: {
                                        type: 'text',
                                        fontColor: 'black',
                                        fontSize: 16,
                                        fontStyle: 'bold',
                                        textAlign: 'center',
                                        value: `${Math.round(presentPercentage)}%`,
                                        x: '50%',
                                        y: '50%',
                                    },
                                },
                            },
                        },
                        cutout: '85%',
                    },
                    plugins: [
                        {
                            id: 'customLabel',
                            afterDraw: chart => {
                                const width = chart.width;
                                const height = chart.height;
                                const ctx = chart.ctx;
                                ctx.save();
                                ctx.fillStyle = 'rgb(20,20,20)';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.font = 'calc(1rem + 2vw) FjallaOne-Regular';
                                ctx.fillText(`${Math.round(presentPercentage)}%`, width / 2, height / 2);
                                ctx.restore();
                            },
                        },
                    ],
                });
            };
    
            if (student) {
                createChart(student);
                createAttendanceChart(student);
            }
        }, [student]);
        */

    const handleAccomplishments = () => {
        setShowAccomplishments(false);
        setShowTestScore(false);
        setShowAttendance(false);
        setshowSemesterResult(true);
        setIsLoading(true);


        // Add loading class to content-container to blur the background
        // Hide the chart elements
        document.querySelectorAll('.profile-attendance-chart,.chart-container1,.profile-chart-container,.chart-details-container1, .attendance-chart, .overall-performance-chart,.analytics-container, .message-container').forEach((element) => {
            element.style.display = 'none';
        });

        // Create a new message element and append it to the content-container
        const messageElement = document.createElement('div');
        messageElement.style.color = 'white'; // Set the color to white
        document.querySelector('.profile-content-container').appendChild(messageElement);

        // After a short delay, remove the loading class and the message element to show the loading overlay
        setTimeout(() => {
            setIsLoading(false);
            messageElement.remove();
            setShowAccomplishments(false);
            setShowTestScore(false);
            setShowAttendance(false);
            setshowSemesterResult(true);
        }, 1000); // Adjust the duration (in milliseconds) to control the transition time
    };

    const handleShowTestScore = () => {
        setShowAccomplishments(false);
        setShowTestScore(false);
        setShowAttendance(false);
        setshowSemesterResult(true);
        setIsLoading(true);


        // Add loading class to content-container to blur the background
        // Hide the chart elements
        document.querySelectorAll('.profile-attendance-chart,.chart-container1,.profile-chart-container,.chart-details-container1, .attendance-chart, .overall-performance-chart,.analytics-container, .message-container').forEach((element) => {
            element.style.display = 'none';
        });

        // Create a new message element and append it to the content-container
        const messageElement = document.createElement('div');
        messageElement.style.color = 'white'; // Set the color to white
        document.querySelector('.profile-content-container').appendChild(messageElement);

        // After a short delay, remove the loading class and the message element to show the loading overlay
        setTimeout(() => {
            setIsLoading(false);
            messageElement.remove();
            setShowAccomplishments(false);
            setShowTestScore(false);
            setShowAttendance(false);
            setshowSemesterResult(true);
        }, 1000); // Adjust the duration (in milliseconds) to control the transition time
    };

    const handleTestScoreClose = () => {
        setShowAccomplishments(false);
        setShowTestScore(false);
        setShowAttendance(false);
        setshowSemesterResult(true);

        document.querySelectorAll('.profile-attendance-chart,.chart-container1,.chart-details-container1 ,.attendance-chart, .overall-performance-chart, .analytics-container, .message-container').forEach((element) => {
            element.style.display = 'flex';
        });
    };

    const handleShowSemesterResults = () => {
        setShowAccomplishments(false);
        setShowTestScore(false);
        setShowAttendance(false);
        setshowSemesterResult(true);
        setIsLoading(true);

        // Add loading class to content-container to blur the background

        // Hide the chart elements
        document.querySelectorAll('.profile-attendance-chart,.chart-container1,.profile-chart-container,.chart-details-container1, .attendance-chart, .overall-performance-chart,.analytics-container, .message-container').forEach((element) => {
            element.style.display = 'none';
        });

        // Create a new message element and append it to the content-container
        const messageElement = document.createElement('div');
        messageElement.style.color = 'white'; // Set the color to white
        document.querySelector('.profile-content-container').appendChild(messageElement);

        // After a short delay, remove the loading class and the message element to show the loading overlay
        setTimeout(() => {
            setIsLoading(false);
            messageElement.remove();
            setShowTestScore(false);
            setshowSemesterResult(true);
            setShowAttendance(false);
        }, 1000); // Adjust the duration (in milliseconds) to control the transition time
    };
    const handleShowAttendance = () => {
        setShowAccomplishments(false);
        setShowTestScore(false);
        setShowAttendance(false);
        setshowSemesterResult(true);
        setIsLoading(true);


        // Add loading class to content-container to blur the background

        // Hide the chart elements
        document.querySelectorAll('.profile-attendance-chart,.chart-container1,.profile-chart-container,.chart-details-container1, .attendance-chart, .overall-performance-chart,.analytics-container, .message-container').forEach((element) => {
            element.style.display = 'none';
        });

        // Create a new message element and append it to the content-container
        const messageElement = document.createElement('div');
        messageElement.style.color = 'white'; // Set the color to white
        document.querySelector('.profile-content-container').appendChild(messageElement);

        // After a short delay, remove the loading class and the message element to show the loading overlay
        setTimeout(() => {
            setIsLoading(false);
            messageElement.remove();
            setShowAccomplishments(false);
            setShowTestScore(false);
            setShowAttendance(false);
            setshowSemesterResult(true);

        }, 1000); // Adjust the duration (in milliseconds) to control the transition time
    };
    const handleCloseAttendance = () => {
        setShowAttendance(false);
        document.querySelectorAll('.profile-attendance-chart,.chart-container1, .profile-chart-container, .chart-details-container1 ,.attendance-chart, .overall-performance-chart,.analytics-container, .message-container').forEach((element) => {
            element.style.display = 'flex';
        });
    };
    const handleHomeButtonClick = () => {
        setShowAccomplishments(false);
        setShowTestScore(false);
        setShowAttendance(false);
        setshowSemesterResult(true);
        /*
        document.querySelectorAll('.profile-attendance-chart,.chart-container1,.profile-chart-container,.chart-details-container1 ,.attendance-chart, .overall-performance-chart,.analytics-container, .message-container').forEach((element) => {
            element.style.display = 'flex';
        });

        */
    };
    const renderAnalytics = (student) => {
        if (!student) {
            return <p className="analytics">Student data not available.</p>;
        }


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

        if (isNaN(overall_score)) {
            return <p className="analytics">Oops! Something went wrong with the performance calculation.</p>;
        } else if (overall_score >= 95 && overall_score <= 100) {
            return <p className="analytics">You are absolutely extraordinary! Your outstanding performance sets a new benchmark. Keep shining brightly and inspiring others!</p>;
        } else if (overall_score >= 90 && overall_score < 95) {
            return <p className="analytics">Wow! Your brilliance knows no bounds! You consistently amaze everyone with your exceptional skills. Keep dazzling the world!</p>;
        } else if (overall_score >= 85 && overall_score < 90) {
            return (
                <p className="analytics">
                    Great job! Your remarkable performance deserves applause. You've shown incredible potential, and with a little focus on areas that need improvement, you'll reach new heights of success!
                </p>
            );
        } else if (overall_score >= 80 && overall_score < 85) {
            return (
                <p className="analytics">
                    Fantastic work! Your achievements speak volumes about your abilities. With a little more effort in specific areas, you'll unlock even greater opportunities for triumph. Keep up the amazing work!
                </p>
            );
        } else if (overall_score >= 75 && overall_score < 80) {
            return (
                <p className="analytics">
                    Well done! You've made significant progress and achieved commendable results. By dedicating some attention to the areas that need improvement, you'll unleash your full potential and achieve even greater feats!
                </p>
            );
        } else if (overall_score >= 70 && overall_score < 75) {
            return (
                <p className="analytics">
                    Great job! Your hard work and commitment have yielded impressive results. Focus on the areas that need a little more attention, and you'll witness a remarkable transformation in your performance!
                </p>
            );
        } else if (overall_score >= 60 && overall_score < 70) {
            return (
                <p className="analytics">
                    Excellent effort! Your performance shows promise and potential. By working on the areas that need improvement, you'll experience a significant boost in your overall performance. Keep pushing forward with unwavering determination!
                </p>
            );
        } else if (overall_score >= 30 && overall_score < 60) {
            return (
                <p className="analytics">
                    Your commitment and perseverance are commendable! Keep pushing harder and striving for excellence. With consistent effort and focus, you'll witness remarkable growth and achieve the success you deserve!
                </p>
            );
        } else if (overall_score >= 0 && overall_score < 30) {
            return (
                <p className="analytics">
                    You've faced challenges, but remember that every setback is an opportunity for a comeback. Stay motivated, seek support, and give your best effort. Success is within reach, and your determination will lead you to achieve greatness!
                </p>
            );
        } else {
            return <p className="analytics">Oops! Something went wrong with the performance calculation.</p>;
        }
    };

    const renderMessage = () => {
        if (student) {
            const { hod_message, mentor_message, advisor_message } = student;
            if (hod_message || mentor_message || advisor_message) {
                return (
                    <div className="message">
                        <p className="message-title">Important Messages:</p>
                        <div className="message-content">
                            <div className="message-point">
                                <img src="./uploads/pin.png" alt="Point Icon" className="point-icon" />
                                <p className="sender-title sender-hod"> HOD MESSAGE : </p>
                                <p className="sentence-text">{hod_message.trim()}   </p>
                                <img src="./uploads/pin.png" alt="Point Icon" className="point-icon" />
                                <p className="sender-title sender-mentor"> MENTOR MESSAGE : </p>
                                <p className="sentence-text">{mentor_message.trim()}   </p>
                                <img src="./uploads/pin.png" alt="Point Icon" className="point-icon" />
                                <p className="sender-title sender-advisor"> ADVISOR MESSAGE : </p>
                                <p className="sentence-text">{advisor_message.trim()}   </p>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return <p className="message">No messages available.</p>;
            }
        } else {
            return <p className="message">Stay tuned...</p>;
        }
    };
    const handleLogout = () => {
        setShowConfirmationPrompt(false);
        localStorage.removeItem('loggedInEmail');
        navigate('/');
    };

    const handleShowNav = () => {
        setShowNavBar((prevShowNavBar) => !prevShowNavBar);
    };

    if (!student) {
        return <p>loading...</p>;
    }

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

    const maxScore = 100;

    const subjectAverages = subjectScores.map((subject) => {
        if (subject.scores === "NaN") {
            return {
                subject_name: subject.subject_name,
                average_score: "NaN",
            };
        }
        const average = (subject.scores / maxScore) * 100;
        return {
            subject_name: subject.subject_name,
            average_score: average,
        };
    });

    const overallAverage =
        subjectAverages.reduce((total, subject) => total + subject.average_score, 0) /
        subjectAverages.length;

    const imageUrl = `./uploads/${student.email}.jpg`;
    const logoImageUrl = `./uploads/dashboard-brand-logo.JPG`;


    function getInstituteFullName(instituteName) {
        const instituteNameMap = {
            "KIOT": "KNOWLEDGE INSTITUTE OF TECHNOLOGY",
            "MHS": "MUNICIPAL HIGHER SECONDARY SCHOOL",
            "PSG": "PSG COIMBATORE",
        };
        return instituteNameMap[instituteName] || instituteName;
    }

    const departmentShortNames = {
        "Information Technology": "IT",
        "Computer Science and Engineering": "CSE",
        "Electrical and Electronics Engineering": "EEE",
        "Artificial Intelligence and Data Science": "AI&DS",
        "Mechanical Engineering": "MECH",
        "Computer Science and Business Systems": "CSBS",
        "Electrical and Communication Engineering": "ECE",
        "Civil Engineering": "CIVIL",
    };



    return (

        <div className="page-container">

            {showNavBar &&
                <nav className="navigation1">
                    <ul>
                        <li>
                            <div className="student-details-card">

                                <div className="image-container">
                                    <img src={logoImageUrl} alt="brand Logo" />
                                </div>
                                {/*
                                <div className="image-container">
                                    <img src={imageUrl} alt="Profile Picture" />
                                </div>
                                */}
                                <p className="student-details">
                                    {student.studentName}
                                    <br />
                                    {student.degreeAndBranch}
                                    <br />
                                    <br />
                                </p>
                            </div>
                        </li>

                        {/*
                            <li><a href="#" onClick={handleHomeButtonClick}>Home</a></li>

                        <li>
                            <div>
                                <a href="#" className="test-score-button" onClick={handleShowAttendance}>Attendance</a>
                            </div>
                        </li>
                        <li>
                            <div>
                                <a href="#" className="test-score-button" onClick={handleAccomplishments}>Activities</a>
                            </div>
                        </li>
                        <li>
                            <div>
                                <a href="#" className="test-score-button" onClick={handleShowTestScore}>Tests</a>
                            </div>
                        </li>
*/}
                        {enableSemesterResult &&
                            <li>
                                <div>
                                    <a href="#" className="test-score-button" id='semester-score-button' onClick={handleShowSemesterResults}>Semester Results</a>
                                </div>
                            </li>
                        }
                    </ul>
                </nav>}

            <div
                className={`profile-right-content-container ${showNavBar ? "with-nav-bar" : "without-nav-bar"
                    }`}>
                <header
                    className="admin-header">
                    <div className='nav-bar-hider'>
                        <img src="./uploads/nav-menu.png" href="#" onClick={handleShowNav} id='nav-menu-button' alt="Dashboard-icon Icon"
                            className={`nav-button-menu ${showNavBar ? "with-nav-bar" : "without-nav-bar"
                                }`} />
                    </div>
                    <div className='header-dialogue'>
                        <p>{getInstituteFullName(student.institute_name)}</p>
                    </div>
                    <div >
                        <button className='logout-button' onClick={() => setShowConfirmationPrompt(true)}>
                            Logout
                        </button>
                    </div>
                    {showConfirmationPrompt && (
                        <div className="logout-overlay">
                            <div className="confirmation-container">
                                <p>Are you sure you want to logout?</p>
                                <button className="confirm-button" onClick={handleLogout}>Yes</button>
                                <button className="cancel-button" onClick={() => setShowConfirmationPrompt(false)}>No</button>
                            </div>
                        </div>
                    )}
                </header>
                <main
                    className={`profile-content-container ${showNavBar ? "with-nav-bar" : "without-nav-bar"
                        }`}>
                    <div>
                        {(isLoading || loading) && <div className={overlayClass}>
                            <div className="spinner">
                                <img src="./uploads/loading-brand-logo.png" alt="loading-brand-logo" id="loading-brand-logo" />
                            </div>
                            <img src="./uploads/loading-brand-title.png" alt="loading-brand-title" id="loading-brand-title" />
                        </div>}
                    </div>
                    {showAttendance ? (
                        <div className='attendance-page-container'>
                            <button className="close-button" onClick={handleCloseAttendance}>
                                Close
                            </button>
                            <AttendanceCalendar student={student} />
                        </div>
                    ) : showTestScore ? (
                        <div className='attendance-page-container'>
                            <TestScore email={student.email} department={student.department} year={student.class} instituteName={student.institute_name} onClose={handleTestScoreClose} />
                        </div>
                    ) : showSemesterResult ? (
                        <div className='attendance-page-container'>
                            <SemResult student={student} onClose={handleTestScoreClose} />
                        </div>
                    ) : showAccomplishments ? (
                        <Accomplishment student={student} onClose={handleTestScoreClose}></Accomplishment>
                    ) : (
                        <div>
                            <div className="profile-chart-container">

                                <div className='attendance-chart-container'>
                                    <div className="profile-attendance-chart" onClick={handleShowTestScore}>
                                        <div className='chart-container1'>
                                            <canvas id="scoreChart"></canvas>
                                        </div>
                                        <div className='profile-chart-details'>
                                            Scored : {isNaN(overallAverage) ? "NaN" : (overallAverage).toFixed(2)} marks
                                            <br />
                                            <p>(For Total of 100 marks)</p>
                                        </div>
                                    </div>
                                    <p className="profile-chart-label">Overall Test Performance</p>
                                </div>
                                <div className='attendance-chart-container'>
                                    <div className="profile-attendance-chart" onClick={handleShowAttendance}>
                                        <div className='chart-container1'>
                                            <canvas id="attendanceChart"></canvas>
                                        </div>
                                        <div className='profile-chart-details'>
                                            Total Present Days: {student.total_attendance}
                                            <br />
                                            Total Days: {student.total_days}
                                            <br />
                                            Present Percentage: {((student.total_attendance / student.total_days) * 100).toFixed(2)}%
                                        </div>
                                    </div>
                                    <p className="profile-chart-label">Overall Attendance Performance</p>
                                </div>

                            </div>
                            <div className='analytics-container'>
                                {renderAnalytics(student)}
                            </div>
                            <div className='message-container'>
                                {renderMessage()}
                            </div>
                        </div>)}
                </main>
            </div>
        </div>

    );
};

export default Profile;