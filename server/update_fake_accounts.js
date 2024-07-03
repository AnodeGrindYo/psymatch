const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const Patient = require('./models/patient');
const Psychologist = require('./models/psy');

require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const hashPassword = async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
};

const updateData = async () => {
    try {
        const patientsFilePath = path.join(__dirname, '../python/patients.json');
        const psychologistsFilePath = path.join(__dirname, '../python/psychologists.json');

        const patients = JSON.parse(fs.readFileSync(patientsFilePath, 'utf-8'));
        const psychologists = JSON.parse(fs.readFileSync(psychologistsFilePath, 'utf-8'));

        // Supprimer tous les utilisateurs existants
        await Patient.deleteMany({});
        await Psychologist.deleteMany({});

        // Hacher les mots de passe avant d'insérer les nouveaux utilisateurs
        for (const patient of patients) {
            await hashPassword(patient);
        }
        for (const psychologist of psychologists) {
            await hashPassword(psychologist);
        }

        // Insérer les nouveaux utilisateurs
        const patientResult = await Patient.insertMany(patients);
        const psychologistResult = await Psychologist.insertMany(psychologists);

        console.log(`Inserted ${patientResult.length} patients`);
        console.log(`Inserted ${psychologistResult.length} psychologists`);

        console.log('Data Updated!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB().then(updateData);
