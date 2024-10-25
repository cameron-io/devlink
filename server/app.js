require('dotenv').config()

const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db')

const app = express()

// Connect database
connectDB()

// Init middleware
app.use(express.json({ extended: false }))
app.use(
    cors({
        origin: 'http://' + process.env.CLIENT_HOST + ':' + process.env.CLIENT_PORT,
        credentials: true,
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
    })
)

app.get('/', (_req, res) => res.send('API Running'))

// Define routes
app.use('/api/accounts', require('./routes/api/accounts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

const PORT = process.env.SERVER_PORT || 5000

var listener = app.listen(PORT, () =>
    console.log('Server listening on port ' + listener.address().port)
)
