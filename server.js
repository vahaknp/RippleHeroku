var express = require('express');
var fs = require('fs');
var app     = express();

var tokenize = require('./app/tokenize');
var scrape = require('./app/scrape');
var moss = require('./app/moss');

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;


app.get('/', function(req, res) {
	res.render('index.ejs'); // load the index.ejs file
});

app.get('/check', function(req, res) {
	//Define path of file
	path = 'samplecode/samplecode.js';
	//Find function names
	keywords = tokenize.findFunctions(path);

	//Scrape Github for names of repos
	var remaining = true;
	iter = 0;
	while (remaining){
		if (keywords.length < 5){
			scrape.findURLs(keywords, iter)
			console.log(keywords);
			remaining = false;
		}
		else{
			temp = keywords.splice(0,5);
			console.log(temp);
			scrape.findURLs(temp, iter);
		}
		iter += 1;
	};
});

