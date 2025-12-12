import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css';

function Dashboard({ contacts, apiUrl }) {
  const [stats, setStats] = useState({
    total: 0,
    needFollowUp: 0,
    totalInteractions: 0
  });

  useEffect(() => {
    calculateStats();
  }, [contacts]);

  const calculateStats = async () => {
    try {
      // Get all interactions to count them
      const response = await fetch(`${apiUrl}/interactions`);
      const interactions = await response.json();

      // Calculate days since last contact for each
      const needFollowUp = await Promise.all(
        contacts.map(async (contact) => {
          const contactInteractions = interactions.filter(
            i => i.contactId === contact._id
          );
          
          if (contactInteractions.length === 0) return true;

          const lastDate = new Date(
            Math.max(...contactInteractions.map(i => new Date(i.date)))
          );
          const daysSince = Math.floor(
            (new Date() - lastDate) / (1000 * 60 * 60 * 24)
          );

          return daysSince > 30;
        })
      );

      setStats({
        total: contacts.length,
        needFollowUp: needFollowUp.filter(Boolean).length,
        totalInteractions: interactions.length
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  return (
    <section className="dashboard" aria-label="Statistics overview">
      <h2 className="sr-only">Dashboard Statistics</h2>
      
      <article className="stat-card" aria-label="Total contacts statistic">
        <div className="stat-value" aria-describedby="total-label">
          {stats.total.toLocaleString()}
        </div>
        <div className="stat-label" id="total-label">Total Contacts</div>
      </article>

      <article className="stat-card stat-warning" aria-label="Contacts needing follow-up">
        <div className="stat-value" aria-describedby="followup-label">
          {stats.needFollowUp.toLocaleString()}
        </div>
        <div className="stat-label" id="followup-label">Need Follow-up (30+ days)</div>
      </article>

      <article className="stat-card" aria-label="Total interactions statistic">
        <div className="stat-value" aria-describedby="interactions-label">
          {stats.totalInteractions.toLocaleString()}
        </div>
        <div className="stat-label" id="interactions-label">Total Interactions</div>
      </article>
    </section>
  );
}

Dashboard.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      company: PropTypes.string,
      role: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  apiUrl: PropTypes.string.isRequired
};

export default Dashboard;
