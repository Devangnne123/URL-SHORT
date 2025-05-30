import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { searchId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://65.0.19.161:5000/api/excel/search/${searchId}`
        );
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchId]); // Re-fetch when searchId changes

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!data) return <div>No data found for ID: {searchId}</div>;

  return (
    <div className="dashboard">
      
      <div className="data-container">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Dashboard;