// components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const verifyKey = async () => {
      const storedKey = localStorage.getItem('authKey');
      if (!storedKey) {
        setIsAuthorized(false);
        return;
      }

      try {
        const response = await axios.get('http://13.232.220.117:8080/users');
        const springUsers = response.data;
        const match = springUsers.some(user => user.name === storedKey);
        setIsAuthorized(match);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthorized(false);
      }
    };

    verifyKey();
  }, []);

  if (isAuthorized === null) {
    return <div>Checking authorization...</div>; // or a loader
  }

  return isAuthorized ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
