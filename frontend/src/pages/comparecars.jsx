import React, { useState } from 'react';
import Usedata from '../hooks/usedata';
import { useNavigate } from 'react-router-dom';
import './comparecars.css';

const specifications = [
  { label: 'Brand & Provenance', key: 'brand', icon: '🏷' },
  { label: 'Model Year', key: 'year', icon: '📅' },
  { label: 'Powertrain & Fuel', key: 'fuel_type', icon: '⛽' },
  { label: 'Power Output', key: 'power', icon: '⚡' },
  { label: 'Acceleration (0–60)', key: 'accel', icon: '⏱' },
  { label: 'Classification Tag', key: 'tag', icon: '🏆' },
  { label: 'Acquisition Price', key: 'price', icon: '💎' },
  { label: 'Registered Custodian', key: 'owner_name', icon: '👤' },
  { label: 'Availability', key: 'is_sold', icon: '🚦' },
];

function getValue(car, key) {
  if (!car) return '—';
  if (key === 'is_sold') {
    return car.is_sold ? 'Sold Out' : 'Available';
  }
  const val = car[key];
  if (val === null || val === undefined || val === '') return '—';
  if (key === 'price') {
    const clean = String(val).replace(/[$₹,\s]/g, '');
    const num = Number(clean);
    return !isNaN(num) ? `₹${num.toLocaleString('en-IN')}` : (String(val).startsWith('₹') ? val : `₹${val}`);
  }
  return val;
}

function Comparecars() {
  const navigate = useNavigate();
  const { data: cars, isLoading, isError } = Usedata('/car/Cars/');
  const [selectedCar1Id, setSelectedCar1Id] = useState('');
  const [selectedCar2Id, setSelectedCar2Id] = useState('');

  if (isLoading) {
    return (
      <main className="comparecars-page">
        <div className="compare-loading-state">
          <div className="luxury-spinner"></div>
          <h2>Loading Comparison Engine</h2>
          <p>Compiling vehicle technical telemetry...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="comparecars-page">
        <div className="compare-error-state">
          <div className="error-icon">!</div>
          <h2>Comparison Engine Offline</h2>
          <p>Unable to retrieve vehicle metrics at this time.</p>
        </div>
      </main>
    );
  }

  const carList = Array.isArray(cars) ? cars : [];
  const selectedCar1 = carList.find((car) => String(car.id) === selectedCar1Id);
  const selectedCar2 = carList.find((car) => String(car.id) === selectedCar2Id);

  return (
    <main className="comparecars-page">
      <div className="comparecars-container">
        {/* Header */}
        <header className="comparecars-header">
          <span className="comparecars-eyebrow">HEAD-TO-HEAD MATRIX</span>
          <h1 id="comparecars-title">Vehicle Comparison</h1>
          <p>Evaluate precision engineering, performance metrics, and valuations side-by-side.</p>
        </header>

        {carList.length === 0 ? (
          <div className="compare-empty-state">
            <p>No vehicles are currently available in the showroom to compare.</p>
          </div>
        ) : (
          <>
            {/* Vehicle Selection Header Cards */}
            <div className="compare-selector-grid">
              {/* Vehicle 1 Selector Card */}
              <div className="selector-vehicle-card">
                <label className="selector-label" htmlFor="car1-select">
                  <span>Vehicle Alpha</span>
                </label>
                <select
                  id="car1-select"
                  className="compare-select"
                  value={selectedCar1Id}
                  onChange={(e) => setSelectedCar1Id(e.target.value)}
                >
                  <option value="">Select First Vehicle</option>
                  {carList.map((car) => (
                    <option key={car.id} value={String(car.id)} disabled={String(car.id) === selectedCar2Id}>
                      {car.brand ? `${car.brand} ` : ''}{car.name}
                    </option>
                  ))}
                </select>

                {selectedCar1 ? (
                  <div className="selected-preview-card">
                    <div className="preview-image-wrap">
                      <img
                        src={selectedCar1.carsimages?.[0]?.images || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'}
                        alt={selectedCar1.name}
                      />
                      <span className={`preview-status ${selectedCar1.is_sold ? 'sold' : 'available'}`}>
                        {selectedCar1.is_sold ? 'Sold' : 'Available'}
                      </span>
                    </div>
                    <div className="preview-info">
                      <h4>{selectedCar1.name}</h4>
                      <p className="preview-price">{getValue(selectedCar1, 'price')}</p>
                      <button
                        type="button"
                        className="preview-view-btn"
                        onClick={() => navigate(`/${selectedCar1.id}`)}
                      >
                        View Full Dossier →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="preview-empty-slot">
                    <span>Select a car to preview</span>
                  </div>
                )}
              </div>

              {/* Vehicle 2 Selector Card */}
              <div className="selector-vehicle-card">
                <label className="selector-label" htmlFor="car2-select">
                  <span>Vehicle Beta</span>
                </label>
                <select
                  id="car2-select"
                  className="compare-select"
                  value={selectedCar2Id}
                  onChange={(e) => setSelectedCar2Id(e.target.value)}
                >
                  <option value="">Select Second Vehicle</option>
                  {carList.map((car) => (
                    <option key={car.id} value={String(car.id)} disabled={String(car.id) === selectedCar1Id}>
                      {car.brand ? `${car.brand} ` : ''}{car.name}
                    </option>
                  ))}
                </select>

                {selectedCar2 ? (
                  <div className="selected-preview-card">
                    <div className="preview-image-wrap">
                      <img
                        src={selectedCar2.carsimages?.[0]?.images || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'}
                        alt={selectedCar2.name}
                      />
                      <span className={`preview-status ${selectedCar2.is_sold ? 'sold' : 'available'}`}>
                        {selectedCar2.is_sold ? 'Sold' : 'Available'}
                      </span>
                    </div>
                    <div className="preview-info">
                      <h4>{selectedCar2.name}</h4>
                      <p className="preview-price">{getValue(selectedCar2, 'price')}</p>
                      <button
                        type="button"
                        className="preview-view-btn"
                        onClick={() => navigate(`/${selectedCar2.id}`)}
                      >
                        View Full Dossier →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="preview-empty-slot">
                    <span>Select a second car to compare</span>
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Matrix Table */}
            <div className="comparecars-table-card">
              <div className="table-responsive-wrapper">
                <table className="comparecars-matrix">
                  <thead>
                    <tr>
                      <th scope="col" className="col-spec">Specification</th>
                      <th scope="col" className="col-car">
                        {selectedCar1?.name ? `${selectedCar1.brand || ''} ${selectedCar1.name}` : 'Vehicle Alpha'}
                      </th>
                      <th scope="col" className="col-car">
                        {selectedCar2?.name ? `${selectedCar2.brand || ''} ${selectedCar2.name}` : 'Vehicle Beta'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {specifications.map(({ label, key, icon }) => (
                      <tr key={key}>
                        <th scope="row" className="row-spec-label">
                          <span className="spec-row-icon">{icon}</span>
                          <span>{label}</span>
                        </th>
                        <td className={`val-cell ${selectedCar1 ? 'has-data' : ''}`}>
                          {getValue(selectedCar1, key)}
                        </td>
                        <td className={`val-cell ${selectedCar2 ? 'has-data' : ''}`}>
                          {getValue(selectedCar2, key)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Comparecars;
