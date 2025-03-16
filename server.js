const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3000;

sequelize.sync({alter: true}).then(() => {
    console.log("Database connected successfully")
    app.listen(PORT, "0.0.0.0",() => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
}).catch((error) => {
    console.error('unable to connect to the database', error);
});




/// run command "npx nodemon server.js" ///