const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = verifyToken => {
	const router = express.Router();

	router.post('/login', async (req, res) => {
		console.log('Request received');
		const { username, password } = req.body;
		console.log('Searching for user: ', username);
		try {
			const user = await User.findOne({ name: username });
			if (!user) {
				console.log('User not found');
				return res.status(404).send('User not found');
			}
			const validPassword = bcrypt.compareSync(
				password,
				user.password,
			);

			if (!validPassword) {
				console.log('Invalid password');
				return res.status(401).send('Invalid password');
			}
			console.log('Should have logged in...');
			const token = jwt.sign({ id: user.id }, 'secret', {
				expiresIn: 86400,
			});
			res.status(200).send({
				auth: true,
				token,
				userType: user.userType,
				id: user.userId,
				unitNum: user.unitNum,
			});
		} catch (err) {
			console.log(err);
			res.status(500).send('Error on the server');
		}
	});
	router.post('/register', async (req, res) => {
		console.log('Registering new user');
		const { username, unitNum, password, userType, email } =
			req.body;
		//userType = 'admin';
		console.log('username: ', username);
		console.log('unitNum: ', unitNum);
		console.log('password: ', password);
		console.log('userType: ', userType);
		console.log('email: ', email);

		try {
			const hashedPassword = bcrypt.hashSync(password, 8);
			console.log('trying to create user');
			const user = new User({
				name: username,
				unitNum: unitNum,
				password: hashedPassword,
				usertype: userType.toString(),
				email: email.toString(),
			});
			user.userType = userType;
			console.log('trying to save user');
			console.log(user.userType);
			await user.save();
			res
				.status(200)
				.send({ message: 'User registered successfully' });
		} catch (err) {
			console.log(err);
			res
				.status(500)
				.send('There was a problem registering the user.');
		}
	});

	return router;
};
