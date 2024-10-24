const express = require('express');
const bcrypt = require('bcrypt');
const {MongoClient} = require('mongodb');
require('dotenv').config();

export default function setRegisterHandler(app, db) {
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

app.post('/api/register', async (req, res, next) =>
{
    try
    {
        const{username, password, firstName, lastName, email} = req.body;

        const existingUser = await db.collection('users').findOne({Login: username});

        if (existingUser)
        {
            return res.status(400).json({error: 'User already exists'});
        }

        const hashedPass = await bcrypt.hash(password, 10);

        await db.collection('users').insertOne(
        {
            Login: username,
            Password: hashedPass,
            FirstName: firstName,
            LastName: lastName,
            Email: email
        });

    res.status(201).json({message: 'User registered successfully'});
    }

    catch (err)
    {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
});
}