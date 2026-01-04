import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AuthService from '../services/authService';
import './Auth.css'; // Re-use existing auth styles

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await AuthService.forgotPassword(data.email);
            setIsOtpSent(true);
            toast.success('Password reset OTP sent to your email!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="text-center">Forgot Password</h2>
                <p className="text-center text-muted">
                    Enter your email address and we'll send you an OTP to reset your password.
                </p>

                {!isOtpSent ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                        <div className="input-group">
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                type="email"
                                placeholder="Email Address"
                                className="input-field"
                            />
                            {errors.email && <span className="error-text">{errors.email.message}</span>}
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center mt-4">
                        <div className="success-icon mb-3">✉️</div>
                        <p>Check your email for the OTP code.</p>
                        <p>Once received, go to the Profile page or use the link in the email to reset your password.</p>
                        {/* 
                           Note: The current backend flow sends an OTP. 
                           The user usually needs a place to INPUT that OTP to reset the password.
                           The current `Profile.js` handles reset, but we might need a dedicated public reset page 
                           if the user can't log in. 
                           For now, the plan specifically asked for the "OTP generation" part. 
                           The user can't access Profile if they forgot their password.
                        */}
                        <Link to="/login" className="btn btn-primary w-100">Back to Login</Link>
                    </div>
                )}

                <div className="auth-footer-text mt-3">
                    <Link to="/login" className="link-primary">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
