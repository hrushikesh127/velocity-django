import React, { useState, useMemo } from 'react';
import Usedata from '../hooks/usedata';
import apiclient from '../utils/apiclient';
import './admincarlist.css';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Admincarlist() {
  const { data: cars, isLoading, isError } = Usedata('/car/Cars/');
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryclient = useQueryClient();
  const navigate = useNavigate();

  const updateCar = (id) => {
    if (!id) return;
    navigate(`/viewcars/${id}`);
  };

  const deleteCar = async (id, name) => {
    if (!id) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${name || 'this vehicle'}" from inventory?`
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await apiclient.delete(`/car/Cars/${id}/`);
      queryclient.invalidateQueries({
        queryKey: ['/cars', '/car/Cars/'],
      });
      toast.success('Vehicle listing removed successfully');
    } catch (error) {
      console.error(error);
      toast.error('Unable to delete vehicle listing. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCars = useMemo(() => {
    if (!Array.isArray(cars)) return [];
    return cars.filter((car) => {
      const term = searchTerm.toLowerCase();
      return (
        (car.name || '').toLowerCase().includes(term) ||
        (car.brand || '').toLowerCase().includes(term) ||
        (car.tag || '').toLowerCase().includes(term)
      );
    });
  }, [cars, searchTerm]);

  const totalCars = cars?.length || 0;
  const soldCars = cars?.filter((c) => c.is_sold)?.length || 0;
  const availableCars = totalCars - soldCars;

  const formatPrice = (val) => {
    if (!val) return '₹—';
    const clean = String(val).replace(/[$₹,\s]/g, '');
    const num = Number(clean);
    return !isNaN(num) ? `₹${num.toLocaleString('en-IN')}` : (String(val).startsWith('₹') ? val : `₹${val}`);
  };

  return (
    <main className="admin-carlist-page">
      <section className="carlist">
        {/* Header */}
        <header className="carlist-header">
          <div>
            <span className="carlist-eyebrow">INVENTORY CONTROL MATRIX</span>
            <h1>Vehicle Management</h1>
            <p className="carlist-description">
              Audit, modify technical specifications, and manage active showroom listings.
            </p>
          </div>

          <button
            type="button"
            className="create-vehicle-btn"
            onClick={() => navigate('/createcar')}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Vehicle</span>
          </button>
        </header>

        {/* Inventory Statistics Bar */}
        <div className="admin-stats-bar">
          <div className="admin-stat-card">
            <span className="stat-label">Total Fleet</span>
            <span className="stat-number">{totalCars}</span>
          </div>
          <div className="admin-stat-card">
            <span className="stat-label">Active Available</span>
            <span className="stat-number green">{availableCars}</span>
          </div>
          <div className="admin-stat-card">
            <span className="stat-label">Sold Out</span>
            <span className="stat-number red">{soldCars}</span>
          </div>
        </div>

        {/* Live Search */}
        <div className="admin-search-wrapper">
          <div className="admin-search-box">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search vehicles by name, brand, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Filter inventory"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
              >
                ×
              </button>
            )}
          </div>
          <span className="search-count-pill">{filteredCars.length} listings</span>
        </div>

        {/* Body Content */}
        {isLoading ? (
          <div className="carlist-state">
            <div className="luxury-spinner"></div>
            <p>Loading vehicle inventory...</p>
          </div>
        ) : isError ? (
          <div className="carlist-state carlist-state-error">
            <p>Unable to connect to inventory telemetry. Please reload.</p>
          </div>
        ) : filteredCars.length ? (
          <div className="carlist-grid">
            {filteredCars.map((car, index) => {
              const primaryImage =
                car.carsimages?.[0]?.images ||
                'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80';

              const isDeletingThis = deletingId === car.id;

              return (
                <article className="admin-car-card" key={car.id ?? index}>
                  <div className="admin-card-header">
                    <div>
                      <span className="carcard-brand">{car.brand || 'Vehicle'}</span>
                      <h2>{car.name}</h2>
                    </div>
                    <span className={`status-pill small ${car.is_sold ? 'sold' : 'available'}`}>
                      {car.is_sold ? 'Sold' : 'Active'}
                    </span>
                  </div>

                  <div className="admin-car-image-wrap">
                    <img src={primaryImage} alt={car.name} loading="lazy" />
                    {car.tag && <span className="carcard-tag">{car.tag}</span>}
                  </div>

                  <div className="carcard-details">
                    <div className="carcard-price">
                      <span>Valuation</span>
                      <strong>{formatPrice(car.price)}</strong>
                    </div>
                    <div>
                      <span>Custodian</span>
                      <strong>{car.owner_name || 'Showroom'}</strong>
                    </div>
                  </div>

                  <div className="admin-card-controls">
                    <button
                      type="button"
                      className="admin-action-btn edit"
                      onClick={() => updateCar(car?.id)}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Modify
                    </button>

                    <button
                      type="button"
                      className="admin-action-btn delete"
                      disabled={isDeletingThis}
                      onClick={() => deleteCar(car?.id, car.name)}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      {isDeletingThis ? 'Removing...' : 'Delete'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="carlist-state empty">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
            </svg>
            <h3>No Vehicles Found</h3>
            <p>No inventory matches your search filter.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Admincarlist;
