const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database").default; // Import Sequelize instance

module.exports = (sequelize, DataTypes) => {
  const TripMediaLike = sequelize.define(
    "TripMediaLike",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      media_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "trip_media", // Referencing the trip_media table
          key: "id",
        },
        onDelete: "CASCADE",
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
    },
    {
      tableName: "trip_media_likes", // Explicit table name
      timestamps: true,
      createdAt: "created_at", // Match DB column name
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["media_id", "user_id"], // Enforce unique likes per user per media
        },
      ],
    }
  );

  return TripMediaLike;
};
