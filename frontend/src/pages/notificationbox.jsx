import React from 'react';
import Usedata from '../hooks/usedata';
import apiclient from '../utils/apiclient';
import { useQueryClient } from '@tanstack/react-query';
import './notificationbox.css';

function Notificationbox({ setshownotify }) {
  const { data: notifications, isLoading, isError } = Usedata('bookings/notifications/');
  const queryclient = useQueryClient();

  const markasread = async (id) => {
    try {
      await apiclient.patch(`bookings/notifications/${id}/read/`);
      queryclient.invalidateQueries({
        queryKey: ['/cars', 'bookings/notifications/'],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const markrealall = async () => {
    try {
      await apiclient.patch('bookings/notifications/readall/');
      queryclient.invalidateQueries({
        queryKey: ['/cars', 'bookings/notifications/'],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const hasUnread = notifications?.some((msg) => !msg.is_read);

  return (
    <div className="notifications-backdrop" onClick={() => setshownotify(false)}>
      <aside
        className="notifications-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="notifications-header">
          <div className="header-titles">
            <span className="notifications-eyebrow">ACTIVITY UPDATES</span>
            <h2 id="notifications-title">Notifications</h2>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="notifications-read-all"
              onClick={markrealall}
              disabled={!hasUnread}
            >
              Mark all read
            </button>
            <button
              type="button"
              className="notifications-close"
              onClick={() => setshownotify(false)}
              aria-label="Close notifications"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="notifications-body">
          {isLoading ? (
            <div className="notifications-state">
              <div className="loading-spinner"></div>
              <p>Fetching notifications...</p>
            </div>
          ) : isError ? (
            <div className="notifications-state error">
              <p>Unable to load notifications.</p>
            </div>
          ) : notifications?.length ? (
            <div className="notification-list">
              {notifications.map((msg) => (
                <article
                  key={msg.id}
                  className={`notification-card ${msg.is_read ? 'is-read' : 'is-unread'}`}
                >
                  <div className="notification-top">
                    <span className="notification-dot" />
                    <time className="notification-date" dateTime={msg.created_at}>
                      {new Date(msg.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>

                  <p className="notification-message">{msg.message}</p>

                  {!msg.is_read && (
                    <div className="notification-card-footer">
                      <button
                        type="button"
                        className="notification-read-button"
                        onClick={() => markasread(msg.id)}
                      >
                        Mark as read
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="notifications-state empty">
              <span className="empty-bell-icon">
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </span>
              <h3>All caught up</h3>
              <p>No new notifications at this time.</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default Notificationbox;
