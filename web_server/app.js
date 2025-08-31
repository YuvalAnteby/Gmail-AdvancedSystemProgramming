const express = require('express')
const cors = require("cors");
require('dotenv').config();

const app = express()

// Use env variables, use defaults if none provided
const PORT = process.env.NODE_PORT || 3001;
const JSON_LIMIT = process.env.JSON_LIMIT || '10mb';
const REACT_URL = process.env.REACT_URL || 'http://localhost:3000';


app.use(express.json({limit: JSON_LIMIT}));
app.use(cors({origin: REACT_URL}));

const inbox = require('./routes/mails');
const users = require('./routes/users');
const labels = require('./routes/labels');
const blacklist = require('./routes/blacklist');
const { connectDB } = require('./config/db');
const health = require('./routes/health');
// Dev routes are disabled by default. Uncomment if needed for local debugging.
// const devUsers = require('./routes/devUsers');
// const devLabels = require('./routes/devLabels');
// const devMails = require('./routes/devMails');

app.use('/api/mails', inbox);
app.use('/api', users);
app.use('/api/labels', labels);
app.use('/api/blacklist', blacklist);
app.use('/health', health);
// app.use('/dev/users', devUsers);
// app.use('/dev/labels', devLabels);
// app.use('/dev/mails', devMails);

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err && err.message ? err.message : err);
        process.exit(1);
    }
};

start();
