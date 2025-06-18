import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post('http://13.232.220.117:8080/api/auth/login', {
                email,
                password
            });
            
            if (response.data.success) {
                localStorage.setItem('userData', JSON.stringify({
                    email: response.data.email,
                    userKey: response.data.userKey,
                    name: response.data.name || 'User'
                }));
                setIsLoggedIn(true);
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <h2>Welcome Back</h2>
                    <p className="subtitle">Please enter your credentials to login</p>
                    
                    {error && <div className="alert error">{error}</div>}
                    
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                id="email"
                                type="email" 
                                placeholder="Enter your email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                id="password"
                                type="password" 
                                placeholder="Enter your password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Logging in...
                                </>
                            ) : 'Login'}
                        </button>
                    </form>
                    
                    
                </div>
            </div>
        );
    }

    return <Dashboard />;
};

const Dashboard = () => {
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const userData = JSON.parse(localStorage.getItem('userData'));

    const handleLogout = () => {
        localStorage.removeItem('userData');
        window.location.reload();
    };

    const fetchData = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            if (!userData || !userData.userKey) {
                throw new Error('Authentication required. Please login again.');
            }

            if (!linkedinUrl.includes('linkedin.com/in/')) {
                throw new Error('Please enter a valid LinkedIn profile URL');
            }

            const response = await axios.post(
                'http://13.232.220.117:8080/api/data/linkedin',
                {
                    userKey: userData.userKey,
                    linkedinUrl: linkedinUrl
                }
            );
            
            setData(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch data');
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="user-info">
                    <span className="welcome">Welcome, {userData?.name || 'User'}</span>
                    <span className="email">{userData?.email}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </header>
            
            <main className="dashboard-content">
                <div className="search-card">
                    <h2>LinkedIn Profile Lookup</h2>
                    <p>Enter a LinkedIn profile URL to retrieve information</p>
                    
                    <form onSubmit={fetchData} className="search-form">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="https://www.linkedin.com/in/username"
                                value={linkedinUrl}
                                onChange={(e) => setLinkedinUrl(e.target.value)}
                                required
                            />
                            <button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Fetching...
                                    </>
                                ) : 'Fetch Data'}
                            </button>
                        </div>
                    </form>
                    
                    {error && <div className="alert error">{error}</div>}
                </div>
                
                {data && (
                    <div className="profile-card">
                        <div className="profile-header">
                            <h3>Profile Details</h3>
                        </div>
                        
                        <div className="profile-details">
                            <div className="detail-section">
                                <h4>Basic Information</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Name:</span>
                                    <span className="detail-value">{data.personName || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Location:</span>
                                    <span className="detail-value">{data.personLocation || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">LinkedIn ID:</span>
                                    <span className="detail-value">{data.linkedinId || 'N/A'}</span>
                                </div>
                            </div>
                            
                            <div className="detail-section">
                                <h4>Contact Information</h4>
                                <div className="detail-row">
                                    <span className="detail-label">Primary Mobile:</span>
                                    <span className="detail-value">
                                        {data.mobileNumber ? (
                                            <a href={`tel:${data.mobileNumber}`}>{data.mobileNumber}</a>
                                        ) : 'N/A'}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Secondary Mobile:</span>
                                    <span className="detail-value">
                                        {data.mobileNumber2 ? (
                                            <a href={`tel:${data.mobileNumber2}`}>{data.mobileNumber2}</a>
                                        ) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="detail-section">
                                <h4>Profile Actions</h4>
                                <div className="action-buttons">
                                    <a 
                                        href={`https://${linkedinUrl}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="btn linkedin-btn"
                                    >
                                        View LinkedIn Profile
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Login;

// Add this CSS to your stylesheet
const styles = `
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --text-color: #333;
    --text-light: #666;
    --border-color: #ddd;
    --error-color: #f44336;
    --error-bg: #ffebee;
    --success-color: #4caf50;
    --white: #fff;
    --light-bg: #f5f7fa;
    --hover-bg: #eaeef5;
    --linkedin-blue: #0077b5;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--light-bg);
}

/* Login Styles */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    padding: 20px;
}

.login-card {
    background: var(--white);
    border-radius: 10px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    padding: 30px;
    width: 100%;
    max-width: 400px;
    text-align: center;
}

.login-card h2 {
    margin: 0 0 10px;
    color: var(--text-color);
    font-size: 24px;
}

.subtitle {
    color: var(--text-light);
    margin-bottom: 25px;
    font-size: 14px;
}

.form-group {
    margin-bottom: 20px;
    text-align: left;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: var(--text-light);
    font-size: 14px;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    transition: border 0.3s;
}

.form-group input:focus {
    border-color: var(--primary-color);
    outline: none;
}

button {
    width: 100%;
    padding: 12px;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    color: var(--white);
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

button:hover {
    opacity: 0.9;
}

button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.footer-links {
    margin-top: 20px;
    font-size: 13px;
    color: var(--text-light);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.footer-links a {
    color: var(--primary-color);
    text-decoration: none;
}

.alert {
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
    font-size: 14px;
}

.alert.error {
    background-color: var(--error-bg);
    color: var(--error-color);
    border: 1px solid #ffcdd2;
}

.spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: var(--white);
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Dashboard Styles */
.dashboard-container {
    min-height: 100vh;
    background-color: var(--light-bg);
    display: flex;
    flex-direction: column;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: var(--white);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 100;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.welcome {
    font-weight: 600;
    color: var(--text-color);
    font-size: 14px;
}

.email {
    font-size: 12px;
    color: var(--text-light);
}
.logout-btn {
    padding: 8px 15px; /* Adjust padding to make it smaller */
    background: var(--light-bg);
    color: var(--text-light);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    width: fit-content; /* Add this to make the width fit its content */
}

.logout-btn:hover {
    background: var(--hover-bg);
}

.dashboard-content {
    flex: 1;
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 20px;
    width: 100%;
}

.search-card {
    background: var(--white);
    border-radius: 10px;
    padding: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
}

.search-card h2 {
    margin: 0 0 10px;
    color: var(--text-color);
    font-size: 20px;
}

.search-card p {
    color: var(--text-light);
    margin-bottom: 20px;
    font-size: 14px;
}

.input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.input-group input {
    flex: 1;
    padding: 12px 15px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    margin-bottom: 10px;
}

.input-group button {
    width: 100%;
    border-radius: 6px;
}

.profile-card {
    background: var(--white);
    border-radius: 10px;
    padding: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    margin-bottom: 30px;
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
}

.profile-card h3 {
    margin: 0;
    color: var(--text-color);
    font-size: 18px;
}

.profile-details {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.detail-section {
    margin-bottom: 15px;
}

.detail-section h4 {
    margin: 0 0 15px;
    color: var(--text-color);
    font-size: 16px;
}

.detail-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.detail-label {
    font-size: 13px;
    color: var(--text-light);
    margin-bottom: 5px;
}

.detail-value {
    font-weight: 500;
    color: var(--text-color);
    word-break: break-all;
}

.detail-value a {
    color: var(--primary-color);
    text-decoration: none;
}

.detail-value a:hover {
    text-decoration: underline;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;
}

.btn {
    padding: 10px 15px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
    text-align: center;
    border: none;
}

.linkedin-btn {
    background-color: var(--linkedin-blue);
    color: var(--white);
}

.linkedin-btn:hover {
    background-color: #006097;
}

/* Responsive Styles */
@media (min-width: 768px) {
    .login-card {
        padding: 40px;
    }
    
    .dashboard-header {
        padding: 15px 30px;
    }
    
    .dashboard-content {
        margin: 30px auto;
        padding: 0 30px;
    }
    
    .search-card {
        padding: 30px;
    }
    
    .input-group {
        flex-direction: row;
        margin-bottom: 20px;
    }
    
    .input-group input {
        margin-bottom: 0;
        border-radius: 6px 0 0 6px;
    }
    
    .input-group button {
        width: auto;
        border-radius: 0 6px 6px 0;
    }
    
    .profile-details {
        flex-direction: row;
        flex-wrap: wrap;
    }
    
    .detail-section {
        flex: 1 1 300px;
        margin-right: 20px;
    }
    
    .action-buttons {
        flex-direction: row;
    }
    
    .btn {
        padding: 8px 15px;
    }
}

@media (min-width: 992px) {
    .profile-details {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
    
    .detail-section {
        margin-right: 0;
    }
}
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);