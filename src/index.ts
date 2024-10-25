require('dotenv').config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import accountsRouter from './routes/accounts'
import profilesRouter from './routes/profiles'
import postsRouter from './routes/posts'

import { connectDB } from './config/db'

const app = express()
app.use(cookieParser())

// Connect database
connectDB()

// Init middleware
app.use(express.json())
app.use(
    cors({
        origin: 'http://' + process.env.CLIENT_HOST + ':' + process.env.CLIENT_PORT,
        credentials: true,
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
    })
)

// Define routes
app.use('/api/accounts', accountsRouter)
app.use('/api/profiles', profilesRouter)
app.use('/api/posts', postsRouter)

const PORT = process.env.SERVER_PORT || 5000

var listener = app.listen(PORT, () => {
    const addr: any = listener.address()
    if (addr == null) {
        throw 'Unexpected failure during listen'
    }
    console.log('Server listening on port ' + addr.port)
})
