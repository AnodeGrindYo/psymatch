const Psychologist = require('../models/psy');

const getNearbyPsychologists = async (req, res) => {
    const { lat, long } = req.query;
    
    if (!lat || !long) {
        return res.status(400).json({ message: 'Latitude et longitude sont requises' });
    }
    
    try {
        console.log(`Received request for psychologists near lat: ${lat}, long: ${long}`);
        
        const psychologists = await Psychologist.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(long), parseFloat(lat)]
                    },
                    distanceField: "distance",
                    maxDistance: 10000000, // Distance maximale en mètres (10000 km)
                    spherical: true
                }
            }
        ]);

        console.log(`Found ${psychologists.length} psychologists`);
        
        res.json(psychologists);
    } catch (error) {
        console.error('Error fetching psychologists:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des psychologues', error: error.message });
    }
};

const getPsychologistSlots = async (req, res) => {
    const { psychologistId } = req.params;
  
    try {
        const psychologist = await Psychologist.findById(psychologistId);
        if (!psychologist) {
            return res.status(404).json({ message: 'Psychologue non trouvé' });
        }
  
        const slots = psychologist.getAvailableSlots();
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des créneaux', error: error.message });
    }
};

const getAllPsychologists = async (req, res) => {
    try {
        const psychologists = await Psychologist.find();
        res.json(psychologists);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des psychologues', error: error.message });
    }
};

module.exports = {
    getNearbyPsychologists,
    getPsychologistSlots,
    getAllPsychologists
};
