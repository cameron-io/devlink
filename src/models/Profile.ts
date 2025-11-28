import mongoose, { SchemaDefinition } from 'mongoose'
import { Profile } from 'devlink-types'
import { HydratedDocument } from 'mongoose';

const ProfileDefinition: SchemaDefinition<Profile> = {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    company: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    status: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    bio: {
        type: String,
    },
    gitHubUsername: {
        type: String,
    },
    experience: [
        {
            title: {
                type: String,
                required: true,
            },
            company: {
                type: String,
                required: true,
            },
            location: {
                type: String,
            },
            from: {
                type: Date,
                required: true,
            },
            to: {
                type: Date,
            },
            current: {
                type: Boolean,
                default: false,
            },
            description: {
                type: String,
            },
        },
    ],
    education: [
        {
            school: {
                type: String,
                required: true,
            },
            degree: {
                type: String,
                required: true,
            },
            fieldofstudy: {
                type: String,
                required: true,
            },
            from: {
                type: Date,
                required: true,
            },
            to: {
                type: Date,
            },
            current: {
                type: Boolean,
                default: false,
            },
            description: {
                type: String,
            },
        },
    ],
    social: {
        youtube: {
            type: String,
        },
        twitter: {
            type: String,
        },
        facebook: {
            type: String,
        },
        linkedin: {
            type: String,
        },
        instagram: {
            type: String,
        },
    },
    date: {
        type: Date,
        default: Date.now,
    },
}

const ProfileSchema = new mongoose.Schema(ProfileDefinition);

// Duplicate the ID field.
ProfileSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

// Ensure virtual fields are serialised.
ProfileSchema.set('toJSON', {
    virtuals: true,
})

export type ProfileDocument = HydratedDocument<Profile>

export default mongoose.model('profile', ProfileSchema)