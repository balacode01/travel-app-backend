const express = require('express');

const router = express.Router();

const tripController = require('../controllers/trips/tripsController');
const TripMediaController = require('../controllers/trips/tripMediaController');
const TripMediaLikesController = require('../controllers/trips/tripMediaLikeController');
const authToken = require("../middleware/authToken");

// Define trip-related routes
router.post('/create', tripController.createTrip); // create a trip by user id
router.get('/list', authToken, tripController.getAllTrips); // fetch all trips of all users
router.get('/:id', authToken, tripController.getTripById);  // fetch a trip details by a trip id
router.get('/user/:user_id', tripController.getTripsByUserId); // fetch all trips of a user by user id
router.put('/:id', tripController.updateTrip); // update a trip by trip id (only authorized user can udpate)
router.delete('/:id', tripController.deleteTrip); // delete a trip by trip id and user id from request body

/// trip media routes
router.post('/:trip_id/media/upload',authToken, TripMediaController.uploadTripMedia); // for eg: '/2/media/upload
router.get('/:trip_id/user/:user_id/media', authToken, TripMediaController.fetchAllTripMediaOfUser);

/// 

router.get('/media/:media_id/likes', TripMediaLikesController.getTripMediaLikes);
router.post('/media/:media_id/like', authToken, TripMediaLikesController.toggleTripMediaLike);

module.exports = router;
