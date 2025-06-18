import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    const fetchData = async (e) => {
        e.preventDefault();
        try {
            // Get userKey from localStorage
            const userData = JSON.parse(localStorage.getItem('userData'));
            console.log('Retrieved userData from localStorage:', userData);
            if (!userData || !userData.userKey) {
                throw new Error('User key not found');
            }

            // Extract the LinkedIn profile path if full URL is entered
            let profilePath = linkedinUrl;
            if (linkedinUrl.includes('linkedin.com/in/')) {
                profilePath = linkedinUrl.split('linkedin.com/in/')[1];
            }

            console.log('Fetching data for LinkedIn profile:', profilePath);

            const response = await axios.post(
                'http://13.232.220.117:8080/api/data/linkedin',
                {
                    userKey: userData.userKey,
                    linkedinUrl: profilePath
                }
            );
            
            console.log('API Response:', response.data);
            
            if (response.data.success && response.data.data) {
                setData(response.data.data);
                setError('');
            } else {
                throw new Error(response.data.message || 'No data found');
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch data');
            setData(null);
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <form onSubmit={fetchData}>
                <input
                    type="text"
                    placeholder="Enter LinkedIn URL (e.g., linkedin.com/in/username)"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    required
                />
                <button type="submit">Fetch Data</button>
            </form>
            
            {error && <p style={{color: 'red'}}>{error}</p>}
            
            {data && (
                <div className="data-container">
                    <h3>Person Details</h3>
                    <p>Name: {data.personName}</p>
                    <p>Mobile: {data.mobileNumber || 'N/A'}</p>
                    <p>Alternative Mobile: {data.mobileNumber2 || 'N/A'}</p>
                    <p>Location: {data.personLocation}</p>
                    <p>LinkedIn URL: {data.linkedinUrl}</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;