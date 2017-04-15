const index = require('../index');
const uploadImage = require('./uploadCloudinary')

const getHeadline = (req, res) => {
    headlines = [];

    if (req.params.user == index.user.username || !req.params.user) {
        headlines.push({ 
            username: index.user.username, 
            headline: index.profile.headline 
        });
    } else {
        headlines.push({ 
            username: req.params.user, 
            headline: req.params.user + ' stub headline'
        });
    }

    res.send({headlines});
}

const getHeadlines = (req, res) => {
    headlines = [];

    if (req.params.user) {
        users = req.params.user.split(",");
        users.forEach(function(user) {
            headlines.push({ username: user, headline: user + ' stub headline'});
        })
    } else {
        headlines.push({ 
            username: index.user.username, 
            headline: index.profile.headline 
        });
    }

    res.send({headlines});
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
    app.get('/headline/:user?', getHeadline),
    app.get('/headlines/:user?', getHeadlines),
    app.put('/headline', putHeadline),
    app.get('/email/:user?', getEmail),
    app.put('/email', putEmail),
    app.get('/zipcode/:user?', getZipcode),
    app.put('/zipcode', putZipcode),
    app.get('/avatars/:user?', getAvatars),
    //app.put('/avatar', putAvatar),
    app.get('/dob', getDob),
    app.get('/', getIndex),
    app.put('/avatar', uploadImage('avatar'), putAvatar)
}
