const {Sequelize, DataTypes} = require('sequelize');


const sequelize = new Sequelize(process.env.DB_URL || 'postgres://postgres:admin@localhost:5432/travelDB');

/// import the model
const UserModel = require('./auth/userModel');
const OtpModel = require('./auth/otpModel');
const TripModel = require('./trips/tripModels');
const TripMediaModel = require('./trips/trip_media_model');
const TripMediaLikeModel = require('./trips/trip_media_like_model');


// initialize the model
const User = UserModel(sequelize, DataTypes);
const OTP = OtpModel(sequelize, DataTypes);
const Trip = TripModel(sequelize, DataTypes);
const TripMedia = TripMediaModel(sequelize, DataTypes);
const TripMediaLikes = TripMediaLikeModel(sequelize, DataTypes);


module.exports = {
    User,
    OTP,
    Trip,
    TripMedia,
    TripMediaLikes,
    Sequelize,
}