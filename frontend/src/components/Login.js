import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './CSS/Login.css';

const Login = () => {
const [loginEmail, setLoginEmail] = useState('');
const [loginPassword, setLoginPassword] = useState('');
const [loginError, setLoginError] = useState('');
const [loginSuccess, setLoginSuccess] = useState(false);
    
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
    const response = await axios.post(`${serverURL}/api/login`, {
        email: loginEmail,
        password: loginPassword,
    });

    // Assuming the server responds with a success message upon successful login
    const message = response.data.message;

    // Store the logged-in user's email in localStorage
    localStorage.setItem('loggedInEmail', loginEmail);

    // Show success message
    setLoginSuccess(true);

    // Redirect to the appropriate page based on user type
    // Example: navigate('/dashboard') or navigate('/profile')
    navigate('/Profile');
    } catch (error) {
    setLoginError('Invalid email or password. Please try again.');
    }
};

const handleGoBack = () => {
    navigate('/'); // Redirect to the home page
};


return (
    <div className='login-page-container'>
    <div className="login-container">
        <h2>Student Login</h2>
        {loginError && <p className="login-error">{loginError}</p>}
        {loginSuccess && <p className="login-success">Login successful!</p>}
        <form onSubmit={handleLogin}>
        <div className="form-group">
            <label>Email:</label>
            <input type="email" value={loginEmail} onChange={handleLoginEmailChange} required />
        </div>
        <div className="form-group">
            <label>Password:</label>
            <input type="password" value={loginPassword} onChange={handleLoginPasswordChange} required />
        </div>
        <div className="form-buttons">
        <button type="submit" className="login-button">Login</button>
            <button onClick={handleGoBack} className="back-button">Go Back</button>
            
        </div>
        </form>
    </div>
    </div>
);
};

export default Login;
