import express from 'express';
import 'dotenv/config';
const loginHandler = require("./api/login");
//const registerHandler = require("./api/register");
import crypt from 'node:crypto';

const SECRET_TOKEN = crypt.randomBytes(64).toString("hex");

const app = express();

app.use(express.json());
app.use(express.static('./build/'));
app.use((req, res, next) => {
    req.secretToken = SECRET_TOKEN;
    next();
});

app.post('/api/login', loginHandler);
//app.post('/api/register', registerHandler);

app.listen(8080, _ => {
    console.log("Listening on port: 8080");
});
