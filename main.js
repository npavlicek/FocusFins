const express = require("express");
const setUpLoginHandler = require("./api/Login");
const setUpRegisterHandler = require("./api/Register");
const setUpGetReefHandler = require("./api/getReef");
const setUpAddFriendHandler = require("./api/addFriend");
const setUpGetFriendsHandler = require("./api/getFriends");
const setUpGetBubblesHandler = require("./api/getBubbles");
const setUpIncBubblesHandler = require("./api/incBubbles");
const setUpDecBubblesHandler = require("./api/decBubbles");

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
setUpGetReefHandler(app);
setUpAddFriendHandler(app);
setUpGetFriendsHandler(app);
setUpGetBubblesHandler(app);
setUpIncBubblesHandler(app);
setUpDecBubblesHandler(app);

app.use(express.static('./build/'));

app.listen(8080, _ => {
	console.log("Listening on port: 8080");
});