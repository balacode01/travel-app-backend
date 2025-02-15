const express = require('express');
const router = express.Router();

const userRoutes = require("./usersRoutes");

router.use('/users', userRoutes);


module.exports = router;