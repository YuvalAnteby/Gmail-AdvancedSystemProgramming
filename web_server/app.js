const express = require('express')
const cors = require("cors");
require('dotenv').config();

const app = express()

// Use env variables, use defaults if none provided
const PORT = process.env.NODE_PORT || 3001;
const JSON_LIMIT = process.env.JSON_LIMIT || '10mb';
const REACT_URL = process.env.REACT_URL || 'http://localhost:3000';
/// todo remove
console.log('port: ' + PORT, ', REACT_URL:' + REACT_URL + ', JSON_LIMIT: ' + JSON_LIMIT + ', JWT_SECRET:' + process.env.JWT_SECRET);


app.use(express.json({limit: JSON_LIMIT}));
app.use(cors({origin: REACT_URL}));

const inbox = require('./routes/mails');
const users = require('./routes/users');
const labels = require('./routes/labels');
const blacklist = require('./routes/blacklist');

app.use('/api/mails', inbox);
app.use('/api', users);
app.use('/api/labels', labels);
app.use('/api/blacklist', blacklist);

app.listen(PORT);
