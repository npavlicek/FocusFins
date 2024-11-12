const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const loginHandler = require("./api/login");
const registerHandler = require("./api/register");
const crypt = require("node:crypto");
const path = require("node:path");

const SECRET_TOKEN = crypt.randomBytes(64).toString("hex");

const app = express();

app.use(express.json());
app.use(express.static('./build/public'));
app.use((req, res, next) => {
	req.secretToken = SECRET_TOKEN;
	return next();
});

app.post('/api/login', loginHandler);
app.post('/api/register', registerHandler);
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(3000, _ => {
	console.log("Listening on port: 3000");
});
