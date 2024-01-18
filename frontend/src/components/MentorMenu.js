import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './CSS/AdminHome.css';
import UpdateAccom from './UpdateAccom.js';
import './CSS/DepartmentMenu.css';
import './CSS/Profile_model.css';
import MentorTest from './MentorTest.js';
import MentorClassWise from './MentorClassWise.js';
import MentorAttendance from './MentorAttendance.js';
import MentorMessage from './MentorMessage.js';


const MentorMenu = () => {
  let instituteName, departmentName, mentor_name;
  const storedmentorInfo = localStorage.getItem('mentorInfo');

  // Parse the JSON string back into an object
  const mentorInfo = storedmentorInfo ? JSON.parse(storedmentorInfo) : null;
  
  // Access individual properties
  if (mentorInfo) {
    instituteName = mentorInfo.instituteName;
    departmentName = mentorInfo.departmentName;
    mentor_name = mentorInfo.mentor_name;
  } else {
    console.log('No mentor info found in local storage.');
  }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameOfMentor, setNameOfMentor] = useState("");

  const [isHomeButtonClicked, setIsHomeButtonClicked] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showUpdateAccom, setShowUpdateAccom] = useState(false);
  const overlayClass = `loading-overlay${loading || isLoading ? ' visible' : ''}`;

  
  const [showTestPerformanceForm, setShowTestPerformanceForm] = useState(false);

  const [showNavBar, setShowNavBar] = useState(true);
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
  const [students, setStudents] = useState([]);
  const [institute, setInstitute] = useState(null);
  const [deviceType, setDeviceType] = useState(null);


  useEffect(() => {
    // Detect device type and set the state
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setDeviceType(isMobile ? 'mobile' : 'desktop');
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('https://eduleaves-api.vercel.app/api/mentor_students_data', {
          params: {
            role: 'student', // Filter by role
            department: departmentName, // Filter by department
            instituteName: instituteName,
            mentor_name: mentor_name// Filter by institute_name
          }
        });
        if (mentor_name) {
          setNameOfMentor(mentor_name.toUpperCase());
          // Rest of your code using nameOfMentor
        } 
        setInstitute(instituteName);
        const studentData = response.data;
        setStudents(studentData); // Set the students state variable
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError(error);
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    setShowConfirmationPrompt(false);
    navigate('/');
  };

  if (error) {
    return <p>Error fetching student data: {error.message}</p>;
  }

  const handleAttendanceButtonClick = () => {
    setShowAttendanceForm(true);
    setShowMessageForm(false);
    setShowTestPerformanceForm(false);
    setShowUpdateAccom(false);
    setIsLoading(true);
    document.querySelectorAll('.admin-chart-container').forEach((element) => {
      element.style.display = 'none';
    });
    const messageElement = document.createElement('div');
    messageElement.style.color = 'black';
    document.querySelector('.profile-right-content-container').appendChild(messageElement);
    setTimeout(() => {
      setIsLoading(false);
      messageElement.remove();
      setShowAttendanceForm(true);
      setShowMessageForm(false);
      setShowTestPerformanceForm(false);

      setIsHomeButtonClicked(false);
    }, 1000);
  };
  const handleUpdateButtonClick = () => {
    setShowAttendanceForm(false);
    setShowMessageForm(false);
    setShowTestPerformanceForm(false);
    setShowUpdateAccom(true);
    setIsLoading(true);
    document.querySelectorAll('.admin-chart-container').forEach((element) => {
      element.style.display = 'none';
    });
    const messageElement = document.createElement('div');
    messageElement.style.color = 'black';
    document.querySelector('.profile-right-content-container').appendChild(messageElement);
    setTimeout(() => {
      setIsLoading(false);
      messageElement.remove();
      setShowAttendanceForm(false);
      setShowMessageForm(false);
      setShowTestPerformanceForm(false);
      setShowUpdateAccom(true);
      setIsHomeButtonClicked(false);
    }, 1000);
  };
  const handleTestPerformanceButtonClick = () => {
    setShowTestPerformanceForm(true);
    setShowAttendanceForm(false);
    setShowMessageForm(false);
    setShowUpdateAccom(false);
    setIsLoading(true);
    document.querySelectorAll('.admin-chart-container').forEach((element) => {
      element.style.display = 'none';
    });
    const messageElement = document.createElement('div');
    messageElement.style.color = 'black';
    document.querySelector('.profile-right-content-container').appendChild(messageElement);
    setTimeout(() => {
      setIsLoading(false);
      messageElement.remove();
      setShowTestPerformanceForm(true);
      setShowAttendanceForm(false);
      setShowMessageForm(false);
      setIsHomeButtonClicked(false);
    }, 1000);
  };

  const handleHomeButtonClick = () => {
    setShowMessageForm(false);
    setShowAttendanceForm(false);
    setShowUpdateAccom(false);
    setShowTestPerformanceForm(false);
    setIsHomeButtonClicked(true);
    setIsLoading(true);

    document.querySelectorAll('.body').forEach((element) => {
      element.style.display = 'block';
    });
    setTimeout(() => {
      setIsLoading(false);
      setShowAttendanceForm(false);
      setShowMessageForm(false);
      setIsHomeButtonClicked(true);
      setShowTestPerformanceForm(false);

    }, 1000);
  };


  const handleShowNav = () => {
    setShowNavBar((prevShowNavBar) => !prevShowNavBar);
  };

  function getInstituteFullName(institute) {
    const instituteNameMap = {
      "KIOT": "KNOWLEDGE INSTITUTE OF TECHNOLOGY",
      "MHS": "MUNICIPAL HIGHER SECONDARY SCHOOL",
      "PSG": "PSG ENGINEERING COLLEGE",
    };
    return instituteNameMap[institute] || institute;
  }


  if (deviceType === 'mobile') {
    return (
      <div className="mobile-warning-overlay-message">
        <p>You are logged in on a mobile device. Please logout from the mobile device to access this page on a computer or laptop.</p>
      </div>
    );
  }
  const imageUrl = `./uploads/dashboard-brand-logo.JPG`;
  // Check if mentor_name is defined before calling toUpperCase()

  return (
    <div className="dep-admin-page-container">

      {showNavBar &&
        <nav className="navigation1">
          <ul>
            <li>
              <div className="student-details-card">
              <div className="image-container">
                  <img src={imageUrl} alt="brand-logo" />
                </div>
                <p>
                <br/>
                  {nameOfMentor}
                  <br/>
                  <br/>
                  MENTOR
                  <br/>
                  <br />
                {institute}
                  <br />
                </p>
              </div>
            </li>
            <br />
            <br />
            <li>
              <a href="#" onClick={handleHomeButtonClick} className="test-score-button" title="Go to Home">
                Mentees Details
              </a>
            </li>
            <br />
            <br />
            <li>
              <a href="#" className="test-score-button" onClick={handleAttendanceButtonClick} title="View Attendance">
                Attendance
              </a>
            </li>
            <br />
            <br />
            <li>
              <a href="#" className="test-score-button" onClick={handleTestPerformanceButtonClick} title="View Attendance">
                Test Performance
              </a>
            </li>
            <br />
            <br />
            <li>
              <a href="#" className="test-score-button" onClick={handleUpdateButtonClick} title="View Attendance">
                Activity Update
              </a>
            </li>
            <br />
            <br />
          </ul>
        </nav>
      }

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
            <p>{getInstituteFullName(institute)}</p>
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
                {loading && <div className={overlayClass}>
                    <div className="spinner">
                        <img src="./uploads/loading-brand-logo.png" alt="loading-brand-logo" id="loading-brand-logo" />
                    </div>
                    <img src="./uploads/loading-brand-title.png" alt="loading-brand-title" id="loading-brand-title" />
                </div>}
            </div>
          {showUpdateAccom ? (
            <UpdateAccom students={students} />
          ) :
            showMessageForm ? (
              <MentorMessage students={students} />
            ) : showAttendanceForm ? (
              <MentorAttendance students={students} />
            ) : showTestPerformanceForm ? (
              <MentorTest students={students} />
            ) :(
              <div className='home-contents'>
                <div>
                  <MentorClassWise students={students} />
                </div>
              </div>)}
        </main>
      </div>
    </div>
  );
};
export default MentorMenu;
