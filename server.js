const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    console.log('hello world');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:3000`);
    });
}).catch((error) => {
    console.error('unable to connect to the database', error);
})