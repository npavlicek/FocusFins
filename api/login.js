const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

module.exports = async function loginHandler(req, res) {
    // connect to db
    const dbClient = new MongoClient(process.env.MONGODB_URI);
    try {
        await dbClient.connect();
        let db = dbClient.db("FocusFins");

        const { username, password } = req.body;

        const user = await db.collection('users').findOne({ username: username });

        // If username doesnt exist
        if (!user)
            return res.status(401).json({ error: "Invalid login credentials" });

        const passwordMatch = await bcrypt.compare(password, user.password);

        // if passwords dont match
        if (!passwordMatch)
            return res.status(401).json({ error: "Invalid login credentials" });

        const token = jwt.sign({ id: user._id }, req.secretToken, { expiresIn: '1800s' });

        res.status(200).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            token
        });
    } catch (err) {
        console.error("Error at /api/login route: " + err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await dbClient.close();
    }
}
