import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const overlayClass = `loading-overlay${loading ? ' visible' : ''}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://eduleaves-api.vercel.app/api/admin-login', {
        email,
        password,
      });
      if (response.data.success) {
        if (email !== 'a@k') {
          navigate('/DepartmentMenu', { state: { email } });
        } else {
          navigate('/admin-home', { state: { email } });
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error authenticating admin:', error);
      setError('An error occurred while authenticating admin');
    }
    setLoading(false);
  };

  const handleGoBack = () => {
    navigate('/');
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
      <div className='login-page-container'>
        <div className="login-container">
          <h2>Admin Login</h2>
          {error && <p className="login-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Logging In...' : 'Log In'}
              </button>
              <button onClick={handleGoBack} className="back-button">Go Back</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
