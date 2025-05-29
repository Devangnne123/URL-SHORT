import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
// import Dashboard from './components/Dashboard';
import UploadAndSearch from './components/UploadAndSearch';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<UploadAndSearch />} />
        {/* <Route path="/uploadandsearch" element={<UploadAndSearch />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
