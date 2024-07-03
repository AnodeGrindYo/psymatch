const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const multer = require('multer');
const cors = require('cors');
const app = express();
const path = require('path');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Servir les fichiers statiques du dossier 'images'
app.use('/images', express.static(path.join(__dirname, './images')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
