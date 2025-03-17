const express = require('express');

const router = express.Router();

const tripController = require('../controllers/trips/tripsController');
const authToken = require("../middleware/authToken");

// Define trip-related routes
router.post('/create', tripController.createTrip);
router.get('/list', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);
router.get('/user/:user_id', tripController.getTripsByUserId);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);


/// unccomment these lines for authentication code

// router.post('/create', authToken, tripController.createTrip);
// router.get('/list',authToken, tripController.getAllTrips);
// router.get('/:id',authToken, tripController.getTripById);
// router.get('/user/:user_id',authToken, tripController.getTripsByUserId);
// router.put('/:id',authToken, tripController.updateTrip);
// router.delete('/:id',authToken, tripController.deleteTrip);

module.exports = router;
