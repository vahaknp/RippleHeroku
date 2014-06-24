var express = require('express');
var fs = require('fs');
var app     = express();
var bodyParser = require('body-parser');
var wget = require('wget');

var tokenize = require('./app/tokenize');
var scrape = require('./app/scrape');
var moss = require('./app/moss');

app.use(bodyParser());

app.listen(process.env.PORT || 8080)
console.log('Magic happens on port 8080');
exports = module.exports = app;

app.get('/', function(req, res) {
	res.render('index.ejs'); // load the index.ejs file
});

app.post('/check', function(req, res) {

	var src = req.body.url;
    var output = 'samplecode/samplecode.js';
    var options = {
        port: 8080
    };
    var download = wget.download(src, output, options);
    download.on('error', function(err) {
        console.log(err);
    });
    download.on('end', function(output) {
        console.log(output);
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
});

