import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/AdminHome.css';
import DepartmentMessage from './DepartmentMessage.js'
import UpdateAccom from './UpdateAccom';
import './CSS/DepartmentMenu.css';
import './CSS/Profile_model.css';
import SemResultUpdate from './SemResultUpdate.js';
import DepartmentMenuDashboard from './DepartmentMenuDashboard';
import DepartmentAttendance from './DepartmentAttendance.js';

const DepartmentMenu = () => {
  
  const storedHODInfo = localStorage.getItem('hodInfo');

  // Parse the JSON string back into an object
  const hodInfo = storedHODInfo ? JSON.parse(storedHODInfo) : null;
  
  // Access individual properties
  let instituteName, departmentName;
  if (hodInfo) {
    instituteName = hodInfo.instituteName;
    departmentName = hodInfo.departmentName;
  
    console.log('Institute Name:', instituteName);
    console.log('Department Name:', departmentName);

  } else {
    console.log('No hod info found in local storage.');
  }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHomeButtonClicked, setIsHomeButtonClicked] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showUpdateAccom, setShowUpdateAccom] = useState(false);
  const [showNavBar, setShowNavBar] = useState(true);
  const [showUpdateSemResForm, setShowUpdateSemResForm] = useState(false);
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
  const [students, setStudents] = useState([]);
  const [institute, setInstitute] = useState(null);
  const [department, setDepartment] = useState(null);

  const [deviceType, setDeviceType] = useState(null);
  const overlayClass = `loading-overlay${loading || isLoading ? ' visible' : ''}`;
  const [mobile, setMobile] = useState(false);



  function getDepartmentFullName(departmentName) {
    const departmentNameMap = {
      'CSE': 'Computer Science and Engineering',
      'IT': 'Information Technology',
      'EEE': 'Electrical and Electronics Engineering',
      'AIDS': 'Artificial Intelligence and Data Science',
      'MECH': 'Mechanical Engineering',
      'CSBS': 'Computer Science and Business Systems',
      'ECE': 'Electrical and Communication Engineering',
      'CIVIL': 'Civil Engineering',
      // Add more mappings as needed
    };
    return departmentNameMap[departmentName] || departmentName;
  }

  useEffect(() => {
    // Detect device type and set the state
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setDeviceType(isMobile ? 'mobile' : 'desktop');
    if (deviceType === 'mobile') {
      setMobile(true);
    }
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('https://eduleaves-api.vercel.app/api/students_data', {
          params: {
            role: 'student', // Filter by role
            department: departmentName, // Filter by department
            instituteName: instituteName, // Filter by institute_name
          }
        });
        setInstitute(instituteName);
        setDepartment(departmentName);
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

  const handleMessageButtonClick = () => {
    setShowMessageForm(true);
    setShowUpdateSemResForm(false);
    setShowUpdateAccom(false);
    document.querySelectorAll('.admin-chart-container, .admin-students-container ').forEach((element) => {
      element.style.display = 'none';
    });
    const messageElement = document.createElement('div');
    messageElement.style.color = 'black';
    document.querySelector('.profile-content-container').appendChild(messageElement);
    setTimeout(() => {
      setIsLoading(false);
      messageElement.remove();
      setShowMessageForm(true);
      setShowUpdateSemResForm(false);
      setShowAttendanceForm(false);
      setShowUpdateAccom(false);
      setIsHomeButtonClicked(false);
    }, 1000);
  };
  
  const handleSemResButtonClick = () => {
    setShowAttendanceForm(false);
    setShowUpdateSemResForm(true);
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
      setShowAttendanceForm(false);
      setShowUpdateSemResForm(true);
      setShowMessageForm(false);
      setIsHomeButtonClicked(false);
    }, 1000);
  };
  const handleAttendanceButtonClick = () => {
    setShowAttendanceForm(true);
    setShowMessageForm(false);
    setShowUpdateSemResForm(false);
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
      setShowUpdateSemResForm(false);
      setShowMessageForm(false);
      setIsHomeButtonClicked(false);
    }, 1000);
  };
  const handleHomeButtonClick = () => {
    setShowMessageForm(false);
    setShowAttendanceForm(false);
    setShowUpdateAccom(false);
    setIsHomeButtonClicked(true);
    setShowUpdateSemResForm(false);
    setIsLoading(true);

    document.querySelectorAll('.body').forEach((element) => {
      element.style.display = 'block';
    });
    setTimeout(() => {
      setIsLoading(false);
      setShowAttendanceForm(false);
      setShowMessageForm(false);
      setShowUpdateSemResForm(false);
      setShowUpdateAccom(false);
      setIsHomeButtonClicked(true);

    }, 1000);
  };


  const handleShowNav = () => {
    setShowNavBar((prevShowNavBar) => !prevShowNavBar);
  };

  function getInstituteFullName(instituteName) {
    const instituteNameMap = {
      "KIOT": "KNOWLEDGE INSTITUTE OF TECHNOLOGY",
      "MHS": "MUNICIPAL HIGHER SECONDARY SCHOOL",
      "PSG": "PSG ENGINEERING COLLEGE",
    };
    return instituteNameMap[instituteName] || instituteName;
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
                  HOD
                  <br />
                  {instituteName}
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
              <a href="#" className="test-score-button" onClick={handleMessageButtonClick} title="Send Messages">
                Message
              </a>
            </li>
            <br />
            <br />
            <li>
              <a href="#" className="test-score-button" onClick={handleSemResButtonClick} title="View Attendance">
                Update Sem Results
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
            <p>{getInstituteFullName(instituteName)}</p>
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
            {(loading || isLoading) && <div className={overlayClass}>
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
              <DepartmentMessage students={students} />
            ) : showUpdateSemResForm ? (
              <SemResultUpdate students={students} />
            ) : showAttendanceForm ? (
              <DepartmentAttendance students={students} />
            ) : (
              <div className='home-contents'>
                <div>
                  {!mobile &&
                    <DepartmentMenuDashboard students={students} department={departmentName} />
                  }
                </div>
              </div>)}
        </main>
      </div>
    </div>
  );
};
export default DepartmentMenu;
