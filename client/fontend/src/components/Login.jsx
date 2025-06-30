import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
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
                localStorage.setItem('userData', JSON.stringify(response.data));
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

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }
        
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post('http://13.203.218.236:8080/api/auth/forgot-password', {
                email
            });
            
            if (response.data.success) {
                setOtpSent(true);
            } else {
                setError(response.data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setIsLoading(true);
        setError('');
        
        try {
            const response = await axios.post('http://13.203.218.236:8080/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            
            if (response.data.success) {
                setPasswordResetSuccess(true);
                setShowForgotPassword(false);
                setOtpSent(false);
            } else {
                setError(response.data.message || 'Password reset failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Password reset failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {!showForgotPassword ? (
                    <>
                        <h2>Welcome Back</h2>
                        <p className="subtitle">Please enter your credentials to login</p>
                        
                        {passwordResetSuccess && (
                            <div className="alert success">Password reset successfully! Please login with your new password.</div>
                        )}
                        
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
                             <br />
                            <p className="forgot-password-link">

                                <button 
                                    type="button" 
                                    className="link-button"
                                    onClick={() => setShowForgotPassword(true)}
                                >
                                    Forgot Password?
                                </button>
                            </p>
                        </form>
                    </>
                ) : (
                    <>
                        <h2>Reset Password</h2>
                        <p className="subtitle">
                            {otpSent 
                                ? 'Enter the OTP sent to your email and your new password' 
                                : 'Enter your email to receive a password reset OTP'}
                        </p>
                        
                        {error && <div className="alert error">{error}</div>}
                        
                        {!otpSent ? (
                            <form onSubmit={handleForgotPassword}>
                                <div className="form-group">
                                    <label htmlFor="forgot-email">Email</label>
                                    <input 
                                        id="forgot-email"
                                        type="email" 
                                        placeholder="Enter your email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <span className="spinner"></span>
                                            Sending OTP...
                                        </>
                                    ) : 'Send OTP'}
                                </button>
                                
                                <p className="back-to-login">
                                    <button 
                                        type="button" 
                                        className="link-button"
                                        onClick={() => {
                                            setShowForgotPassword(false);
                                            setError('');
                                        }}
                                    >
                                        Back to Login
                                    </button>
                                </p>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div className="form-group">
                                    <label htmlFor="otp">OTP</label>
                                    <input 
                                        id="otp"
                                        type="text" 
                                        placeholder="Enter OTP" 
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="new-password">New Password</label>
                                    <input 
                                        id="new-password"
                                        type="password" 
                                        placeholder="Enter new password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                    <input 
                                        id="confirm-password"
                                        type="password" 
                                        placeholder="Confirm new password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <span className="spinner"></span>
                                            Resetting Password...
                                        </>
                                    ) : 'Reset Password'}
                                </button>
                                
                                <p className="back-to-login">
                                    <button 
                                        type="button" 
                                        className="link-button"
                                        onClick={() => {
                                            setShowForgotPassword(false);
                                            setOtpSent(false);
                                            setError('');
                                        }}
                                    >
                                        Back to Login
                                    </button>
                                </p>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;