import React, { useState } from 'react';
import axios from 'axios';
import './CSS/UpdateAccom.css';
import './CSS/Message.css';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MentorMessage = ({ student }) => {
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
    const updateStudentAccomplishments = async () => {
    
        if (!message.trim()) {
            setAppMessage('Please enter a valid message!');
            return;
        }
    
        const sender = "mentor";
        const dateAndTime = new Date().toLocaleString(); // Get current date and time in a readable format
    
        try { 
            // Send the POST request to update accomplishments
            const accomplishmentsToUpdate = `[${dateAndTime}] ${message.trim()}`;
            console.log(accomplishmentsToUpdate);
    
            await axios.post('https://eduleaves-api.vercel.app/api/update_messages', {
                email: student.email,
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
                <div className="message-students-container">
                    {student && student !== '' && (
                        <div className="message-form">
                            <p className="message-title-message">Existing message</p>
                            <div className="existing-message-container">
                                {student && student.mentor_message &&
                                    // Split and remove empty sentences
                                    // Inside your renderMessage function
                                    <div className="message">
                                        <div className="message-content">
                                            <div className="message-point">
                                                <img src="./uploads/pin.png" alt="Point Icon" className="point-icon" />
                                                <p className="sentence-text">{student.mentor_message.trim()}</p>
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
    );
};

export default MentorMessage;
