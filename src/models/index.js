const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL || "postgres://postgres:admin@localhost:5432/travelDB");

// Import models
const UserModel = require("./auth/userModel");
const OtpModel = require("./auth/otpModel");
const TripModel = require("./trips/tripModels");
const TripMediaModel = require("./trips/trip_media_model");
const TripMediaLikeModel = require("./trips/trip_media_like_model");

// Initialize models
const User = UserModel(sequelize, DataTypes);
const OTP = OtpModel(sequelize, DataTypes);
const Trip = TripModel(sequelize, DataTypes);
const TripMedia = TripMediaModel(sequelize, DataTypes);
const TripMediaLikes = TripMediaLikeModel(sequelize, DataTypes);

// **Define Associations**
User.hasMany(Trip, { foreignKey: "user_id", as: "trips" });
Trip.belongsTo(User, { foreignKey: "user_id", as: "user" }); // This ensures you can fetch the trip along with user details

// Export models
module.exports = {
  sequelize,
  Sequelize,
  User,
  OTP,
  Trip,
  TripMedia,
  TripMediaLikes,
};
