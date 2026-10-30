import React, { useState } from 'react';
import Usedata from '../hooks/usedata';
import { useParams, useNavigate } from 'react-router-dom';
import './cardetailspage.css';
import apiclient from '../utils/apiclient';
import { getuser } from '../App';
import { toast } from 'react-toastify';

function Cardetailspage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: car, isLoading, isError } = Usedata(`/car/Cars/${id}/`);
  const { data: users } = Usedata('myuser/');
  console.log(users);

  const user = getuser();
  const [actions, setActions] = useState('Booking');
  const [sentBooking, setSentBooking] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const sendBooking = async () => {
    if (!car) return;

    const data = {
      carid: car.id,
      customername: `${users?.first_name} ${users?.last_name}` || 'Customer',
      customeremail: users?.email || '',
      contactno: users?.phone || '',
      location: users?.location || 'Not Specified',
      Actions: actions,
      price_at_request: car.price,
    };

    try {
      setSentBooking(true);
      await apiclient.post('/bookings/', data);
      toast.success(
        actions === 'Booking'
          ? 'Booking request sent successfully! Concierge will contact you shortly.'
          : 'Inquiry submitted successfully!'
      );
    } catch (error) {
      console.error(error);
      toast.error('Unable to send request. Please try again.');
    } finally {
      setSentBooking(false);
    }
  };

  const formatPrice = (val) => {
    if (!val) return '₹—';
    const clean = String(val).replace(/[$₹,\s]/g, '');
    const num = Number(clean);
    if (!isNaN(num)) {
      return `₹${num.toLocaleString('en-IN')}`;
    }
    return String(val).startsWith('₹') ? val : `₹${val}`;
  };

  if (isLoading) {
    return (
      <main className="car-details-page">
        <div className="details-loading-state">
          <div className="luxury-spinner"></div>
          <h2>Accessing Vehicle Telemetry</h2>
          <p>Retrieving high-resolution assets & specification sheet...</p>
        </div>
      </main>
    );
  }

  if (isError || !car) {
    return (
      <main className="car-details-page">
        <div className="details-error-state">
          <div className="error-icon">!</div>
          <h2>Vehicle Not Found</h2>
          <p>This listing may have been moved, sold, or is currently unavailable.</p>
          <button onClick={() => navigate('/')} className="back-btn">
            ← Return to Showroom
          </button>
        </div>
      </main>
    );
  }

  const images = car.carsimages ?? [];
  const currentImage = images[activeImageIndex]?.images || (images.length > 0 ? images[0].images : null);

  return (
    <main className="car-details-page">
      <div className="details-container">
        {/* Breadcrumb Navigation */}
        <nav className="details-breadcrumb" aria-label="Breadcrumb">
          <button onClick={() => navigate('/')} className="breadcrumb-back-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Showroom Fleet
          </button>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">{car.brand}</span>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current active">{car.name}</span>
        </nav>

        {/* Main Showcase Grid */}
        <div className="details-grid">
          {/* Left: Visual Gallery */}
          <section className="details-gallery-section" aria-label="Vehicle Images">
            <div className="main-stage-image">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={`${car.brand} ${car.name} - view ${activeImageIndex + 1}`}
                />
              ) : (
                <div className="empty-photo-placeholder">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>No Imagery Registered</span>
                </div>
              )}

              {/* Status Pill on Image */}
              <div className="gallery-status-overlay">
                <span className={`status-pill ${car.is_sold ? 'sold' : 'available'}`}>
                  <span className="status-pulse-dot"></span>
                  {car.is_sold ? 'Sold Out' : 'Available For Delivery'}
                </span>
              </div>

              {/* Image Controls Overlay */}
              {images.length > 1 && (
                <>
                  <button
                    className="gallery-nav-btn prev"
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    aria-label="Previous photo"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>

                  <button
                    className="gallery-nav-btn next"
                    onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    aria-label="Next photo"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>

                  <span className="gallery-counter">
                    {activeImageIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="thumbnail-strip">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    className={`thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img src={img.images} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Right: Vehicle Dossier & Booking Suite */}
          <section className="details-dossier-section">
            <div className="dossier-card">
              {/* Header */}
              <header className="dossier-header">
                <div className="dossier-brand-row">
                  <span className="dossier-brand-pill">{car.brand}</span>
                  {car.year && <span className="dossier-year-pill">{car.year}</span>}
                  {car.tag && <span className="dossier-tag-pill">{car.tag}</span>}
                </div>
                <h1 className="dossier-title">{car.name}</h1>
                <div className="dossier-price-row">
                  <span className="price-label">Acquisition Price</span>
                  <strong className="price-figure">{formatPrice(car.price)}</strong>
                </div>
              </header>

              {/* Performance Telemetry Grid */}
              <div className="specs-telemetry-grid">
                <div className="telemetry-card">
                  <span className="telemetry-icon">⚡</span>
                  <span className="telemetry-label">Output</span>
                  <strong className="telemetry-val">{car.power || '—'}</strong>
                </div>
                <div className="telemetry-card">
                  <span className="telemetry-icon">⏱</span>
                  <span className="telemetry-label">0–60 mph</span>
                  <strong className="telemetry-val">{car.accel || '—'}</strong>
                </div>
                <div className="telemetry-card">
                  <span className="telemetry-icon">⛽</span>
                  <span className="telemetry-label">Powertrain</span>
                  <strong className="telemetry-val">{car.fuel_type || '—'}</strong>
                </div>
                <div className="telemetry-card">
                  <span className="telemetry-icon">📅</span>
                  <span className="telemetry-label">Model Year</span>
                  <strong className="telemetry-val">{car.year || '—'}</strong>
                </div>
              </div>

              {/* Description */}
              {car.description && (
                <div className="dossier-description-block">
                  <h3>Curator's Notes</h3>
                  <p>{car.description}</p>
                </div>
              )}

              {/* Provenance & Seller Details */}
              <div className="provenance-block">
                <h3>Provenance & Direct Contact</h3>
                <div className="provenance-details-grid">
                  <div className="provenance-item">
                    <span className="provenance-label">Verified Custodian</span>
                    <span className="provenance-val">{car.owner_name || 'Velocity Vault'}</span>
                  </div>
                  <div className="provenance-item">
                    <span className="provenance-label">Contact Line</span>
                    <span className="provenance-val">{car.owner_contact || 'Inquire via concierge'}</span>
                  </div>
                </div>
              </div>

              {/* Booking & Inquiry Action Suite */}
              <div className="booking-action-suite">
                <div className="booking-select-row">
                  <label htmlFor="action-type-select">Request Type</label>
                  <select
                    id="action-type-select"
                    value={actions}
                    onChange={(e) => setActions(e.target.value)}
                    disabled={car.is_sold}
                  >
                    <option value="Booking">Official Purchase / Booking</option>
                    <option value="INQUIRY">Vehicle Inquiry & Inspection</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={sendBooking}
                  className={`submit-request-btn ${car.is_sold ? 'disabled' : ''}`}
                  disabled={car.is_sold || sentBooking}
                >
                  {sentBooking ? (
                    <span className="btn-spinner-wrap">
                      <span className="mini-spinner"></span>
                      Dispatching Request...
                    </span>
                  ) : car.is_sold ? (
                    'Vehicle Sold Out'
                  ) : actions === 'Booking' ? (
                    'Send Booking Request'
                  ) : (
                    'Submit Inquiry'
                  )}
                </button>

                <p className="concierge-guarantee">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Protected by Velocity Concierge VIP Service & Inspection Guarantee
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Cardetailspage;
