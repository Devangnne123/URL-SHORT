import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import './UserM.css'; // Make sure to import your dashboard styles

const UserManagement = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    credits: 0,
    searchCount_Cost: 2,
    searchCount: 0,
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
    key: 1
  });
  
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

      const response = await axios.get(`http://13.203.218.236:8080/api/users`, {
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

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.size, isAdmin]);

  // Form handlers
  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditForm({
      credits: user.credits,
      searchCount_Cost: user.searchCount_Cost,
      searchCount: user.searchCount,
      userKey: user.userKey,
      key: user.key
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'credits' || name === 'searchCount_Cost' || name === 'searchCount' || name === 'key'
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: name === 'credits' || name === 'searchCount_Cost' || name === 'key'
        ? parseInt(value) || 0 
        : value
    }));
  };

  // API interaction handlers
  const handleSave = async (userId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      await axios.put(`http://13.203.218.236:8080/api/users/${userId}`, editForm, {
        headers: {
          'X-User-Email': userData.email,
          'X-User-Key': userData.key
        }
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...editForm } : user
      ));
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
      const response = await axios.post('http://13.203.218.236:8080/api/users', newUser, {
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
      await axios.delete(`http://13.203.218.236:8080/api/users/${userId}`, {
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

  // UI helper functions
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
      key: 1
    });
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Render states
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
                { label: 'Credits', name: 'credits', type: 'number' },
                { label: 'Search Cost', name: 'searchCount_Cost', type: 'number' },
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
                  {['Name', 'Email', 'User Key', 'Admin Key', 'Credits', 'Search Cost', 'Search Count', 'Actions'].map((header) => (
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
                            <input
                              type="number"
                              name="credits"
                              value={editForm.credits}
                              onChange={handleInputChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="searchCount_Cost"
                              value={editForm.searchCount_Cost}
                              onChange={handleInputChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="searchCount"
                              value={editForm.searchCount}
                              onChange={handleInputChange}
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
                          <td className="actions">
                            <button
                              onClick={() => handleEdit(user)}
                              className="btn-primary"
                            >
                              Edit
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
                    <td colSpan="8" className="no-data">
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
    </div>
  );
};

export default UserManagement;