const mongoose = require('mongoose');
var db = require("./models");
mongoose.connect('mongodb://localhost/basketball-reference');



db.Players.updateMany({team:"njn"}, {$set:{team:'bkn'}}).then(function(result){
	console.log(result);
})
db.Players.updateMany({team:"njn1"}, {$set:{team:'bkn'}}).then(function(result){
	console.log(result);
})
db.Players.updateMany({team:"noh"}, {$set:{team:'nop'}}).then(function(result){
	console.log(result);
})
db.Players.updateMany({team:"brk"}, {$set:{team:'bkn'}}).then(function(result){
	console.log(result);
})
db.Players.updateMany({team:"brkl"}, {$set:{team:'njn'}}).then(function(result){
	console.log(result);
})
db.Players.updateMany({team:"cho"}, {$set:{team:'cha'}}).then(function(result){
	console.log(result);
})
db.Players.updateMany({team:"pho"}, {$set:{team:'phx'}}).then(function(result){
	console.log(result);
})

db.Players.updateMany({team:"sea"}, {$set:{team:'okc'}}).then(function(result){
	console.log(result);
})

db.Players.updateMany({team:"van"}, {$set:{team:'mem'}}).then(function(result){
	console.log(result);
})

db.Players.updateMany({team:"nok"}, {$set:{team:'nop'}}).then(function(result){
	console.log(result);
})

db.Players.updateMany({team:"wsb"}, {$set:{team:'was'}}).then(function(result){
	console.log(result);
})

db.Players.updateMany({team:"chh"}, {$set:{team:'cha'}}).then(function(result){
	console.log(result);
})
