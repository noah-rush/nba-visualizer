const NBA = require("nba");
const mongoose = require('mongoose');
const moment = require('moment');
const axios = require('axios')
const cheerio = require('cheerio')
// var db = require("./models");



mongoose.connect('mongodb://localhost/basketball-reference');

var db = require("./models");




// 202710
let startDate = "01/01/2019";

let currentDate = moment(startDate, "MM/DD/YYYY");

// NBA.stats.teamPlayerDashboard({ LeagueID: "00", TeamID: "1610612755", DateFrom: currentDate.format("MM/DD/YYYY"), DateTo: currentDate.add(1, 'days').format("MM/DD/YYYY"), SeasonType: "Regular Season" }).then(function(data) {
// console.log(data);
// })


while (!currentDate.isSame(new Date(), "day")) {
    NBA.stats.teamPlayerDashboard({ LeagueID: "00", TeamID: "1610612755", DateFrom: currentDate.format("MM/DD/YYYY"), DateTo: currentDate.add(1, 'days').format("MM/DD/YYYY"), SeasonType: "Regular Season" }).then(function(data) {
        // console.log(data);
        for (var i = 0; i < data.playersSeasonTotals.length; i++) {
            db.Players.findOneAndUpdate({ "_id": data.playersSeasonTotals[i].playerId }, {
                "name": data.playersSeasonTotals[i].playerName,
                "_id": data.playersSeasonTotals[i].playerId,
            }, { upsert: true, new: true }).then(function(result) {
                console.log(result);
            })
            for (var j = 0; j < data.playersSeasonTotals.length; j++) {
                if (j != i) {
                    player1Id = data.playersSeasonTotals[i].playerId;
                    player2Id = data.playersSeasonTotals[j].playerId;
                    var playerString = parseInt(player1Id) > parseInt(player2Id) ? player2Id + "|" + player1Id : player1Id + "|" + player2Id
                    console.log(playerString)
                    db.Connections.findOneAndUpdate({ players: playerString }, { players: playerString, team: 1610612755, year: 2019 }, { upsert: true, new: true }).then(function(result) {
                        console.log(result);
                        var players = result.players.split("|");
                        db.Players.findOneAndUpdate({ "_id": players[0] }, {
                            "_id": players[0],
                            $addToSet: { "connections" : result._id }
                        }, { upsert: true, new: true }).then(function(result) {
                            console.log(result);
                        })
                        db.Players.findOneAndUpdate({ "_id": players[1] }, {
                            "_id": players[1],
                            $addToSet: { "connections" : result._id }
                        }, { upsert: true, new: true }).then(function(result) {
                            console.log(result);
                        })
                    })

                    // db.Connection.create
                }
            }
        }
    }).catch(function(error){
        console.log(error);
    })
}