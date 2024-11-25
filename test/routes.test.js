const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const registerHandler = require('../api/register');
const loginHandler = require('../api/login');
const mocha = require('mocha');
const crypt = require('node:crypto');
const dotenv = require("dotenv");
dotenv.config();

const SECRET_TOKEN = crypt.randomBytes(64).toString("hex");

mocha.describe('FocusFins App Registration', (m) => {
	const app = express();
	app.use(express.json());
	app.use((req, res, next) => {
		req.secretToken = SECRET_TOKEN;
		return next();
	});
	app.use('/api/register', registerHandler);

	mocha.it('should respond with a 201 status code with a message when registering', (done) => {
		const payload = {
			username: 'example',
			password: 'password',
			firstName: 'John',
			lastName: 'Doe',
			email: 'npavlicek00@gmail.com'
		};
		request(app).post('/api/register').send(payload).set('Content-Type', 'application/json').accept('Accept', 'application/json').end((err, res) => {
			if (err) return done(err);
			expect(res.status).to.equal(201);
			expect(res.body.message).to.equal("User registered successfully");
			done();
		});
	});
});

mocha.describe('FocusFins App Login', (m) => {
	const app = express();
	app.use(express.json());
	app.use((req, res, next) => {
		req.secretToken = SECRET_TOKEN;
		return next();
	});
	app.use('/api/login', loginHandler);

	mocha.it('should respond with a 200 status code with a token when logging in', (done) => {
		const payload = {
			username: 'test',
			password: 'user',
		};
		request(app).post('/api/login').send(payload).set('Content-Type', 'application/json').accept('Accept', 'application/json').end((err, res) => {
			if (err) return done(err);
			expect(res.status).to.equal(200);
			expect(res.body.token).to.not.equal(undefined);
			expect(res.body.id).to.not.equal(undefined);
			expect(res.body.firstName).to.not.equal(undefined);
			expect(res.body.lastName).to.not.equal(undefined);
			done();
		});
	});
});
