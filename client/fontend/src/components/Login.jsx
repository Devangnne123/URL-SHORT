import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post('http://13.203.218.236:8080/api/auth/login', {
                email,
                password
            });
            
            if (response.data.success) {
                localStorage.setItem('userData', JSON.stringify({
                    email: response.data.email,
                    userKey: response.data.userKey,
                    name: response.data.name || 'User',
                    searchCount: response.data.searchCount || 0 ,
                    searchLimit: response.data.searchLimit || 0 ,
                    credits: response.data.credits
                    
                    
                }));
                navigate('/dashboard');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="subtitle">Please enter your credentials to login</p>
                
                {error && <div className="alert error">{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            id="email"
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            id="password"
                            type="password" 
                            placeholder="Enter your password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Logging in...
                            </>
                        ) : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;