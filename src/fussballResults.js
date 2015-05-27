var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 
// Connection URL 
var url = 'mongodb://localhost:27017/Fussball';
// Use connect method to connect to the Server 
var database;
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  database = db;  
});

var findDocuments = function(db, callback) {
  // Get the documents collection 
  var collection = db.collection('results');
  // Find some documents 
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);    
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
}

var parseQueryString = function(queryString){
  var splitFixture = queryString.fixture.split('-');
  var splitScores = queryString.score.split('-')
  return {
    "home team" : splitFixture[0],
    "away team" : splitFixture[1],
    "home score" : splitScores[0],
    "away score" : splitScores[1],
    "date" : new Date()
  }
}

var insertDocuments = function(db, gameResult, callback) {
  // Get the documents collection 
  var collection = db.collection('results');
  // Insert some documents 
  collection.insert(
    gameResult
  , function(err, result) {
    assert.equal(err, null);
    console.log("Inserted new result document");
    console.log(gameResult);
    console.log(result);
    callback(result);
  });
}

module.exports ={
	get :function(onSuccess){
		findDocuments(database,onSuccess);
	},
  insert :function(queryString, onSuccess){
      var toInsert = parseQueryString(queryString);
      insertDocuments(database, toInsert, onSuccess);
  }
}