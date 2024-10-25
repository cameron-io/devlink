import express, { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'
import User from '../../models/User'
import auth from '../../middleware/auth'

const accountsRouter: Router = express.Router()

// @route    GET api/accounts/info
// @desc     Get Authenticated User Info
// @access   Public
accountsRouter.get('/info', auth, async (req: any, res: any) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
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
    async (req: any, res: any) => {
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

            // Create instance of user (not saved)
            user = new User({
                name,
                email,
                password,
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
    async (req: any, res: any) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body

        try {
            let user = await User.findOne({ email })

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
                    res.setHeader('set-cookie', [
                        `token=${token}; Path=/; HttpOnly; SameSite=strict;`,
                    ])
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
accountsRouter.post('/logout', auth, (_req: any, res: any) => {
    res.setHeader('set-cookie', [
        `token=null; Path=/; HttpOnly; MaxAge=-1; SameSite=strict;`,
    ])
        .status(200)
        .send()
})

export default accountsRouter
