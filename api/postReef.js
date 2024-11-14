const express = require("express");
const {MongoClient} = require("mongodb");
require("dotenv").config();

export default function setPostReefHandler(app, db){
    app.use(express.json());

    const client = new MongoClient(process.env.MONGODB_URI);

    app.post('/api/getReef', async (req, res) =>
    {
        try
        {
            const { /*reefobject*/, uID } = req.body;

            const user = await db.collection('users').findOne({id: uID});

            if (!user)
            {
                return res.status(404).json({error: 'User not found'});
            }

            await db.collection('users').put(uID, reefobject)
        }
    });
}
