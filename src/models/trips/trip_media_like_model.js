const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database").default;

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
          model: "trip_media",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "trip_media_likes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["media_id", "user_id"], // Prevents duplicate likes
        },
      ],
    }
  );

  return TripMediaLike;
};
