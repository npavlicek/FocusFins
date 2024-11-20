const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

module.exports = async function updateCoralHandler(req, res) {
    if (!req.body.token || !req.body.coral || req.body.coralId === undefined) {
        return res.status(400).json({ error: "Invalid request" });
    }

    const dbClient = new MongoClient(process.env.MONGODB_URI);
    try {
        await dbClient.connect();
        let db = dbClient.db("FocusFins");

        const decoded = jwt.verify(req.body.token, req.secretToken);

        /**
         * {
        *   token: <token>,
        *   coralId: id
        *   coral: {
        *       <coral data>
        *   }
         */

        await db.collection('reefs').updateOne({
            userId: decoded.id,
            "corals.coralId": req.body.coralId
        }, {
            $set: { "corals.$": req.body.coral }
        }, {
            upsert: true
        });

        res.sendStatus(200);
    } catch (err) {
        console.error("Error at /api/updateCoral route: " + err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await dbClient.close();
    }
}
