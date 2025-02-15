const {Sequelize, DataTypes} = require('sequelize');


const sequelize = new Sequelize(process.env.DB_URL || 'postgres://postgres:admin@localhost:5432/travelDB');

/// import the model
const UserModel = require('./userModel');

// initialize the model
const User = UserModel(sequelize, DataTypes);

module.exports = {
    User,
}