import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './CSS/AdminHome.css';
import UpdateAccom from './UpdateAccom.js';
import './CSS/DepartmentMenu.css';
import './CSS/Profile_model.css';
import AdvisorAttendance from './AdvisorAttendance.js';
import AdvisorDashboard from './AdvisorDashboard.js';
import AdvisorMessage from './AdvisorMessage.js';
import AdvisorTest from './AdvisorTest.js';
import AdvisorAttendancePerformance from './AdvisorAttendancePerformance.js';
import UpdateIAT from './UpdateIAT.js';
import AdvisorClassWise from './AdvisorClassWise.js';
import UpdateStudents from './UpdateStudents.js';
import ModifyAdvisorAttendance from './ModifyAdvisorAttendance.js';

const AdvisorMenu = () => {

  const storedAdvisorInfo = localStorage.getItem('advisorInfo');

  // Parse the JSON string back into an object
  const advisorInfo = storedAdvisorInfo ? JSON.parse(storedAdvisorInfo) : null;

  // Access individual properties
  if (advisorInfo) {
    const instituteName = advisorInfo.instituteName;
    const departmentName = advisorInfo.departmentName;
    const year = advisorInfo.year;
    const section = advisorInfo.section;

    console.log('Institute Name:', instituteName);
    console.log('Department Name:', departmentName);
    console.log('Year:', year);
    console.log('Section:', section);
  } else {
    console.log('No advisor info found in local storage.');
  }
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [showModifyAttendanceForm, setShowModifyAttendanceForm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isHomeButtonClicked, setIsHomeButtonClicked] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showAdvisorAttendancePerformace, setShowAdvisorAttendancePerformace] = useState(false);
  const [showUpdateIATForm, setShowUpdateIATForm] = useState(false);
  const [showUpdateStudents, setShowUpdateStudents] = useState(false);

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showUpdateAccom, setShowUpdateAccom] = useState(false);
  const [showNavBar, setShowNavBar] = useState(true);
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
  const [students, setStudents] = useState([]);
  const [deviceType, setDeviceType] = useState(null);
  const overlayClass = `loading-overlay${loading || isLoading ? ' visible' : ''}`;
  const [showTestPerformanceForm, setShowTestPerformanceForm] = useState(false);


  useEffect(() => {

    const timer = setTimeout(() => {

      const fetchData = async () => {
        try {
          const response = await axios.get('https://eduleaves-api.vercel.app/api/advisor_students_data', {
            params: {
              role: 'student',
              department: advisorInfo.departmentName,
              year: advisorInfo.year,
              section: advisorInfo.section,
            }
          });
          setInstitute(advisorInfo.instituteName);
          const studentData = response.data;
          setStudents(studentData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching student data:', error);
          setError(error);
          setLoading(false);
        }
      };
      fetchData();
    }, 500);

    return () => clearTimeout(timer);

  }, []);
  const navigate = useNavigate();
  const handleLogout = () => {
    setShowConfirmationPrompt(false);
    navigate('/');
  };
  if (error) {
    return <p>Error fetching student data: {error.message}</p>;
  }
  const handleTestPerformanceButtonClick = () => {
    setShowTestPerformanceForm(true);
    setShowUpdateStudents(false);
    setShowModifyAttendanceForm(false);

    setShowUpdateIATForm(false);
    setShowAttendanceForm(false);
    setShowMessageForm(false);
    setShowAdvisorAttendancePerformace(false);
    setShowDashboard(false);
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
      setShowUpdateIATForm(false);
      setShowAttendanceForm(false);
      setShowUpdateStudents(false);
      setShowModifyAttendanceForm(false);
      setShowAdvisorAttendancePerformace(false);
      setShowDashboard(false);
      setShowMessageForm(false);
      setIsHomeButtonClicked(false);
    }, 1000);
  };
  const handleMessageButtonClick = () => {
    setShowTestPerformanceForm(false);
    setShowMessageForm(true);
    setShowModifyAttendanceForm(false);
    setShowUpdateStudents(false);
    setShowUpdateIATForm(false);
    setShowAdvisorAttendancePerformace(false);
    setShowDashboard(false);
    setShowUpdateAccom(false);
    setIsLoading(true);
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
      setShowModifyAttendanceForm(false);
      setShowAttendanceForm(false);
      setShowUpdateAccom(false);
      setShowUpdateIATForm(false);
      setShowDashboard(false);
      setShowUpdateStudents(false);
      setIsHomeButtonClicked(false);
      setShowAdvisorAttendancePerformace(false);
      setShowTestPerformanceForm(false);
    }, 1000);
  };
  const handleUpdateIATButtonClick = () => {
    setShowTestPerformanceForm(false);
    setShowUpdateIATForm(true);
    setShowMessageForm(false);
    setShowAdvisorAttendancePerformace(false);
    setShowDashboard(false);
    setShowUpdateAccom(false);
    setShowModifyAttendanceForm(false);
    setShowUpdateStudents(false);
    setIsLoading(true);
    document.querySelectorAll('.admin-chart-container, .admin-students-container ').forEach((element) => {
      element.style.display = 'none';
    });
    const messageElement = document.createElement('div');
    messageElement.style.color = 'black';
    document.querySelector('.profile-content-container').appendChild(messageElement);
    setTimeout(() => {
      setIsLoading(false);
      messageElement.remove();
      setShowMessageForm(false);
      setShowAttendanceForm(false);
      setShowUpdateAccom(false);
      setShowUpdateIATForm(true);
      setShowModifyAttendanceForm(false);
      setShowUpdateStudents(false);
      setShowDashboard(false);
      setIsHomeButtonClicked(false);
      setShowAdvisorAttendancePerformace(false);
      setShowTestPerformanceForm(false);
    }, 1000);
  };
  console.log(students);

  const handleUpdateStudentsButtonClick = () => {
    setShowAttendanceForm(false);
    setShowMessageForm(false);
    setShowUpdateIATForm(false);
    setShowAdvisorAttendancePerformace(false);
    setShowUpdateAccom(false);
    setShowModifyAttendanceForm(false);
    setShowUpdateStudents(true);
    setShowDashboard(false);
    setShowTestPerformanceForm(false);
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
      setShowModifyAttendanceForm(false);
      setShowMessageForm(false);
      setShowUpdateStudents(true);
      setShowUpdateIATForm(false);
      setIsHomeButtonClicked(false);
      setShowAdvisorAttendancePerformace(false);
      setShowDashboard(false);
      setShowTestPerformanceForm(false);
    }, 1000);
  };
  const handleAttendanceButtonClick = () => {
    setShowAttendanceForm(true);
    setShowUpdateStudents(false);
    setShowMessageForm(false);
    setShowModifyAttendanceForm(false);
    setShowUpdateIATForm(false);
    setShowAdvisorAttendancePerformace(false);
    setShowUpdateAccom(false);
    setShowDashboard(false);
    setShowTestPerformanceForm(false);
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
      setShowUpdateStudents(false);
      setShowModifyAttendanceForm(false);
      setShowMessageForm(false);
      setShowUpdateIATForm(false);
      setIsHomeButtonClicked(false);
      setShowAdvisorAttendancePerformace(false);
      setShowDashboard(false);
      setShowTestPerformanceForm(false);
    }, 1000);
  };
  const handleAdvisorAttendancePerformaceButtonClick = () => {
    setShowAdvisorAttendancePerformace(true);
    setShowAttendanceForm(false);
    setShowMessageForm(false);
    setShowUpdateAccom(false);
    setShowDashboard(false);
    setShowModifyAttendanceForm(false);
    setShowUpdateStudents(false);
    setShowUpdateIATForm(false);
    setShowTestPerformanceForm(false);
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
      setShowAdvisorAttendancePerformace(true);
      setShowAttendanceForm(false);
      setShowMessageForm(false);
      setIsHomeButtonClicked(false);
      setShowModifyAttendanceForm(false);
      setShowUpdateIATForm(false);
      setShowUpdateStudents(false);
      setShowDashboard(false);
      setShowTestPerformanceForm(false);
    }, 1000);
  };

  const handleAdvisorAttendanceModificationButtonClick = () => {
    setShowAdvisorAttendancePerformace(false);
    setShowModifyAttendanceForm(true);
    setShowAttendanceForm(false);
    setShowMessageForm(false);
    setShowUpdateAccom(false);
    setShowDashboard(false);
    setShowUpdateStudents(false);
    setShowUpdateIATForm(false);
    setShowTestPerformanceForm(false);
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
      setShowModifyAttendanceForm(true);
      setShowAdvisorAttendancePerformace(false);
      setShowAttendanceForm(false);
      setShowMessageForm(false);
      setIsHomeButtonClicked(false);
      setShowUpdateIATForm(false);
      setShowUpdateStudents(false);
      setShowDashboard(false);
      setShowTestPerformanceForm(false);
    }, 1000);
  };
  const handleHomeButtonClick = () => {
    setShowMessageForm(false);
    setShowAttendanceForm(false);
    setShowDashboard(true);
    setShowAdvisorAttendancePerformace(false);
    setShowUpdateAccom(false);
    setShowModifyAttendanceForm(false);
    setShowUpdateStudents(false);
    setShowTestPerformanceForm(false);
    setShowUpdateIATForm(false);
    setIsHomeButtonClicked(false);
    setIsLoading(true);
    document.querySelectorAll('.body').forEach((element) => {
      element.style.display = 'block';
    });
    setTimeout(() => {
      setIsLoading(false);
      setShowAttendanceForm(false);
      setShowMessageForm(false);
      setShowModifyAttendanceForm(false);
      setIsHomeButtonClicked(true);
      setShowAdvisorAttendancePerformace(false);
      setShowDashboard(true);
      setShowTestPerformanceForm(false);
      setShowUpdateIATForm(false);
      setShowUpdateStudents(false);

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

  const logoImageUrl = `./uploads/dashboard-brand-logo.JPG`;
  return (
    <div className="dep-admin-page-container">
      {showNavBar &&
        <nav className="navigation1">
          <ul>
            <li>
              <div className="student-details-card">
                <div className="image-container">
                  <img src={logoImageUrl} alt="brand Logo" />
                </div>
                <p>
                  <br />
                  ADVISOR
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
                Home
              </a>
            </li>

            <li>
              <a href="#" className="test-score-button" onClick={handleAttendanceButtonClick} title="View Attendance">
                Attendance
              </a>
            </li>

            <li>
              <a href="#" className="test-score-button" onClick={handleTestPerformanceButtonClick} title="View Attendance">
                Test Performance
              </a>
            </li>

            <li>
              <a href="#" className="test-score-button" onClick={handleAdvisorAttendanceModificationButtonClick} title="View Attendance">
                Modify Attendance
              </a>
            </li>
            <li>
              <a href="#" className="test-score-button" onClick={handleAdvisorAttendancePerformaceButtonClick} title="View Attendance">
                Attendance Details
              </a>
            </li>
            <li>
              <a href="#" className="test-score-button" onClick={handleMessageButtonClick} title="Send Messages">
                Message
              </a>
            </li>

            <li>
              <a href="#" className="test-score-button" onClick={handleUpdateIATButtonClick} title="Send Messages">
                Update IAT Scores
              </a>
            </li>

            <li>
              <a href="#" className="test-score-button" onClick={handleUpdateStudentsButtonClick} title="Send Messages">
                Update Students
              </a>
            </li>

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
            {(loading || isLoading) && <div className={overlayClass}>
              <div className="spinner">
                <img src="./uploads/loading-brand-logo.png" alt="loading-brand-logo" id="loading-brand-logo" />
              </div>
              <img src="./uploads/loading-brand-title.png" alt="loading-brand-title" id="loading-brand-title" />
            </div>}
          </div>
          {showUpdateAccom ? (
            <UpdateAccom students={students} />
          ) : showUpdateIATForm ? (
            <UpdateIAT students={students} />
          ) : showMessageForm ? (
            <AdvisorMessage students={students} year={advisorInfo.year} section={advisorInfo.section} department={advisorInfo.departmentName} />
          ) : showAttendanceForm ? (
            <AdvisorAttendance students={students} year={advisorInfo.year} section={advisorInfo.section} department={advisorInfo.departmentName} />
          ) : showUpdateStudents ? (
            <UpdateStudents />
          ) : showTestPerformanceForm ? (
            <AdvisorTest students={students} year={advisorInfo.year} section={advisorInfo.section} department={advisorInfo.departmentName} />
          ) : showModifyAttendanceForm ? (
            <ModifyAdvisorAttendance students={students} year={advisorInfo.year} section={advisorInfo.section} department={advisorInfo.departmentName} />
          ) : showAdvisorAttendancePerformace ? (
            <AdvisorAttendancePerformance students={students} year={advisorInfo.year} section={advisorInfo.section} department={advisorInfo.departmentName} />
          ) : (showDashboard &&
            <div className='home-contents'>
              <div id='class-wise-page' className='class-wise-analytics-page'>
                <AdvisorClassWise students={students} year={advisorInfo.year} section={advisorInfo.section} department={advisorInfo.departmentName} />
              </div>
            </div>)}
        </main>
      </div>
    </div>
  );
};
export default AdvisorMenu;
