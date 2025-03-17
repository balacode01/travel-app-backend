const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database").default; // Import Sequelize instance

module.exports = (sequelize, DataTypes) => {
  const TripMedia = sequelize.define(
    "TripMedia",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      trip_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "trips", // References the trips table
          key: "id",
        },
        onDelete: "CASCADE",
      },
      media_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      media_type: {
        type: DataTypes.ENUM("image", "video"),
        allowNull: false,
      },
      file_size: {
        type: DataTypes.BIGINT,
        allowNull: true,
        validate: {
          min: 0, // Ensure file size is non-negative
        },
      },
      file_format: {
        type: DataTypes.STRING(10), // Store format like jpg, png, mp4
        allowNull: true,
      },
      is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "trip_media", // Explicit table name
      timestamps: true,
      createdAt: "created_at", // Match DB column name
      updatedAt: "updated_at",
    }
  );

  return TripMedia;
};
