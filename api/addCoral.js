const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

module.exports = async function addCoralHandler(req, res) {
    if (!req.body.token || !req.body.coral) {
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
                *   coral: {
                *       <coral data>
                *   }
                 */

                db.collection('reefs').updateOne({
                    userId: decoded.id
                }, {
                    $push: { corals: req.body.coral },
                    $inc: { currentCoralIdx: 1 }
                }, {
                    upsert: true
                });
            }
        });
    } catch (err) {
        console.error("Error at /api/updateCorals route: " + err);
        res.status(500).json({ error: "Internal server error" });
    }
}
