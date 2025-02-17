const express = require('express');

const router = express.Router();

const userDetails = require('../controllers/users/userController');

router.post('/generateOtp', userDetails.generateOtp);
router.post('/register', userDetails.registerUser);
router.post('/verifyOtp', userDetails.verifyOtp);

module.exports = router;

