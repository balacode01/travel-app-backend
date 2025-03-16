const express = require('express');

const router = express.Router();

const userDetails = require('../controllers/users/userController');

router.post('/generateOtp', userDetails.generateOtp);
router.post('/register', (req, res) => {
    express.json({limit: "20mb", extended: true})
    // console.log("Inside /register route");
    userDetails.registerUser(req, res);
});

router.post('/verifyOtp', userDetails.verifyOtp);

module.exports = router;

