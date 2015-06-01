var express = require('express');
var Handlebars =require('handlebars');
var fussballResults = require ("./fussballResults")
var fs = require('fs');


var app = express();
var source1 = fs.readFileSync(__dirname +"/views/index.html", {
	encoding : "utf8"
});

var indexTemplate = Handlebars.compile(source1)

app.get('/', function (req, res) {
	fussballResults.get(function(results){
		res.send(indexTemplate({
			"Table": results.Table,
			"RawResults" : results.RawResults
		}))	
	});
});

app.get('/result', function (req, res) {
	fussballResults.insert(req.query, function(){
		res.redirect('/'
		);
	});
});

app.get('/*', function (req, res) {
	console.log(req.path);	
	fussballResults.getForPlayer(req.path.replace("/",""), function(results){
		res.send(indexTemplate({
			"Table": results.Table,
			"RawResults" : results.RawResults
		}))	
	});
});





app.listen(80)