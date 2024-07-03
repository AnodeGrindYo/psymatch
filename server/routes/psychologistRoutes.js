const express = require('express');
const router = express.Router();
const Psychologist = require('../models/psy');
const auth = require('../middlewares/auth'); // middleware d'authentification

// Route pour obtenir les psychologues disponibles
router.get('/api/psychologists', auth, async (req, res) => {
  try {
    const psychologists = await Psychologist.find();
    res.json(psychologists);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des psychologues' });
  }
});

module.exports = router;
