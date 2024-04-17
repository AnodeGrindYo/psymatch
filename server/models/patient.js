const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferredLanguage: { type: String, required: true },
    issues: [{ type: String, required: true }],
    locationPreference: {
        type: String,
        enum: ['Remote', 'In-person', 'No Preference']
    }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;