const { MongoClient, ObjectId } = require('mongodb');

module.exports = async function getCoralsHandler(req, res) {
    if (!req.body.username)
        return res.status(400).json({ error: "Invalid request" });

    const dbClient = new MongoClient(process.env.MONGODB_URI);
    try {
        await dbClient.connect();
        let db = dbClient.db("FocusFins");

        const user = await db.collection('users').findOne({ username: req.body.username });

        if (user) {
            const reef = await db.collection('reefs').findOne({ userId: user._id.toString() });
            if (reef) {
                res.status(200).json(reef.corals);
            } else {
                const user = await db.collection('users').findOne({ _id: new ObjectId(req.body.id) });
                if (user) {
                    const newReefRecord = {
                        userId: req.body.id,
                        currentCoralIdx: 0,
                        corals: []
                    };
                    await db.collection('reefs').insertOne(newReefRecord);
                    res.status(200).json(newReefRecord.corals);
                } else {
                    res.status(400).json({ error: "user does not exist" });
                }
            }
        } else {
            res.status(400).json({ error: 'user does not exist' });
        }
    } catch (err) {
        console.error("Error at /api/updateCorals route: " + err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await dbClient.close();
    }

}
