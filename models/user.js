const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// user schema. to be added weather profile
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },

    password:{
        type: String
    },
    email: {
        type: String
    },
    name:{
        type: String
    }
});

var User = module.exports = mongoose.model('User',UserSchema)

// method to create new user
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

// method to get user by username
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

// method to get user by ID
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

// method to check if password is correct
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

