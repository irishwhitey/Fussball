var express = require('express');
var Handlebars =require('handlebars');
var fussballResults = require ("./fussballResults")
var fs = require('fs');


var app = express();
var source1 = fs.readFileSync(__dirname +"/views/index.html", {
	encoding : "utf8"
});

var indexTemplate = Handlebars.compile(source1)

var result = indexTemplate({title: "Janes Cakes"});

app.get('/', function (req, res) {
	fussballResults.get(function(results){
		res.send(indexTemplate(results))	
	});
});

app.get('/result', function (req, res) {
	fussballResults.insert(req.query, function(){
		res.redirect('/');
	});
});


app.listen(80)