import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/AdminAttendance.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MentorTest = ({ students }) => {

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [allStudentsAttendance, setAllStudentsAttendance] = useState({});
    const [movingLabel, setMovingLabel] = useState('');
    const [labelWidth, setLabelWidth] = useState(0);
    const [dateError, setDateError] = useState(false);
    const [isDateChosen, setIsDateChosen] = useState(false);



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

            return a.name.localeCompare(b.name);
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
                const presentValue = allStudentsAttendance[student.email] || false;

                await axios.post('http://localhost:3000/api/attendance', {
                    date,
                    present: presentValue,
                    email: student.email,
                });

                // Update local state after making the request
                setAllStudentsAttendance((prevAttendance) => ({
                    ...prevAttendance,
                    [student.email]: presentValue,
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
                    <th>Year</th>
                    <th>IAT</th>
                </tr>
            </thead>
        );
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
                                        <td key={subject.subject_code}>{subject.scores[iat]}</td>
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
