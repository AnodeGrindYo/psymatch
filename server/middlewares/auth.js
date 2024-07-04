const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Auth Error: Token not provided' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        console.error(e);
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'TokenExpiredError' });
        }
        res.status(500).json({ message: 'Invalid Token' });
    }
};

module.exports = auth;
