const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

module.exports = async function decBubblesHandler(req, res) {
    if (req.body.token === undefined || req.body.amount === undefined) {
        res.status(400).json({ error: 'invalid request' });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        const decoded = jwt.verify(req.body.token, req.secretToken);
        await client.connect();
        const db = client.db("FocusFins");

        const dbRes = await db.collection('users').updateOne({ _id: new ObjectId(decoded.id) }, {
            $inc: { bubbles: -req.body.amount }
        });

        if (dbRes.modifiedCount === 1) {
            res.sendStatus(200);
        } else {
            res.status(400).json({ error: 'user does not exist' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
}
