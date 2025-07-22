import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import "./Dashboard.css";

const Dashboard = () => {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingKey, setIsRefreshingKey] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [creditHistory, setCreditHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiDocs, setShowApiDocs] = useState(false);
  const [showCreditHistory, setShowCreditHistory] = useState(false);
  const [userCreditHistory, setUserCreditHistory] = useState([]); // Add this line

  const [userData, setUserData] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData) : {};
  });
  const navigate = useNavigate();

  const fetchSearchHistory = async () => {
    try {
      if (!userData || !userData.userKey) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await axios.get(
        "http://13.203.218.236:8080/api/user/history",
        {
          params: {
            userKey: userData.userKey,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch history");
      }

      setSearchHistory(response.data.history);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch history"
      );
    }
  };

  const fetchCreditHistory = async () => {
    try {
      if (userData?.key === 23) {
        // Admin view - fetch all credit history
        const response = await axios.get(
          "http://13.203.218.236:8080/api/credits/admin",
          {
            headers: {
              "X-User-Email": userData.email,
              "X-User-Key": userData.key || userData.userKey,
            },
          }
        );
        setCreditHistory(response.data);
      } else {
        // Regular user view - fetch only their history
        const response = await axios.get(
          `http://13.203.218.236:8080/api/credits/user/${userData.id}`, // Use user's ID
          {
            headers: {
              "X-User-Email": userData.email,
              "X-User-Key": userData.userKey,
            },
          }
        );
        setUserCreditHistory(response.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch credit history"
      );
    }
  };

  useEffect(() => {
    if (userData?.userKey) {
      fetchSearchHistory();
      if (showCreditHistory) {
        fetchCreditHistory();
      }
    }
  }, [userData?.userKey, showCreditHistory]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  const refreshUserKey = async () => {
    setIsRefreshingKey(true);
    setError("");

    try {
      const response = await axios.post(
        "http://13.203.218.236:8080/api/user/refresh-key",
        {
          email: userData.email,
          currentKey: userData.userKey,
        }
      );

      const updatedUserData = {
        ...userData,
        userKey: response.data.newKey,
      };

      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to refresh key"
      );
    } finally {
      setIsRefreshingKey(false);
    }
  };

  const fetchData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://13.203.218.236:8080/api/data/linkedin",
        {
          userKey: userData.userKey,
          linkedinUrl: linkedinUrl,
        }
      );

      if (
        response.data.success === false &&
        response.data.message === "Search limit reached"
      ) {
        setError(
          `You've reached your search limit of ${response.data.searchLimit}`
        );
        setData(null);
        return;
      }

      setData(response.data.data);

      const updatedUserData = {
        ...userData,
        searchCount: response.data.searchCount,
        searchLimit: response.data.searchLimit,
        credits: response.data.credits,
      };
      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      await fetchSearchHistory();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch data"
      );
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`dashboard-container ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="user-info-section">
          <div className="info-group">
            <label>Email</label>
            <div className="info-value">{userData?.email || "N/A"}</div>
          </div>

          <div className="info-group">
            <label>Username</label>
            <div className="info-value">{userData?.name || "User"}</div>
          </div>

          <div className="info-group">
            <label>API Key</label>
            <div className="api-key-container">
              <div className="api-key-value">
                {showApiKey ? (
                  <>
                    <span>{userData?.userKey || "N/A"}</span>
                    <button
                      onClick={refreshUserKey}
                      disabled={isRefreshingKey}
                      className="refresh-key-btn"
                      title="Refresh Key"
                    >
                      {isRefreshingKey ? "🔄" : "🔄"}
                    </button>
                  </>
                ) : (
                  <span className="key-hidden">••••••••••••</span>
                )}
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="toggle-key-btn"
                  title={showApiKey ? "Hide Key" : "Show Key"}
                >
                  {showApiKey ? <IoMdEye /> : <IoMdEyeOff />}
                </button>
              </div>
              <button
                onClick={() => setShowApiDocs(!showApiDocs)}
                className="api-docs-btn"
              >
                {showApiDocs ? "Hide API Docs" : "How to Use API"}
              </button>
              <br />
              <button
                onClick={() => {
                  setShowApiDocs(false);
                  setShowCreditHistory(false);
                  fetchSearchHistory(); // Refresh data when opening
                }}
                className="api-docs-btn"
              >
                Search History
              </button>
              <br />
              <button
                onClick={() => {
                  setShowCreditHistory(!showCreditHistory);
                  if (!showCreditHistory) {
                    fetchCreditHistory();
                  }
                }}
                className="api-docs-btn"
              >
                {showCreditHistory
                  ? "Hide Credit History"
                  : "Show Credit History"}
              </button>
            </div>
          </div>

          {/* <div className="info-group">
                        <label>Searches</label>
                        <div className="info-value">
                            {userData?.searchCount || 0} / {userData?.searchLimit || 0}
                        </div>
                    </div> */}
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
        {userData?.key === 23 && (
          <button onClick={() => navigate("/UserM")} className="admin-btn">
            User Management
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="main-header">
          <div className="credits-display">
            Credits: <strong>{userData?.credits || 0}</strong>
          </div>
        </div>

        {showApiDocs ? (
          <div className="api-documentation-main">
            {/* API Documentation content */}
            <h2>API Documentation</h2>
            <div className="docs-section">
              <h3>Endpoint</h3>
              <code>POST http://13.203.218.236:8080/api/data/linkedin</code>
              <p className="description">
                Retrieve LinkedIn profile data by providing a valid LinkedIn
                profile URL and your API key.
              </p>
            </div>
            <div className="docs-section">
              <h3>Authentication</h3>
              <p className="description">
                Include your API key in the request body:
              </p>
              <pre>{`{
  "userKey": "your_api_key_here",  // Required
  "linkedinUrl": "https://www.linkedin.com/in/username"  // Required
}`}</pre>

              <div className="docs-section">
                <h3>Request Parameters</h3>
                <table className="params-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>userKey</td>
                      <td>String</td>
                      <td>Yes</td>
                      <td>Your unique API key for authentication</td>
                    </tr>
                    <tr>
                      <td>linkedinUrl</td>
                      <td>String (URL)</td>
                      <td>Yes</td>
                      <td>
                        Valid LinkedIn profile URL (must contain
                        'linkedin.com/in/')
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="docs-section">
                <h3>Example Requests</h3>

                <h4>cURL</h4>
                <pre>{`curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "userKey": "${userData?.userKey || "your_api_key_here"}",
    "linkedinUrl": "https://www.linkedin.com/in/example"
  }' \\
  http://13.203.218.236:8080/api/data/linkedin`}</pre>

                <h4>JavaScript (fetch)</h4>
                <pre>{`fetch('http://13.203.218.236:8080/api/data/linkedin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userKey: '${userData?.userKey || "your_api_key_here"}',
    linkedinUrl: 'https://www.linkedin.com/in/example'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}</pre>

                <h4>Python (requests)</h4>
                <pre>{`import requests

url = "http://13.203.218.236:8080/api/data/linkedin"
payload = {
    "userKey": "${userData?.userKey || "your_api_key_here"}",
    "linkedinUrl": "https://www.linkedin.com/in/example"
}

response = requests.post(url, json=payload)
print(response.json())`}</pre>
              </div>
            </div>{" "}
          </div>
        ) : showCreditHistory ? (
          <div className="history-section">
            <div className="section-header">
              <h3>
                {userData?.key === 23
                  ? "All Credit History"
                  : "Your Credit History"}
              </h3>
              <button
                onClick={fetchCreditHistory}
                className="refresh-btn"
                title="Refresh History"
              >
                🔄
              </button>
            </div>

            {(userData?.key === 23 ? creditHistory : userCreditHistory).length >
            0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Action</th>
                      <th>Amount</th>
                      {userData?.key === 23 && <th>User</th>}
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(userData?.key === 23
                      ? creditHistory
                      : userCreditHistory
                    ).map((item, index) => (
                      <tr key={index}>
                        <td>{new Date(item.timestamp).toLocaleString()}</td>
                        <td
                          className={`action-${item.actionType.toLowerCase()}`}
                        >
                          {item.actionType}
                        </td>
                        <td>{item.amount}</td>
                        {userData?.key === 23 && (
                          <td>
                            {item.user?.email || item.adminEmail || "System"}
                          </td>
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
        ) : (
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
                          <a
                            href={item.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.linkedinUrl.length > 30
                              ? `${item.linkedinUrl.substring(0, 30)}...`
                              : item.linkedinUrl}
                          </a>
                        </td>
                        <td>{item.creditsDeducted}</td>
                        <td>{item.remainingCredits}</td>
                        <td>
                          {item.searchCount}/{item.searchLimit}
                        </td>
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
