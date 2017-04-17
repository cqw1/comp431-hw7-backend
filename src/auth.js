let md5 = require('md5');
let index = require('../index');
//let redis = require('redis').createClient(process.env.REDIS_URL);
let models = require('./db/models.js');
let sessions = require('../index.js').sessions;
var isLoggedIn = require('../index.js').isLoggedIn;

let passport = index.passport;

let authRequests = {}
let authTokens = {}

//let sessions = {};

let secretMessage = "oi183u4ms12on";


const postLogin = (req, res) => {

    if (!req.body.username || !req.body.password) {
        return res.sendStatus(400);
    }

    /*
    var index.user = getUser(username);
    if (!index.user || index.user.password !== password) {
        res.sendStatus(400);
        return;
    }
    */

    models.User.find({username: req.body.username}).exec(function(err, users) {
        if (users.length > 0) {
            var hash = md5(req.body.password + users[0].salt);
            if (users[0].hash == hash) {
                loginSuccess(req, res);
            } else {
                return res.sendStatus(401);
            }
        } else {
            return res.sendStatus(401);
        }
    });
}

const postRegister = (req, res) => {
    let salt = md5(req.body.username + Date.now());

    let newUser = new models.User({
        username: req.body.username,
        salt: salt,
        hash: md5(req.body.password + salt)
    })

    newUser.save(function(err, newUser) {
        if (err) {
            return console.error(err);
        }

        let msg = {username: newUser.username, result: 'success'};
        return res.send(msg);
    })
}

const putLogout = (req, res) => {
    delete sessions[req.cookies['sessionId']];
    res.clearCookie('sessionId');

    console.log('postLogout sessions');
    console.log(sessions);

    return res.send('OK');
}

const putPassword = (req, res) => {
    const msg = {
        username: index.user.username,
        status: 'will not change',
    }

    res.send(msg);
}


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
const authGoogle = passport.authenticate('google', { scope: [
   'https://www.googleapis.com/auth/plus.login',
   'https://www.googleapis.com/auth/plus.profile.emails.read'] 
})

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
const authGoogleCallback = passport.authenticate('google', { 
    successRedirect: '/login/success',
    failureRedirect: '/login'
});

const getUsername = (req) => {
    var username;

    if (req.body.username) {
        username = req.body.username;
    } else if (req.user.username) {
        username = req.user.username;
    }

    return username;
}

const loginSuccess = (req, res) => {
    /*
    let username;
    if (req.body.username) {
        username = req.body.username;
    } else {
        username = 'default user';
    }

    index.user.username = username;
    */


    /*
    redis.hmset(sessions[username], index.user);
    redis.hgetall(sessions[username], function(err, userObj) {
        console.log(sessions[username] + ' mapped to ' + userObj);
    })
    */

    var username = getUsername(req);
    var sessionId = md5(secretMessage + username + Date.now());

    models.User.find({username: req.body.username}).exec(function(err, users) {
        if (users.length > 0) {
            sessions[sessionId] = users[0];

            // cookie lasts for 1 hour
            res.cookie('sessionId', sessionId,
                    {maxAge: 3600 * 1000, httpOnly: true});

            var msg = {username: req.body.username, result: 'success'};
            return res.send(msg);
        } else {
            return res.sendStatus(401);
        }
    });
}

var exports = module.exports = {};

exports.endpoints = function(app) {
    app.post('/register', postRegister),
    app.post('/login', postLogin),
    app.put('/logout', isLoggedIn, putLogout),
    app.put('/password', putPassword),
    app.get('/auth/google', authGoogle),
    app.get('/auth/google/callback', authGoogleCallback),
    app.get('/login/success', loginSuccess)
}
