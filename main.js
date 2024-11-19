const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const loginHandler = require("./api/login");
const registerHandler = require("./api/register");
const isAuthenticatedHandler = require('./api/isAuthenticated');
const updateCoralsHandler = require('./api/updateCorals');
const updateCoralHandler = require('./api/updateCoral');
const getCoralsHandler = require('./api/getCorals');
const addCoralHandler = require('./api/addCoral');
const removeCoralHandler = require('./api/removeCoral');
const crypt = require("node:crypto");
const path = require("node:path");

const SECRET_TOKEN = 'f7b658fea5d09bb6dea4f4638a44d2d07f440c16c56f3d3ac3320b735a315229be6024a2abce71ec2665ba6508f3f45d951a1d128f9eaad143d0e80d3cf74ab7';

const app = express();

app.use(express.json());
app.use('/public', express.static('./build/public'));
app.use((req, res, next) => {
	req.secretToken = SECRET_TOKEN;
	return next();
});

app.post('/api/login', loginHandler);
app.post('/api/register', registerHandler);
app.post('/api/isAuthenticated', isAuthenticatedHandler);
app.post('/api/updateCorals', updateCoralsHandler);
app.post('/api/updateCoral', updateCoralHandler);
app.post('/api/getCorals', getCoralsHandler);
app.post('/api/addCoral', addCoralHandler);
app.post('/api/removeCoral', removeCoralHandler);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(3000, _ => {
	console.log("Listening on port: 3000");
});
