import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = ({ fetchUsers, users }) => {
  const [editUser, setEditUser] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete?')) {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    }
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/api/users/${id}`, {
      name: updatedName,
      email: updatedEmail,
    });
    setEditUser(null);
    fetchUsers();
  };

  return (
    <div>
      <h2>User List</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div key={user.id} style={{ marginBottom: '10px' }}>
            {editUser === user.id ? (
              <>
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
                <input
                  type="email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                />
                <button onClick={() => handleUpdate(user.id)}>Save</button>
                <button onClick={() => setEditUser(null)}>Cancel</button>
              </>
            ) : (
              <>
                {user.name} - {user.email}{' '}
                <button onClick={() => {
                  setEditUser(user.id);
                  setUpdatedName(user.name);
                  setUpdatedEmail(user.email);
                }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserList;
