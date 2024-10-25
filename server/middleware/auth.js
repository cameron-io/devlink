const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    // Get token from header
    const cookies = req.cookies
    if (!cookies) return res.status(401).json({ msg: 'No cookies provided.' })

    const token = cookies.token

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied.' })
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded.user
        next()
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token.', err: err })
    }
}
