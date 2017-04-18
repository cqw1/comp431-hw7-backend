var index = require('../index');
var models = require('./db/models.js');
var isLoggedIn = require('./auth.js').isLoggedIn;
let mongoose = require('mongoose')
let md5 = require('md5');

const sampleArticle = {
    '_id': 0,
    'text': 'stubbed article.',
    'date': new Date(),
    'img': null,
    'comments': [],
    'author': index.user.username,
};

const sampleComment = {
    'commentId': 0,
    'author': index.user.username,
    'date': new Date(),
    'text': 'stubbed comment.',
};

let articles = [
    {
        '_id': 0,
        'text': 'stubbed article.',
        'date': new Date(),
        'img': null,
        'comments': [],
        'author': index.user.username,
    },
    {
        '_id': 1,
        'text': 'stubbed article.',
        'date': new Date(),
        'img': null,
        'comments': [],
        'author': index.user.username,
    },
    {
        '_id': 2,
        'text': 'stubbed article.',
        'date': new Date(),
        'img': null,
        'comments': [],
        'author': index.user.username,
    },
];

const getArticles = (req, res) => {
    /*
    models.Article.find({author: "stub username"}).exec(function(err, articles) {
        console.log(articles);
        console.log(articles.length);
    });

    if (req.params.id) {
        res.send({
            'articles': articles.filter(function(el) {
                return el._id == req.params.id || el.author == req.params.id;
            })
        });
    } else {
        res.send({articles});
    }
    */

    let query;

    if (req.params.id) {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            query = models.Article.find().or([{author: req.params.id}, {_id: mongoose.Types.ObjectId(req.params.id)}]);
        } else {
            query = models.Article.find({author: req.params.id});
        }
    } else {
        query = models.Article.find();
    } 

    query.exec(function(err, articles) {
        res.send({articles});
    })
}

const putArticles = (req, res) => {
    if (req.params.id) {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {

            let articleId = mongoose.Types.ObjectId(req.params.id);
            models.Article.find({_id: articleId, author: req.user.username})
                .exec(function(err, articles) {
                    if (err) {
                        return console.error(err);
                    } else {
                        if (articles.length < 1) {
                            return res.sendStatus(400);
                        }

                        if (req.body.commentId) {
                            // Editing a comment
                            if (req.body.commentId == '-1') {
                                // Creating a new comment.
                                articles[0].comments.push({
                                    commentId: md5(req.body.text + Date.now()),
                                    author: req.user.username,
                                    date: new Date(),
                                    text: req.body.text
                                })

                            } else {
                                // Editing existing comment.
                                articles[0].comments.filter((comment) => {
                                    return comment.commentId == req.body.commentId;
                                }).forEach((comment) => { 
                                    comment.text = req.body.text;
                                })
                            }

                            articles[0].save((err, articles) => { if (err) {
                                    return console.error(err);
                                }
                                return res.send({articles});
                            })

                        } else {
                            // Editing the article text.

                            articles[0].update({text: req.body.text})
                                .exec(function(err, raw) {
                                    if (err) {
                                        return console.error(err);
                                    }

                                    return sendArticle(res, articleId);
                                });
                        }
                    }
                });
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    } 
}

const sendArticle = (res, articleId) => {
    // Return the updated article.
    models.Article.find({_id: articleId}).exec(function(err, articles) {
        if (err) {
            return console.error(err);
        } else {
            return res.send({articles});
        }
    });
}

const postArticle = (req, res) => {
    /*
    const newArticle = Object.assign({}, sampleArticle, {
        '_id': articles.length,
        'text': req.body.text,
        'date': new Date(),
    })
    articles.push(newArticle)

	res.send({
        'articles': [newArticle],
    })
    */
    /////////////////////////////////////


    // Used for node initDatabase.js
    /*
    let newArticle = new models.Article({
        author: req.body.author,
        date: req.body.date,
        text: req.body.text,
        comments: req.body.comments,
    })
    */
    
    let newArticle = new models.Article({
        author: req.user.username,
        date: new Date(),
        text: req.body.text,
    })

    newArticle.save(function(err, newArticle) {
        if (err) {
            return console.error(err);
        }

        let msg = {'articles': newArticle};
        return res.send(msg);
    })
}

var exports =  module.exports = {};

exports.endpoints = function(app) {
	app.get('/articles/:id*?', isLoggedIn, getArticles),
	app.put('/articles/:id', isLoggedIn, putArticles),
	app.post('/article', isLoggedIn, postArticle)
}
