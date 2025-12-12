import React from 'react';
import PropTypes from 'prop-types';
import './InteractionLog.css';

function InteractionLog({ interaction, onDelete }) {
  const getIcon = (type) => {
    const icons = {
      meeting: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      call: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      email: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      message: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    };
    return icons[type] || icons.message;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      meeting: 'Meeting',
      call: 'Phone Call',
      email: 'Email',
      message: 'Message'
    };
    return labels[type] || type;
  };

  return (
    <article 
      className="interaction-log"
      role="listitem"
      aria-label={`${getTypeLabel(interaction.type)} on ${formatDate(interaction.date)}`}
    >
      <div className="interaction-log-header">
        <div className="interaction-log-icon" aria-hidden="true">
          {getIcon(interaction.type)}
        </div>
        <div className="interaction-log-meta">
          <span className="interaction-log-type">{getTypeLabel(interaction.type)}</span>
          <span className="interaction-log-separator" aria-hidden="true">•</span>
          <time className="interaction-log-date" dateTime={interaction.date}>
            {formatDate(interaction.date)}
          </time>
          {interaction.duration && (
            <>
              <span className="interaction-log-separator" aria-hidden="true">•</span>
              <span className="interaction-log-duration">{interaction.duration}</span>
            </>
          )}
        </div>
        <button 
          onClick={() => onDelete(interaction._id)}
          className="interaction-log-delete"
          aria-label={`Delete ${getTypeLabel(interaction.type)} from ${formatDate(interaction.date)}`}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
      <p className="interaction-log-notes">{interaction.notes}</p>
    </article>
  );
}

InteractionLog.propTypes = {
  interaction: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    duration: PropTypes.string
  }).isRequired,
  onDelete: PropTypes.func.isRequired
};

export default InteractionLog;
