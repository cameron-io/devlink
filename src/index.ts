require('dotenv').config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

import db from './config/db'
import accountsRouter from './api/accounts'
import profilesRouter from './api/profiles'
import postsRouter from './api/posts'

// Connect database
(async () => {
    try {
        await mongoose.connect(db)
        console.log('MongoDB connected')
    } catch (err: any) {
        console.error(err.message)
        process.exit(1)
    }
})()

const app = express()

// Init middleware
app.use(express.json())
app.use(
    cors({
        origin: ['http://' + process.env.CLIENT_HOST],
        credentials: true,
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
    })
)
app.use(cookieParser())

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
