import React, { useState, useEffect, useRef, useId } from 'react';
import PropTypes from 'prop-types';
import './ContactForm.css';

function ContactForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    tags: ''
  });

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const formId = useId();

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onCancel]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      return;
    }

    const contactData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    };

    onSubmit(contactData);
  };

  const handleBackdropClick = (event) => {
    if (event.target === modalRef.current) {
      onCancel();
    }
  };

  return (
    <div 
      className="modal-overlay"
      ref={modalRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
    >
      <div className="modal">
        <header className="modal-header">
          <h2 id={`${formId}-title`}>Add New Contact</h2>
          <button 
            onClick={onCancel} 
            className="modal-close"
            aria-label="Close dialog"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor={`${formId}-name`}>
                Name <span className="required" aria-hidden="true">*</span>
              </label>
              <input
                ref={firstInputRef}
                id={`${formId}-name`}
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
                required
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`${formId}-email`}>
                Email <span className="required" aria-hidden="true">*</span>
              </label>
              <input
                id={`${formId}-email`}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
                required
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`${formId}-company`}>Company</label>
              <input
                id={`${formId}-company`}
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="TechCorp"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`${formId}-role`}>Role</label>
              <input
                id={`${formId}-role`}
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                placeholder="Software Engineer"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`${formId}-tags`}>Tags (comma separated)</label>
              <input
                id={`${formId}-tags`}
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="client, active, prospect"
                aria-describedby={`${formId}-tags-hint`}
              />
              <span id={`${formId}-tags-hint`} className="form-hint">
                Separate multiple tags with commas
              </span>
            </div>
          </div>

          <footer className="modal-footer">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Contact
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

ContactForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ContactForm;
