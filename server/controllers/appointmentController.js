const Appointment = require('../models/appointment');
const io =  require('socket.io')(require('../server').server);

const createAppointment = async (req, res) => {
    const { psychologistId, day, timeSlot } = req.body;
    const patientId = req.user.userId;
    
    try {
        const appointment = new Appointment({
            psychologistId,
            patientId,
            day,
            timeSlot,
        });
        
        await appointment.save();
        
        // Envoyer une notification au psychologue
        io.to(psychologistId).emit('notification', {
            message: `Nouveau rendez-vous de ${req.user.email} pour le ${day} à ${timeSlot.start}`,
            type: 'appointment-request'
        });
        
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du rendez-vous', error: error.message });
    }
};

const getAppointments = async (req, res) => {
    const { userId, role } = req.user;
    
    try {
        let appointments;
        if (role === 'psychologist') {
            appointments = await Appointment.find({ psychologistId: userId });
        } else if (role === 'patient') {
            appointments = await Appointment.find({ patientId: userId });
        } else {
            return res.status(403).json({ message: 'Role inconnu' });
        }
        
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous', error: error.message });
    }
};

const updateAppointmentStatus = async (req, res) => {
    const { appointmentId, status } = req.body;
    const { userId, role } = req.user;
    
    if (role !== 'psychologist') {
        return res.status(403).json({ message: 'Seul le psychologue peut accepter ou rejeter un rendez-vous' });
    }
    
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Rendez-vous non trouvé' });
        }
        
        if (appointment.psychologistId.toString() !== userId) {
            return res.status(403).json({ message: 'Non autorisé' });
        }
        
        appointment.status = status;
        await appointment.save();
        
        // Envoyer une notification au patient
        io.to(appointment.patientId).emit('notification', {
            message: `Votre rendez-vous a été ${status === 'accepted' ? 'accepté' : 'rejeté'}.`,
            type: 'appointment-status'
        });
        
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du rendez-vous', error: error.message });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointmentStatus
};
