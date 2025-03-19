const express = require('express');

const router = express.Router();

const tripController = require('../controllers/trips/tripsController');
const TripMediaController = require('../controllers/trips/tripMediaController');
const authToken = require("../middleware/authToken");

// Define trip-related routes
router.post('/create', tripController.createTrip);
router.get('/list', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);
router.get('/user/:user_id', tripController.getTripsByUserId);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

/// trip media routes
router.post('/:trip_id/media/upload',authToken, TripMediaController.uploadTripMedia); // for eg: '/2/media/upload
// router.get('/:trip_id/media', TripMediaController.getTripMedia);
// router.delete('/media/:media_id', TripMediaController.deleteTripMedia);
/// trip media likes


module.exports = router;
