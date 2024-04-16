const mongoose = require('mongoose');
const { Schema } = mongoose;

const psychologistSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    languages: [{ type: String, required: true }],
    specialization: [{ type: String, required: true }],
    geoLocation: {
        lat: Number,
        long: Number
    },
    bio: { type: String },
    ratings: [{ type: Number }],
    availableTimes: [{ 
        day: String, 
        timeSlots: [{ start: String, end: String }]
    }]
});

const Psychologist = mongoose.model('Psychologist', psychologistSchema);
