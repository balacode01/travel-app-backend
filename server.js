const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3000;

sequelize.sync({alter: true}).then(() => {
    console.log("Database connected successfully")
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:3000`);
    });
}).catch((error) => {
    console.error('unable to connect to the database', error);
});




/// run command "npx nodemon server.js" ///