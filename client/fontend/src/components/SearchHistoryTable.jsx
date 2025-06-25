import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchHistoryTable = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://13.232.220.117:8080/api/history');
        setHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search history:', error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div>Loading history...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Search History</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>LinkedIn URL</th>
              <th>Credits Used</th>
              <th>Remaining Credits</th>
              <th>Search Count</th>
              <th>Search Limit</th>
              <th>Search Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.user?.username || 'N/A'}</td>
                <td>
                  <a href={item.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    {item.linkedinUrl}
                  </a>
                </td>
                <td>{item.creditsDeducted}</td>
                <td>{item.remainingCredits}</td>
                <td>{item.searchCount}</td>
                <td>{item.searchLimit}</td>
                <td>{new Date(item.searchDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchHistoryTable;