const express = require('express')
var app = express()

const inbox = require('./routes/inbox');
const users = require('./routes/users');
app.use('/inbox', inbox);
app.use('/users', users);