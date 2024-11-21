const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

module.exports = async function registerHandler(req, res) {
    if (req.body.username === undefined || req.body.password === undefined
        || req.body.firstName === undefined || req.body.lastName === undefined
        || req.body.email === undefined) {
        res.status(400).json({ error: "invalid request" });
    }

    // connect to db
    const dbClient = new MongoClient(process.env.MONGODB_URI);
    try {
        await dbClient.connect();
        let db = dbClient.db("FocusFins");

        const { username, password, firstName, lastName, email } = req.body;

        const existingUser = await db.collection('users').findOne({ username: username });

        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
        } else {
            const hashedPass = await bcrypt.hash(password, 10);

            await db.collection('users').insertOne({
                username: username,
                password: hashedPass,
                firstName: firstName,
                lastName: lastName,
                email: email,
                bubbles: 200,
                emailVerified: false
            });

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'focusfins@gmail.com',
                    pass: process.env.GMAIL_PASS
                }
            });

            const key = jwt.sign({ email: email }, req.secretToken);
            const verifyURL = `http://focusfins.org/verify?key=${key}`;
            const emailBody = `Verify your email with this link: ${verifyURL}\n\n\n` +
                `Thank you for signing up for FocusFins!`;

            transporter.sendMail({
                from: "info@focusfins.com",
                to: email,
                subject: "Verify your email!",
                text: emailBody
            }, (error, info) => {
                if (error) {
                    console.error(error);
                }
            });

            res.status(201).json({ message: 'User registered successfully' });
        }
    } catch (err) {
        console.error("Error at /api/register route: " + err);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await dbClient.close();
    }
}
