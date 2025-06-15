// tokenManager

const users = require('../models/users')
const jwt = require('jsonwebtoken')
// need to replace with a secure key
const key = "my-secret-key"

exports.createToken = (req, res) =>{
    // Extract and check for missing fields in request's body
    const { username, password } = req.body
    if (!username || !password)
        return res.status (400).json({ error : 'Username, Password are required' })

    // Get token (= user ID) by the given username + password
    const userId = users.getUserID(username, password)

    if (!userId)
        return res.status (404).json({ error: 'User does not exist' })
    jwt.sign({ userId }, key, (err, token) => {
        if (err) {
            console.error("Error signing token:", err)
            return res.status(500).json({error: 'Internal server error'})
        }
        res.status(201).json({ token })
    })
}