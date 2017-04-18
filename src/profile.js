const index = require('../index');
const uploadImage = require('./uploadCloudinary')
let models = require('./db/models.js');
var isLoggedIn = require('./auth.js').isLoggedIn;

const getHeadlines = (req, res) => {
    headlines = [];

    let usernameMatches = [];
    if (req.params.user) {
        users = req.params.user.split(",");
        users.forEach(function(user) {
            usernameMatches.push({username: user});
        });
    } else {
        usernameMatches = [{username: req.user.username}];
    }

    models.Profile.find().or(usernameMatches).exec(function(err, profiles) {
        if (err) {
            return console.error(err);
        } else {
            if (profiles.length > 0) {
                let headlines = [];
                profiles.forEach((profile) => {
                    headlines.push({username: profile.username, headline: profile.status});
                })

                return res.send({headlines});
            } else {
                return res.sendStatus(400);
            }
        }
    });
}

const putHeadline = (req, res) => {
    index.profile.headline = req.body.headline;
    res.send({username: index.user.username, headline: index.profile.headline});
}

const getEmail = (req, res) => {
    var username = index.user.username;
    if (req.params.user) {
        username = req.params.user;
    }
    res.send({username, email: index.profile.email});
}

const putEmail = (req, res) => {
    index.profile.email = req.body.email;
    res.send({username: index.user.username, email: index.profile.email});
}

const getZipcode = (req, res) => {
    var username = index.user.username;

    if (req.params.user) {
        username = req.params.user;
    }

    res.send({username, zipcode: index.profile.zipcode});
}

const putZipcode = (req, res) => {
    index.profile.zipcode = req.body.zipcode;
    res.send({username: index.user.username, zipcode: index.profile.zipcode});
}

const getAvatars = (req, res) => {
    avatars = [];

    if (req.params.user) {
        users = req.params.user.split(",");
        users.forEach(function(user) {
            avatars.push({username: user, avatar: user + ' stub avatar'});
        })
    } else {
        avatars.push({username: index.user.username, avatar: index.profile.avatar});
    }

    res.send({ avatars });
}

const putAvatar = (req, res) => {
    index.profile.avatar = req.body.avatar;
    console.log(req.fileurl);
    console.log(req.fileid);
    res.send({username: index.user.username, avatar: index.profile.avatar});
}

const getDob = (req, res) => {
    res.send({username: index.user.username, dob: index.profile.dob});
}

const getIndex = (req, res) => {
     res.send({hello: 'world'});
}

var exports =  module.exports = {};

exports.endpoints = function(app) {
    app.get('/headlines/:user?', isLoggedIn, getHeadlines),
    app.put('/headline', isLoggedIn, putHeadline),
    app.get('/email/:user?', isLoggedIn, getEmail),
    app.put('/email', isLoggedIn, putEmail),
    app.get('/zipcode/:user?', isLoggedIn, getZipcode),
    app.put('/zipcode', isLoggedIn, putZipcode),
    app.get('/avatars/:user?', isLoggedIn, getAvatars),
    //app.put('/avatar', putAvatar),
    app.get('/dob', isLoggedIn, getDob),
    app.get('/', getIndex),
    app.put('/avatar', uploadImage('avatar'), putAvatar)
}
