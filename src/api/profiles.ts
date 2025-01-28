import express, { Router } from 'express'
import axios from 'axios'
import { validationResult } from 'express-validator'
import auth from '../middleware/auth'
import Profile from '../models/Profile'

const profilesRouter: Router = express.Router()

// @route    GET api/profiles/me
// @desc     Get current user profile
// @access   Private
profilesRouter.get('/me', auth, async (req: any, res: any) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found for this user' })
        }

        res.json(profile)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route    POST api/profiles
// @desc     Create or update user profile
// @access   Private
profilesRouter.post('/', auth, async (req: any, res: any) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        })
    }

    // Pull from body
    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
    } = req.body

    // Initialize profile object
    const profileFields: any = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) profileFields.skills = skills

    // Initialize social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    try {
        // Look for user profile
        let profile: any = await Profile.findOne({ user: req.user.id })

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            )

            return res.json(profile)
        }

        // Create
        profile = new Profile(profileFields)

        // Save
        await profile.save()

        res.json(profile)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    GET api/profiles
// @desc     Get all profiles
// @access   Public
profilesRouter.get('/', async (req: any, res: any) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    GET api/profiles/user/:user_id
// @desc     Get profile by user ID
// @access   Public
profilesRouter.get('/user/:user_id', async (req: any, res: any) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate('user', ['name', 'avatar'])

        if (!profile) return res.status(400).json({ msg: 'Profile not found.' })

        res.json(profile)
    } catch (err: any) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found.' })
        }
        res.status(500).send('Server Error')
    }
})

// @route    PUT api/profiles/experience
// @desc     Add profile experience
// @access   Private
profilesRouter.put('/experience', auth, async (req: any, res: any) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { title, company, location, from, to, current, description } = req.body

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    }

    try {
        const profile: any = await Profile.findOne({ user: req.user.id })

        profile.experience.unshift(newExp)

        await profile.save()

        res.json(profile)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    DELETE api/profiles/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
profilesRouter.delete('/experience/:exp_id', auth, async (req: any, res: any) => {
    try {
        const profile: any = await Profile.findOne({ user: req.user.id })

        // Get remove index
        const removeIndex = profile.experience
            .map((item: any) => item.id)
            .indexOf(req.params.exp_id)

        profile.experience.splice(removeIndex, 1)

        await profile.save()

        res.json(profile)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    PUT api/profiles/education
// @desc     Add profile education
// @access   Private
profilesRouter.put('/education', auth, async (req: any, res: any) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Body requirements
    const { school, degree, fieldofstudy, from, to, current, description } = req.body
    // Instantiated body
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
    }

    try {
        const profile: any = await Profile.findOne({ user: req.user.id })

        profile.education.unshift(newEdu)

        await profile.save()

        res.json(profile)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    DELETE api/profiles/education/:edu_id
// @desc     Delete education from profile
// @access   Private
profilesRouter.delete('/education/:edu_id', auth, async (req: any, res: any) => {
    try {
        const profile: any = await Profile.findOne({ user: req.user.id })

        // Get remove index
        const removeIndex = profile.education
            .map((item: any) => item.id)
            .indexOf(req.params.edu_id)

        profile.education.splice(removeIndex, 1)

        await profile.save()

        res.json(profile)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    GET api/profiles/github/:username
// @desc     Get user repos from GitHub
// @access   Public
profilesRouter.get('/github/:username', (req: any, res: any) => {
    try {
        const options: any = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' },
        }

        const response: any = axios.get(options)
        if (response.statusCode !== 200) {
            return res.status(404).json({ msg: 'No GitHub profile found.' })
        }
        res.json(JSON.parse(response.body))
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

export default profilesRouter
