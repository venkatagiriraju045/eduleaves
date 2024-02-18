import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/AdminAttendance.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ModifyAdvisorAttendance = ({ students, year, section, department }) => {
    const [loading, setLoading] = useState(false);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [dateEntered, setDateEntered] = useState(false);
    const [modifyAttendance, setModifyAttendance] = useState(false);
    const [confirmedModify, setConfirmedModify] = useState(false); // State variable to track confirmation
    const navigate = useNavigate();
    const [allStudentsAttendance, setAllStudentsAttendance] = useState({});
    const [movingLabel, setMovingLabel] = useState('');
    const [dateError, setDateError] = useState(false);
    const [selectedRegisterNumbers, setSelectedRegisterNumbers] = useState([]); // State variable for selected register numbers
    const [isDateChosen, setIsDateChosen] = useState(false);
    const overlayClass = `loading-overlay${loading ? ' visible' : ''}`;
    const [existingAttendance, setExistingAttendance] = useState([]);
    const [modifiedAttendance, setModifiedAttendance] = useState({});


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

        // Extract register numbers and store in selectedRegisterNumbers state
        const registerNumbers = students.map(student => student.registerNumber);
        setSelectedRegisterNumbers(registerNumbers);
    }, [students]);

    const fetchExistingAttendance = async () => {
        if (date) {
            try {
                const existingAttendanceData = [];
                setLoading(true);
                for (const registerNumber of selectedRegisterNumbers) {
                    const response = await axios.get('https://eduleaves-api.vercel.app/api/fetch_attendance', {
                        params: {
                            date: date,
                            registerNumber: registerNumber,
                        }
                    });
                    // Check if the response contains the expected data structure
                    if (response.data && response.data.hasOwnProperty('registerNumber') && response.data.hasOwnProperty('attendanceStatus')) {
                        const { registerNumber, attendanceStatus } = response.data;

                        // Push each attendance data object to the array
                        existingAttendanceData.push({ registerNumber, attendanceStatus });
                    } else {
                        console.error(`Invalid response structure for register number ${registerNumber}`);
                    }
                }
                // Set the existing attendance data state with the array containing attendance for each register number
                setExistingAttendance(existingAttendanceData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching existing attendance:', error);
                setLoading(false);

            }
        }
    };
    useEffect(() => {
        if (dateEntered && selectedRegisterNumbers.length > 0) {
            fetchExistingAttendance();
        }
    }, [dateEntered, selectedRegisterNumbers]);
    // Assuming date and selectedRegisterNumbers are state variables holding the selected date and register numbers respectively.

    // Then, you can log the existingAttendance state after it's set:
    console.log("existing record : ", existingAttendance);


    // Make sure to include selectedRegisterNumbers as a state variable which contains the register numbers of selected students, if any.
    const handleModifyAttendance = () => {
        setModifyAttendance(true);
    };

    const handleSelectAllToggle = () => {
        setSelectAllChecked(prevState => !prevState);
        // Toggle between select all and deselect all based on the current state of selectAllChecked
        if (!selectAllChecked) {
            handleSelectAll();
        } else {
            handleDeselectAll();
        }
    };
    const sortStudentsByRegNo = (students) => {
        return students.sort((a, b) => {
            // Convert register numbers to numbers and then compare
            const registerNumberA = parseInt(a.registerNumber);
            const registerNumberB = parseInt(b.registerNumber);
            return registerNumberA - registerNumberB;
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
    const sortExistingAttendanceByRegNo = (existingAttendance) => {
        return existingAttendance.sort((a, b) => {
            return a.registerNumber - b.registerNumber;
        });
    };

    const filteredStudents = students.filter(
        (student) =>
        (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(student.registerNumber)
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
    );
    const handleDateChangeAndSubmit = async () => {
        if (date && selectedRegisterNumbers.length > 0) {
            try {
                setLoading(true);
                const newAttendanceData = [];
                for (const registerNumber of selectedRegisterNumbers) {
                    const response = await axios.get('https://eduleaves-api.vercel.app/api/fetch_attendance', {
                        params: {
                            date: date,
                            registerNumber: registerNumber,
                        }
                    });
                    // Check if the response contains the expected data structure
                    if (response.data && response.data.hasOwnProperty('registerNumber') && response.data.hasOwnProperty('attendanceStatus')) {
                        const { registerNumber, attendanceStatus } = response.data;
                        newAttendanceData.push({ registerNumber, attendanceStatus });
                    } else {
                        console.error(`Invalid response structure for register number ${registerNumber}`);
                    }
                }
                setExistingAttendance(newAttendanceData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching new attendance:', error);
                setLoading(false);
            }
        }
    };

    // Update handleDateEnter to trigger data fetching
    const handleDateEnter = () => {
        if (date) {
            setConfirmedModify(false);
            setDateEntered(true);
            setExistingAttendance([]); // Clear existing attendance data when a new date is chosen
            handleDateChangeAndSubmit(); // Fetch new attendance data
        }
    };
    const handleCheckboxChange = (registerNumber, checked) => {
        setModifiedAttendance((prevAttendance) => ({
            ...prevAttendance,
            [registerNumber]: checked,
        }));
    };

    const handleUpdateAttendance = async () => {
        // Update attendance logic
        setLoading(true);
        try {
            // Update attendance for each student one by one
            for (const registerNumber of Object.keys(modifiedAttendance)) {
                const presentValue = modifiedAttendance[registerNumber];
                await axios.post('https://eduleaves-api.vercel.app/api/modify_attendance', {
                    date,
                    present: presentValue,
                    registerNumber,
                });
            }
            setMessage('Attendance updated successfully!');
            setTimeout(() => {
                setMessage('');
            }, 5000);
            setDate('');
            setIsDateChosen(false);
            setModifiedAttendance({}); // Reset modified attendance
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
                    <th>Attendance Status</th>
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
        const sortedExistingAttendance = sortExistingAttendanceByRegNo(existingAttendance)
        if (sortedExistingAttendance.length > 0) {
            const sortedStudents = sortStudentsByRegNo(students);
            let serialNumber = 1;

            return sortedStudents.map((student, index) => {
                // Check if the student's register number exists in sortedExistingAttendance
                const attendanceRecord = sortedExistingAttendance.find(
                    (attendance) => attendance.registerNumber === student.registerNumber
                );
                console.log("record" + attendanceRecord)

                return (
                    <tr key={student._id}>
                        <td>{serialNumber++}</td>
                        <td>{student.registerNumber}</td>
                        <td>{student.name}</td>
                        <td>{departmentShortNames[student.department] || student.department}</td>
                        <td>{student.year}</td>
                        <td>{sortedExistingAttendance[index].attendanceStatus}</td> {/* Display attendance status */}
                        <td>
                            {confirmedModify ? (
                                <input
                                    type="checkbox"
                                    checked={modifiedAttendance[student.registerNumber] || false}
                                    onChange={(e) => handleCheckboxChange(student.registerNumber, e.target.checked)}
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    checked={sortedExistingAttendance[index].attendanceStatus === 'Present'}
                                    disabled
                                    className="custom-checkbox"
                                />
                            )}
                        </td>
                    </tr>
                );
            });
        }
        else {
            return null; // Return null if existingAttendance is empty
        }
    };
    const handleConfirmModify = () => {
        setConfirmedModify(true);
        setModifyAttendance(false);
        // Initialize modifiedAttendance with existing attendance data
        const initialModifiedAttendance = {};
        existingAttendance.forEach((attendance) => {
            initialModifiedAttendance[attendance.registerNumber] = attendance.attendanceStatus === 'Present';
        });
        setModifiedAttendance(initialModifiedAttendance);
    };

    const handleSelectAll = () => {
        const updatedModifiedAttendance = {};
        // Set all students' attendance to true
        selectedRegisterNumbers.forEach(registerNumber => {
            updatedModifiedAttendance[registerNumber] = true;
        });
        setModifiedAttendance(updatedModifiedAttendance);
    };

    const handleDeselectAll = () => {
        const updatedModifiedAttendance = {};
        // Set all students' attendance to false
        selectedRegisterNumbers.forEach(registerNumber => {
            updatedModifiedAttendance[registerNumber] = false;
        });
        setModifiedAttendance(updatedModifiedAttendance);
    };

    return (
        <div>
            <div>
                {modifyAttendance && (
                    <div className="overlay">
                        <div className="confirmation-box">
                            <p>Are you sure you want to modify attendance?</p>
                            <div className='confirmation-buttons'>
                                <button onClick={handleConfirmModify}>Yes</button>
                                <button onClick={() => setModifyAttendance(false)}>No</button>
                            </div>
                        </div>
                    </div>
                )}

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
                        <div className='date-submit-button'>
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
                            <div className='submit-button-container-center'>
                                <div className="update-all-container">
                                    <div className="date-container">
                                        <button onClick={handleDateEnter} className="update-all-button">Submit</button>
                                        {dateError && <p className='success-message'>please select date!</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='date-submit-button'>

                            {dateEntered && (
                                <div>
                                    <button
                                        className="update-all-button"
                                        onClick={handleModifyAttendance}
                                    >
                                        {loading ? 'Loading...' : 'Modify'}
                                    </button>
                                    {dateError && <p className='success-message'>please select date!</p>}
                                </div>
                            )
                            }
                            {confirmedModify && (

                                <div className='select-all-button-container'>
                                    <input
                                        type="checkbox"
                                        checked={selectAllChecked}
                                        onChange={handleSelectAllToggle}

                                    />
                                    <label className='select-all-button'>{selectAllChecked ? 'Deselect All' : 'Select All'}</label>
                                </div>)}
                            {confirmedModify && (
                                <div className='select-all-update-button'>


                                    <button
                                        className="update-all-button"
                                        onClick={handleUpdateAttendance}
                                        disabled={Object.keys(modifiedAttendance).length === 0} // Disable update button if no modifications
                                    >
                                        {loading ? 'Loading...' : 'Update'}
                                    </button>
                                    {dateError && <p className='success-message'>please select date!</p>}
                                </div>
                            )}
                        </div>
                    </div>
                    {dateEntered ? (
                        <div className="attendance-table-container">
                            <table>
                                {renderTableHeader()}
                                <tbody>{renderTableRows(filteredStudents)}</tbody>
                            </table>
                        </div>
                    ) : !isDateChosen ? (
                        <p className="error-message">Please select a date to view the attendance of the students</p>
                    ) : (
                        <p className="error-message">Please click on submit to continue</p>
                    )}
                    {message && <p className={`success-message`}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default ModifyAdvisorAttendance;
