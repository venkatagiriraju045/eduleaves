import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { useNavigate, useLocation  } from 'react-router-dom';
import './CSS/AdminHome.css';
import DepartmentMessage from './DepartmentMessage.js'
import AdminAttendance from './AdminAttendance.js';
import UpdateAccom from './UpdateAccom';
import './CSS/DepartmentMenu.css';
import DepartmentMenuDashboard from './DepartmentMenuDashboard';

const calculateAttendancePercentage = (presentCount, absentCount) => {
    const totalDays = presentCount + absentCount;
    if (totalDays === 0) return { percentage: 0, count: 0 };
    const percentage = ((presentCount / totalDays) * 100).toFixed(2);
    return { percentage, count: presentCount };
  };
  const calculateOverallAttendance = (students) => {
    const studentList = students.filter((student) => student.role === 'student');
    if (studentList.length === 0) {
      return {
        presentPercentage: 0,
        absentPercentage: 0,
        presentCount: 0,
        totalCount: 0,
        departments: {},
      };
    }
    const currentDate = new Date();
    let presentCount = 0;
    let absentCount = 0;
    const departments = {}; 
    studentList.forEach((student) => {
      if (!departments[student.department]) {
        departments[student.department] = {
          presentCount: 0,
          absentCount: 0,
          totalCount: 0,
        };
      }
      student.present_array.forEach((dateStr) => {
        const date = new Date(dateStr);
        if (date.toDateString() === currentDate.toDateString()) {
          presentCount++;
          departments[student.department].presentCount++;
        }
      });
      student.leave_array.forEach((dateStr) => {
        const date = new Date(dateStr);
        if (date.toDateString() === currentDate.toDateString()) {
          absentCount++;
          departments[student.department].absentCount++;
        }
      });
      departments[student.department].totalCount++;
    });
    const presentResult = calculateAttendancePercentage(presentCount, absentCount);
    const absentResult = calculateAttendancePercentage(absentCount, presentCount);
    return {
      presentPercentage: presentResult.percentage,
      absentPercentage: absentResult.percentage,
      presentCount: presentResult.count,
      totalCount: studentList.length,
      departments,
    };
  };
