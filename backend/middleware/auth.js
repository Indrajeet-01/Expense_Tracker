import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    // Get the token from the request headers, query parameters, or cookies
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(" ")[1]

        jwt.verify(token,"jwtkey",(err,user)=>{
            if(err) res.status(403).json("Token is not valid")
            req.user = user
            next()
        })
    } else {
        return res.status(401).json("You are not authenticated")
    }
};

