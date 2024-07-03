const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/register', auth, authController.register);
router.post('/login', auth, authController.login);
router.get('/getCurrentUser/:userId', auth, authController.getCurrentUser);
router.put('/updateUser/:userId', auth, upload.single('profilePicture'), authController.updateUser);

module.exports = router;
