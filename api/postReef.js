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
            const {uid, reefObject} = req.body;

            const user = await db.collection('reefs').findOneAndUpdate(
                {userId : uid},
                {currentCoralIdx : reefObject.currentCoralIndex},
                {corals : reefObject.corals}
            );

            /*
            Reached this point of writing and started discussing with the team
            upon further discussion we came to the consensus that this endpoint is redundant
            its purpose is distributed amongst other endpoints elsewhere
            */
        }
    });
}
