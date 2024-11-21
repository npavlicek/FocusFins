const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

module.exports = async function verifyEmailHandler(req, res) {
    if (req.body.key === undefined) {
        return res.status(400).json({ error: "key required" });
    }

    const dbClient = new MongoClient(process.env.MONGODB_URI);
    try {
        await dbClient.connect();
        const db = dbClient.db("FocusFins");

        const decoded = jwt.decode(req.body.key, req.secretToken);

        const user = await db.collection("users").findOne({
            email: decoded.email
        });

        if (user) {
            await db.collection("users").updateOne({
                email: decoded.email
            }, {
                $set: { emailVerified: true }
            });
            res.sendStatus(200);
        } else {
            res.status(400).json({ error: "Invalid key" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    } finally {

    }
};
