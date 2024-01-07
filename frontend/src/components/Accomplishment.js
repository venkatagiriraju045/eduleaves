import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import './CSS/Accomplishment.css';

const Accomplishment = ({ student }) => {
    const [loading, setLoading] = useState(false);



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
                    <div className="section-container">
                        <h2>Achievements</h2>
                        {student.achievements.map(achievement => (
                            <div key={achievement.achievement_name} className="card">
                                <p><b>Name:</b> {achievement.achievement_name}</p>
                                <p><b>Held at:</b> {achievement.held_at}</p>
                                <p><b>Got:</b> {achievement.prize_got}</p>
                                <p><b>Date of Happened:</b> {achievement.date_of_happened}</p>
                            </div>
                        ))}
                    </div>
                    {/* Display Certifications */}
                    <div className="section-container">
                        <h2>Certifications</h2>
                        {student.certifications.map(certification => (
                            <div key={certification.certification_name} className="card">
                                <p><b>Name:</b> {certification.certification_name}</p>
                                <p><b>Organization:</b> {certification.certification_providing_organization}</p>
                                <p><b>Date of Completion:</b> {certification.date_of_completion}</p>
                            </div>
                        ))}
                    </div>
                    {/* Display Courses */}
                    <div className="section-container">
                        <h2>Courses</h2>
                        {student.courses.map(course => (
                            <div key={course.course_name} className="card">
                                <p><b>Course Name:</b> {course.course_name}</p>
                                <p><b>Duration:</b> {course.course_duration}</p>
                                <p><b>Date of Completion:</b> {course.date_of_completion}</p>
                            </div>
                        ))}
                    </div>

                    {/* Display Internships */}
                    <div className="section-container">
                        <h2>Internships</h2>
                        {student.internships.map(internship => (
                            <div key={internship.role_name} className="card">
                                <p><b>Role Name:</b> {internship.role_name}</p>
                                <p><b>Organization:</b> {internship.organization_name}</p>
                                <p><b>Duration:</b> {internship.duration}</p>
                                <p><b>Start Date:</b> {internship.start_date}</p>
                                <p><b>End Date:</b> {internship.end_date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accomplishment;
