const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

//DB + Models
const mongoose = require('mongoose');
const User = require('./models/User');
const Transfer = require('./models/Transfer');

//routes
const fcmRoutes = require('./routes/fcm');
const userRoutes = require('./routes/users');
const transferRoutes = require('./routes/transfers');

//FCM Setup
const admin = require('firebase-admin');
const serviceAccount = require('/home/localUsr/projectmanagementappnotif-firebase-adminsdk-fbsvc-2125592a6b.json');


const sendNotifs = require('./routes/notifs.js')

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const verifyToken = (req, res, next) => {
	console.log('Verifying token');
	const token = req.headers['x-access-token'];
	if (!token) {
		console.log('No token provided');
		return res
			.status(403)
			.send({ auth: false, message: 'No token provided.' });
	}

	jwt.verify(token, 'secret', (err, decoded) => {
		if (err) {
			return res
				.status(500)
				.send({
					auth: false,
					message: 'Failed to authenticate token.',
				});
		}
		console.log('Token verified');
		req.userId = decoded.id;
		next();
	});
};
app.get('/ping', (rec, res) => {
	console.log('ping route hit');
	
	res.send('pong');
});
sendNotifs();
//routes
app.use(fcmRoutes(verifyToken));
app.use(userRoutes(verifyToken));
app.use(transferRoutes(verifyToken));

try {
	mongoose.connect(
		'mongodb://localhost:27017/transferManagerApp',
		{},
	);
	console.log('Connected to DB');
} catch (error) {
	console.error('Error connecting to DB:', error);
}

/**

//Transfer Routes
/**

 */

// Start server
app.listen(port, '0.0.0.0', () => {
	console.log(`Server is running on port ${port}`);
});
