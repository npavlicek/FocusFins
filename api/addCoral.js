const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

module.exports = async function addCoralHandler(req, res) {
    if (!req.body.token || !req.body.coral) {
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
        *   coral: {
        *       <coral data>
        *   }
         */

        await db.collection('reefs').updateOne({
            userId: decoded.id
        }, {
            $push: { corals: req.body.coral },
            $inc: { currentCoralIdx: 1 }
        }, {
            upsert: true
        });

        res.sendStatus(200);
    } catch (err) {
        console.error("Error at /api/updateCorals route: " + err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await dbClient.close();
    }
}
