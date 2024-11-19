const express = require('express');
const {MongoClient} = require('mongodb');
require('dotenv').config();

export default function setGetFriendsHandler(app, db) {
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

app.post('/api/getFriends', async (req, res, next) =>
{
    try
    {
        const uID = req.body;

        const user = await db.collection('users').findOne({id: uID});

        if (!user)
        {
            return res.status(404).json({error: 'User not found'});
        }

        if (user.friends.length == 0)
        {
            return res.json({friends: []});
        }

        const friends = await db.collection('users').findOne({uID: {$in: user.friends}});

        res.json({friends});
    }

    catch (err)
    {
        console.error(err);
        return res.status(500).json({error: 'Internal server error'});
    }
});
}