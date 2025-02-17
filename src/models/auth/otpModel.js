const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define(
    "OTP",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "otp", // only smallcase Explicit table name
      timestamps: true,
      createdAt: "created_at", // Custom name for the createdAt column
      updatedAt: "updated_at",
    }
  );

  return OTP;
};
