const express = require('express')
const cors = require("cors");

const app = express()

app.use(express.json());
//app.use(cors({ origin: "http://localhost:3000" }));
app.use(cors());


const inbox = require('./routes/mails');
const users = require('./routes/users');
const labels = require('./routes/labels');
const blacklist = require('./routes/blacklist');

app.use('/api/mails', inbox);
app.use('/api', users);
app.use('/api/labels', labels);
app.use('/api/blacklist', blacklist);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
