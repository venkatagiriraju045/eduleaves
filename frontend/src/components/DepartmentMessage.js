import React, { useState } from 'react';
import axios from 'axios';
import './CSS/UpdateAccom.css';
import './CSS/Message.css';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DepartmentMessage = ({ students }) => {
    const [loading, setLoading] = useState(false);
    const [appMessage, setAppMessage] = useState('');
    const [message, setMessage] = useState('');
    const [messagePreview, setMessagePreview] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedStudent, setSearchedStudent] = useState(null);
    const [studentNotFound, setStudentNotFound] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState(true);
    const overlayClass = `loading-overlay${loading ? ' visible' : ''}`;

    const handleAccomplishmentsChange = (e) => {
        setMessage(e.target.value);
        handlePreviewUpdate(e);
    };
    const handlePreviewUpdate = (e) => {
        const messageText = e.target.value;
        const sentences = messageText;
        setMessagePreview(
                <div className="message">
                    <div clas sName="message-content">
                        <div className="message-point">
                            <img src="./uploads/pin.png" alt="Point Icon" className="point-icon" />
                            <p className="sentence-text">{sentences.trim()}</p>
                        </div>
                    </div>
                </div>
            
        );
        setMessage(messageText);
    };

    const findStudent = () => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const foundStudent = students.find(
            (student) =>
                student.name.toLowerCase() === lowerCaseQuery ||
                String(student.registerNumber).toLowerCase() === lowerCaseQuery
        );

        if (foundStudent) {
            setSearchedStudent(foundStudent);
            setStudentNotFound(false);
        } else {
            setSearchedStudent(null);
            setStudentNotFound(true);
        }
    };

    const updateStudentAccomplishments = async () => {
        if (!searchedStudent) {
            setAppMessage('Student not found. Please retry with a valid student id!');
            return;
        }
    
        if (!message.trim()) {
            setAppMessage('Please enter a valid message!');
            return;
        }
    
        setLoading(true);
    
        try {
            const sender = "hod";
            const dateAndTime = new Date().toLocaleString();
            const accomplishmentsToUpdate = `[${dateAndTime}] ${message.trim()}`;
            console.log(accomplishmentsToUpdate);
    
            // Send the POST request to update accomplishments
            await axios.post('https://eduleaves-api.vercel.app/api/update_messages', {
                email: searchedStudent.email,
                messages: accomplishmentsToUpdate,
                sender,
                dateAndTime,
            });
    
            setAppMessage('Messages updated successfully!');
            setTimeout(() => {
                setAppMessage('');
            }, 5000);
            setLoading(false);
        } catch (error) {
            console.error('Error updating messages:', error);
            setAppMessage('An error occurred while updating the messages');
            setLoading(false);
        }
    };
    

    const handleWelcomeMessage = () => {
        findStudent(); // Trigger the search
        setWelcomeMessage(false); // Set welcomeMessage to false
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
            <h1 className='department-wise-chart-heading'>{students[0].department} Message Center</h1>

            <div className="attendance-content-container">
                
                <div className="search-bar-container">
                    <div className="search-bar">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleWelcomeMessage();
                                }
                            }}
                            placeholder="Search by register number"
                        />
                        <button onClick={handleWelcomeMessage}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>
                <div className="message-students-container">
                    {welcomeMessage && (
                        <div className="message-to-select">
                            <img src="./uploads/present.png" alt="Present Icon" className="present-icon" />
                            <h3>Please find the student using the name or reg no.</h3>
                        </div>
                    )}
                    {studentNotFound && (
                        <div className="message-to-select">
                            <img src="./uploads/present.png" alt="Present Icon" className="present-icon" />
                            <h3>Student not found. Please retry with a valid student id!</h3>
                        </div>
                    )}
                    {searchedStudent && searchedStudent !== '' && (
                        <div className="message-form">
                            <p className="message-title-message">{searchedStudent.name}'s Existing message</p>
                            <div className="existing-message-container">
                                {searchedStudent && searchedStudent.hod_message &&
                                    // Split and remove empty sentences
                                    // Inside your renderMessage function
                                    <div className="message">
                                        <div className="message-content">
                                            <div className="message-point">
                                                <img src="./uploads/pin.png" alt="Point Icon" className="point-icon" />
                                                <p className="sentence-text">{searchedStudent.hod_message.trim()}</p>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="input-field-container">
                                <div className="input-field">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={handleAccomplishmentsChange}
                                        placeholder="Enter your accomplishment here"
                                    />
                                    <button
                                        className="send-button"
                                        onClick={updateStudentAccomplishments}
                                    >
                                        <img src="./uploads/send-icon.png" alt="Send Icon" className="send-icon" />
                                    </button>
                                </div>
                            </div>
                            <p className="message-title-message">Update preview</p>

                            <div className="new-message-container">{messagePreview}</div>

                            {appMessage && <p className={`success-message`}>{appMessage}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentMessage;
