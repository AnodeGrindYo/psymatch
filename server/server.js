const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const dotenv = require('dotenv');

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Déclaration des constantes
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Initialisation de l'application Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware pour CORS
app.use(cors({ origin: FRONTEND_URL }));

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Configuration du stockage de multer pour les uploads de fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Middleware pour servir les fichiers statiques
app.use('/images', express.static(path.join(__dirname, './images')));
app.use('/uploads', express.static('uploads'));

// Importation des routes
const authRoutes = require('./routes/authRoutes');
const psychologistRoutes = require('./routes/psychologistRoutes');
const matchRoutes = require('./routes/matchRoutes');
const videoRoutes = require('./routes/videoRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use(psychologistRoutes);
app.use(matchRoutes);
app.use(videoRoutes);
app.use(appointmentRoutes);

// Route par défaut
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Connexion à MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Configuration de Socket.IO pour la signalisation WebRTC
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (sessionId) => {
        socket.join(sessionId);
        console.log(`User joined session: ${sessionId}`);
    });

    socket.on('offer', ({ offer, sessionId }) => {
        socket.to(sessionId).emit('offer', offer);
    });

    socket.on('answer', ({ answer, sessionId }) => {
        socket.to(sessionId).emit('answer', answer);
    });

    socket.on('ice-candidate', ({ candidate, sessionId }) => {
        socket.to(sessionId).emit('ice-candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Démarrage du serveur
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server, io };
