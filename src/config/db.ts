import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb://' +
                process.env.DATABASE_USER +
                ':' +
                process.env.DATABASE_PASS +
                '@' +
                process.env.DATABASE_HOST +
                ':' +
                process.env.DATABASE_PORT +
                '/' +
                process.env.DATABASE_NAME
        )

        console.log('MongoDB connected')
    } catch (err: any) {
        console.error(err.message)
        // Exit process with failure
        process.exit(1)
    }
}
