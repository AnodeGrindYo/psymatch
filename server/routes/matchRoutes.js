const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const auth = require('../middlewares/auth'); // Importer le middleware d'authentification

// Route pour enregistrer les sélections des patients
router.post('/api/matches', auth, async (req, res) => {
  const { psychologistId } = req.body;
  const patientId = req.user.userId; // Utiliser req.user.userId

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Ajouter le psychologue sélectionné à la liste des matchs du patient
    patient.matches.push(psychologistId);
    await patient.save();

    res.status(200).json({ message: 'Match enregistré avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du match' });
  }
});

module.exports = router;
