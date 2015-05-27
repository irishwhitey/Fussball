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

module.exports ={
	get :function(onSuccess){
		findDocuments(database,onSuccess);
	}
}