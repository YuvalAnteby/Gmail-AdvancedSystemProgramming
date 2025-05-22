const express = require('express')
var app = express()

const inbox = require('./routes/mails');
const users = require('./routes/users');
app.use('/inbox', inbox);
app.use('/users', users);