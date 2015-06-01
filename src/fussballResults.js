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

var findDocuments = function(db, playerName, callback) {
  // Get the documents collection 
  var collection = db.collection('results');
  // Find some documents
  query = {}
  console.log('player name is ' + playerName)
  if (playerName != null){
    query = {
      $or: [ { 'home team' : playerName }, { 'away team': playerName }]
    }
  }
  console.log('query is ' +query)
  collection.find(query).toArray(function(err, docs) {
    assert.equal(err, null);    
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
}



var parseQueryString = function(queryString){
  var splitFixture = queryString.fixture.toUpperCase().split('-');
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

var getTable = function(db, playerName, callback){
      
      var aggregate =[]
      if (playerName !=null){
        console.log('aggregate....' + playerName)
          aggregate.push({ $match: {$or: [ { 'home team' : playerName }, { 'away team': playerName }]}});
      }
      aggregate.push({ $project: { winner : { $cond: { if: { $eq: [ "10", "$home score" ] }, then: "$home team", else: "$away team" }}}})
      aggregate.push({ $group: {_id: "$winner", TotalPoints: { $sum: 1 } }})
      aggregate.push({ $sort :{ TotalPoints : -1}})
      db.collection('results').aggregate(aggregate).toArray(function(err, docs) {
        assert.equal(null, err);  
        callback(docs);
    });
}

module.exports ={
	get :function(onSuccess){
    getTable(database, null, function(table){
      console.log('table is ')
      console.log(table)
        findDocuments(database, null, function(rawResults){
          console.log('rawResults is ')
          console.log(rawResults)
          onSuccess({
            "Table": table,
            "RawResults" : rawResults
          });
        });        
    });
	},
  getForPlayer: function(playerName, onSuccess){
    getTable(database, playerName, function(table){
      console.log('table is ')
      console.log(table)
        findDocuments(database, playerName, function(rawResults){
          console.log('rawResults is ')
          console.log(rawResults)
          onSuccess({
            "Table": table,
            "RawResults" : rawResults
          });
        });        
    });
  },
  insert :function(queryString, onSuccess){
      var toInsert = parseQueryString(queryString);
      insertDocuments(database, toInsert, onSuccess);
  }
}