const {Sequelize, DataTypes} = require('sequelize');


const sequelize = new Sequelize(process.env.DB_URL || 'postgres://postgres:admin@localhost:5432/travelDB');

/// import the model
const UserModel = require('./auth/userModel');
const OtpModel = require('./auth/otpModel');

// initialize the model
const User = UserModel(sequelize, DataTypes);
const OTP = OtpModel(sequelize, DataTypes);

module.exports = {
    User,
    OTP
}