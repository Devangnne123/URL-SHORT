import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UploadAndSearch from './components/UploadAndSearch';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<UploadAndSearch />} />
        {/* Updated route to use query parameters instead of URL params */}
        <Route path="/dashboard/*" element={<Dashboard />} />
        
        
      </Routes>
    </Router>
  );
};

export default App;