const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database").default; // Import Sequelize instance

module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define(
    "Trip",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "users", // Referencing the users table
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      from_date: {
        type: DataTypes.DATEONLY, // Stores only date (no time)
        allowNull: false,
      },
      to_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      total_budget: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0, // Budget must be non-negative
        },
      },
      cover_image: {
        type: DataTypes.TEXT, // Stores image URL
        allowNull: true,
      },
    },
    {
      tableName: "trips", // Explicit table name
      timestamps: true,
      createdAt: "created_at", // Match DB column name
      updatedAt: "updated_at",
    }
  );

  return Trip;
};
