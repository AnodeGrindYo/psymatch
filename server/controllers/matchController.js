const Patient = require('../models/patient');

const createMatch = async (req, res) => {
  const { psychologistId } = req.body;
  const patientId = req.user.userId;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    patient.matches.push(psychologistId);
    await patient.save();

    res.status(200).json({ message: 'Match enregistré avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du match', error: error.message });
  }
};

module.exports = {
  createMatch
};
