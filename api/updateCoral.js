const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

module.exports = async function updateCoralHandler(req, res) {
    if (!req.body.token || !req.body.coral || req.body.coralId === undefined) {
        return res.status(400).json({ error: "Invalid request" });
    }

    try {
        const dbClient = new MongoClient(process.env.MONGODB_URI);
        await dbClient.connect();
        let db = dbClient.db("FocusFins");

        jwt.verify(req.body.token, req.secretToken, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: "Unauthenticated" });
            } else {

                /**
                 * {
                *   token: <token>,
                *   coralId: id
                *   coral: {
                *       <coral data>
                *   }
                 */

                db.collection('reefs').updateOne({
                    userId: decoded.id,
                    "corals.coralId": req.body.coralId
                }, {
                    $set: { "corals.$": req.body.coral }
                }, {
                    upsert: true
                }).then(() => {
                    res.sendStatus(200);
                }).catch(err => {
                    throw new Error(err);
                });
            }
        });
    } catch (err) {
        console.error("Error at /api/updateCoral route: " + err);
        res.status(500).json({ error: "Internal server error" });
    }
}
