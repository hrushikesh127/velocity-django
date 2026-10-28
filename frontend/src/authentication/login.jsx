import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import apiclient, { settoken } from '../utils/apiclient';
import { toast } from 'react-toastify';
import './login.css';

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await apiclient.post('/login/', data).then((res) => res.data);

      if (response.token) {
        localStorage.setItem('velocitytoken', response.token);
        settoken(response.token);
        toast.success('Welcome back to Velocity!');
        navigate('/');
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Invalid username or password.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-backdrop-glow"></div>
      <section className="login-card">
        {/* Brand Header */}
        <div className="login-brand">
          <span className="login-brand-mark">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.3"/>
            </svg>
          </span>
          <span className="login-brand-name">VELOCITY</span>
        </div>

        <p className="login-eyebrow">CLIENT ACCESS PORTAL</p>
        <h1 className="login-title">Sign in to your account</h1>
        <p className="login-description">
          Enter your credentials to access your saved vehicles, inquiries, and VIP showroom concierge.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="input-group">
            <label htmlFor="login-username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input
                {...register('username', { required: true })}
                id="login-username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="label-with-action">
              <label htmlFor="login-password">Password</label>
            </div>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                {...register('password', { required: true })}
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-loading-wrap">
                <span className="mini-spinner"></span>
                Authenticating...
              </span>
            ) : (
              <>
                <span>Sign in to Showroom</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Switch link */}
        <div className="login-switch-prompt">
          <span>New to Velocity?</span>
          <NavLink to="/register" className="switch-link">
            Create an Account
          </NavLink>
        </div>
      </section>
    </main>
  );
}

export default Login;
