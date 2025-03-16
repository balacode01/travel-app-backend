const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();


// middleware 
app.use(bodyParser.json());

// API Routes 
app.get('/', (req, res,next) => {
    res.send('Server is running!');
});

app.use('/api', routes);

app.use((err, req, res, next) => {
    res.status(500).json({
        message: "Internal Server Error"
    });
});

module.exports = app;