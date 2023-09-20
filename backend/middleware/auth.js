import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    // Get the token from the request headers, query parameters, or cookies
    const token = req.cookies.access_token

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const decoded = jwt.verify(token, 'jwtkey')
        req.user = decoded

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is invalid' })
    }
};

