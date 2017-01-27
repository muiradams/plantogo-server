const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// MONGODB_URI contains the URI for the Heroku mLab Add-on
const mongoURI = MONGODB_URI || 'mongodb://localhost:plantogo/plantogo';
mongoose.connect(mongoURI);

// App setup
// app.use sets up functions as middleware
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on', port);
