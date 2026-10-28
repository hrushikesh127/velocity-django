import React, { useState, useMemo } from 'react';
import Usedata from '../hooks/usedata';
import './adminrequests.css';
import { toast } from 'react-toastify';
import apiclient from '../utils/apiclient';
import { useQueryClient } from '@tanstack/react-query';

function formatRequestDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
}

function Adminrequests() {
  const { data: requests, isLoading, isError } = Usedata('bookings/');
  const queryclient = useQueryClient();
  const [processingId, setProcessingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const updateRequestStatus = async (id, status) => {
    try {
      setProcessingId(id);
      await apiclient.patch(`/bookings/${id}/status/`, { status });
      queryclient.invalidateQueries({
        queryKey: ['/cars', 'bookings/'],
      });
      toast.success(
        status === 'approved'
          ? 'Booking request approved successfully!'
          : 'Booking request declined.'
      );
    } catch (error) {
      console.error(error);
      toast.error('Unable to update request status. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = useMemo(() => {
    if (!Array.isArray(requests)) return [];
    if (statusFilter === 'all') return requests;
    return requests.filter(
      (r) => (r.status?.toLowerCase() || 'pending') === statusFilter
    );
  }, [requests, statusFilter]);

  const pendingCount = requests?.filter((r) => (r.status?.toLowerCase() || 'pending') === 'pending')?.length || 0;
  const approvedCount = requests?.filter((r) => r.status?.toLowerCase() === 'approved')?.length || 0;
  const declinedCount = requests?.filter((r) => r.status?.toLowerCase() === 'declined')?.length || 0;

  const formatPrice = (val) => {
    if (!val) return '₹—';
    const clean = String(val).replace(/[$₹,\s]/g, '');
    const num = Number(clean);
    return !isNaN(num) ? `₹${num.toLocaleString('en-IN')}` : (String(val).startsWith('₹') ? val : `₹${val}`);
  };

  return (
    <main className="admin-requests-page">
      <section className="requests">
        {/* Header */}
        <header className="requests-header">
          <div>
            <span className="requests-eyebrow">CONCIERGE OPERATIONS</span>
            <h1>Client Booking Requests</h1>
            <p className="requests-description">
              Review, approve, or manage VIP purchase requests and vehicle inquiries.
            </p>
          </div>
          <span className="requests-count-badge">{requests?.length ?? 0} total enquiries</span>
        </header>

        {/* Filter Tabs */}
        <div className="requests-tabs-row">
          <button
            type="button"
            className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Requests ({requests?.length || 0})
          </button>
          <button
            type="button"
            className={`tab-btn pending ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending Action ({pendingCount})
          </button>
          <button
            type="button"
            className={`tab-btn approved ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved ({approvedCount})
          </button>
          <button
            type="button"
            className={`tab-btn declined ${statusFilter === 'declined' ? 'active' : ''}`}
            onClick={() => setStatusFilter('declined')}
          >
            Declined ({declinedCount})
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="requests-state">
            <div className="luxury-spinner"></div>
            <p>Accessing customer concierge queue...</p>
          </div>
        ) : isError ? (
          <div className="requests-state requests-state-error">
            <p>Unable to connect to booking database. Please reload.</p>
          </div>
        ) : filteredRequests.length ? (
          <div className="requests-grid">
            {filteredRequests.map((request, index) => {
              const car = request.carfields;
              const status = request.status?.toLowerCase() || 'pending';
              const isProcessing = processingId === request.id;

              return (
                <article className="request-card" key={request.id ?? index}>
                  {/* Card Header */}
                  <header className="request-card-header">
                    <div>
                      <span className="request-type-tag">{request.Actions || 'Booking Request'}</span>
                      <h2 className="customer-name">{request.customername || 'VIP Client'}</h2>
                    </div>
                    <span className={`request-status-pill ${status}`}>
                      <span className="status-dot"></span>
                      {request.status || 'Pending'}
                    </span>
                  </header>

                  {/* Customer Details */}
                  <div className="request-section customer-details">
                    <h3 className="section-label">Client Information</h3>
                    <div className="client-data-grid">
                      <div className="data-row">
                        <span className="data-label">Email</span>
                        <a
                          href={`mailto:${request.customeremail}`}
                          className="data-val email-link"
                          title="Send Email"
                        >
                          {request.customeremail || 'Not provided'}
                        </a>
                      </div>
                      <div className="data-row">
                        <span className="data-label">Phone</span>
                        <a
                          href={`tel:${request.contactno}`}
                          className="data-val phone-link"
                          title="Call Client"
                        >
                          {request.contactno || 'Not provided'}
                        </a>
                      </div>
                      <div className="data-row">
                        <span className="data-label">City</span>
                        <span className="data-val">{request.location || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="request-section request-car-panel">
                    <div className="vehicle-icon-box">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.25"/>
                      </svg>
                    </div>
                    <div className="vehicle-meta">
                      <h4>{car?.name || `Vehicle Ref #${request.car_id ?? request.carid ?? 'N/A'}`}</h4>
                      <p>{[car?.brand, car?.year, car?.tag].filter(Boolean).join(' · ') || 'Vehicle details unavailable'}</p>
                      <span className="request-quote-price">
                        {formatPrice(request.price_at_request)}
                      </span>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <footer className="request-card-footer">
                    <div className="footer-timestamp">
                      <span>Submitted: {formatRequestDate(request.created_At)}</span>
                      {request.id && <span className="ref-id">ID: #{request.id}</span>}
                    </div>

                    <div className="action-buttons-group">
                      <button
                        type="button"
                        className="request-action-btn approve-btn"
                        disabled={status === 'approved' || isProcessing}
                        onClick={() => updateRequestStatus(request.id, 'approved')}
                      >
                        {isProcessing ? 'Updating...' : status === 'approved' ? '✓ Approved' : 'Approve'}
                      </button>

                      <button
                        type="button"
                        className="request-action-btn decline-btn"
                        disabled={status === 'declined' || isProcessing}
                        onClick={() => updateRequestStatus(request.id, 'declined')}
                      >
                        {isProcessing ? 'Updating...' : status === 'declined' ? 'Declined' : 'Decline'}
                      </button>
                    </div>
                  </footer>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="requests-empty-state">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
            </svg>
            <h3>No Requests In This Queue</h3>
            <p>There are no customer requests matching the current status filter.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Adminrequests;
