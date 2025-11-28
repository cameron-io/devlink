import express, { Router, Response, Request } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'
import gravatar from 'gravatar'
import auth from '../middleware/auth'
import User from '../models/user'
import Post from '../models/post'
import Profile from '../models/profile'

const accountsRouter: Router = express.Router()

const setLoginCookie = (res: Response, token: string) => {
    return res.setHeader('set-cookie', [
        `token=${token}; Path=/; HttpOnly; SameSite=strict;`,
    ])
}

const setLogoutCookie = (res: Response) => {
    return res.setHeader('set-cookie', [
        'token=null; Path=/; HttpOnly; MaxAge=-1; SameSite=strict;',
    ])
}

// @route    GET api/accounts/info
// @desc     Get Authenticated User Info
// @access   Public
accountsRouter.get('/info', auth, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?.id).select('-password')
        res.json(user)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    POST api/accounts/register
// @desc     Register user
// @access   Public
accountsRouter.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email address').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({
            min: 6,
        }),
    ],
    async (req: Request, res: any) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body

        try {
            let user = await User.findOne({ email })

            // See if user exists
            if (user) {
                return res.status(400).json({ error: [{ msg: 'User already exists' }] })
            }

            const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' })

            // Create instance of user (not saved)
            user = new User({
                name,
                email,
                password,
                avatar,
            })

            // Encrypt password
            const salt = await bcrypt.genSalt(10)

            user.password = await bcrypt.hash(password, salt)

            // Save user
            await user.save()

            // Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id,
                },
            }

            if (!process.env.JWT_SECRET) {
                throw 'Environment malformed.'
            }

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err
                    res.json({ token })
                }
            )
        } catch (err: any) {
            console.error(err.message)
            res.status(500).send('Server error')
        }
    }
)

// @route    POST api/accounts/login
// @desc     Authenticate user & get token
// @access   Public
accountsRouter.post(
    '/login',
    [
        check('email', 'Please include a valid email address').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req: Request, res: any) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body

        try {
            let user: any = await User.findOne({ email })

            // See if no user exists
            if (!user) {
                return res.status(401).json({ error: [{ msg: 'Invalid Credentials' }] })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(401).json({ error: [{ msg: 'Invalid Credentials' }] })
            }

            // Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id,
                },
            }

            if (!process.env.JWT_SECRET) {
                throw 'Environment malformed.'
            }

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err
                    if (token == undefined) throw 'token creation failure'
                    setLoginCookie(res, token)
                        .status(200)
                        .send()
                }
            )
        } catch (err: any) {
            console.error(err.message)
            res.status(500).send('Server error')
        }
    }
)

// set cookie MaxAge:   -1,

// @route    POST api/auth/logout
// @desc     Logout user & invalidate token
// @access   Public
accountsRouter.post('/logout', auth, (_req: Request, res: Response) => {
    setLogoutCookie(res)
        .status(200)
        .send()
})

// @route    GET api/accounts/info
// @desc     Get Authenticated User Info
// @access   Public
accountsRouter.get('/info', auth, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?.id).select('-password')
        res.json(user)
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route    DELETE api/accounts
// @desc     Delete profile, user & posts
// @access   Private
accountsRouter.delete('/', auth, async (req: Request, res: Response) => {
    try {
        // Remove user posts
        await Post.deleteMany({ user: req.user?.id })
        // Remove profile
        await Profile.findOneAndDelete({ user: req.user?.id })
        // Remove user
        await User.findOneAndDelete({ _id: req.user?.id })

        setLogoutCookie(res)
            .status(200)
            .send()
    } catch (err: any) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

export default accountsRouter
