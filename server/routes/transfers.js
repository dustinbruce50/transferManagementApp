const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Transfer = require('../models/Transfer');

module.exports = verifyToken => {
  const router = express.Router();

  router.post('/transfers/requested', verifyToken, async (req, res) => {
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
  router.get('/transfers/status/:status', async (req, res) => {
    const {status} = req.params;
    console.log(`Fetching ${status} transfers`);
    console.log('wrong place');

    // Validate the status parameter
    const validStatuses = ['requested', 'accepted', 'in-transit', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .send('Invalid status. Must be one of: requested, accepted, delivered');
    }
    try {
      const transfers = await Transfer.find({type: status});
      res.status(200).send(transfers);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });
  router.get('/transfers/unit/:unit', async (req, res) => {
    const {unit} = req.params;

    console.log(`Fetching ${unit} transfers`);

    // Validate the status parameter

    if (false) {
      return res
        .status(400)
        .send('Invalid status. Must be one of: requested, accepted, delivered');
    }
    try {
      const transfers = await Transfer.find({
        $or: [{sendingUnit: unit}, {receivingUnit: unit}],
      });
      res.status(200).send(transfers);
      console.log(transfers);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });
  router.put('/transfers/:id', verifyToken, async (req, res) => {
    console.log('Updating transfer');
    const {id} = req.params;
    const {amountSent, status, amountSentType, sendingUnit} = req.body;

    try {
      const transfer = await Transfer.findById(id);
      if (!transfer) {
        return res.status(404).send('Transfer not found');
      }
      if (status != null) {
        transfer.type = status;
        console.log('Status updated to: ', status);
      }
      if (amountSent != null) {
        transfer.amountSent = amountSent;
        console.log('Amount sent updated to: ', amountSent);
      }
      if (amountSentType != null) {
        transfer.amountSentType = amountSentType.toString();
        console.log('Amount sent type updated to: ', amountSentType);
      }
      if (sendingUnit != null) {
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
  return router;
};
