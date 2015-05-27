var express = require('express');
var Handlebars =require('handlebars');
var fussballResults = require ("./fussballResults")
var fs = require('fs');


var app = express();
var source1 = fs.readFileSync(__dirname +"/views/index.html", {
	encoding : "utf8"
});

Handlebars.registerHelper('listRawResults', function(results) {
  var out = "<ul>";
	console.log(results)
  for(var i=0, l=results.length; i<l; i++) {
    out = out + "<li>" + results["home team"] + "</li>";
  }

  return out + "</ul>";
});

var indexTemplate = Handlebars.compile(source1)

app.get('/', function (req, res) {
	fussballResults.get(function(results){
		res.send(indexTemplate({
			"RawResults" : results
		}))	
	});
});

app.get('/result', function (req, res) {
	fussballResults.insert(req.query, function(){
		res.redirect('/');
	});
});


app.listen(80)