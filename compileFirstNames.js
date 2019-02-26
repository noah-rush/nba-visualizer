var fs = require('fs');
const mongoose = require('mongoose');

function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function(filename) {
          console.log(filename)
            var file = fs.readFileSync(dirname + filename, 'utf-8');
            onFileContent(filename, file)
            // console.log(file);
        });
    });
}



mongoose.connect('mongodb://localhost/nba_db');

var db = require("./models");

 


// db.FirstNames.create({
// name:"Derrick",
// count:1,
// rank:1
// }).then(function(data){
//   console.log(data);
//   console.log("success");
// })


var masterList = [];
var nameList = [];
readFiles("data/runs/1980s/", function(name, content) {


    lines = content.split("\r\n")
    for (line of lines) {
        lineInfo = line.split(",")

        var name = lineInfo[0]
        var sex = lineInfo[1]
        var count = parseInt(lineInfo[2]);
        var numberAppearances = parseInt(lineInfo[2]);
        // console.log(count);

        if (sex == "M") {

            // console.log(name);
            //  db.FirstNames.create({name:name, yearsOnList:1, count:count}).then(function(data){
            //       console.log("index created")
            //     })
            // //     })
            db.FirstNames.findOneAndUpdate({"name":name}, {"name":name, $inc: { "count" : count, "yearsOnList": 1 }}, {upsert:true, new:true}).then(function(result){
              console.log(result);
              
              })
            // var index = masterList.findIndex(x => x.name == name)
            // console.log(index);
            // console.log(masterList);
            // if (index > 0) {
            //     masterList[index].count = count + masterList[index].count
            //     masterList[index].yearsOnList = masterList[index].yearsOnList + 1

            // } else {
            //     masterList.push({
            //         name: name,
            //         count: count,
            //         yearsOnList: 1
            //     })

            // }
        }
    }
    // console.log(masterList)
    // fs.writeFile("total.json" , JSON.stringify(masterList), function(err) {
    //       if (err) {
    //           return console.log(err);
    //       }

    //       console.log("The txt master file was saved!");
    //   });

}, function(err) {
    throw err;
})