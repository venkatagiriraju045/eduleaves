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
    const [loading, setLoading] = useState(false);
    const [mentorLogin, setMentorLogin] = useState(null); // Add mentor login state
    const [staff, setStaff] = useState(null);


    const serverURL = `https://eduleaves-api.vercel.app`;

    const navigate = useNavigate();

    const handleLoginEmailChange = (e) => {
        setLoginEmail(e.target.value);
    };

    const handleLoginPasswordChange = (e) => {
        setLoginPassword(e.target.value);
    };




    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:3000/api/login`, {
                email: loginEmail,
                password: loginPassword,
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
    };


    // Define a function to fetch admin data
    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/students?email=${loginEmail}`);
                const staffData = response.data;
                setStaff(staffData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                setLoading(false);
            }
        }
        fetchStaffData();
    });
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

        e.preventDefault();
        setLoading(true); // Set loading to true when the submit button is clicked

        try {
            console.log(loginEmail);
            console.log(loginPassword);
            console.log(staff);
            const response = await axios.post(`http://localhost:3000/api/admin-login`, {
                email: loginEmail,
                password: loginPassword,
            });
            if (response.data.success) {
                if (staff) {
                    if ((loginEmail !== 'admin@kiot') && (loginEmail !== 'admin@psg') && (loginEmail !== 'admin@mhs')) {
                        if (staff.role === 'hod') {
                            navigate('/DepartmentMenu', { state: { instituteName: staff.institute_name, departmentShortName: staff.department } });
                        } else if (staff.role === 'advisor') {
                            console.log(staff.institute_name);
                            console.log(staff.department);

                            console.log(staff.year);
                            console.log(staff.section);

                            navigate('/AdvisorMenu', { state: { instituteName: staff.institute_name, departmentName: staff.department, year: staff.year, section:staff.section} });
                        } else if (staff.role === 'mentor') {
                            navigate('/MentorMenu', { state: { instituteName: staff.institute_name, departmentShortName: staff.department } });
                        }
                    } else {
                        navigate('/admin-home', { state: { email: loginEmail, instituteName: staff.institute_name } });
                    }
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
                            {loginAs === 'student' ? 'Student Gate' : loginAs === 'admin' ? 'Admin Gate' : loginAs === 'hod' ? 'HOD Gate' : 'Mentor Gate'}
                        </h2>
                        {loginError && <p className="login-error">{loginError}</p>}
                        {loginSuccess && <p className="login-success">Login successful!</p>}
                        <form onSubmit={loginAs === 'student' ? handleLogin : handleSubmit}>
                            <div className="form-group">
                                <label>Gate Address</label>
                                <br />
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={handleLoginEmailChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
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
                                        <div className="loading-symbol"></div> // Display the loading symbol when loading is true
                                    ) : (
                                        'Enter'
                                    )}
                                </button>
                            </div>
                            <div className="form-group">
                                <br></br>
                                <br></br>
                                <p id="login-as">
                                    Enter as
                                    {loginAs !== 'student' && <span onClick={() => setLoginAs('student')}> Student /</span>}
                                    {loginAs !== 'hod' && <span onClick={() => setLoginAs('hod')}> HOD /</span>}
                                    {loginAs !== 'admin' && loginAs !== 'mentor' && <span onClick={() => setLoginAs('admin')}> Advisor /</span>}
                                    {loginAs === 'mentor' && <span onClick={() => setLoginAs('admin')}> Advisor </span>}
                                    {loginAs !== 'mentor' && <span onClick={() => setLoginAs('mentor')}> Mentor </span>}
                                </p>



                            </div>

                        </form>
                        <img src="./uploads/login-page-line.png" alt="menu image" id="login-page-line" />

                    </div>
                    <footer id="home-page-footer">
                        &copy; The Students Gate. All rights reserved.
                        Venkatagiriraju Udayakumar, B.E.CSE.,
                    </footer>

                </div >
            </div >
        </div >
    );
};

export default Home;
