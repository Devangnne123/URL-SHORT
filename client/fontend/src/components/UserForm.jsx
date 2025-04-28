import React, { useState } from 'react';
import axios from 'axios';

const UserForm = ({ fetchUsers }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return alert('Fill all fields');
    try {
      await axios.post('http://localhost:5000/api/users', { name, email });
      setName('');
      setEmail('');
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />{' '}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />{' '}
      <button type="submit">Add User</button>
    </form>
  );
};

export default UserForm;
