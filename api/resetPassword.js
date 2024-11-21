const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");

module.exports = async function resetPasswordHandler(req, res) {
    if (req.body.email === undefined) {
        return res.status(400).json({ error: "missing email" });
    }

    const dbClient = new MongoClient(process.env.MONGODB_URI);
    try {
        await dbClient.connect();
        const db = dbClient.db("FocusFins");

        const user = await db.collection("users").findOne({
            email: req.body.email
        });

        if (user) {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'focusfins@gmail.com',
                    pass: process.env.GMAIL_PASS
                }
            });

            const key = jwt.sign({ email: user.email }, req.secretToken);
            const verifyURL = `http://focusfins.org/resetPassword?key=${key}`;
            const emailBody = `Reset your passowrd with this link: ${verifyURL}`;

            transporter.sendMail({
                from: "info@focusfins.com",
                to: user.email,
                subject: "Reset your password!",
                text: emailBody
            }, (error, info) => {
                if (error) {
                    console.error(error);
                }
            });

            res.sendStatus(200);
        } else {
            res.status(400).json({ error: "email is not registered" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await dbClient.close();
    }
}
