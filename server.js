///// Start Server with Express
var express = require('express');
var app     = express();

// Required Libraries
var fs = require('fs-extra');
var bodyParser = require('body-parser');
var wget = require('wget');
app.use(bodyParser());

// Call functions from other modules - tokenize and scrape
var tokenize = require('./app/tokenize');
var scrape = require('./app/scrape');

// Open port based on Heroku
app.listen(process.env.PORT || 8080);
console.log('Magic happens on port 8080');
exports = module.exports = app;

// Main Page
app.get('/', function(req, res) {
	res.render('index.ejs'); // load the index.ejs file
});

// Run similarity checker on given RAW github file
app.post('/check', function(req, res) {

	// Download the given RAW Github file
	var src = req.body.url;
	console.log(src);
	var output = 'basecode/basecode.js';
	var options = {
	};
	var download = wget.download(src, output, options);
	download.on('error', function(err) {
		console.log(err);
	});

	// Download Progress
	download.on('progress', function(output) {
		console.log('progress', output);
	});

	// When download ends, send it to be tokenized
	download.on('end', function(output) {

		// Define path of file
		path = 'basecode/basecode.js';

		// Find function names
		// Get tokens that are going to be used for the search
		keywords = tokenize.findFunctions(path);

		// Scrape Github for names of repos using keywords.
		// Since there is a limit on the number of keywords you can search with
		// split up the keywords into groups of 5 (max) and search.
		console.log('REACHED HERE', keywords);
		var remaining = true;
		iter = 0;
		while (remaining){
			if (keywords.length < 5){
				scrape.findURLs(keywords, iter);
				console.log(keywords);
				remaining = false;
			}
			else{
				temp = keywords.splice(0,5);
				console.log(temp);
				scrape.findURLs(temp, iter);
			}
			iter += 1;
		}

		var exec = require('child_process').exec;
		exec("/usr/bin/perl mossnet.pl -l javascript basecode/*.js candidates/*.js", function(err, stdout, stderr) {
			res.send(stdout);
		});

	});
	

});

