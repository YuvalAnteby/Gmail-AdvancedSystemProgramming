const express = require('express')
const app = express()

app.use(express.json());

const inbox = require('./routes/mails');
const users = require('./routes/users');
const labels = require('./routes/labels');

app.use('/api/mails', inbox);
app.use('/api/users', users);
app.use('/api/labels', labels);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
