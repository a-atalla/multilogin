var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://127.0.0.1/multilogin');

var userSchema = new Schema({
	id: ObjectId,
	role: {type: String, required: true },
	orchestraName: String,  // have value with Orchestra Officer role only 
	firstname: String,
	surname: String,
	gender: String,
	email: {type: String, required: true },
	password: {type: String, required: true },

	isActive: Boolean,
	verificationCode: String,
	passwordResetCode: String
});

// set the (email,role) pair unique
userSchema.index({email: 1, role: 1}, { "unique": true });

var User = mongoose.model('User', userSchema);


module.exports = User;