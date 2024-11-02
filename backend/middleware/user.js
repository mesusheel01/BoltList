import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
    const partialToken = req.headers.authorization;
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

export default authenticateUser;
