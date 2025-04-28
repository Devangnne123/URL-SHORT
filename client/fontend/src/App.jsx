import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import UploadForm from './components/UploadForm'; // adjust path if needed
import LinksList from './components/LinkList';


const App = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple CRUD with Node + PostgreSQL</h1>
      <UserForm fetchUsers={fetchUsers} />
      <UserList fetchUsers={fetchUsers} users={users} />
      <UploadForm />
      <h1>LinkedIn Links</h1>
      <LinksList />
    </div>
  );
};

export default App;
