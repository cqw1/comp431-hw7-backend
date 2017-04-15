const index = require('../index');

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
    if (req.params.id) {
        res.send({
            'articles': articles.filter(function(el) {
                return el._id == req.params.id || el.author == req.params.id;
            })
        });
    } else {
        res.send({articles});
    }
}

const putArticles = (req, res) => {

    const filteredArticles = articles.filter(function(el) {
        return el._id == req.params.id;
    })

    let article;
    if (filteredArticles.length > 0) {
        article = filteredArticles[0];
    }

    if (req.body.commentId != undefined) {
        if (req.body.commentId == -1) {
            article.comments.push(Object.assign({}, sampleComment, {
                'commentId': article.comments.length,
                'text': req.body.text,
                'date': new Date(),
            }))
        } else {
            let filteredComment = article.comments.filter(function(comment) {
                return comment.commentId == req.body.commentId;
            })

            let comment;
            if (filteredComment.length > 0) {
                comment = filteredComment[0];
            }

            comment.text = req.body.text;
        }
    } else {
        article.text = req.body.text;
    }

    res.send({articles});
}

const postArticle = (req, res) => {
    const newArticle = Object.assign({}, sampleArticle, {
        '_id': articles.length,
        'text': req.body.text,
        'date': new Date(),
    })
    articles.push(newArticle)

	res.send({
        'articles': [newArticle],
    })
}

var exports =  module.exports = {};

exports.endpoints = function(app) {
	app.get('/articles/:id*?', getArticles),
	app.put('/articles/:id', putArticles),
	app.post('/article', postArticle)
}
