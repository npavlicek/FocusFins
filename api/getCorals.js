const { MongoClient, ObjectId } = require('mongodb');
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
            if (val) {
                res.status(200).json(val);
            } else {
                db.collection('users').findOne({ _id: new ObjectId(req.body.id) }).then(val => {
                    if (val) {
                        db.collection('reefs').insertOne({
                            userId: req.body.id,
                            currentCoralIdx: 0,
                            corals: []
                        }).then(val => {
                            res.status(200).json({
                                userId: req.body.id,
                                currentCoralIdx: 0,
                                corals: []
                            });
                        }).catch(err => {
                            throw new Error(err);
                        });
                    } else {
                        throw new Error("user does not exist");
                    }
                }).catch(err => {
                    throw new Error(err);
                });
            }
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        });
    } catch (err) {
        console.error("Error at /api/updateCorals route: " + err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
