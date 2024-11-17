const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

module.exports = async function getCoralsHandler(req, res) {
    if (!req.body.id) {
        return res.status(400).json({ error: "Invalid request" });
    }

    try {
        const dbClient = new MongoClient(process.env.MONGODB_URI);
        await dbClient.connect();
        let db = dbClient.db("FocusFins");

        db.collection('reefs').findOne({ userId: req.body.id }).then(val => {
            return res.status(200).json({
                corals: val.corals
            });
        });

    } catch (err) {
        console.error("Error at /api/updateCorals route: " + err);
        res.status(500).json({ error: "Internal server error" });
    }
}
