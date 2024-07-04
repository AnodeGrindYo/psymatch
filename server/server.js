const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const multer = require('multer');
const cors = require('cors');
const app = express();
const path = require('path');
const psychologistRoutes = require('./routes/psychologistRoutes');
const matchRoutes = require('./routes/matchRoutes');
const videoRoutes = require('./routes/videoRoutes');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

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
app.use(psychologistRoutes);
app.use(matchRoutes);
app.use(videoRoutes);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Socket.IO pour la signalisation WebRTC
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
