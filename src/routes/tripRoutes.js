const express = require('express');

const router = express.Router();

const tripController = require('../controllers/trips/tripsController');

// Define trip-related routes
router.post('/create', tripController.createTrip);
router.get('/list', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

module.exports = router;
