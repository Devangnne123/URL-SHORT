import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserM.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    currentCredits: 0,
    creditAddition: 0,
    creditDeduction: 0,
    searchCount_Cost: 2,
    searchCount: 0,
    searchLimit: 10,
    userKey: '',
    key: 1
  });
  
  // New user state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    userKey: '',
    credits: 10,
    searchCount_Cost: 2,
    searchLimit: 10,
    key: 1
  });
  
  // History state
  const [showHistory, setShowHistory] = useState(false);
  const [selectedUserForHistory, setSelectedUserForHistory] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0
  });

  const navigate = useNavigate();

  // Check admin status on component mount
  useEffect(() => {
    const verifyAdminStatus = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          throw new Error('User not authenticated');
        }
        
        if (userData.key !== 23) {
          throw new Error('Admin privileges required');
        }
        
        setIsAdmin(true);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    verifyAdminStatus();
  }, []);

  // Fetch users when admin or pagination changes
  const fetchUsers = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
        params: {
          page: pagination.page,
          size: pagination.size
        },
        headers: {
          'X-User-Email': userData.email,
          'X-User-Key': userData.key
        }
      });
      
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        totalElements: parseInt(response.headers['x-total-count']) || 0
      }));
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch credit history for a user
  const fetchCreditHistory = async (userId) => {
    setHistoryLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/credits/user/${userId}`, {
        headers: {
          'X-User-Email': userData.email,
          'X-User-Key': userData.userKey
        }
      });
      setHistory(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch credit history');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.size, isAdmin]);

  // Form handlers
  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditForm({
      currentCredits: user.credits,
      creditAddition: 0,
      creditDeduction: 0,
      searchCount_Cost: user.searchCount_Cost,
      searchCount: user.searchCount,
      searchLimit: user.searchLimit,
      userKey: user.userKey,
      key: user.key
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = Math.max(0, parseInt(value) || 0);
    
    // Prevent deducting more than current credits
    if (name === 'creditDeduction' && newValue > editForm.currentCredits) {
      newValue = editForm.currentCredits;
    }

    setEditForm(prev => ({
      ...prev,
      [name]: ['creditAddition', 'creditDeduction', 'searchCount_Cost', 
              'searchCount', 'key', 'searchLimit'].includes(name)
        ? newValue
        : value
    }));
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: name === 'credits' || name === 'searchCount_Cost' || 
              name === 'key' || name === 'searchLimit'
        ? Math.max(0, parseInt(value) || 0)
        : value
    }));
  };

  // API interaction handlers
  const handleSave = async (userId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const creditDelta = editForm.creditAddition - editForm.creditDeduction;
      const finalDelta = Math.max(creditDelta, -editForm.currentCredits);
      
      const updateData = {
        credits: finalDelta,
        searchCount_Cost: editForm.searchCount_Cost,
        searchCount: editForm.searchCount,
        searchLimit: editForm.searchLimit,
        userKey: editForm.userKey,
        key: editForm.key,
        adminEmail: userData.email
      };

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`, updateData, {
        headers: {
          'X-User-Email': userData.email,
          'X-User-Key': userData.key
        }
      });
      
      // Update local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            credits: user.credits + creditDelta,
            searchCount_Cost: updateData.searchCount_Cost,
            searchCount: updateData.searchCount,
            searchLimit: updateData.searchLimit,
            userKey: updateData.userKey,
            key: updateData.key
          };
        }
        return user;
      }));
      
      setEditingId(null);
      setError(null);
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleAddUser = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users`, newUser, {
        headers: {
          'X-User-Email': userData.email,
          'X-User-Key': userData.key
        }
      });
      
      setUsers([response.data, ...users]);
      setShowAddForm(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        userKey: '',
        credits: 10,
        searchCount_Cost: 2,
        searchLimit: 10,
        key: 1
      });
      setError(null);
    } catch (error) {
      console.error('Error adding user:', error);
      setError(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`, {
        headers: {
          'X-User-Email': userData.email,
          'X-User-Key': userData.key
        }
      });
      
      setUsers(users.filter(user => user.id !== userId));
      setError(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const viewHistory = async (userId) => {
    setSelectedUserForHistory(userId);
    await fetchCreditHistory(userId);
    setShowHistory(true);
  };

  const handleCancel = () => setEditingId(null);

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewUser({
      name: '',
      email: '',
      password: '',
      userKey: '',
      credits: 10,
      searchCount_Cost: 2,
      searchLimit: 10,
      key: 1
    });
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-xl">
          {error || 'Access Denied. Admin privileges required.'}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '◄' : '►'}
          </button>
        </div>
        
        <div className="sidebar-menu">
          <button 
            onClick={() => navigate('/dashboard')}
            className="sidebar-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="dashboard-main">
        <div className="main-header">
          <h1 className="main-title">User Management</h1>
          <div className="header-actions">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary"
            >
              {showAddForm ? 'Cancel' : 'Add New User'}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        {/* Add User Form */}
        {showAddForm && (
          <div className="card">
            <h2 className="card-title">Add New User</h2>
            <div className="form-grid">
              {[
                { label: 'Name', name: 'name', type: 'text', required: true },
                { label: 'Email', name: 'email', type: 'email', required: true },
                { label: 'Password', name: 'password', type: 'password', required: true },
                { label: 'User Key', name: 'userKey', type: 'text' },
                { label: 'Initial Credits', name: 'credits', type: 'number' },
                { label: 'Search Cost', name: 'searchCount_Cost', type: 'number' },
                { label: 'Search Limit', name: 'searchLimit', type: 'number' },
                { label: 'Admin Key (23 for admin)', name: 'key', type: 'number' }
              ].map((field) => (
                <div key={field.name} className="form-group">
                  <label>
                    {field.label}
                    {field.required && <span className="required">*</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={newUser[field.name]}
                    onChange={handleNewUserChange}
                    required={field.required}
                    min={field.type === 'number' ? '0' : undefined}
                  />
                </div>
              ))}
            </div>
            <div className="form-actions">
              <button
                onClick={handleAddUser}
                className="btn-success"
              >
                Save User
              </button>
              <button
                onClick={handleCancelAdd}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  {['Name', 'Email', 'User Key', 'Admin Key', 'Credits', 'Search Cost', 'Search Count', 'Search Limit', 'Actions'].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.userKey}</td>
                      <td>{user.key}</td>
                      
                      {editingId === user.id ? (
                        <>
                          <td>
                            <div className="credit-management">
                              <div className="current-credits">
                                <span>Current:</span>
                                <strong>{editForm.currentCredits}</strong>
                              </div>
                              <div className="credit-adjustment">
                                <div className="adjustment-group">
                                  <label>Add:</label>
                                  <input
                                    type="number"
                                    name="creditAddition"
                                    value={editForm.creditAddition}
                                    onChange={handleInputChange}
                                    min="0"
                                  />
                                </div>
                                <div className="adjustment-group">
                                  <label>Deduct:</label>
                                  <input
                                    type="number"
                                    name="creditDeduction"
                                    value={editForm.creditDeduction}
                                    onChange={handleInputChange}
                                    min="0"
                                    max={editForm.currentCredits}
                                    disabled={editForm.currentCredits === 0}
                                  />
                                  {editForm.currentCredits === 0 && (
                                    <div className="error-message">Cannot deduct - no credits available</div>
                                  )}
                                </div>
                              </div>
                              <div className="credit-preview">
                                <span>New Total:</span>
                                <strong>
                                  {editForm.currentCredits + editForm.creditAddition - editForm.creditDeduction}
                                </strong>
                              </div>
                            </div>
                          </td>
                          <td>
                            <input
                              type="number"
                              name="searchCount_Cost"
                              value={editForm.searchCount_Cost}
                              onChange={handleInputChange}
                              min="1"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="searchCount"
                              value={editForm.searchCount}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="searchLimit"
                              value={editForm.searchLimit}
                              onChange={handleInputChange}
                              min="0"
                            />
                          </td>
                          <td className="actions">
                            <button
                              onClick={() => handleSave(user.id)}
                              className="btn-success"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{user.credits}</td>
                          <td>{user.searchCount_Cost}</td>
                          <td>{user.searchCount}</td>
                          <td>{user.searchLimit}</td>
                          <td className="actions">
                            <button
                              onClick={() => handleEdit(user)}
                              className="btn-primary"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => viewHistory(user.id)}
                              className="btn-info"
                            >
                              History
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="btn-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalElements > 0 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(Math.max(0, pagination.page - 1))}
                disabled={pagination.page === 0}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page + 1} of {Math.ceil(pagination.totalElements / pagination.size)}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={(pagination.page + 1) * pagination.size >= pagination.totalElements}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Credit History Modal */}
      {showHistory && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Credit History</h3>
              <button onClick={() => setShowHistory(false)}>×</button>
            </div>
            <div className="modal-body">
              {historyLoading ? (
                <div>Loading history...</div>
              ) : (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Action</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record.id}>
                        <td>{new Date(record.timestamp).toLocaleString()}</td>
                        <td className={record.actionType.toLowerCase()}>
                          {record.actionType}
                        </td>
                        <td>{record.amount}</td>
                        <td>{record.description}</td>
                        <td>{record.adminEmail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;