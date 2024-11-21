const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

module.exports = async function submitPasswordResetHandler(req, res) {
    if (req.body.key === undefined || req.body.password === undefined) {
        return res.sendStatus(400);
    }

    const dbClient = new MongoClient(process.env.MONGODB_URI);
    try {
        await dbClient.connect();
        const db = dbClient.db("FocusFins");

        const decoded = jwt.decode(req.body.key, req.secretToken);

        const user = await db.collection("users").findOne({
            email: decoded.email
        });

        const hashedPass = await bcrypt.hash(req.body.password, 10);

        if (user) {
            await db.collection("users").updateOne({
                email: decoded.email
            }, {
                $set: { password: hashedPass }
            });
            res.sendStatus(200);
        } else {
            res.status(400).json({ error: "Invalid email" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await dbClient.close();
    }
};
