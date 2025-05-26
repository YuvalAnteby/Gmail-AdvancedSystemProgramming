const express = require('express')
var app = express()

const inbox = require('./routes/mails');
const users = require('./routes/users');
app.use('/api/inbox', inbox);
app.use('/api/users', users);