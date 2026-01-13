import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
        return res.status(401).json({
            msg: 'Unauthorized: No token provided'
        });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            msg: 'Unauthorized: Invalid token format'
        });
    }

    const token = authHeader.split(' ')[1];

    // Check if token exists after split
    if (!token) {
        return res.status(401).json({
            msg: 'Unauthorized: Token is missing'
        });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                // Differentiate between expired and invalid tokens
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        msg: 'Unauthorized: Token has expired'
                    });
                }
                return res.status(403).json({
                    msg: 'Forbidden: Invalid token'
                });
            }
            req.userId = user.userId;
            next();
        });
    } catch (err) {
        res.status(500).json({
            msg: 'Error during authentication'
        });
    }
};

export default authenticateUser;
