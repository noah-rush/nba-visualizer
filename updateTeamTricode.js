const mongoose = require('mongoose');
var db = require("./models");
mongoose.connect('mongodb://localhost/basketball-reference');



db.Players.updateMany({team:"brk"}, {$set:{team:'bkn'}}).then(function(result){
	console.log(result);
})
db.Players.updateMany({team:"cho"}, {$set:{team:'cha'}}).then(function(result){
	console.log(result);
})
db.Players.updateMany({team:"pho"}, {$set:{team:'phx'}}).then(function(result){
	console.log(result);
})