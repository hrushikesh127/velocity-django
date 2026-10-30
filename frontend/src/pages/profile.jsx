import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Usedata from '../hooks/usedata';
import apiclient from '../utils/apiclient';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import './profile.css';

function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userData, isLoading, isError } = Usedata('myuser/');
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const resetpassword = async () => {
    try {
      setIsResettingPassword(true);
      const email = userData.email;
      await apiclient.post('reset-link/', {email});
      toast.success('Password reset link sent successfully.');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || 'Unable to send the password reset link.');
    } finally {
      setIsResettingPassword(false);
    }
  }

  useEffect(() => {
    if (userData) {
      reset({
        username: userData.username || '',
        email: userData.email || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        location: userData.location || '',
      });
      if (userData.profileimg) {
        setPreviewImage(userData.profileimg);
      }
    }
  }, [userData, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('first_name', data.first_name || '');
      formData.append('last_name', data.last_name || '');
      formData.append('phone', data.phone || '');
      formData.append('location', data.location || '');

      if (selectedImageFile) {
        formData.append('profileimg', selectedImageFile);
      }

      await apiclient.patch('myuser/', formData);
      await queryClient.invalidateQueries({
        queryKey: ['myuser/'],
      });

      toast.success('Profile details updated successfully!');
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Unable to update profile. Please verify your information.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="profile-page">
        <div className="profile-state-loading">
          <div className="luxury-spinner"></div>
          <p>Accessing member profile credentials...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="profile-page">
        <div className="profile-state-error">
          <div className="error-icon">!</div>
          <h2>Unable to Load Profile</h2>
          <p>Please check your connection and ensure you are signed in.</p>
          <button onClick={() => navigate('/')} className="back-btn">
            ← Return to Showroom
          </button>
        </div>
      </main>
    );
  }

  const initialLetter = (userData?.username || userData?.email || 'U').charAt(0).toUpperCase();

  return (
    <main className="profile-page">
      <div className="profile-container">
        {/* Breadcrumb Header */}
        <header className="profile-header">
          <button type="button" onClick={() => navigate(-1)} className="profile-back-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back</span>
          </button>
          <div>
            <span className="profile-eyebrow">CLIENT DOSSIER</span>
            <h1>Account Credentials</h1>
            <p className="profile-description">
              Manage your personal information, concierge contact details, and showroom preferences.
            </p>
          </div>
        </header>

        <section className="profile-card">
          <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
            {/* Avatar & Member Status Header */}
            <div className="profile-hero-banner">
              <div className="profile-avatar-wrapper">
                {previewImage ? (
                  <img src={previewImage} alt="Profile Avatar" className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-fallback">{initialLetter}</div>
                )}
                <label htmlFor="avatar-upload" className="avatar-edit-label" title="Upload new photo">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="avatar-hidden-input"
                  />
                </label>
              </div>

              <div className="profile-hero-info">
                <div className="profile-name-row">
                  <h2>{userData?.username || 'Client'}</h2>
                  {userData?.is_staff && <span className="profile-badge-admin">Admin Privileges</span>}
                </div>
                <p className="profile-email-label">{userData?.email || 'Verified Account'}</p>
                <span className="profile-member-date">
                  Member since {userData?.created_at ? new Date(userData.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '2024'}
                </span>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="profile-fields-grid">
              <div className="form-group">
                <label htmlFor="prof-username">Username *</label>
                <input
                  {...register('username', { required: true })}
                  id="prof-username"
                  type="text"
                  placeholder="Username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="prof-email">Email Address *</label>
                <input
                  {...register('email', { required: true })}
                  id="prof-email"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="prof-first">First Name</label>
                <input
                  {...register('first_name')}
                  id="prof-first"
                  type="text"
                  placeholder="First name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="prof-last">Last Name</label>
                <input
                  {...register('last_name')}
                  id="prof-last"
                  type="text"
                  placeholder="Last name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="prof-phone">Contact Phone</label>
                <input
                  {...register('phone')}
                  id="prof-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="prof-location">City / Location</label>
                <input
                  {...register('location')}
                  id="prof-location"
                  type="text"
                  placeholder="e.g. Los Angeles, CA"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="profile-actions-bar">
              <button
                type="button"
                className="profile-cancel-btn"
                onClick={() => navigate('/')}
              >
                Back to Showroom
              </button>
              <button
                type="submit"
                className="profile-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="btn-loading-wrap">
                    <span className="mini-spinner"></span>
                    Saving Profile...
                  </span>
                ) : (
                  'Update Credentials'
                )}
              </button>
              
            </div>
            
          </form>
          <button
            type="button"
            className="profile-reset-password-btn"
            onClick={resetpassword}
            disabled={isResettingPassword}
            aria-busy={isResettingPassword}
          >
            {isResettingPassword ? (
              <span className="profile-reset-loading" role="status">
                <span className="profile-reset-spinner" aria-hidden="true"></span>
                Sending reset link...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </section>
      </div>
    </main>
  );
}

export default Profile;
