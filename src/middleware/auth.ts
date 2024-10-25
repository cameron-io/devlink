import jwt from 'jsonwebtoken'

export default function (req: any, res: any, next: any) {
    // Get token from header
    const cookies = req.cookies
    if (!cookies) return res.status(401).json({ msg: 'No cookies provided.' })

    const token = cookies.token

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied.' })
    }

    if (!process.env.JWT_SECRET) {
        throw 'Environment malformed.'
    }

    // Verify token
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded.user
        next()
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token.', err: err })
    }
}
