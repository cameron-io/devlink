import mongoose, { HydratedDocument, SchemaDefinition } from 'mongoose'
import { User } from 'devlink-types'

const UserDefinition: SchemaDefinition<User> = {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}

const UserSchema = new mongoose.Schema(UserDefinition);

// Duplicate the ID field.
UserSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
    virtuals: true,
})

export type UserDocument = HydratedDocument<User>

export default mongoose.model('user', UserSchema)