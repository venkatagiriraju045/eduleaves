import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/AdminAttendance.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MentorAttendance = ({ students }) => {

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [allStudentsAttendance, setAllStudentsAttendance] = useState({});
    const [movingLabel, setMovingLabel] = useState('');
    const [dateError, setDateError] = useState(false);
    const overlayClass = `loading-overlay${loading ? ' visible' : ''}`;


    useEffect(() => {
        // Set opacity to 0 initially
        if (loading) {
            document.querySelector('.loading-overlay').style.opacity = '1';

            // After 3 seconds, update opacity to 1 without transition
            const initialOpacityTimer = setTimeout(() => {
                document.querySelector('.loading-overlay').style.opacity = '0';
                document.querySelector('.loading-overlay').style.transition = 'opacity 3s ease'; // Add transition for the next 3 seconds

            }, 1000);

            // After 6 seconds, hide the overlay
            const hideOverlayTimer = setTimeout(() => {
                setLoading(false);
            }, 2000);

            return () => {
                clearTimeout(hideOverlayTimer);

                clearTimeout(initialOpacityTimer);
            };
        }
    }, [loading]);


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
            defaultPresentData[student.email] = true;
        });
        setAllStudentsAttendance(defaultPresentData);
    }, [students]);


    const sortStudentsByName = (students) => {
        const yearOrder = ["First year", "Second year", "Third year", "Final year"];

        return students.sort((a, b) => {
            const yearIndexA = yearOrder.indexOf(a.class);
            const yearIndexB = yearOrder.indexOf(b.class);

            const yearComparison = yearIndexA - yearIndexB;
            if (yearComparison !== 0) return yearComparison;

            // Sort by register number instead of name
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
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(student.registerNumber)
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
    );

    const renderTableHeader = () => {
        return (
            <thead>
                <tr>
                    <th className='serial-num-header'>Sl.no</th>
                    <th>Register No</th>
                    <th>Name</th>
                    <th>Year</th>
                    <th>Present Days</th>
                    <th>Total Days</th>
                    <th>Present Percentage</th>
                </tr>
            </thead>
        );
    };

    const renderTableRows = (students) => {
        const sortedStudents = sortStudentsByName(students);
        let serialNumber = 1;

        return sortedStudents.map((student) => {
            const presentDays = student.present_array.length;
            const totalDays = student.total_days;
            const attendancePercentage = ((presentDays / totalDays) * 100).toFixed(2);
            const isLowAttendance = attendancePercentage <= 80;

            return (
                <tr key={student._id}>
                    <td>{serialNumber++}</td>
                    <td>{student.registerNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.year}</td>
                    <td>{presentDays}</td>
                    <td>{totalDays}</td>
                    <td style={{ backgroundColor: isLowAttendance ? 'yellow' : 'inherit' }}>
                        {attendancePercentage}%
                    </td>
                </tr>
            );
        });
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
            <h1 className='department-wise-chart-heading'>Mentees Attendance</h1>
            <div className='attendance-content-container'>
                <div className="students-container">
                    <div className="bars">
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
                    </div>
                    {filteredStudents.length > 0 ? (
                        <div className="attendance-table-container" style={{ height: `${Math.min(500, Math.max(150, filteredStudents.length * 50))}px`, overflow: 'auto' }}>
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

export default MentorAttendance;
