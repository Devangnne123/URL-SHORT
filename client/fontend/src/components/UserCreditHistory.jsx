import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import './Dashboard.css';

const UserCreditHistory = () => {
    const { userId } = useParams(); // Get userId from URL params
    const [creditHistory, setCreditHistory] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [userData, setUserData] = useState(() => {
        const storedData = localStorage.getItem('userData');
        return storedData ? JSON.parse(storedData) : {};
    });
    const navigate = useNavigate();

      const fetchCreditHistory = async () => {
        try {
            if (userData?.key === 23) {
                // Admin view - fetch all credit history
                const response = await axios.get(
                    'http://13.203.218.236:8080/api/credits/admin',
                    {
                        headers: {
                            'X-User-Email': userData.email,
                            'X-User-Key': userData.key || userData.userKey
                        }
                    }
                );
                setCreditHistory(response.data);
            } else {
                // Regular user view - fetch only their history
                const response = await axios.get(
                    `http://13.203.218.236:8080/api/credits/user/${userData.id}`, // Use user's ID
                    {
                        headers: {
                            'X-User-Email': userData.email,
                            'X-User-Key': userData.userKey
                        }
                    }
                );
                setUserCreditHistory(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch credit history');
        }
    };

    useEffect(() => {
        if (userData?.email) {
            fetchUserCreditHistory();
        }
    }, [userId, userData?.email, userData?.userKey]);

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-main">
                <div className="main-header">
                    <button onClick={handleBack} className="back-button">
                        &larr; Back
                    </button>
                    <h2>
                        {userData?.key === 23 ? 'User Credit History' : 'Your Credit History'}
                    </h2>
                </div>

                {isLoading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="history-section">
                        <div className="section-header">
                            <h3>Credit Transactions</h3>
                            <button 
                                onClick={fetchUserCreditHistory} 
                                className="refresh-btn"
                                title="Refresh History"
                            >
                                🔄
                            </button>
                        </div>
                        
                        {creditHistory.length > 0 ? (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Action</th>
                                            <th>Amount</th>
                                            {userData?.key === 23 && <th>Admin</th>}
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {creditHistory.map((item, index) => (
                                            <tr key={index}>
                                                <td>{new Date(item.timestamp).toLocaleString()}</td>
                                                <td className={`action-${item.actionType.toLowerCase()}`}>
                                                    {item.actionType}
                                                </td>
                                                <td>{item.amount}</td>
                                                {userData?.key === 23 && (
                                                    <td>{item.adminEmail || 'System'}</td>
                                                )}
                                                <td>{item.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="no-history">
                                <p>No credit history found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCreditHistory;