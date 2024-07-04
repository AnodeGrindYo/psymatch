const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const matchController = require('../controllers/matchController');

router.post('/api/matches', auth, matchController.createMatch);

module.exports = router;
