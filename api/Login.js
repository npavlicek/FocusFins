const express = require('express');
const bcrypt = require('bcrypt');
const {MongoClient} = require('mongodb');
require('dotenv').config();

export default function setLoginHandler(app, db) {
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

app.post('/api/login', async (req, res, next) =>
{
    try
    {
        const {login, password} = req.body;

        const user = await db.collection('users').findOne({Login: login});

        if (!user)
        {
            return res.status(401).json({error: 'Invalid login credentials'});
        }

        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (!passwordMatch)
        {
            return res.status(401).json({error: 'Invalid login credentials'});
        }

        const {UserId: id, FirstName: fn, LastName: ln, } = user;
        return res.status(200).json({id, firstName: fn, lastName: ln, error: ''});

    }

    catch (err)
    {
        console.error(err);
        return res.status(500).json({error: 'Internal server error'});
    }
});
}