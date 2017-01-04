/**
* npm run dev
*/

// main starting point of the server application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
// morgan logs incoming requests, and we're using it for debugging
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// db setup - plantogo is the name of the database we chose for this app
mongoose.connect('mongodb://localhost:plantogo/plantogo');

// app setup
// app.use sets up functions as middleware
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on', port);
