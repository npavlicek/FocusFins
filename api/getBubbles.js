const express = require('express');
const {MongoClient} = require('mongodb');
require('dotenv').config();

export default function setGetBubblesHandler(app, db) {
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

app.post('/api/getBubbles', async (req, res, next) =>
{
    try
    {
        const uID = req.body;

        const user = await db.collection('users').findOne({id: uID});

        if (!user)
        {
            return res.status(404).json({error: 'User not found'});
        }

        return res.status(200).json({bubbles: user.bubbles, error: ''});
    }

    catch (err)
    {
        console.error(err);
        return res.status(500).json({error: 'Internal server error'});
    }
});
}