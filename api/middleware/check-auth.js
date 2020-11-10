const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, 'secret');
        req.userDate = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Auth faild' })
    }
}