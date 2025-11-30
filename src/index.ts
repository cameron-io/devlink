require('dotenv').config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

import db from './config/db'
import accountsRouter from './api/accounts'
import profilesRouter from './api/profiles'
import postsRouter from './api/posts'

// Environment Variables
const clientHost: string = process.env.CLIENT_HOST!
const serverHost: string = process.env.SERVER_HOST!
const serverPort: number = parseInt(process.env.SERVER_PORT!);

// Connect Database
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

// Init Middleware
app.use(express.json())
app.use(
    cors({
        origin: [`http://${clientHost}`],
        credentials: true,
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
    })
)
app.use(cookieParser())

// Define Routes
app.use('/api/accounts', accountsRouter)
app.use('/api/profiles', profilesRouter)
app.use('/api/posts', postsRouter)

var listener = app.listen(serverPort, serverHost, () => {
    const addr: any = listener.address()
    if (addr == null) {
        throw 'Unexpected failure during listen'
    }
    console.log(`Server listening on: ${addr.address}:${addr.port}`)
})
