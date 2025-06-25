import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshingKey, setIsRefreshingKey] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const [userData, setUserData] = useState(() => {
        const storedData = localStorage.getItem('userData');
        return storedData ? JSON.parse(storedData) : {};
    });
    const navigate = useNavigate();

    const fetchSearchHistory = async () => {
        try {
            if (!userData || !userData.userKey) {
                throw new Error('Authentication required. Please login again.');
            }

            const response = await axios.get(
                'http://3.109.203.132:8080/api/user/history',
                {
                    params: {
                        userKey: userData.userKey
                    }
                }
            );
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch history');
            }
            
            setSearchHistory(response.data.history);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch history');
        }
    };

    useEffect(() => {
        if (userData?.userKey) {
            fetchSearchHistory();
        }
    }, [userData?.userKey]);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        navigate('/');
    };

    const refreshUserKey = async () => {
        setIsRefreshingKey(true);
        setError('');
        
        try {
            if (!userData || !userData.email || !userData.userKey) {
                throw new Error('User data not found. Please login again.');
            }

            const response = await axios.post(
                'http://3.109.203.132:8080/api/user/refresh-key',
                {
                    email: userData.email,
                    currentKey: userData.userKey
                }
            );
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to refresh key');
            }
            
            const updatedUserData = {
                ...userData,
                userKey: response.data.newKey
            };
            
            setUserData(updatedUserData);
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to refresh key');
        } finally {
            setIsRefreshingKey(false);
        }
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
                'http://3.109.203.132:8080/api/data/linkedin',
                {
                    userKey: userData.userKey,
                    linkedinUrl: linkedinUrl
                }
            );
            
            if (response.data.success === false && response.data.message === "Search limit reached") {
                setError(`You've reached your search limit of ${response.data.searchLimit}`);
                setData(null);
                return;
            }
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch data');
            }
            
            setData(response.data.data);
            
            const updatedUserData = {
                ...userData,
                searchCount: response.data.searchCount,
                searchLimit: response.data.searchLimit,
                credits: response.data.credits
            };
            setUserData(updatedUserData);
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            
            await fetchSearchHistory();
            
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch data');
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            {/* Sidebar */}
            <div className="dashboard-sidebar">
                {/* <div className="sidebar-header">
                    <h3>User Dashboard</h3>
                    <button 
                        className="sidebar-toggle" 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? '◀' : '▶'}
                    </button>
                </div> */}
                
                <div className="user-info-section">
                    <div className="info-group">
                        <label>Email</label>
                        <div className="info-value">{userData?.email || 'N/A'}</div>
                    </div>
                    
                    <div className="info-group">
                        <label>Username</label>
                        <div className="info-value">{userData?.name || 'User'}</div>
                    </div>
                    
                    <div className="info-group">
                        <label>User Key</label>
                        <div className="info-value key-value">
                            <span>{userData?.userKey || 'N/A'}</span>
                            <button 
                                onClick={refreshUserKey} 
                                disabled={isRefreshingKey}
                                className="refresh-key-btn"
                                title="Refresh Key"
                            >
                                {isRefreshingKey ? '🔄' : '🔄'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="info-group">
                        <label>Searches</label>
                        <div className="info-value">
                            {userData?.searchCount || 0} / {userData?.searchLimit || 0}
                        </div>
                    </div>
                </div>
                
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
            
            {/* Main Content */}
            <div className="dashboard-main">
                <div className="main-header">
                    <div className="credits-display">
                        Credits: <strong>{userData?.credits || 0}</strong>
                    </div>
                </div>
                
                {/* <div className="search-section">
                    <h2>LinkedIn Profile Lookup</h2>
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
                </div> */}
                
                <div className="history-section">
                    <div className="section-header">
                        <h3>Search History</h3>
                        <button 
                            onClick={fetchSearchHistory} 
                            className="refresh-btn"
                            title="Refresh History"
                        >
                            🔄
                        </button>
                    </div>
                    
                    {searchHistory.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>LinkedIn URL</th>
                                        <th>Credits Used</th>
                                        <th>Remaining Credits</th>
                                        <th>Searches</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchHistory.map((item, index) => (
                                        <tr key={index}>
                                            <td>{new Date(item.searchDate).toLocaleString()}</td>
                                            <td className="url-cell">
                                                <a href={item.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                                    {item.linkedinUrl.length > 30 
                                                        ? `${item.linkedinUrl.substring(0, 30)}...` 
                                                        : item.linkedinUrl}
                                                </a>
                                            </td>
                                            <td>{item.creditsDeducted}</td>
                                            <td>{item.remainingCredits}</td>
                                            <td>{item.searchCount}/{item.searchLimit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="no-history">
                            <p>No search history found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;