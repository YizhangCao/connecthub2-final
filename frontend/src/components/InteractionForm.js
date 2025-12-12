import React, { useState, useEffect, useRef, useId } from 'react';
import PropTypes from 'prop-types';
import './InteractionForm.css';

function InteractionForm({ contactName, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'meeting',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    duration: ''
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
    
    if (!formData.date || !formData.notes) {
      alert('Date and notes are required');
      return;
    }

    onSubmit(formData);
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
          <h2 id={`${formId}-title`}>Log Interaction with {contactName}</h2>
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
              <label htmlFor={`${formId}-type`}>
                Type <span className="required" aria-hidden="true">*</span>
              </label>
              <select
                ref={firstInputRef}
                id={`${formId}-type`}
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                required
                aria-required="true"
              >
                <option value="meeting">Meeting</option>
                <option value="call">Phone Call</option>
                <option value="email">Email</option>
                <option value="message">Message</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor={`${formId}-date`}>
                Date <span className="required" aria-hidden="true">*</span>
              </label>
              <input
                id={`${formId}-date`}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`${formId}-duration`}>Duration (optional)</label>
              <input
                id={`${formId}-duration`}
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="e.g., 30min, 1hr"
                aria-describedby={`${formId}-duration-hint`}
              />
              <span id={`${formId}-duration-hint`} className="form-hint">
                Enter the duration of the interaction
              </span>
            </div>

            <div className="form-group">
              <label htmlFor={`${formId}-notes`}>
                Notes <span className="required" aria-hidden="true">*</span>
              </label>
              <textarea
                id={`${formId}-notes`}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="What did you discuss? Any action items or follow-ups?"
                rows="5"
                required
                aria-required="true"
              />
            </div>
          </div>

          <footer className="modal-footer">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Log Interaction
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

InteractionForm.propTypes = {
  contactName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default InteractionForm;
