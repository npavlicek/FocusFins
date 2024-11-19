const express = require('express');
const {MongoClient} = require('mongodb');
require('dotenv').config();

export default function setAddFriendHandler(app, db) {
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

app.post('/api/addFriend', async (req, res, next) =>
{
    try
    {
        const {uID, fID} = req.body;

        if (!uID || !fID)
        {
            return res.status(400).json({error: 'Both user ID and friend ID are required'});
        }

        const user = await db.collection('users').findOne({id: uID});
        const friend = await db.collection('users').findOne({id: fID});

        if (!user)
        {
            return res.status(404).json({error: 'User not found'});
        }

        if (!friend)
        {
            return res.status(404).json({error: 'Friend not found'});
        }

        if (user.friends.includes(fID))
        {
            return res.status(400).json({error: 'Friend is already in the users friend list'});
        }

        user.friends.push(fID);
        await user.save();

        res.json({message: 'Friend added successfully!', user});
    }

    catch (err)
    {
        console.error(err);
        return res.status(500).json({error: 'Internal server error'});
    }
});
}