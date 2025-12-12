import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ContactCard.css';

function ContactCard({ contact, onClick, onKeyDown, apiUrl }) {
  const [lastContact, setLastContact] = useState(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [daysSince, setDaysSince] = useState(null);

  useEffect(() => {
    fetchInteractionData();
  }, [contact._id]);

  const fetchInteractionData = async () => {
    try {
      const response = await fetch(`${apiUrl}/interactions/contact/${contact._id}`);
      const interactions = await response.json();
      
      setInteractionCount(interactions.length);

      if (interactions.length > 0) {
        const lastDate = new Date(
          Math.max(...interactions.map(i => new Date(i.date)))
        );
        setLastContact(lastDate.toISOString().split('T')[0]);
        
        const days = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
        setDaysSince(days);
      }
    } catch (error) {
      console.error('Error fetching interactions:', error);
    }
  };

  const getBadgeClass = () => {
    if (daysSince === null) return 'badge-gray';
    if (daysSince > 90) return 'badge-danger';
    if (daysSince > 30) return 'badge-warning';
    return 'badge-success';
  };

  const getStatusLabel = () => {
    if (daysSince === null) return 'No previous contact';
    if (daysSince > 90) return `${daysSince} days since last contact - needs urgent follow-up`;
    if (daysSince > 30) return `${daysSince} days since last contact - consider following up`;
    return `${daysSince} days since last contact - recently contacted`;
  };

  return (
    <article 
      className="contact-card"
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="listitem"
      tabIndex={0}
      aria-label={`${contact.name}, ${contact.role} at ${contact.company}. ${getStatusLabel()}`}
    >
      <div className="contact-card-header">
        <div className="contact-card-info">
          <h3 className="contact-card-name">{contact.name}</h3>
          <p className="contact-card-role">{contact.role}</p>
          <p className="contact-card-company">{contact.company}</p>
        </div>
        <span 
          className={`contact-card-badge ${getBadgeClass()}`}
          aria-label={getStatusLabel()}
        >
          {daysSince !== null ? `${daysSince}d` : 'New'}
        </span>
      </div>

      <div className="contact-card-meta">
        <svg 
          width="14" 
          height="14" 
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
        <span>Last: {lastContact || 'Never'}</span>
        <span className="contact-card-separator" aria-hidden="true">•</span>
        <span>{interactionCount} {interactionCount === 1 ? 'interaction' : 'interactions'}</span>
      </div>

      {contact.tags && contact.tags.length > 0 && (
        <div className="contact-card-tags" aria-label="Tags">
          {contact.tags.map((tag, index) => (
            <span key={index} className="contact-tag">{tag}</span>
          ))}
        </div>
      )}
    </article>
  );
}

ContactCard.propTypes = {
  contact: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    company: PropTypes.string,
    role: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  apiUrl: PropTypes.string.isRequired
};

ContactCard.defaultProps = {
  onKeyDown: () => {}
};

export default ContactCard;
