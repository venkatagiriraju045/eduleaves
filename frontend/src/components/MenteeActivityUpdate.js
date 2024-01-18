import React, { useState } from 'react';
import axios from 'axios';
import './CSS/UpdateAccom.css';
import './CSS/Message.css';

const MenteeActivityUpdate = ({ student }) => {
    const [loading, setLoading] = useState(false);
    const [appMessage, setAppMessage] = useState('');
    const [activityType, setActivityType] = useState('achievement');

    // State variables for different types of activity details
    const [internshipDetails, setInternshipDetails] = useState({
        role_name: '',
        organization_name: '',
        duration: '',
        start_date: '',
        end_date: '',
    });

    const [certificationDetails, setCertificationDetails] = useState({
        certification_name: '',
        certification_providing_organization: '',
        date_of_happened: '',
    });

    const [courseDetails, setCourseDetails] = useState({
        course_name: '',
        course_duration: '',
        date_of_completion: '',
    });

    const [achievementDetails, setAchievementDetails] = useState({
        achievement_name: '',
        held_at: '',
        prize_got: '',
        date_of_happened: '',
    });

    const overlayClass = `loading-overlay${loading ? ' visible' : ''}`;

    const handleActivityTypeChange = (event) => {
        const selectedActivityType = event.target.value;
        setActivityType(selectedActivityType);

        // Reset activity details when activity type changes
        resetActivityDetails();
    };

    const resetActivityDetails = () => {
        setInternshipDetails({
            role_name: '',
            organization_name: '',
            duration: '',
            start_date: '',
            end_date: '',
        });

        setCertificationDetails({
            certification_name: '',
            certification_providing_organization: '',
            date_of_happened: '',
        });

        setCourseDetails({
            course_name: '',
            course_duration: '',
            date_of_completion: '',
        });

        setAchievementDetails({
            achievement_name: '',
            held_at: '',
            prize_got: '',
            date_of_happened: '',
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        // Update the corresponding activity details based on the selected activity type
        switch (activityType) {
            case 'internship':
                setInternshipDetails({ ...internshipDetails, [name]: value });
                break;
            case 'certification':
                setCertificationDetails({ ...certificationDetails, [name]: value });
                break;
            case 'course':
                setCourseDetails({ ...courseDetails, [name]: value });
                break;
            case 'achievement':
                setAchievementDetails({ ...achievementDetails, [name]: value });
                break;
            default:
                break;
        }
    };

    const updateStudentAccomplishments = async () => {
        try {
            setLoading(true);
            // Validate that the necessary fields are filled based on the selected activity type
            await axios.post(`https://eduleaves-api.vercel.app/api/update_activity`, {
                email: student.email,
                activity_type: activityType,
                activity_details: getActivityDetails(),
            });
            setAppMessage(`${activityType} details updated successfully!`);
        } catch (error) {
            console.error(`Error updating ${activityType} details:`, error);
            setAppMessage(`An error occurred while updating the ${activityType} details`);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setAppMessage('');
            }, 5000);
        }
    };

    const getActivityDetails = () => {
        // Return the corresponding activity details based on the selected activity type
        switch (activityType) {
            case 'internship':
                return internshipDetails;
            case 'certification':
                return certificationDetails;
            case 'course':
                return courseDetails;
            case 'achievement':
                return achievementDetails;
            default:
                return {};
        }
    };

    return (
        <div>
            <div>
                {loading && (
                    <div className={overlayClass}>
                        <div className="spinner">
                            <img src="./uploads/loading-brand-logo.png" alt="loading-brand-logo" id="loading-brand-logo" />
                        </div>
                        <img src="./uploads/loading-brand-title.png" alt="loading-brand-title" id="loading-brand-title" />
                    </div>
                )}
            </div>
            <div className="student-achievements-container">
                {student && student !== '' && (

                    <div className="achievement-form">
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    value="achievement"
                                    checked={activityType === 'achievement'}
                                    onChange={handleActivityTypeChange}
                                />
                                Achievement
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    value="certification"
                                    checked={activityType === 'certification'}
                                    onChange={handleActivityTypeChange}
                                />
                                Certification
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    value="course"
                                    checked={activityType === 'course'}
                                    onChange={handleActivityTypeChange}
                                />
                                Course
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    value="internship"
                                    checked={activityType === 'internship'}
                                    onChange={handleActivityTypeChange}
                                />
                                Internship
                            </label>
                        </div>

                        {/* Render form fields based on the selected activity type */}
                        <div className="form-fields">
                            {activityType === 'internship' && (
                                <>
                                    <label>Role Name:</label>
                                    <input type="text" name="role_name" value={internshipDetails.role_name} onChange={handleInputChange} />

                                    <label>Organization Name:</label>
                                    <input type="text" name="organization_name" value={internshipDetails.organization_name} onChange={handleInputChange} />

                                    <label>Duration:</label>
                                    <input type="text" name="duration" value={internshipDetails.duration} onChange={handleInputChange} />

                                    <label>Start Date:</label>
                                    <input type="date" name="start_date" value={internshipDetails.start_date} onChange={handleInputChange} />

                                    <label>End Date:</label>
                                    <input type="date" name="end_date" value={internshipDetails.end_date} onChange={handleInputChange} />
                                </>
                            )}

                            {activityType === 'certification' && (
                                <>
                                    <label>Certification Name:</label>
                                    <input
                                        type="text"
                                        name="certification_name"
                                        value={certificationDetails.certification_name}
                                        onChange={handleInputChange}
                                    />

                                    <label>Providing Organization:</label>
                                    <input
                                        type="text"
                                        name="certification_providing_organization"
                                        value={certificationDetails.certification_providing_organization}
                                        onChange={handleInputChange}
                                    />

                                    <label>Date of Completion:</label>
                                    <input
                                        type="date"
                                        name="date_of_completion"
                                        value={certificationDetails.date_of_completion}
                                        onChange={handleInputChange}
                                    />
                                </>
                            )}

                            {activityType === 'course' && (
                                <>
                                    <label>Course Name:</label>
                                    <input type="text" name="course_name" value={courseDetails.course_name} onChange={handleInputChange} />

                                    <label>Duration:</label>
                                    <input type="text" name="course_duration" value={courseDetails.course_duration} onChange={handleInputChange} />

                                    <label>Date of Completion:</label>
                                    <input
                                        type="date"
                                        name="date_of_completion"
                                        value={courseDetails.date_of_completion}
                                        onChange={handleInputChange}
                                    />
                                </>
                            )}

                            {activityType === 'achievement' && (
                                <>
                                    <label>Achievement Name:</label>
                                    <input
                                        type="text"
                                        name="achievement_name"
                                        value={achievementDetails.achievement_name}
                                        onChange={handleInputChange}
                                    />

                                    <label>Held At:</label>
                                    <input type="text" name="held_at" value={achievementDetails.held_at} onChange={handleInputChange} />

                                    <label>Prize Got:</label>
                                    <input type="text" name="prize_got" value={achievementDetails.prize_got} onChange={handleInputChange} />

                                    <label>Date of Happened:</label>
                                    <input
                                        type="date"
                                        name="date_of_happened"
                                        value={achievementDetails.date_of_happened}
                                        onChange={handleInputChange}
                                    />
                                </>
                            )}
                        </div>

                        <button className="update-button" onClick={updateStudentAccomplishments}>
                            Update
                        </button>
                            {appMessage && <p className={`success-message`}>{appMessage}</p>}
                    </div>
                )}
            </div>
        </div>
    );

};

export default MenteeActivityUpdate;
