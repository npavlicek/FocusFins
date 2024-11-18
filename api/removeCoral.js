const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

module.exports = async function removeCoralHandler(req, res) {
    if (!req.body.token || req.body.coralId === undefined) {
        console.error(req.body);
        return res.status(400).json({ error: "Invalid request" });
    }

    try {
        const dbClient = new MongoClient(process.env.MONGODB_URI);
        await dbClient.connect();
        let db = dbClient.db("FocusFins");

        jwt.verify(req.body.token, req.secretToken, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Unauthenticated" });
            } else {

                /**
                * {
                *   token: <token>,
                *   coralId: <id>
                * }
                *
                */

                db.collection('reefs').updateOne({
                    userId: decoded.id
                }, {
                    $pull: { corals: { coralId: req.body.coralId } }
                }, {
                    upsert: true
                }).then(val => {
                    console.log(val);
                    return res.sendStatus(200);
                }).catch(err => {
                    console.error(err);
                    res.status(500).json({ error: "Internal server error" });
                });
            }
        });
    } catch (err) {
        console.error("Error at /api/updateCorals route: " + err);
        res.status(500).json({ error: "Internal server error" });
    }
}
