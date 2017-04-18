const index = require('../index');
const uploadImage = require('./uploadCloudinary')
let models = require('./db/models.js');
var isLoggedIn = require('./auth.js').isLoggedIn;

const getHeadlines = (req, res) => {
    let usernameMatches = [];

    if (req.params.user) {
        users = req.params.user.split(",");
        users.forEach((user) => {
            usernameMatches.push({username: user});
        });
    } else {
        usernameMatches = [{username: req.user.username}];
    }

    models.Profile.find().or(usernameMatches).exec((err, profiles) => {
        if (err) {
            return console.error(err);
        } else {
            if (profiles.length > 0) {
                let headlines = [];
                profiles.forEach((profile) => {
                    headlines.push(
                        {
                            username: profile.username, 
                            headline: profile.headline
                        });
                })

                return res.send({headlines});
            } else {
                return res.sendStatus(400);
            }
        }
    });
}

const putHeadline = (req, res) => {

    models.Profile.find({username: req.user.username}).exec((err, profiles) => {
        if (err) {
            return console.error(err);
        } else {
            profiles[0].headline = req.body.headline;
            profiles[0].save((err, profile) => { 
                if (err) {
                    return console.error(err);
                }
                return res.send({username: req.user.username, headline: profile.headline});
            })
        }
    })
}

const getEmail = (req, res) => {
    let username = req.user.username;
    if (req.params.user) {
        username = req.params.user;
    }

    models.Profile.find({username}).exec((err, profiles) => {
        if (err) {
            return console.error(err);
        } else {
            return res.send({username, email: profiles[0].email});
        }
    })
}

const putEmail = (req, res) => {

    models.Profile.find({username: req.user.username}).exec((err, profiles) => {
        if (err) {
            return console.error(err);
        } else {
            profiles[0].email = req.body.email;
            profiles[0].save((err, profile) => { 
                if (err) {
                    return console.error(err);
                }
                return res.send({username: req.user.username, email: profile.email});
            })
        }
    })
}

const getZipcode = (req, res) => {
    let username = req.user.username;
    if (req.params.user) {
        username = req.params.user;
    }

    models.Profile.find({username}).exec((err, profiles) => {
        if (err) {
            return console.error(err);
        } else {
            return res.send({username, zipcode: profiles[0].zipcode});
        }
    })
}

const putZipcode = (req, res) => {
    models.Profile.find({username: req.user.username}).exec((err, profiles) => {
        if (err) {
            return console.error(err);
        } else {
            profiles[0].zipcode = req.body.zipcode;
            profiles[0].save((err, profile) => { 
                if (err) {
                    return console.error(err);
                }
                return res.send({username: req.user.username, zipcode: profile.zipcode});
            })
        }
    })
}

const getAvatars = (req, res) => {
    let usernameMatches = [];

    if (req.params.user) {
        users = req.params.user.split(",");
        users.forEach((user) => {
            usernameMatches.push({username: user});
        });
    } else {
        usernameMatches = [{username: req.user.username}];
    }

    models.Profile.find().or(usernameMatches).exec((err, profiles) => {
        if (err) {
            return console.error(err);
        } else {
            if (profiles.length > 0) {
                let avatars = [];
                profiles.forEach((profile) => {
                    avatars.push(
                        {
                            username: profile.username, 
                            avatar: profile.avatar
                        });
                });

                return res.send({avatars});
            } else {
                return res.sendStatus(400);
            }
        }
    });
}

const putAvatar = (req, res) => {
    index.profile.avatar = req.body.avatar;
    console.log(req.fileurl);
    console.log(req.fileid);
    res.send({username: index.user.username, avatar: index.profile.avatar});
}

const getDob = (req, res) => {
    models.Profile.find({username: req.user.username}).exec((err, profiles) => {
        if (err) {
            return console.error(err);
        } else {
            return res.send({username: req.user.username, dob: profiles[0].dob.getTime()});
        }
    })
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
