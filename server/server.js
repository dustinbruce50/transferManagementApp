const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Transfer = require('./models/Transfer');

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

mongoose.connect('mongodb://localhost:27017/transferManagerApp', {});
console.log('Connected to DB');

//User Routes
app.post('/login', async (req, res) => {
  console.log('Request received');
  const {username, password} = req.body;
  console.log('Searching for user: ', username);
  try {
    const user = await User.findOne({name: username});
    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      console.log('Invalid password');
      return res.status(401).send('Invalid password');
    }
    console.log('Should have logged in...');
    const token = jwt.sign({id: user.id}, 'secret', {expiresIn: 86400});
    res
      .status(200)
      .send({auth: true, token, userType: user.userType, id: user.userId, unitNum: user.unitNum});
  } catch (err) {
    console.log(err);
    res.status(500).send('Error on the server');
  }
});
app.post('/register', async (req, res) => {
  console.log('Registering new user');
  const {username, unitNum, password, userType, email} = req.body;
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
    res.status(200).send({message: 'User registered successfully'});
  } catch (err) {
    console.log(err);
    res.status(500).send('There was a problem registering the user.');
  }
});

//Transfer Routes
app.post('/transfers/requested', verifyToken, async (req, res) => {
  console.log('created new transfers');
  console.log('Request body: ', req.body);
  try {
    const transfer = new Transfer({
      userId: req.userId,
      item: req.body.item,
      //cost: req.body.cost,
      amountReq: req.body.amountReq,
      amountReqType: req.body.amountReqType,
      receivingUnit: req.body.unitNum,
      //amountSent: req.body.amountSent,
      type: 'requested',
    });
    await transfer.save();
    res.status(200).send(transfer);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});
app.get('/transfers/:status', async (req, res) => {
  const { status } = req.params;
  console.log(`Fetching ${status} transfers`);
  
  // Validate the status parameter
  const validStatuses = ['requested', 'accepted', 'in-transit', 'delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).send('Invalid status. Must be one of: requested, accepted, delivered');
  }
  try {
    const transfers = await Transfer.find({type: status});
    res.status(200).send(transfers);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});
app.put('/transfers/:id', verifyToken, async (req, res) => {
  console.log('Updating transfer');
  const {id} = req.params;
  const {amountSent, status, amountSentType, sendingUnit} = req.body;

  try {
    const transfer = await Transfer.findById(id);
    if (!transfer) {
      return res.status(404).send('Transfer not found');
    }
    if(status != null){
      transfer.type = status;
      console.log('Status updated to: ', status);
    }
    if(amountSent != null){
      transfer.amountSent = amountSent;
      console.log('Amount sent updated to: ', amountSent);
    }
    if(amountSentType != null){
      transfer.amountSentType = amountSentType.toString();
      console.log('Amount sent type updated to: ', amountSentType);
    }
    if(sendingUnit != null){
      transfer.sendingUnit = sendingUnit;
      console.log('Sending unit updated to: ', sendingUnit);
    }
    await transfer.save();
    res.status(200).send('Transfer updated successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error updating transfer');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
