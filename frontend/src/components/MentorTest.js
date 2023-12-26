import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/AdminAttendance.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MentorTest = ({ students }) => {

    const [loading, setLoading] = useState(true); 
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [allStudentsAttendance, setAllStudentsAttendance] = useState({});
    const [movingLabel, setMovingLabel] = useState('');
    const [labelWidth, setLabelWidth] = useState(0);
    const [dateError, setDateError] = useState(false);
    const overlayClass = `loading-overlay${loading ? ' visible' : ''}`;
    const [isDateChosen, setIsDateChosen] = useState(false);

    useEffect(() => {
        setDateError(false);
    }, [date]);

    useEffect(() => {
        // Set opacity to 0 initially
        if(loading){
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
    }, []);



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
                    <th>IAT</th>
                </tr>
            </thead>
        );
    };
    const cellClass = (mark) => {
        if (mark >= 0 && mark <= 40) {
            return 'low-mark';
        } else if (mark >= 41 && mark <= 70) {
            return 'average-mark';
        } else if (mark >= 71 && mark <= 89) {
            return 'good-mark';
        } else if (mark >= 90 && mark <= 100) {
            return 'outstanding-mark';
        } else {
            return ''; // Default class when the mark is outside the specified ranges
        }
    };
    
    const renderTableRows = (students) => {
        const sortedStudents = sortStudentsByName(students);
        let serialNumber = 1;

        return sortedStudents.map((student) => (
            <tr key={student._id}>
                <td>{serialNumber++}</td>
                <td>{student.registerNumber}</td>
                <td>{student.name}</td>
                <td>{student.year}</td>
                <td>
                    <table>
                        <tbody>
                            <tr>
                                <td></td>
                                {student.subjects.map((subject) => (
                                    <td key={subject.subject_code}>{subject.subject_code}</td>
                                ))}
                            </tr>
                            {Object.keys(student.subjects[0].scores).map((iat, i) => (
                                <tr key={i}>
                                    <td>{`IAT-${i + 1}`}</td>
                                    {student.subjects.map((subject) => (
                                        <td key={subject.subject_code} className={cellClass(subject.scores[iat])}>{subject.scores[iat]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
            <h1 className='department-wise-chart-heading'>Mentees Test Performance</h1>
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

export default MentorTest;
