const express = require('express');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

module.exports = async function registerHandler(req, res) {
    // connect to db
    const dbClient = new MongoClient(process.env.MONGODB_URI);
    try {
        await dbClient.connect();
        let db = dbClient.db("FocusFins");

        const { username, password, firstName, lastName, email } = req.body;

        const existingUser = await db.collection('users').findOne({ username: username });

        if (existingUser)
            return res.status(400).json({ error: 'User already exists' });

        const hashedPass = await bcrypt.hash(password, 10);

        await db.collection('users').insertOne(
            {
                username: username,
                password: hashedPass,
                firstName: firstName,
                lastName: lastName,
                email: email
            });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.log("ERROR");
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    } finally {
        await dbClient.close();
    }
}
