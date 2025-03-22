const express = require('express');

const router = express.Router();

const tripController = require('../controllers/trips/tripsController');
const TripMediaController = require('../controllers/trips/tripMediaController');
const TripMediaLikesController = require('../controllers/trips/tripMediaLikeController');
const authToken = require("../middleware/authToken");

// Define trip-related routes
router.post('/create', tripController.createTrip);
router.get('/list', authToken, tripController.getAllTrips);
router.get('/:id', authToken, tripController.getTripById);
router.get('/user/:user_id', tripController.getTripsByUserId);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

/// trip media routes
router.post('/:trip_id/media/upload',authToken, TripMediaController.uploadTripMedia); // for eg: '/2/media/upload
router.get('/:trip_id/user/:user_id/media', authToken, TripMediaController.fetchAllTripMediaOfUser);

router.get('/media/:media_id/likes', TripMediaLikesController.getTripMediaLikes);
router.post('/media/:media_id/like', authToken, TripMediaLikesController.toggleTripMediaLike);

module.exports = router;
