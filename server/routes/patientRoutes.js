const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // middleware d'authentification

// On importera les fonctions du contrôleur des patients ici

// Exemple d'une route future pour obtenir les informations d'un patient
// const { getPatientProfile } = require('../controllers/patientController');
// router.get('/api/patient/:id', auth, getPatientProfile);

module.exports = router;
