import React, { useState, useMemo } from 'react';
import './home.css';
import Usedata from '../hooks/usedata';
import { useNavigate, NavLink } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const { data: cars, isLoading, isError } = Usedata('/car/Cars/');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Extract unique brands dynamically
  const uniqueBrands = useMemo(() => {
    if (!Array.isArray(cars)) return ['All'];
    const brands = new Set(cars.map((c) => c.brand).filter(Boolean));
    return ['All', ...Array.from(brands)];
  }, [cars]);

  // Filtered and sorted cars
  const filteredCars = useMemo(() => {
    if (!Array.isArray(cars)) return [];

    return cars
      .filter((car) => {
        const matchesSearch =
          (car.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (car.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (car.tag || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesBrand =
          selectedBrand === 'All' ||
          (car.brand || '').toLowerCase() === selectedBrand.toLowerCase();

        const matchesAvailability =
          filterAvailability === 'All'
            ? true
            : filterAvailability === 'available'
            ? !car.is_sold
            : car.is_sold;

        return matchesSearch && matchesBrand && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        }
        if (sortBy === 'price-desc') {
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        }
        if (sortBy === 'year-desc') {
          return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
        }
        return 0;
      });
  }, [cars, searchTerm, selectedBrand, filterAvailability, sortBy]);

  const carView = (id) => {
    if (id) navigate(`/${id}`);
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
      <main className="home-page-container">
        <div className="home-loading-state">
          <div className="luxury-spinner"></div>
          <h2>Curating Velocity Inventory</h2>
          <p>Connecting to premium vehicle telemetry...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="home-page-container">
        <div className="home-error-state">
          <div className="error-icon">!</div>
          <h2>Unable to Load Showroom</h2>
          <p>Please check your connection or ensure the service is running.</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry Connection
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="home-page-container">
      {/* Hero Showcase Section */}
      <section className="hero-section">
        <div className="hero-backdrop-glow"></div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot"></span>
            EXOTIC & PERFORMANCE SHOWROOM
          </div>
          <h1 className="hero-title">
            Engineered For The <span className="title-gradient">Exceptional.</span>
          </h1>
          <p className="hero-subtitle">
            Curated world-class supercars, grand tourers, and hyper-performance vehicles inspected to pristine standards.
          </p>

          {/* Quick Metrics Bar */}
          <div className="hero-metrics-bar">
            <div className="metric-item">
              <span className="metric-val">{cars?.length || 0}</span>
              <span className="metric-label">Available Listings</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-val">100%</span>
              <span className="metric-label">Verified History</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-val">Direct</span>
              <span className="metric-label">Concierge Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom Controls & Filters Bar */}
      <section className="showroom-controls-section">
        <div className="controls-wrapper">
          {/* Live Search Input */}
          <div className="search-box">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by model, brand, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search vehicles"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Selectors Row */}
          <div className="filters-row">
            {/* Availability Filter */}
            <div className="custom-select-wrapper">
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                aria-label="Filter by availability"
              >
                <option value="All">All Availability</option>
                <option value="available">Available Now</option>
                <option value="sold">Sold Out</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="custom-select-wrapper">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort vehicles"
              >
                <option value="default">Featured Sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Year: Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Brand Filter Pills Carousel */}
        {uniqueBrands.length > 2 && (
          <div className="brand-pills-container">
            <div className="brand-pills-scroll">
              {uniqueBrands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  className={`brand-pill ${selectedBrand === brand ? 'active' : ''}`}
                  onClick={() => setSelectedBrand(brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Listings Grid Section */}
      <section className="showroom-grid-section">
        <div className="showroom-header-info">
          <h2>
            Showroom Fleet
            <span className="results-counter">({filteredCars.length} vehicles)</span>
          </h2>
          <NavLink to="/compare" className="compare-fleet-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            Compare Vehicles
          </NavLink>
        </div>

        {filteredCars.length > 0 ? (
          <div className="car-showcase-grid">
            {filteredCars.map((car, index) => {
              const primaryImage =
                car.carsimages?.[0]?.images ||
                'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80';

              return (
                <article
                  key={car.id || `${car.name}-${index}`}
                  className="luxury-car-card"
                  onClick={() => carView(car.id)}
                >
                  {/* Card Media Header */}
                  <div className="card-media">
                    <img
                      src={primaryImage}
                      alt={`${car.brand} ${car.name}`}
                      loading="lazy"
                    />
                    <div className="card-media-gradient"></div>

                    {/* Status Badge */}
                    <div className="status-badge-container">
                      <span className={`status-pill ${car.is_sold ? 'sold' : 'available'}`}>
                        <span className="status-pulse-dot"></span>
                        {car.is_sold ? 'Sold Out' : 'Available'}
                      </span>
                    </div>

                    {/* Tag / Category Badge */}
                    {car.tag && (
                      <span className="car-tag-badge">{car.tag}</span>
                    )}

                    {/* Year Badge */}
                    {car.year && (
                      <span className="car-year-badge">{car.year}</span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    <div className="card-identity">
                      <span className="car-brand-name">{car.brand || 'Luxury Auto'}</span>
                      <h3 className="car-model-title">{car.name}</h3>
                    </div>

                    {/* Quick Specs Pills */}
                    <div className="specs-row">
                      {car.power && (
                        <div className="spec-item" title="Engine Power">
                          <span className="spec-icon">⚡</span>
                          <span>{car.power}</span>
                        </div>
                      )}
                      {car.accel && (
                        <div className="spec-item" title="0-60 Acceleration">
                          <span className="spec-icon">⏱</span>
                          <span>{car.accel}</span>
                        </div>
                      )}
                      {car.fuel_type && (
                        <div className="spec-item" title="Fuel Type">
                          <span className="spec-icon">⛽</span>
                          <span>{car.fuel_type}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Info & Action */}
                    <div className="card-footer-info">
                      <div className="price-tag-wrap">
                        <span className="price-caption">Starting at</span>
                        <strong className="price-amount">{formatPrice(car.price)}</strong>
                      </div>

                      <button
                        type="button"
                        className="explore-car-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          carView(car.id);
                        }}
                        aria-label={`View details for ${car.name}`}
                      >
                        <span>Details</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="no-results-card">
            <div className="no-results-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
            <h3>No Vehicles Match Your Criteria</h3>
            <p>Try adjusting your search terms, brand filters, or availability settings.</p>
            <button
              type="button"
              className="reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedBrand('All');
                setFilterAvailability('All');
                setSortBy('default');
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
