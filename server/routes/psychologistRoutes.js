const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const psychologistController = require('../controllers/psychologistController');

router.get('/api/psychologists', auth, psychologistController.getAllPsychologists);
router.get('/api/psychologists/nearby', auth, psychologistController.getNearbyPsychologists);
router.get('/api/psychologists/:psychologistId/slots', auth, psychologistController.getPsychologistSlots);

module.exports = router;
