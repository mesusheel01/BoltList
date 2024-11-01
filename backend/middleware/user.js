// Start writing from here

import jwt from 'jsonwebtoken';

const userMiddleware = (req, res, next) => {
    const partialToken = req.headers.authorization;

    // Check if Authorization header exists and is in the expected format
    if (!partialToken || !partialToken.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized: No token provided'
        });
    }

    const token = partialToken.split(' ')[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: 'Forbidden: Invalid Token'
                });
            }
            req.userId = user.userId;
            next();
        });
    } catch (err) {
        res.status(500).json({
            msg: 'Error during authenticating user!'
        });
    }
};

export default userMiddleware;
