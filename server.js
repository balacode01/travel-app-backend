const app = require("./src/app");
const sequelize = require("./src/config/database");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate(); // Check DB connection
    console.log(" Database connected successfully");

    await sequelize.sync({ alter: true }); // Sync models (use migrations in production)
    console.log(" Database synchronized");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });

    // Graceful shutdown handling
    process.on("SIGINT", async () => {
      console.log("\n Shutting down gracefully...");
      await sequelize.close();
      console.log("🔌 Database connection closed");
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("\n Shutting down due to termination signal...");
      await sequelize.close();
      console.log("🔌 Database connection closed");
      process.exit(0);
    });
  } catch (error) {
    console.error(" Unable to connect to the database:", error);
    process.exit(1); // Exit the process with failure
  }
};

// Start the server
startServer();



/// run command "npx nodemon server.js" ///