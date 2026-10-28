import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './admincreatecar.css';
import { useForm } from 'react-hook-form';
import apiclient from '../utils/apiclient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Admincreatecar() {
  const [file, setFile] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    setFile((prev) => [
      ...prev,
      ...acceptedFiles.map((image) => ({
        file: image,
        path: URL.createObjectURL(image),
      })),
    ]);
  };

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    multiple: true,
  });

  const deleteImage = (index) => {
    setFile((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const formdata = new FormData();
    file.forEach((item) => {
      formdata.append('images', item.file);
    });

    formdata.append('name', data.name);
    formdata.append('brand', data.brand);
    formdata.append('year', data.year);
    formdata.append('tag', data.tag);
    formdata.append('price', data.price);
    formdata.append('power', data.power);
    formdata.append('accel', data.accel);
    formdata.append('fuel_type', data.fuel_type);
    formdata.append('owner_name', data.owner_name);
    formdata.append('owner_contact', data.owner_contact);
    formdata.append('description', data.description);

    try {
      setIsSubmitting(true);
      await apiclient.post('/car/Cars/', formdata);
      toast.success('Vehicle published to showroom inventory successfully!', {
        autoClose: 1200,
      });
      navigate('/viewcars');
    } catch (error) {
      toast.error('Unable to add car. Please check that all required fields are filled.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="createcar-page">
      <div className="createcar">
        <header className="createcar-header">
          <span className="createcar-eyebrow">NEW LISTING CURATION</span>
          <h1>Publish Vehicle to Showroom</h1>
          <p>Register high-resolution photography and performance specs into the Velocity fleet.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="createcar-form">
          {/* Section 1: Visual Media */}
          <div className="form-section span-full">
            <h3 className="section-title">Vehicle Photography</h3>
            <div
              {...getRootProps({
                className: `createcar-dropzone ${isDragActive ? 'is-active' : ''}`,
              })}
            >
              <input {...getInputProps()} />
              <div className="dropzone-content">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <p className="dropzone-title">
                  {isDragActive ? 'Drop vehicle photos here' : 'Click or drag vehicle photos here'}
                </p>
                <span className="dropzone-hint">PNG, JPG, or WEBP high-resolution photography</span>
              </div>
            </div>

            {file.length > 0 && (
              <div className="preview-strip">
                {file.map((Images, index) => (
                  <div className="createcar-photo" key={`${Images.file.name}-${index}`}>
                    <img src={Images.path} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => deleteImage(index)}
                      aria-label={`Remove photo ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Vehicle Identity */}
          <div className="form-section span-full">
            <h3 className="section-title">Identity & Classification</h3>
            <div className="form-fields-grid">
              <div className="field-group">
                <label htmlFor="car-name">Model Name *</label>
                <input {...register('name', { required: true })} id="car-name" type="text" placeholder="e.g. 911 GT3 RS" required />
              </div>
              <div className="field-group">
                <label htmlFor="car-brand">Manufacturer Brand *</label>
                <input {...register('brand', { required: true })} id="car-brand" type="text" placeholder="e.g. Porsche" required />
              </div>
              <div className="field-group">
                <label htmlFor="car-year">Model Year *</label>
                <input {...register('year', { required: true })} id="car-year" type="text" placeholder="e.g. 2024" required />
              </div>
              <div className="field-group">
                <label htmlFor="car-tag">Classification Tag</label>
                <input {...register('tag')} id="car-tag" type="text" placeholder="e.g. Track Edition / Supercar" />
              </div>
            </div>
          </div>

          {/* Section 3: Performance Telemetry */}
          <div className="form-section span-full">
            <h3 className="section-title">Engineering & Telemetry</h3>
            <div className="form-fields-grid">
              <div className="field-group">
                <label htmlFor="car-power">Output / Horsepower</label>
                <input {...register('power')} id="car-power" type="text" placeholder="e.g. 518 hp" />
              </div>
              <div className="field-group">
                <label htmlFor="car-accel">0–60 mph Acceleration</label>
                <input {...register('accel')} id="car-accel" type="text" placeholder="e.g. 3.0 sec" />
              </div>
              <div className="field-group">
                <label htmlFor="car-fuel">Powertrain / Fuel Type</label>
                <input {...register('fuel_type')} id="car-fuel" type="text" placeholder="e.g. 4.0L Naturally Aspirated / Hybrid" />
              </div>
              <div className="field-group">
                <label htmlFor="car-price">Valuation Price *</label>
                <input {...register('price', { required: true })} id="car-price" type="text" placeholder="e.g. 295000" required />
              </div>
            </div>
          </div>

          {/* Section 4: Provenance & Ownership */}
          <div className="form-section span-full">
            <h3 className="section-title">Custodian & Provenance</h3>
            <div className="form-fields-grid">
              <div className="field-group">
                <label htmlFor="car-owner">Custodian / Owner Name</label>
                <input {...register('owner_name')} id="car-owner" type="text" placeholder="e.g. Velocity Vault West" />
              </div>
              <div className="field-group">
                <label htmlFor="car-contact">Direct Contact Line</label>
                <input {...register('owner_contact')} id="car-contact" type="text" placeholder="e.g. +1 (310) 555-0199" />
              </div>
              <div className="field-group span-full">
                <label htmlFor="car-desc">Vehicle Overview / Story</label>
                <textarea
                  {...register('description')}
                  id="car-desc"
                  rows="4"
                  placeholder="Detail provenance, service records, factory options, and condition."
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions span-full">
            <button type="button" className="cancel-btn" onClick={() => navigate('/viewcars')}>
              Cancel
            </button>
            <button type="submit" className="submit-car-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="btn-loading-wrap">
                  <span className="mini-spinner"></span>
                  Publishing Listing...
                </span>
              ) : (
                'Publish Vehicle Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Admincreatecar;
