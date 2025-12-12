import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Dashboard from './components/Dashboard';
import ContactCard from './components/ContactCard';
import ContactDetail from './components/ContactDetail';
import ContactForm from './components/ContactForm';
import SearchBar from './components/SearchBar';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/contacts`);
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      setContacts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchContacts();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/contacts?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  }, []);

  const handleAddContact = async (contactData) => {
    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) throw new Error('Failed to add contact');
      
      await fetchContacts();
      setShowAddContact(false);
    } catch (err) {
      alert('Error adding contact: ' + err.message);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch(`${API_URL}/contacts/${contactId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete contact');
      
      setSelectedContact(null);
      await fetchContacts();
    } catch (err) {
      alert('Error deleting contact: ' + err.message);
    }
  };

  // Keyboard handler for contact selection
  const handleContactKeyDown = useCallback((event, contact) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedContact(contact);
    }
  }, []);

  // Loading state with ARIA live region
  if (loading) {
    return (
      <div className="app-loading" role="status" aria-live="polite" aria-busy="true">
        <div className="spinner" aria-hidden="true"></div>
        <p>Loading ConnectHub...</p>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="app-error" role="alert" aria-live="assertive">
        <h2>Error Loading Application</h2>
        <p>{error}</p>
        <button onClick={fetchContacts} aria-label="Retry loading contacts">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header with navigation landmark */}
      <header className="app-header" role="banner">
        <div className="app-header-content">
          <div className="app-logo">
            <div className="logo-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h1>ConnectHub</h1>
              <p className="app-tagline">Track relationships that matter</p>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddContact(true)}
            aria-label="Add new contact"
            aria-haspopup="dialog"
          >
            <span className="btn-icon" aria-hidden="true">+</span>
            Add Contact
          </button>
        </div>

        {/* Search bar - only shown on list view */}
        {!selectedContact && (
          <SearchBar 
            value={searchQuery}
            onChange={handleSearch}
          />
        )}
      </header>

      {/* Main content area with landmark */}
      <main className="app-main" id="main-content" role="main" aria-label="Contact management">
        {selectedContact ? (
          <ContactDetail
            contact={selectedContact}
            onBack={() => setSelectedContact(null)}
            onDelete={handleDeleteContact}
            apiUrl={API_URL}
          />
        ) : (
          <>
            {/* Dashboard statistics */}
            <Dashboard contacts={contacts} apiUrl={API_URL} />
            
            {/* Contacts grid with ARIA */}
            <section aria-label="Contacts list">
              <h2 className="sr-only">Your Contacts</h2>
              <div 
                className="contacts-grid" 
                role="list"
                aria-live="polite"
                aria-relevant="additions removals"
              >
                {contacts.length === 0 ? (
                  <div className="empty-state" role="status">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <h3>{searchQuery ? 'No contacts found' : 'No contacts yet'}</h3>
                    <p>{searchQuery ? 'Try adjusting your search' : 'Add your first contact to get started'}</p>
                  </div>
                ) : (
                  contacts.map(contact => (
                    <ContactCard
                      key={contact._id}
                      contact={contact}
                      onClick={() => setSelectedContact(contact)}
                      onKeyDown={(e) => handleContactKeyDown(e, contact)}
                      apiUrl={API_URL}
                    />
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Modal for adding contacts */}
      {showAddContact && (
        <ContactForm
          onSubmit={handleAddContact}
          onCancel={() => setShowAddContact(false)}
        />
      )}
    </div>
  );
}

export default App;
