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
const getBubblesHandler = require('./api/getBubbles');
const decBubblesHandler = require('./api/decBubbles');
const incBubblesHandler = require('./api/incBubbles');
const getCoralsByUsernameHandler = require('./api/getCoralsByUsername');
const verifyEmailHandler = require('./api/verifyEmail');
const resetPasswordHandler = require('./api/resetPassword');
const submitPasswordResetHandler = require('./api/submitPasswordReset');
const getCoralIdxHandler = require('./api/getCoralIdx');
const crypt = require("node:crypto");
const path = require("node:path");

//const SECRET_TOKEN = crypt.randomBytes(64).toString("hex");
const SECRET_TOKEN = '05fae87c04f81f6469554be10b95f78442c394d4de598efaebe4a109ab8486386a2b2bc842de2d7ca58efed700fda63376c3401921deedb17fe457c1d67d5a64';

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
app.post('/api/getBubbles', getBubblesHandler);
app.post('/api/decBubbles', decBubblesHandler);
app.post('/api/incBubbles', incBubblesHandler);
app.post('/api/getCoralsByUsername', getCoralsByUsernameHandler);
app.post('/api/verifyEmail', verifyEmailHandler);
app.post('/api/resetPassword', resetPasswordHandler);
app.post('/api/submitPasswordReset', submitPasswordResetHandler);
app.post('/api/getCoralIdx', getCoralIdxHandler);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(3000, _ => {
	console.log("Listening on port: 3000");
});
