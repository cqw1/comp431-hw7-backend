
// Models for the database.
let mongoose = require('mongoose')
require('./db.js')

let commentSchema = new mongoose.Schema({
	commentId: Number, 
    author: String, 
    date: Date, 
    text: String
});

let articleSchema = new mongoose.Schema({
	id: Number, 
    author: String, 
    img: String, 
    date: Date, 
    text: String,
	comments: [ commentSchema ]
});

let userSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String    
});

let profileSchema = new mongoose.Schema({
    username: String,
    status: String,
    following: [ String ],
    email: String,
    zipcode: String,
    picture: String    
});


exports.Comment = mongoose.model('comments', commentSchema);
exports.Article = mongoose.model('articles', articleSchema);
exports.User = mongoose.model('users', userSchema);
exports.Profile = mongoose.model('profiles', profileSchema);

