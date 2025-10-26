const mongoose = require('mongoose');
const fcm = require('../routes/fcm');
const AutoIncrement = require('mongoose-sequence')(
	mongoose,
);

const UserSchema = new mongoose.Schema({
	userId: {
		type: Number,
		//required: true,
	},
	unitNum: {
		type: String,
		required: true,
		unique: false,
		index: true,
	},
	name: {
		type: String,
		required: true,
	},
	userType: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	fcmToken: {
		type: String,
		required: false,
	},
});

UserSchema.plugin(AutoIncrement, { inc_field: 'userId' });

module.exports = mongoose.model('User', UserSchema);
