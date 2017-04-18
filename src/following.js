const index = require('../index');
let models = require('./db/models.js');
var isLoggedIn = require('./auth.js').isLoggedIn;

const sampleFollowing = [
    'john',
    'ann',
    'joe',
];

const getFollowing = (req, res) => {
    let username = req.user.username;
    if (req.params.user) {
        username = req.params.user;
    }

    models.Profile.find({username}).exec((err, profiles) => {
        if (err) {
            return console.error(err);
        } else {
            return res.send({username, following: profiles[0].following});
        }
    })
}

const putFollowing = (req, res) => {
    const msg = {
        username: index.user.username,
        following: [req.params.user, ...sampleFollowing]
    };

    res.send(msg);
}

const deleteFollowing = (req, res) => {
    const deleted = sampleFollowing.filter(function (user) {
        return user != req.params.user;
    })

    const msg = {
        username: index.user.username,
        following: deleted,
    };

    res.send(msg);
}

var exports =  module.exports = {};

exports.endpoints = function(app) {
	app.get('/following/:user?', isLoggedIn, getFollowing),
	app.put('/following/:user', isLoggedIn, putFollowing),
	app.delete('/following/:user', isLoggedIn, deleteFollowing)
}
