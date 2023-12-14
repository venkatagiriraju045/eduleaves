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
  const location = useLocation();
  const { instituteName, departmentName, mentor_name } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHomeButtonClicked, setIsHomeButtonClicked] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showUpdateAccom, setShowUpdateAccom] = useState(false);
  
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
  if (loading) {
    return <div>
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p className="loading-text">   Loading... Please wait!</p>
      </div>
    </div>;
  }
  if (error) {
    return <p>Error fetching student data: {error.message}</p>;
  }

  const handleMessageButtonClick = () => {
    setShowMessageForm(true);
    setShowUpdateAccom(false);
    setShowTestPerformanceForm(false);
    setShowAttendanceForm(false);
    setIsLoading(true);
    document.querySelector('.profile-content-container').classList.add('loading');
    document.querySelectorAll('.admin-chart-container, .admin-students-container ').forEach((element) => {
      element.style.display = 'none';
    });
    const messageElement = document.createElement('div');
    messageElement.classList.add('loading-message');
    messageElement.style.color = 'black';
    document.querySelector('.profile-content-container').appendChild(messageElement);
    setTimeout(() => {
      setIsLoading(false);
      document.querySelector('.profile-content-container').classList.remove('loading');
      messageElement.remove();
      setShowMessageForm(true);
      setShowTestPerformanceForm(false);
      setShowAttendanceForm(false);
      setShowUpdateAccom(false);
      setIsHomeButtonClicked(false);
    }, 1000);
  };

  const handleAttendanceButtonClick = () => {
    setShowAttendanceForm(true);
    setShowMessageForm(false);
    setShowTestPerformanceForm(false);
    setShowUpdateAccom(false);
    setIsLoading(true);
    document.querySelector('.profile-content-container').classList.add('loading');
    document.querySelectorAll('.admin-chart-container').forEach((element) => {
      element.style.display = 'none';
    });
    const messageElement = document.createElement('div');
    messageElement.classList.add('loading-message');
    messageElement.style.color = 'black';
    document.querySelector('.profile-right-content-container').appendChild(messageElement);
    setTimeout(() => {
      setIsLoading(false);
      document.querySelector('.profile-right-content-container').classList.remove('loading');
      messageElement.remove();
      setShowAttendanceForm(true);
      setShowMessageForm(false);
      setShowTestPerformanceForm(false);

      setIsHomeButtonClicked(false);
    }, 1000);
  };
  const handleTestPerformanceButtonClick = () => {
    setShowTestPerformanceForm(true);
    setShowAttendanceForm(false);
    setShowMessageForm(false);
    setShowUpdateAccom(false);
    setIsLoading(true);
    document.querySelector('.profile-content-container').classList.add('loading');
    document.querySelectorAll('.admin-chart-container').forEach((element) => {
      element.style.display = 'none';
    });
    const messageElement = document.createElement('div');
    messageElement.classList.add('loading-message');
    messageElement.style.color = 'black';
    document.querySelector('.profile-right-content-container').appendChild(messageElement);
    setTimeout(() => {
      setIsLoading(false);
      document.querySelector('.profile-right-content-container').classList.remove('loading');
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

    document.querySelectorAll('.body').forEach((element) => {
      element.style.display = 'block';
    });
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
                  MENTOR
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
                Dashboard
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
              <a href="#" className="test-score-button" onClick={handleMessageButtonClick} title="Send Messages">
                Message
              </a>
            </li>
            <br />
            <br />
          </ul>
          <footer className="profile-footer">
            &copy; The Students Gate-2023.
          </footer>
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
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p className="loading-text">   Loading please wait...</p>
            </div>
          )}
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
