const express = require("express");
const setUpLoginHandler = require("./api/Login");
const setUpRegisterHandler = require("./api/Register");

const app = express();

client.connect()
    .then(() => 
    {
        db = client.db();
        console.log('Connected to MongoDB');
    })

    .catch(err => {
        console.error('MongoDB connection failed: ', err);
    });

setUpLoginHandler(app);
setUpRegisterHandler(app);

app.use(express.static('./build/'));

app.listen(8080, _ => {
	console.log("Listening on port: 8080");
});