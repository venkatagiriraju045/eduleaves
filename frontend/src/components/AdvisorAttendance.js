import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/AdminAttendance.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdvisorAttendance = ({ students, year, section, department}) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [allStudentsAttendance, setAllStudentsAttendance] = useState({});
  const [movingLabel, setMovingLabel] = useState('');
  const [dateError, setDateError] = useState(false);
  const [isDateChosen, setIsDateChosen] = useState(false);
  const overlayClass = `loading-overlay${loading ? ' visible' : ''}`;

  useEffect(() => {
    setDateError(false);
  }, [date]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMovingLabel('');
    }, 400);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const defaultPresentData = {};
    students.forEach((student) => {
      defaultPresentData[student.registerNumber] = true;
    });
    setAllStudentsAttendance(defaultPresentData);
  }, [students]);
console.log(allStudentsAttendance)
  const sortStudentsByName = (students) => {
    const yearOrder = ["First year", "Second year", "Third year", "Final year"];
    return students.sort((a, b) => {
      const yearIndexA = yearOrder.indexOf(a.class);
      const yearIndexB = yearOrder.indexOf(b.class);
      const yearComparison = yearIndexA - yearIndexB;
      if (yearComparison !== 0) return yearComparison;
      return a.registerNumber - b.registerNumber;
    });
  };
  const handleSearch = () => {
    const searchInput = searchQuery.toLowerCase();
    const tableRows = document.querySelectorAll('tbody tr');
    let matchedRows = [];
    for (const row of tableRows) {
      const rowData = row.innerText.toLowerCase();
      const matchingScore = calculateMatchingScore(rowData, searchInput);
      if (matchingScore > 0) {
        matchedRows.push({ row, matchingScore });
      }
    }
    if (matchedRows.length > 0) {
      matchedRows.sort((a, b) => a.row.offsetTop - b.row.offsetTop);
      const tableContainer = document.querySelector('.attendance-table-container');
      const headerHeight = document.querySelector('.attendance-table-container th').offsetHeight;
      const paddingTop = headerHeight + 5;
      const closestRow = matchedRows[0];
      tableContainer.scrollTop = closestRow.row.offsetTop - paddingTop;
    } else {
      setSearchQuery('');
    }
  };
  const calculateMatchingScore = (text, searchInput) => {
    const regex = new RegExp(searchInput, 'g');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };
  const filteredStudents = students.filter(
    (student) =>
    (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(student.registerNumber)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()))
  );
  const handleUpdateAttendance = async () => {
    if (!isDateChosen) {
      setDateError(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Update attendance for each student one by one
      for (const student of students) {
        const presentValue = allStudentsAttendance[student.registerNumber] || false;
        await axios.post('https://eduleaves-api.vercel.app/api/attendance', {
          date,
          present: presentValue,
          registerNumber: student.registerNumber,
        });
        setAllStudentsAttendance((prevAttendance) => ({
          ...prevAttendance,
          [student.registerNumber]: presentValue,
        }));
      }
      setMessage('Attendance updated successfully!');
      setTimeout(() => {
        setMessage('');
      }, 5000);
      setDate('');
      setIsDateChosen(false);
    } catch (error) {
      console.error('Error updating attendance:', error);
      setMessage('An error occurred while updating attendance mod 4');
    }
    setLoading(false);
  };
  const renderTableHeader = () => {
    return (
      <thead>
        <tr>
          <th className='serial-num-header'>Sl.no</th>
          <th>Register No</th>
          <th>Name</th>
          <th>Department</th>
          <th>Year</th>
          <th>Attendance</th>
        </tr>
      </thead>
    );
  };
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
  const renderTableRows = (students) => {
    const sortedStudents = sortStudentsByName(students);
    let serialNumber = 1;
    return sortedStudents.map((student) => (
      <tr key={student._id}>
        <td>{serialNumber++}</td>
        <td>{student.registerNumber}</td>
        <td>{student.name}</td>
        <td>{departmentShortNames[student.department] || student.department}</td>
        <td>{student.year}</td>
        <td>
          <input
            type="checkbox"
            checked={allStudentsAttendance[student.registerNumber] || false}
            onChange={(e) => {
              const { checked } = e.target;
              setAllStudentsAttendance((prevAttendance) => ({
                ...prevAttendance,
                [student.registerNumber]: checked,
              }));
            }}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <div>
        {loading && <div className={overlayClass}>
          <div className="spinner">
            <img src="./uploads/loading-brand-logo.png" alt="loading-brand-logo" id="loading-brand-logo" />
          </div>
          <img src="./uploads/loading-brand-title.png" alt="loading-brand-title" id="loading-brand-title" />
        </div>}
      </div>
      <h1 className='department-wise-chart-heading'>{year} - "{section}" Section {department} Attendance</h1>
      <div className='attendance-content-container'>
        <div className="students-container">
        <div className="attendance-search-bar-container">
              <div className='search-bar'>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder="Search"
                />
                <button onClick={handleSearch}>
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>
          <div className="bars">
            <div>
              <div className="update-all-container">
                <div className="date-container">
                  <input
                    className={`date-box ${dateError ? 'error' : ''}`}
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setIsDateChosen(true);
                      setDateError(false);
                    }
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                className="update-all-button"
                onClick={handleUpdateAttendance}
              >
                {loading ? 'Loading...' : 'Update'}
              </button>
              {dateError && <p className='success-message'>please select date!</p>}
            </div>
          </div>
          {filteredStudents.length > 0 ? (
            <div className="attendance-table-container">
              <table>
                {renderTableHeader()}
                <tbody>{renderTableRows(filteredStudents)}</tbody>
              </table>
            </div>
          ) : (
            <p className="error-message">No student data available.</p>
          )}
          {message && <p className={`success-message`}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdvisorAttendance;
