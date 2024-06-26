// routes/authRoutes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/getCurrentUser/:userId', authController.getCurrentUser);
router.put('/updateUser/:userId', authController.updateUser);


module.exports = router;