import React, { useState } from 'react';
import axios from 'axios';
import './CSS/UpdateAccom.css';
import './CSS/Message.css';
const AdvisorMessage = ({ students, year, section, department}) => {
    const [loading, setLoading] = useState(false);
    const [appMessage, setAppMessage] = useState('');
    const [message, setMessage] = useState('');
    const [messagePreview, setMessagePreview] = useState('');
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
                <div className="message-content">
                    <div className="message-point">
                        <img src="./uploads/pin.png" alt="Point Icon" className="point-icon" />
                        <p className="sentence-text">{sentences.trim()}</p>
                    </div>
                </div>
            </div>
        );
        setMessage(messageText);
    };
    const updateStudentAccomplishments = async () => {
        if (!message.trim()) {
            setAppMessage('Please enter a valid message!');
            return;
        }
        setLoading(true);
        try {
            const sender = 'advisor';
            const dateAndTime = new Date().toLocaleString();
            const accomplishmentsToUpdate = `[${dateAndTime}] ${message.trim()}`;
            console.log(accomplishmentsToUpdate);
            // Send the POST request to update accomplishments for all students
            for (const student of students) {
                await axios.post('https://eduleaves-api.vercel.app/api/update_messages', {
                    registerNumber: student.registerNumber,
                    messages: accomplishmentsToUpdate,
                    sender,
                    dateAndTime,
                });
            }
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


    return (
        <div>
            <div className='advisor-message-container'>
                {loading && (
                    <div className={overlayClass}>
                        <div className="spinner">
                            <img src="./uploads/loading-brand-logo.png" alt="loading-brand-logo" id="loading-brand-logo" />
                        </div>
                        <img src="./uploads/loading-brand-title.png" alt="loading-brand-title" id="loading-brand-title" />
                    </div>
                )}
            </div>
            <div className='class-wise-header'>
                <h1 className='department-wise-chart-heading'>{year} - "{section}" Section {department} Message Dashboard</h1>
            </div>
                <div className="message-students-container">
                        <div className="message-form">
                            <div className="input-field-container">
                                <div className="input-field">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={handleAccomplishmentsChange}
                                        placeholder="Enter your message here"
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
                </div>

        </div>
    );
};

export default AdvisorMessage;