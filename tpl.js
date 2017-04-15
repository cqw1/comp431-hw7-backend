
var express = require('express')

var app = express()

app.set('view engine', 'ejs')

app.get('/', getIndex)

function getIndex(req, res) {
	res.render('tpl', { 
		user: 'Scott', 
		now: Date.now(), 
		message: 'hello world!'
	})
}





app.post('/', postIndex)

function postIndex(req, res) {
	res.send('You POSTed to the homepage')
}


// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 3000

//////////////////////////////////////////////////////
var server = app.listen(port, function() {
     console.log('Server listening at http://%s:%s', 
               server.address().address,
               server.address().port)
})
