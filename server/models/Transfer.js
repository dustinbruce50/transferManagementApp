const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['requested', 'accepted', 'delivered'],
    required: true,
    default: 'requested',
  },
  item: {
    type: String,
    required: true,
    cost: Number,
  },
  amountReq: {
    type: Number,
    required: true,
  },
  amountReqType: {
    type: String
  },
  amountSent: {
    type: Number,
    //required: true,
  },
  amountSentType: {
    type: String
  },
  date: {
    type: Date,
    //default: Date.now,
  },
});

module.exports = mongoose.model('Transfer', TransferSchema);
