const express = require('express');
const router = express.Router();

const userRoutes = require("./usersRoutes");
const tripDetails = require('./tripRoutes');

router.use('/users', userRoutes);
router.use('/trips', tripDetails);

module.exports = router;