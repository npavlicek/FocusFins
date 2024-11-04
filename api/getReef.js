const express = require('express');
const {MongoClient} = require('mongodb');
require('dotenv').config();

export default function setGetReefHandler(app, db) {
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

app.post('/api/getReef', async (req, res, next) =>
{
    try
    {
        const uID = req.body;

        const user = await db.collections('users').findOne({UserID: uID});

        if (!user)
        {
            return res.status(401).json({error: 'Reef not found for the given user ID'});
        }

        return res.status(200).json({id, error: ''});
    }
    catch (err)
    {
        console.error(err);
        return res.status(500).json({error: 'Internal server error'});
    }
});
}