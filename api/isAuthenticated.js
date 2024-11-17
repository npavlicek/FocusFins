const jwt = require('jsonwebtoken');

module.exports = function isAuthenticated(req, res) {
    jwt.verify(req.body.token, req.secretToken, (err, decoded) => {
        if (err) {
            res.status(401).json({ error: "Unauthenticated" });
        } else {
            res.sendStatus(200);
        }
    });
}
