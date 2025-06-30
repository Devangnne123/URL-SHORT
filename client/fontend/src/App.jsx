import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';

function App() {
    
    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="/UserM" element={<UserManagement />} />
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default App;