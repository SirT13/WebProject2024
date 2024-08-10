const jwt = require('jsonwebtoken');
 
const verifyToken = (req, res, next) => {
    const auth_headers = req.header('Authorization');
    var token = auth_headers && auth_headers.split(' ')[1]
    if (!token) return res.status(401).send({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified; // Add the verified user data to the request object
        next();
    } catch (err) {
        res.status(400).send({ message: 'Invalid Token' });
    }
};

module.exports = verifyToken;