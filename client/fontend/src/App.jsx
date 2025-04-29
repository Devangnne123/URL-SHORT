import React, { useEffect, useState } from 'react';
import axios from 'axios';

import UploadForm from './components/UploadForm'; // adjust path if needed
import LinksList from './components/LinkList';
import UpdateLinkDetails from './components/UpdateLinkDetails';



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
      
      <UploadForm />
      <h1>LinkedIn Links</h1>
      <LinksList /> 
      <UpdateLinkDetails/>
    </div>
  );
};

export default App;
