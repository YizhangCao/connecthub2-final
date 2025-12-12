const express = require('express');
const router = express.Router();
const Interaction = require('../models/Interaction');

// GET all interactions
router.get('/', async (req, res) => {
  try {
    const interactions = await Interaction.findAll();
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET interactions by contact ID
router.get('/contact/:contactId', async (req, res) => {
  try {
    const interactions = await Interaction.findByContactId(req.params.contactId);
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single interaction
router.get('/:id', async (req, res) => {
  try {
    const interaction = await Interaction.findById(req.params.id);
    if (!interaction) {
      return res.status(404).json({ error: 'Interaction not found' });
    }
    res.json(interaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new interaction
router.post('/', async (req, res) => {
  try {
    const { contactId, type, date, notes, duration } = req.body;
    
    if (!contactId || !type || !date || !notes) {
      return res.status(400).json({ 
        error: 'ContactId, type, date, and notes are required' 
      });
    }

    const interactionData = {
      contactId,
      type,
      date,
      notes,
      duration: duration || null
    };

    const id = await Interaction.create(interactionData);
    const newInteraction = await Interaction.findById(id);
    
    res.status(201).json(newInteraction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update interaction
router.put('/:id', async (req, res) => {
  try {
    const { type, date, notes, duration } = req.body;
    
    const updateData = {};
    if (type) updateData.type = type;
    if (date) updateData.date = date;
    if (notes) updateData.notes = notes;
    if (duration !== undefined) updateData.duration = duration;

    const updated = await Interaction.update(req.params.id, updateData);
    
    if (!updated) {
      return res.status(404).json({ error: 'Interaction not found' });
    }

    const interaction = await Interaction.findById(req.params.id);
    res.json(interaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE interaction
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Interaction.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Interaction not found' });
    }

    res.json({ message: 'Interaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;