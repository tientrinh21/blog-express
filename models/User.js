const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Please enter a username'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please enter a password'],
	},
})

UserSchema.plugin(uniqueValidator)

UserSchema.pre('save', function (next) {
	// Don't use arrow function because 'this' will lexically go up 1 scope
	const user = this

	bcrypt.hash(user.password, 10, (error, hash) => {
		user.password = hash
		next()
	})
})

// export model
const User = mongoose.model('User', UserSchema)
module.exports = User
