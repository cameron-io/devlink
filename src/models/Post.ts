import mongoose, { SchemaDefinition } from 'mongoose'
import { Post } from 'devlink-types'
import { HydratedDocument } from 'mongoose';

const PostDefinition: SchemaDefinition<Post> = {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    text: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
            },
        },
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
            },
            text: {
                type: String,
                required: true,
            },
            name: {
                type: String,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
}

const PostSchema = new mongoose.Schema(PostDefinition);


// Duplicate the ID field.
PostSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

// Ensure virtual fields are serialised.
PostSchema.set('toJSON', {
    virtuals: true,
})

export type PostDocument = HydratedDocument<Post>

export default mongoose.model('post', PostSchema)