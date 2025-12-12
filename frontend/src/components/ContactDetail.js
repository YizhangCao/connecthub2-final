import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import InteractionLog from './InteractionLog';
import InteractionForm from './InteractionForm';
import './ContactDetail.css';

function ContactDetail({ contact, onBack, onDelete, apiUrl }) {
  const [interactions, setInteractions] = useState([]);
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [daysSince, setDaysSince] = useState(null);
  const backButtonRef = useRef(null);

  useEffect(() => {
    fetchInteractions();
    // Focus the back button when component mounts for keyboard navigation
    if (backButtonRef.current) {
      backButtonRef.current.focus();
    }
  }, [contact._id]);

  const fetchInteractions = async () => {
    try {
      const response = await fetch(`${apiUrl}/interactions/contact/${contact._id}`);
      const data = await response.json();
      setInteractions(data);

      if (data.length > 0) {
        const lastDate = new Date(Math.max(...data.map(i => new Date(i.date))));
        const days = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
        setDaysSince(days);
      }
    } catch (error) {
      console.error('Error fetching interactions:', error);
    }
  };

  const handleAddInteraction = async (interactionData) => {
    try {
      const response = await fetch(`${apiUrl}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...interactionData,
          contactId: contact._id
        })
      });

      if (!response.ok) throw new Error('Failed to add interaction');
      
      await fetchInteractions();
      setShowAddInteraction(false);
    } catch (error) {
      alert('Error adding interaction: ' + error.message);
    }
  };

  const handleDeleteInteraction = async (interactionId) => {
    if (!window.confirm('Are you sure you want to delete this interaction?')) return;

    try {
      const response = await fetch(`${apiUrl}/interactions/${interactionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete interaction');
      
      await fetchInteractions();
    } catch (error) {
      alert('Error deleting interaction: ' + error.message);
    }
  };

  // Handle keyboard navigation for back button
  const handleBackKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onBack();
    }
  };

  return (
    <article className="contact-detail" aria-label={`Details for ${contact.name}`}>
      {/* Header section */}
      <header className="contact-detail-header">
        <button 
          ref={backButtonRef}
          onClick={onBack}
          onKeyDown={handleBackKeyDown}
          className="btn-back"
          aria-label="Go back to contacts list"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Contacts
        </button>

        <div className="contact-detail-info">
          <div className="contact-detail-main">
            <h1>{contact.name}</h1>
            <p className="contact-detail-role">{contact.role}</p>
            <p className="contact-detail-company">{contact.company}</p>
            <p className="contact-detail-email">
              <a href={`mailto:${contact.email}`} aria-label={`Email ${contact.name}`}>
                {contact.email}
              </a>
            </p>
          </div>

          <div className="contact-detail-stats" aria-label="Contact statistics">
            <div className="stat-large">{interactions.length}</div>
            <div className="stat-label">Interactions</div>
            <div className="stat-small">
              Last contact: {daysSince === null ? 'Never' : `${daysSince}d ago`}
            </div>
          </div>
        </div>

        {contact.tags && contact.tags.length > 0 && (
          <div className="contact-detail-tags" aria-label="Contact tags">
            {contact.tags.map((tag, index) => (
              <span key={index} className="tag-large">{tag}</span>
            ))}
          </div>
        )}
      </header>

      {/* Action buttons */}
      <div className="contact-detail-actions" role="toolbar" aria-label="Contact actions">
        <button 
          onClick={() => setShowAddInteraction(true)}
          className="btn btn-primary btn-block"
          aria-haspopup="dialog"
          aria-label="Log a new interaction with this contact"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Log New Interaction
        </button>
        <button 
          onClick={() => onDelete(contact._id)}
          className="btn btn-danger"
          aria-label={`Delete contact ${contact.name}`}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete Contact
        </button>
      </div>

      {/* Interaction history */}
      <section className="contact-detail-body" aria-label="Interaction history">
        <h2 className="section-title">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Interaction History
        </h2>

        {interactions.length === 0 ? (
          <div className="empty-interactions" role="status">
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No interactions recorded yet</p>
            <p className="empty-subtitle">Start by logging your first conversation</p>
          </div>
        ) : (
          <div role="list" aria-label="List of interactions">
            {interactions.map(interaction => (
              <InteractionLog
                key={interaction._id}
                interaction={interaction}
                onDelete={handleDeleteInteraction}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal for adding interaction */}
      {showAddInteraction && (
        <InteractionForm
          contactName={contact.name}
          onSubmit={handleAddInteraction}
          onCancel={() => setShowAddInteraction(false)}
        />
      )}
    </article>
  );
}

ContactDetail.propTypes = {
  contact: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    company: PropTypes.string,
    role: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  apiUrl: PropTypes.string.isRequired
};

export default ContactDetail;
