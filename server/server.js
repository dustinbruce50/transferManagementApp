const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Transfer = require('./models/Transfer');
const userRoutes = require('./routes/users');
const transferRoutes = require('./routes/transfers');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
const verifyToken = (req, res, next) => {
  console.log('Verifying token');
  const token = req.headers['x-access-token'];
  if (!token) {
    console.log('No token provided');
    return res.status(403).send({auth: false, message: 'No token provided.'});
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({auth: false, message: 'Failed to authenticate token.'});
    }
    console.log('Token verified');
    req.userId = decoded.id;
    next();
  });
};
app.use(userRoutes(verifyToken));
app.use(transferRoutes(verifyToken));

try {
  mongoose.connect('mongodb://localhost:27017/transferManagerApp', {});
  console.log('Connected to DB');
} catch (error) {
  console.error('Error connecting to DB:', error);
}

/**

//Transfer Routes
/**

 */

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
