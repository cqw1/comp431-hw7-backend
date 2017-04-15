const index = require('../index');

const sampleFollowing = [
    'john',
    'ann',
    'joe',
];

const getFollowing = (req, res) => {
    let username = index.user.username;
    if (req.params.user) {
        username = req.params.user;
    }

    const msg = {
        username,
        following: sampleFollowing
    };

    res.send(msg);
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
	app.get('/following/:user?', getFollowing),
	app.put('/following/:user', putFollowing),
	app.delete('/following/:user', deleteFollowing)
}
