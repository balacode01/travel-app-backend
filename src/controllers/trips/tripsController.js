const { Op, where } = require("sequelize");
const { Trip, User } = require("../../models"); // Adjust path based on your setup
const { use } = require("../../routes/tripRoutes");

/// create a trip ///
const createTrip = async (req, res) => {
    try {
        // Extract trip details from request body
        const { user_id, name, location, from_date, to_date, description, total_budget, cover_image } = req.body;

        // Validate required fields
        if (!user_id || !name || !location || !from_date || !to_date || total_budget === undefined) {
            return res.status(400).json({ message: "Missing required fields", statusCode: 400 });
        }
        const userExists = await User.findByPk(user_id);
        if(!userExists){
            return res.status(404).json({
                message: "User not found",
                statusCode: 404,
            });
        }

        // Validate total_budget
        if (total_budget < 0) {
            return res.status(400).json({ message: "Total budget cannot be negative", statusCode: 400 });
        }

        // Validate cover image size (if applicable)
        if (cover_image && cover_image.length > 10 * 1024 * 1024) {
            return res.status(400).json({ message: "Image size too large", statusCode: 400 });
        }

        // Check if a trip with the same name exists for this user (optional)
        const existingTrip = await Trip.findOne({
            where: { user_id, name },
        });

        if (existingTrip) {
            return res.status(422).json({
                status: 422,
                message: "Trip with this name already exists for this user",
            });
        }

        // Create new trip
        const newTrip = await Trip.create({
            user_id,
            name,
            location,
            from_date,
            to_date,
            description,
            total_budget,
            cover_image,
        });

        return res.status(201).json({
            message: "Trip created successfully",
            statusCode: 201,
            trip: {
                id: newTrip.id,
                user_id: newTrip.user_id,
                name: newTrip.name,
                location: newTrip.location,
                from_date: newTrip.from_date,
                to_date: newTrip.to_date,
                description: newTrip.description,
                total_budget: newTrip.total_budget,
                cover_image: newTrip.cover_image,
                created_at: newTrip.created_at,
                updated_at: newTrip.updated_at,
            },
        });
    } catch (error) {
        console.error("Server error", error);
        return res.status(500).json({ message: "Intesrnal Server Error" });
    }
};

/// get all trips ///
const getAllTrips = async (req, res) => {
    // Logic to fetch all trips for a user
    try {
        const user_id = req.user.id;
        // find the user by id
        const user = await User.findOne({where: {id: user_id}});
        // check user exists
        if(!user){
            return res.status(404).json({
                message: "User not found",
                statusCode: 404,
            });
        }

        const trips = await Trip.findAll(); // fetch All trips
        return res.status(200).json({
            message: "Trips fetch Successfully",
            statusCode: 200,
            data: trips,
        })
    } catch (error) {
        console.log("Error fetching trips: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            statusCode: 500,
        });
    }
};


/// get all trips for user id ///
const getTripsByUserId = async (req, res) => {
    try {
      const { user_id } = req.params;


  
      // Find trips by user_id
      const trips = await Trip.findAll({
        where: { user_id }
      });
  
      if (trips.length === 0) {
        return res.status(404).json({
          message: "No trips found for this user",
          statusCode: 404,
        });
      }
  
      return res.status(200).json({
        message: "Trips fetched successfully",
        statusCode: 200,
        trips,
      });
    } catch (error) {
      console.error("Error fetching trips:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        statusCode: 500,
      });
    }
  };
  

/// get trip by id ///
const getTripById = async (req, res) => {
    try {
      const { id } = req.params;

      // find the user by id
      const user = await User.findOne({where: {id: user_id}});
      // check user exists
      if(!user){
          return res.status(404).json({
              message: "User not found",
              statusCode: 404,
          });
      }
  
      // Find trip by ID
      const trip = await Trip.findOne({ where: { id } });
  
      if (!trip) {
        return res.status(404).json({
          message: "Trip not found",
          statusCode: 404,
        });
      }
  
      return res.status(200).json({
        message: "Trip fetched successfully",
        statusCode: 200,
        trip,
      });
    } catch (error) {
      console.error("Error fetching trip:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        statusCode: 500,
      });
    }
  };
  
/// update trip ///
const updateTrip = async (req, res) => {
    // Logic to update an existing trip

    try {
        const { id } = req.params;
        const { user_id, name, location, from_date, to_date, description, total_budget, cover_image } = req.body;

        //find the trip by id
        const trip = await Trip.findOne({ where: { id } });

        /// check if trip exists
        if (!trip) {
            return res.status(404).json({
                message: "Trip not found",
                statusCode: 404,
            });
        }

        // Ensure the user is the owner of this trip
        if (trip.user_id.toString() !== user_id.toString()) {
            return res.status(403).json({
                message: " You are not authorized to update this trip",
                statusCode: 403,
            });
        }

        // update the trip details
        await trip.update({
            name: name || trip.name,
            location: location || trip.location,
            from_date: from_date || trip.from_date,
            to_date: to_date || trip.to_date,
            description: description || trip.description,
            total_budget: total_budget || trip.total_budget,
            cover_image: cover_image || trip.cover_image,
        });

        return res.status(200).json({
            message: "Trip updated successfully",
            statusCode: 200,
            updateTrip: trip,
        });
    } catch (error) {
        console.error("Error updating trip:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            statusCode: 500,
        });
    }
};

/// delete trip by id ///
const deleteTrip = async (req, res) => {
    // Logic to delete a trip by its ID
    try {
        const { id } = req.params;
        const { user_id } = req.body;

        // find the user by id
        const user = await User.findOne({where: {id: user_id}});
        // check user exists
        if(!user){
            return res.status(404).json({
                message: "User not found",
                statusCode: 404,
            });
        }

        // find the trip by id //
        const trip = await Trip.findOne({ where: { id } });
        // check trip exists for user
        if (!trip) {
            return res.status(404).json({
                message: "Trip not found",
                statusCode: 404,
            });
        }

        if (trip.user_id.toString() !== user_id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this trip",
                statusCode: 403,
            });
        }

        await trip.destroy();

        return res.status(200).json({
            message: "Trip deleted successfully",
            statusCode: 200,
        });

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server error",
            statusCode: 500
        });
    }
};

module.exports = {
    createTrip,
    getAllTrips,
    getTripById,
    getTripsByUserId,
    updateTrip,
    deleteTrip
};
