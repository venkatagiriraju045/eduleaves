import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import './CSS/Accomplishment.css';

const Accomplishment = ({ student }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // You may fetch additional data or perform any necessary actions here
        // For example, if you need to load data for courses, certifications, and achievements
        // You can use axios or any other method to fetch the data
        // After fetching the data, you can update the state to setLoading(false)
        // setLoading(false);
    }, []);

    const overlayClass = `loading-overlay${loading ? ' visible' : ''}`;

    return (
        <div>
            {loading ? (
                <div className={overlayClass}>
                    <div className="spinner">
                        <img src="./uploads/loading-brand-logo.png" alt="loading-brand-logo" id="loading-brand-logo" />
                    </div>
                    <img src="./uploads/loading-brand-title.png" alt="loading-brand-title" id="loading-brand-title" />
                </div>
            ) : (
                <div className='accomplishments-container'>
                    {/* Display Achievements */}
                    <div className="section">
                        <h2>Achievements</h2>
                        {student.achievements.map(achievement => (
                            <div key={achievement.achievement_name}>
                                <p>Name: {achievement.achievement_name}</p>
                                <p>Held at: {achievement.held_at}</p>
                                <p>Got: {achievement.prize_got}</p>
                                <p>Date of Happened: {achievement.date_of_happened}</p>
                            </div>
                        ))}
                    </div>
                    {/* Display Certifications */}
                    <div className="section">
                        <h2>Certifications</h2>
                        {student.certifications.map(certification => (
                            <div key={certification.certification_name}>
                                <p>Name: {certification.certification_name}</p>
                                <p>Organization: {certification.certification_providing_organization}</p>
                                <p>Date of Completion: {certification.date_of_completion}</p>
                            </div>
                        ))}
                    </div>
                    {/* Display Courses */}
                    <div className="section">
                        <h2>Courses</h2>
                        {student.courses.map(course => (
                            <div key={course.course_name}>
                                <p>Course Name: {course.course_name}</p>
                                <p>Duration: {course.course_duration}</p>
                                <p>Date of Completion: {course.date_of_completion}</p>
                            </div>
                        ))}
                    </div>

                    {/* Display Internships */}
                    <div className="section">
                        <h2>Internships</h2>
                        {student.internships.map(internship => (
                            <div key={internship.role_name}>
                                <p>Role Name: {internship.role_name}</p>
                                <p>Organization: {internship.organization_name}</p>
                                <p>Duration: {internship.duration}</p>
                                <p>Start Date: {internship.start_date}</p>
                                <p>End Date: {internship.end_date}</p>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
};

export default Accomplishment;
