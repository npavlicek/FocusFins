const express = require('express');
const {MongoClient} = require('mongodb');
require('dotenv').config();

export default function setIncBubblesHandler(app, db) {
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

app.post('/api/incBubbles', async (req, res, next) =>
{
    try
    {
        const {uID, amount} = req.body;

        if (!uID || !amount || amount < 0)
        {
            return res.status(400).json({error: "Valid user ID and amount (positive number) are required"})
        }

        const user = await db.collection('users').findOneAndUpdate(
            {id: uID},
            {$inc: {bubbles: amount}},
            {new: true}
        );

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