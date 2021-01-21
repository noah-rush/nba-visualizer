const NBA = require("nba");
const mongoose = require('mongoose');
const moment = require('moment');
const axios = require('axios')
const cheerio = require('cheerio')
// var db = require("./models");



mongoose.connect('mongodb://localhost/basketball-reference');

var db = require("./models");




// 202710
// let startDate = "01/01/2019";

// let currentDate = moment(startDate, "MM/DD/YYYY");

// NBA.stats.scoreboard({LeagueID: "00", DayOffset: "0", gameDate:startDate}).then(function(data){
//     console.log(data);
// })
var first = "a",
    last = "z";
for (var i = first.charCodeAt(0); i <= last.charCodeAt(0); i++) {
    var alphabet = eval("String.fromCharCode(" + i + ")");
    // console.log(alphabet);
    url = "https://www.basketball-reference.com/players/" + alphabet + "/"
    // console.log(url)
    axios.get(url).then(function(data) {
        const $ = cheerio.load(data.data);
        $('#players').find("tbody th").each(function() {
            console.log($(this).find("a").text())
            console.log($(this).attr("data-append-csv"))
            db.Players.findOneAndUpdate({ "_id": $(this).attr("data-append-csv") }, {
                "name": $(this).find("a").text(),
                "_id": $(this).attr("data-append-csv")
            }, { upsert: true, new: true }).then(function(result) {
                console.log(result);
            }).catch(function(error) {
                console.log("dude already entered")
            })
        })


    })

}
