const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

module.exports = async function loginHandler(req, res) {
    if (req.body.username === undefined || req.body.password === undefined) {
        res.status(400).json({ error: "invalid request" });
    }

    // connect to db
    const dbClient = new MongoClient(process.env.MONGODB_URI);
    try {
        await dbClient.connect();
        let db = dbClient.db("FocusFins");

        const { username, password } = req.body;

        const user = await db.collection('users').findOne({ username: username });

        // If username doesnt exist
        if (!user) {
            res.status(401).json({ error: "User does not exist" });
        } else {
            if (user.emailVerified) {
                const passwordMatch = await bcrypt.compare(password, user.password);

                // if passwords dont match
                if (!passwordMatch) {
                    res.status(401).json({ error: "Invalid login credentials" });
                } else {
                    const token = jwt.sign({ id: user._id }, req.secretToken, { expiresIn: '1800s' });

                    res.status(200).json({
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token
                    });
                }
            } else {
                res.status(401).json({ emailVerified: false, error: "Email not verified" });
            }
        }
    } catch (err) {
        console.error("Error at /api/login route: " + err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await dbClient.close();
    }
}
