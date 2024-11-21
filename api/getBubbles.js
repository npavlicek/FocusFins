const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

module.exports = async function getBubblesHandler(req, res) {
    if (req.body.token === undefined) {
        return res.status(400).json({ error: 'invalid request' });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        const decoded = jwt.verify(req.body.token, req.secretToken);
        await client.connect();
        const db = client.db("FocusFins");

        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json({ bubbles: user.bubbles });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
}
