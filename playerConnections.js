const NBA = require("nba");
const mongoose = require('mongoose');
const moment = require('moment');


// var db = require("./models");



mongoose.connect('mongodb://localhost/nba_db');

var db = require("./models");




// 202710
let startDate = "01/20/2018";

let currentDate = moment(startDate, "MM/DD/YYYY");



// NBA.stats.teamPlayerDashboard({ LeagueID: "00", TeamID: "1610612755", DateFrom: currentDate.format("MM/DD/YYYY"), DateTo: currentDate.add(1, 'days').format("MM/DD/YYYY"), SeasonType: "Regular Season" }).then(function(data) {
// console.log(data);
// })


while (!currentDate.isSame(new Date(), "day")) {
    NBA.stats.teamPlayerDashboard({ LeagueID: "00", TeamID: "1610612755", DateFrom: currentDate.format("MM/DD/YYYY"), DateTo: currentDate.add(1, 'days').format("MM/DD/YYYY"), SeasonType: "Regular Season" }).then(function(data) {
        console.log(data.playersSeasonTotals);
        for (var i = 0; i < data.playersSeasonTotals.length; i++) {
            for (var j = 0; j < data.playersSeasonTotals.length; j++) {
                if (j != i) {
                    db.Players.findOneAndUpdate({ "_id": data.playersSeasonTotals[i].playerId }, {
                        "name": data.playersSeasonTotals[i].playerName,
                        "_id": data.playersSeasonTotals[i].playerId,
                        $addToSet: { hasPlayedWith: data.playersSeasonTotals[j].playerId }
                    }, { upsert: true, new: true }).then(function(result) {
                        console.log(result);
                    })
                }
            }
        }
    })
}

