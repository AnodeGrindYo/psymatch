const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middlewares/auth');

// Route pour créer une nouvelle session de visioconférence
router.post('/api/video/createSession', auth, (req, res) => {
    const sessionId = uuidv4();
    res.status(200).json({ sessionId });
});

module.exports = router;
