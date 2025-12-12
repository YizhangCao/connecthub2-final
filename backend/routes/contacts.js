const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Interaction = require('../models/Interaction');

// GET all contacts
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let contacts;
    
    if (search) {
      contacts = await Contact.search(search);
    } else {
      contacts = await Contact.findAll();
    }
    
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single contact
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET contacts needing follow-up
router.get('/followup/needed', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const contacts = await Contact.getContactsNeedingFollowUp(days);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new contact
router.post('/', async (req, res) => {
  try {
    const { name, email, company, role, tags } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const contactData = {
      name,
      email,
      company: company || '',
      role: role || '',
      tags: tags || []
    };

    const id = await Contact.create(contactData);
    const newContact = await Contact.findById(id);
    
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update contact
router.put('/:id', async (req, res) => {
  try {
    const { name, email, company, role, tags } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (company !== undefined) updateData.company = company;
    if (role !== undefined) updateData.role = role;
    if (tags !== undefined) updateData.tags = tags;

    const updated = await Contact.update(req.params.id, updateData);
    
    if (!updated) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contact = await Contact.findById(req.params.id);
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE contact
router.delete('/:id', async (req, res) => {
  try {
    // Also delete all interactions for this contact
    await Interaction.deleteByContactId(req.params.id);
    
    const deleted = await Contact.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;