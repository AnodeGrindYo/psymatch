const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');

router.post('/api/appointments', auth, createAppointment);
router.get('/api/appointments', auth, getAppointments);
router.put('/api/appointments', auth, updateAppointmentStatus);

module.exports = router;
