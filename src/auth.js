let md5 = require('md5');
let index = require('../index');
var redis = require('redis').createClient(process.env.REDIS_URL)

let passport = index.passport;
var exports = module.exports = {};

let authRequests = {}
let authTokens = {}

let sessions = {};

const postLogin = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.sendStatus(400);
        return;
    }

    /*
    var index.user = getUser(username);
    if (!index.user || index.user.password !== password) {
        res.sendStatus(400);
        return;
    }
    */

    if (index.user.username != req.body.username) {
        res.sendStatus(401);
        return;
    }

    var hash = md5(req.body.password + index.user.salt);
    if (index.user.hash != hash) {
        res.sendStatus(401);
        return;
    }

    loginSuccess(req, res);
}

const postRegister = (req, res) => {
    index.user.username = req.body.username;
    var salt = 'salty';
    index.user.salt = salt;
    index.user.hash = md5(req.body.password + salt);

    const msg = {username: req.body.username, result: 'success'};
    res.send(msg);
}

const putLogout = (req, res) => {
    res.send('OK');
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

const loginSuccess = (req, res) => {
    let username;
    if (req.body.username) {
        username = req.body.username;
    } else {
        username = 'default user';
    }
    index.user.username = username;
    sessions[username] = username + Date.now();

    redis.hmset(sessions[username], index.user);
    redis.hgetall(sessions[username], function(err, userObj) {
        console.log(sessions[username] + ' mapped to ' + userObj);
    })


    // cookie lasts for 1 hour
    res.cookie('sessionId', username,
            {maxAge: 3600 * 1000, httpOnly: true});

    var msg = {username: req.body.username, result: 'success'};
    res.send(msg);
}

exports.endpoints = function(app) {
    app.post('/register', postRegister),
    app.post('/login', postLogin),
    app.put('/logout', putLogout),
    app.put('/password', putPassword),
    app.get('/auth/google', authGoogle),
    app.get('/auth/google/callback', authGoogleCallback),
    app.get('/login/success', loginSuccess)
}