const DepartmentMenu = () => {
const location = useLocation();
const { email} = location.state || {};
const [students, setStudents] = useState([]);
const [adminData, setAdminData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [showAttendanceForm, setShowAttendanceForm] = useState(false); 
const [isLoading, setIsLoading] = useState(false);
const [isHomeButtonClicked, setIsHomeButtonClicked] = useState(false); 
const [showMessageForm, setShowMessageForm] = useState(false); 
const [newDepartmentName, setNewDepartmentName] = useState(null);
const [showUpdateAccom, setShowUpdateAccom] = useState(false); 
const [showNavBar, setShowNavBar]=useState(true);
const[showConfirmationPrompt,setShowConfirmationPrompt]=useState(false);

useEffect(() => {
    const fetchStudentData = async () => {
    try {
        const response = await axios.get('https://eduleaves-api.vercel.app/api/students_data');
        const studentData = response.data.filter((data) => data.role === 'student');
        setStudents(studentData);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching student data:', error);
        setError(error);
        setLoading(false);
    }
    };
    fetchStudentData();
}, []);

useEffect(() => {
  if (email === 'cse@kiot') {
    setNewDepartmentName('Computer Science and Engineering');
  } else if (email === 'it@kiot') {
    setNewDepartmentName('Information Technology');
  } else if (email === 'eee@kiot') {
    setNewDepartmentName('Electrical and Electronics Engineering');
  } else if (email === 'aids@kiot') {
    setNewDepartmentName('Artificial Intelligence and Data Science');
  } else if (email === 'mech@kiot') {
    setNewDepartmentName('Mechanical Engineering');
  } else if (email === 'csbs@kiot') {
    setNewDepartmentName('Computer Science and Business Systems');
  } else if (email === 'ece@kiot') {
    setNewDepartmentName('Electrical and Communication Engineering');
  } else if (email === 'civil@kiot') {
    setNewDepartmentName('Civil Engineering');
  }
}, [email]);

useEffect(() => {
    const fetchAdminData = async () => {
    try {
        const response = await axios.get(`https://eduleaves-api.vercel.app/api/students?email=${email}`);
        const admin = response.data;
        setAdminData(admin);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching student data:', error);
        setLoading(false);
    }
    };

    fetchAdminData();
}, [email]);
useEffect(() => {
    const tableContainer = document.querySelector('.admin-table-container');
    if (tableContainer) {
    tableContainer.addEventListener('scroll', handleTableScroll);
    }
    return () => {
    if (tableContainer) {
        tableContainer.removeEventListener('scroll', handleTableScroll);
    }
    };
}, []);
function handleTableScroll(event) {
    const tableContainer = event.currentTarget;
    const distanceScrolled = tableContainer.scrollTop;
    const tableHeader = tableContainer.querySelector('th');
    if (distanceScrolled >= 40) {
    const blurIntensity = Math.min(4, (distanceScrolled - 40) / 10);
    const transparency = Math.min(0.8, (distanceScrolled - 40) / 400); 
    tableHeader.style.backdropFilter = `blur(${blurIntensity}px)`;
    tableHeader.style.backgroundColor = `rgba(41, 50, 65, ${transparency})`;    
    } else {
    tableHeader.style.backdropFilter = 'blur(0)';
    tableHeader.style.backgroundColor = 'rgba(41, 50, 65, 0.8)';
    tableContainer.style.paddingLeft = '0';
    tableContainer.style.paddingRight = '0';
    }
}
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
console.log(email);
const handleMessageButtonClick =()=>{
    setShowMessageForm(true);
    setShowUpdateAccom(false);
    setIsLoading(true);
    document.querySelector('.content-container').classList.add('loading');
    document.querySelectorAll('.admin-chart-container, .admin-table-container, .admin-students-container ').forEach((element) => {
    element.style.display = 'none';
    });
    const messageElement = document.createElement('div');
    messageElement.classList.add('loading-message');
    messageElement.style.color = 'black';
    document.querySelector('.content-container').appendChild(messageElement);
    setTimeout(() => {
    setIsLoading(false);
    document.querySelector('.content-container').classList.remove('loading');
    messageElement.remove();
    setShowMessageForm(true); 
    setShowAttendanceForm(false);
    setShowUpdateAccom(false);
    setIsHomeButtonClicked(false);
    }, 1000); 
};

const handleAttendanceButtonClick = () => {
    setShowAttendanceForm(true);
    setShowMessageForm(false);
    setShowUpdateAccom(false);
    setIsLoading(true);
    document.querySelector('.content-container').classList.add('loading');
    document.querySelectorAll('.admin-chart-container, .admin-table-container').forEach((element) => {
    element.style.display = 'none';
    });
    const messageElement = document.createElement('div');
    messageElement.classList.add('loading-message');
    messageElement.style.color = 'black'; 
    document.querySelector('.content-container').appendChild(messageElement);
    setTimeout(() => {
    setIsLoading(false);
    document.querySelector('.content-container').classList.remove('loading');
    messageElement.remove();
    setShowAttendanceForm(true);
    setShowMessageForm(false);
    setIsHomeButtonClicked(false);
    }, 1000); 
};
const handleHomeButtonClick = () => {
    setShowMessageForm(false);
    setShowAttendanceForm(false);
    setShowUpdateAccom(false);
    document.querySelectorAll('.body').forEach((element) => {
    element.style.display = 'block';
    });
};
const handleDownloadImage = () => {
    html2canvas(document.body).then((canvas) => {
      const dataURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataURL;
      downloadLink.download = 'admin_home.png';
      downloadLink.click();
    });
};
const handleShowNav = () => {
  setShowNavBar((prevShowNavBar) => !prevShowNavBar);
};
return (
<div>
<div className="page-container">
{showNavBar &&
<nav className="navigation1">
<ul className='admin-nav-list'>
<li>
<div className="student-details">
<p>
ADMIN
<br />
KIOT
<br />
</p>
</div>
</li>
<br />
<br />
<li>
<a href="#" onClick={handleHomeButtonClick} className="attendance-button" title="Go to Home">
Dashboard
</a>
</li>
<br />
<br />
<li>
<a href="#" className="attendance-button" onClick={handleAttendanceButtonClick} title="View Attendance">
Attendance
</a>
</li>
<br />
<br />
<li>
<a href="#"className="attendance-button" onClick={handleMessageButtonClick} title="Send Messages">
Message
</a>
</li>
<br />
<br />
</ul>
<button className="download-button" onClick={handleDownloadImage}>download</button>
    <footer className="footer">
    &copy; KIOT-2023. All rights reserved.
    </footer>
</nav>
}
<div>
<header 
        className={`admin-header ${
        showNavBar ? "with-nav-bar" : "without-nav-bar"
        }`}>
        <img src="/uploads/nav-menu.png" href="#"onClick={handleShowNav} id='nav-menu-button' alt="Dashboard-icon Icon" 
                className={`nav-button-menu ${
                  showNavBar ? "with-nav-bar" : "without-nav-bar"
                  }`}/>
    <p className="header-dialogue">KNOWLEDGE INSTITUTE OF TECHNOLOGY</p>
    <div className='top-buttons'>
        <button className="logout-button" onClick={() => setShowConfirmationPrompt(true)}>
  Logout
</button>
    {showConfirmationPrompt && (
  <div className="logout-overlay">
    <div className="confirmation-container">
      <p>Are you sure you want to logout?</p>
      <button className="confirm-button" onClick={handleLogout}>Yes</button>
      <button className="cancel-button" onClick={() => setShowConfirmationPrompt(false)}>No</button>
    </div>
  </div>
)}
    </div>
    </header>
</div>
<main
        className={`content-container ${
        showNavBar ? "with-nav-bar" : "without-nav-bar"
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
        <DepartmentMessage students={students}/>
    ) :showAttendanceForm ? (
    <AdminAttendance  students={students} department = {newDepartmentName} />
    ) : (
    
    <div className='home-contents'>
    <div>
        <DepartmentMenuDashboard department={newDepartmentName} students={students} />
    </div>
    </div>)}
</main>
</div>
</div>
);
};
export default DepartmentMenu;
