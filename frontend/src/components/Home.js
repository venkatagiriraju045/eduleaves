import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/Home.css';

const Home = () => {
    const [loginAs, setLoginAs] = useState('student'); // Default to student login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [hod, setHod] = useState(null);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [mentorLogin, setMentorLogin] = useState(null); // Add mentor login state
    const [staff, setStaff] = useState(null);
    const [handleSubmitPressed, setHandleSubmitPressed] = useState(false);
    const navigate = useNavigate();
    const [mobile, setMobile] = useState(false);

    const overlayClass = `loading-overlay${loading ? ' visible' : ''}`;
    const handleLoginEmailChange = (e) => {
        setLoginEmail(e.target.value);
    };

    const handleLoginPasswordChange = (e) => {
        setLoginPassword(e.target.value);
    };
    useEffect(() => {
        setLoginEmail('');
        setLoginPassword('');
    }, [loginAs]);

    useEffect(() => {
        // Detect device type and set the state
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        isMobile ? setMobile(true) : setMobile(false)
    }, []);
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
            }, 1000);

            return () => {
                clearTimeout(hideOverlayTimer);

                clearTimeout(initialOpacityTimer);
            };
        }
    }, [loading]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`https://eduleaves-api.vercel.app/api/login`, {
                registerNumber: loginEmail,
                DOB: loginPassword,
            });
            localStorage.setItem('loggedInEmail', loginEmail);
            setLoginSuccess(true);
            navigate('/Profile');
        } catch (error) {
            setLoginError('Invalid email or password. Please try again.');
            setTimeout(() => {
                setLoginError('');
            }, 5000);
        }
        finally {
            setLoading(false); // Set loading to false when API call is completed
        }
    };


    // Define a function to fetch admin data
    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`https://eduleaves-api.vercel.app/api/students?email=${loginEmail}`);
                const staffData = response.data;
                setStaff(staffData);
                setLoading(false);
            } catch (error) {
                if (handleSubmitPressed) {
                    console.error('Error fetching admin data:', error);
                    setLoading(false);
                }
            }
        }
        if (loginEmail) {
            fetchStaffData();
        }
    }, [loginEmail, handleSubmitPressed]);
    useEffect(() => {
        if (loginEmail) {
            // Extract the part of the email before "@" symbol
            const emailPrefix = loginEmail.split('@')[0];
            // Define a mapping of email prefixes to department names
            const departmentMap = {
                'cse': 'Computer Science and Engineering',
                'it': 'Information Technology',
                'eee': 'Electrical and Electronics Engineering',
                'aids': 'Artificial Intelligence and Data Science',
                'mech': 'Mechanical Engineering',
                'csbs': 'Computer Science and Business Systems',
                'ece': 'Electrical and Communication Engineering',
                'civil': 'Civil Engineering',
            };

            // Check if the email prefix is in the mapping
            if (departmentMap.hasOwnProperty(emailPrefix)) {
            }
            // If the email prefix is not in the mapping, you can set a default department name or handle it as needed.
        }
    }, [loginEmail]);

    const handleSubmit = async (e) => {
        setHandleSubmitPressed(true);
        e.preventDefault();
        setLoading(true); // Set loading to true when the submit button is clicked

        try {
            console.log(loginEmail);
            console.log(loginPassword);
            console.log("staff data :" + staff);
            const response = await axios.post(`https://eduleaves-api.vercel.app/api/admin-login`, {
                email: loginEmail,
                password: loginPassword,
            });
            if (response.data.success) {
                if (staff) {
                    if ((loginEmail !== 'admin@kiot') && (loginEmail !== 'admin@psg') && (loginEmail !== 'admin@mhs')) {
                        if (loginAs === 'hod' && staff.role === 'hod' && loginAs !== 'student') {
                            const hodInfo = {
                                instituteName: staff.institute_name,
                                departmentName: staff.department,
                            };
                            
                            // Convert the object to a JSON string before storing
                            localStorage.setItem('hodInfo', JSON.stringify(hodInfo));
                            navigate('/DepartmentMenu');
                        } else if (loginAs === 'advisor' && staff.role === 'advisor' && (staff.name === 'finalcsec@kiot' || staff.name === 'secondcsec@kiot' || staff.name === 'thirdcsec' || staff.name === 'firstcsec@kiot') && loginAs !== 'student') {
                            const advisorInfo = {
                                instituteName: staff.institute_name,
                                departmentName: staff.department,
                                year: staff.year,
                                section: staff.section
                            };
                            // Convert the object to a JSON string before storing
                            localStorage.setItem('advisorInfo', JSON.stringify(advisorInfo));

                            navigate('/AdvisorMenu');
                        } else if (loginAs === 'mentor' && staff.role === 'mentor' && (staff.name === 'rk@cse.kiot' || staff.name === 'rsp@cse.kiot' || staff.name === 'rsg@cse.kiot' || staff.name === 'mj@cse.kiot') && loginAs !== 'student') {
                            const mentorInfo = {
                                instituteName: staff.institute_name,
                                departmentName: staff.department,
                                mentor_name: staff.name,
                            };
                            // Convert the object to a JSON string before storing
                            localStorage.setItem('mentorInfo', JSON.stringify(mentorInfo));
                            navigate('/MentorMenu');
                        }
                    }/* else {
                        navigate('/admin-home', { state: { email: loginEmail, instituteName: staff.institute_name } });
                    }*/
                }
            } else {
                setLoginError('Invalid email or password');
                setTimeout(() => {
                    setLoginError('');
                }, 5000);
            }

        } catch (error) {
            setLoginError('Invalid email or password');
            setTimeout(() => {
                setLoginError('');
            }, 5000);
        } finally {
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

            <div className="home-container">
                <div className="home-page-left-container">
                    <div className="home-page-main-logo-container">
                        <img src="./uploads/tsg-logo.PNG" alt="menu image" id="home-page-main-logo" />
                    </div>
                    <div id="about-company-container">
                        <div>
                            <p>" Welcome to our dynamic student and admin portal, where learning meets efficiency. Dive into tailored analytics that track your academic progress and stay on top of attendance effortlessly. Experience a smarter way to manage your educational journey with us. "</p>
                        </div>
                    </div>

                </div>
                <div className="home-page-right-container">

                    <div className="login-container">
                        <div className='login-page-logo-container'>
                            <img src="./uploads/login-page-logo.png" alt="menu image" id="login-page-logo" />
                        </div>
                        <h2 id="login-person">
                            {loginAs === 'student' ? 'Student Gate' : loginAs === 'advisor' ? 'Advisor Gate' : loginAs === 'hod' ? 'HOD Gate' : 'Mentor Gate'}
                        </h2>
                        {loginError && <p className="login-error">{loginError}</p>}
                        {loginSuccess && <p className="login-success">Login successful!</p>}
                        <form onSubmit={loginAs === 'student' ? handleLogin : handleSubmit}>
                            <div className="form-group">
                                <label>Gate Address{loginAs === 'student' ? <> (Register number [611....])</> : <></>}</label>
                                <br />
                                <input
                                    type="text"
                                    value={loginEmail}
                                    onChange={handleLoginEmailChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password{loginAs === 'student' ? <> (Date Of Birth [30-05-2002])</> : <></>}</label>
                                <br />
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={handleLoginPasswordChange}
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="button" className="back-button">
                                    Go back
                                </button>
                                <button type="submit" className="login-button" disabled={loading}>
                                    {loading ? (
                                        'loading' // Display the loading symbol when loading is true
                                    ) : (
                                        'Enter'
                                    )}
                                </button>
                            </div>
                            {!mobile &&
                                <div className="form-group">
                                    <br></br>
                                    <br></br>
                                    <p id="login-as">
                                        Enter as
                                        {loginAs !== 'student' && <span onClick={() => setLoginAs('student')}> Student /</span>}
                                        {loginAs !== 'hod' && <span onClick={() => setLoginAs('hod')}> HOD /</span>}
                                        {loginAs !== 'advisor' && loginAs !== 'mentor' && <span onClick={() => setLoginAs('advisor')}> Advisor /</span>}
                                        {loginAs === 'mentor' && <span onClick={() => setLoginAs('advisor')}> Advisor </span>}
                                        {loginAs !== 'mentor' && <span onClick={() => setLoginAs('mentor')}> Mentor </span>}
                                    </p>
                                </div>
                            }
                            {mobile &&
                                <div className="form-group">
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    <br></br>

                                </div>
                            }
                        </form>
                        <img src="./uploads/login-page-line.png" alt="menu image" id="login-page-line" />
                    </div>
                    <div><p className='footer-para'>Developer: Venkatagiriraju Udayakumar, IV CSE KIOT.</p></div>

                </div >
            </div >
        </div >
    );
};

export default Home;
