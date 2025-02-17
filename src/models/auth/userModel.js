const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database").default; // Import Sequelize instance

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      email_address: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      profile_picture: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      social_links: {
        type: DataTypes.JSONB, // PostgreSQL JSONB for structured data
        allowNull: true,
      },
    },
    {
      tableName: "users", // Explicit table name
      timestamps: true,
      createdAt: "created_at", // Custom name for the createdAt column
      updatedAt: "updated_at",
    }
  );

  return User;
};
