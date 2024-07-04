const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  psychologistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Psychologist', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  day: { type: String, required: true },
  timeSlot: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
