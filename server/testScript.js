const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Adjust the path as necessary

mongoose.connect(
	'mongodb://localhost:27017/transferManagerApp',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
);

const createUser = async () => {
	try {
		const hashedPassword = await bcrypt.hash('admin', 10); // Hash the password
		const user = new User({
			name: 'admin',
			email: 'admin@admin.com',
			password: hashedPassword,
			userType: 'operator',
		});
		await user.save();
		console.log('User created successfully');
	} catch (error) {
		console.error('Error creating user:', error);
	} finally {
		mongoose.connection.close();
	}
};

createUser();
