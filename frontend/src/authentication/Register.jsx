import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import './Register.css';
import apiclient, { settoken } from '../utils/apiclient';
import { toast } from 'react-toastify';

function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await apiclient.post('/register/', data).then((res) => res.data);

      if (response.token) {
        localStorage.setItem('velocitytoken', response.token);
        settoken(response.token);
        toast.success('Registration successful! Welcome to Velocity.');
        navigate('/');
      } else {
        toast.success('Registration completed! You can now sign in.');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Registration failed. Please check your information.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-backdrop-glow"></div>
      <section className="register-card">
        {/* Brand Header */}
        <div className="register-brand">
          <span className="register-brand-mark">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.3"/>
            </svg>
          </span>
          <span className="register-brand-name">VELOCITY</span>
        </div>

        <p className="register-eyebrow">EXCLUSIVE MEMBERSHIP</p>
        <h1 className="register-title">Create Client Profile</h1>
        <p className="register-description">
          Register to view confidential pricing, request private viewings, and reserve prestigious automobiles.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="input-group">
            <label htmlFor="reg-username">Username *</label>
            <input
              {...register('username', { required: true })}
              id="reg-username"
              type="text"
              placeholder="e.g. alexander_v"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-email">Email Address *</label>
            <input
              {...register('email', { required: true })}
              id="reg-email"
              type="email"
              placeholder="alex@domain.com"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-first-name">First Name</label>
            <input
              {...register('first_name')}
              id="reg-first-name"
              type="text"
              placeholder="First name"
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-last-name">Last Name</label>
            <input
              {...register('last_name')}
              id="reg-last-name"
              type="text"
              placeholder="Last name"
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-phone">Contact Phone</label>
            <input
              {...register('phone')}
              id="reg-phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-location">City / Location</label>
            <input
              {...register('location')}
              id="reg-location"
              type="text"
              placeholder="e.g. Los Angeles, CA"
            />
          </div>

          <div className="input-group span-full">
            <label htmlFor="reg-password">Security Password *</label>
            <div className="password-input-wrap">
              <input
                {...register('password', { required: true })}
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
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

          <button type="submit" className="register-submit-btn span-full" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-loading-wrap">
                <span className="mini-spinner"></span>
                Creating Profile...
              </span>
            ) : (
              <>
                <span>Complete Registration</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Switch link */}
        <div className="register-switch-prompt">
          <span>Already have a client account?</span>
          <NavLink to="/login" className="switch-link">
            Sign In
          </NavLink>
        </div>
      </section>
    </main>
  );
}

export default Register;
