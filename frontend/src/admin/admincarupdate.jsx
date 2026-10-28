import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import Usedata from '../hooks/usedata';
import { useDropzone } from 'react-dropzone';
import './admincarupdate.css';
import apiclient from '../utils/apiclient';
import { toast } from 'react-toastify';

function Admincarupdate() {
  const { register, handleSubmit, reset } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: car, isLoading, isError } = Usedata(`/car/Cars/${id}/`);
  const [files, setFiles] = useState([]);
  const [keepIds, setKeepIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFiles(
      car?.carsimages?.map((image) => ({
        images: image.images,
        id: image.id,
      })) ?? []
    );
    setKeepIds(car?.carsimages?.map((image) => image.id) ?? []);
  }, [car]);

  const onDrop = (acceptedFiles) => {
    setFiles((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => ({
        images: URL.createObjectURL(file),
        file,
      })),
    ]);
  };

  useEffect(() => {
    if (car) {
      reset({
        name: car.name,
        brand: car.brand,
        year: car.year,
        tag: car.tag,
        price: car.price,
        power: car.power,
        accel: car.accel,
        fuel_type: car.fuel_type,
        owner_name: car.owner_name,
        owner_contact: car.owner_contact,
        description: car.description,
      });
    }
  }, [car, reset]);

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    multiple: true,
  });

  const deletePreview = (index, imageId) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (imageId !== undefined) {
      setKeepIds((prev) => prev.filter((id) => id !== imageId));
    }
  };

  const onSubmit = async (data) => {
    const formdata = new FormData();
    files.forEach((image) => {
      if (image.file) {
        formdata.append('images', image.file);
      }
    });

    keepIds.forEach((id) => {
      formdata.append('keep_images_ids', String(id));
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
      await apiclient.put(`/car/Cars/${id}/`, formdata);
      toast.success('Vehicle specifications updated successfully!', {
        autoClose: 1200,
      });
      navigate('/viewcars');
    } catch (error) {
      console.error(error);
      toast.error('Unable to update vehicle details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="carupdate-page">
        <div className="carupdate-state-loading">
          <div className="luxury-spinner"></div>
          <p>Accessing vehicle dossier...</p>
        </div>
      </main>
    );
  }

  if (isError || !car) {
    return (
      <main className="carupdate-page">
        <div className="carupdate-state-error">
          <div className="error-icon">!</div>
          <h2>Vehicle Not Found</h2>
          <p>The requested vehicle listing could not be retrieved.</p>
          <button onClick={() => navigate('/viewcars')} className="cancel-btn">
            ← Return to Fleet
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="carupdate-page">
      <div className="carupdate">
        <header className="carupdate-header">
          <span className="carupdate-eyebrow">VEHICLE MODIFICATION</span>
          <h1>Update {car.name}</h1>
          <p>Modify performance telemetry, pricing, and high-resolution showroom photography.</p>
        </header>

        <form className="carupdate-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Section 1: Photos */}
          <div className="form-section span-full">
            <h3 className="section-title">Gallery & Visual Assets</h3>

            {files.length > 0 && (
              <div className="carupdate-preview">
                {files.map((image, index) => (
                  <div className="carupdate-preview-item" key={`${image.images}-${index}`}>
                    <img src={image.images} alt={`Vehicle photo ${index + 1}`} />
                    <button
                      className="deletepreview"
                      type="button"
                      onClick={() => deletePreview(index, image.id)}
                      aria-label={`Remove photo ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              {...getRootProps({
                className: `carupdate-dropzone ${isDragActive ? 'is-active' : ''}`,
              })}
            >
              <input {...getInputProps()} />
              <div className="dropzone-content">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p className="dropzone-title">
                  {isDragActive ? 'Drop new photos to attach' : 'Drag or click to attach additional photos'}
                </p>
                <span className="dropzone-hint">PNG, JPG, or WEBP high-resolution</span>
              </div>
            </div>
          </div>

          {/* Section 2: Identity */}
          <div className="form-section span-full">
            <h3 className="section-title">Identity & Classification</h3>
            <div className="form-fields-grid">
              <div className="field-group">
                <label htmlFor="edit-name">Model Name *</label>
                <input {...register('name', { required: true })} id="edit-name" type="text" placeholder="Model name" required />
              </div>
              <div className="field-group">
                <label htmlFor="edit-brand">Manufacturer Brand *</label>
                <input {...register('brand', { required: true })} id="edit-brand" type="text" placeholder="Brand" required />
              </div>
              <div className="field-group">
                <label htmlFor="edit-year">Model Year *</label>
                <input {...register('year', { required: true })} id="edit-year" type="text" placeholder="Year" required />
              </div>
              <div className="field-group">
                <label htmlFor="edit-tag">Classification Tag</label>
                <input {...register('tag')} id="edit-tag" type="text" placeholder="Tag" />
              </div>
            </div>
          </div>

          {/* Section 3: Telemetry */}
          <div className="form-section span-full">
            <h3 className="section-title">Performance Telemetry</h3>
            <div className="form-fields-grid">
              <div className="field-group">
                <label htmlFor="edit-power">Horsepower Output</label>
                <input {...register('power')} id="edit-power" type="text" placeholder="Output" />
              </div>
              <div className="field-group">
                <label htmlFor="edit-accel">0–60 mph Acceleration</label>
                <input {...register('accel')} id="edit-accel" type="text" placeholder="0-60 time" />
              </div>
              <div className="field-group">
                <label htmlFor="edit-fuel">Powertrain / Fuel Type</label>
                <input {...register('fuel_type')} id="edit-fuel" type="text" placeholder="Powertrain" />
              </div>
              <div className="field-group">
                <label htmlFor="edit-price">Valuation Price *</label>
                <input {...register('price', { required: true })} id="edit-price" type="text" placeholder="Price" required />
              </div>
            </div>
          </div>

          {/* Section 4: Custodian */}
          <div className="form-section span-full">
            <h3 className="section-title">Custodian & Overview</h3>
            <div className="form-fields-grid">
              <div className="field-group">
                <label htmlFor="edit-owner">Custodian / Owner Name</label>
                <input {...register('owner_name')} id="edit-owner" type="text" placeholder="Owner" />
              </div>
              <div className="field-group">
                <label htmlFor="edit-contact">Direct Contact Line</label>
                <input {...register('owner_contact')} id="edit-contact" type="text" placeholder="Contact" />
              </div>
              <div className="field-group span-full">
                <label htmlFor="edit-desc">Vehicle Overview</label>
                <textarea
                  {...register('description')}
                  id="edit-desc"
                  rows="4"
                  placeholder="Vehicle story and condition details"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="form-actions span-full">
            <button type="button" className="cancel-btn" onClick={() => navigate('/viewcars')}>
              Discard Changes
            </button>
            <button type="submit" className="submit-car-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="btn-loading-wrap">
                  <span className="mini-spinner"></span>
                  Saving Modifications...
                </span>
              ) : (
                'Save Modifications'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Admincarupdate;
