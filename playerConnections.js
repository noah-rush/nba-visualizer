// const express = require("express");
// const path = require("path");
// const PORT = process.env.PORT || 3001;
// const app = express();
// const axios = require("axios")
// const nbaColor = require('nba-color');
const NBA = require("nba");
const mongoose = require('mongoose');
const moment = require('moment');


// var db = require("./models");



mongoose.connect('mongodb://localhost/nba_db');

var db = require("./models");



// Define middleware here
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// // Serve up static assets (usually on heroku)
// if (process.env.NODE_ENV === "production") {
//     app.use(express.static("client/build"));
// }

// Define API routes here
// 
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/nba_db');





// 202710
let startDate = "1/20/2019";

let currentDate = moment(startDate, "MM/DD/YYYY");

// let urlString = "https://stats.nba.com/stats/teamplayerdashboard?MeasureType=Base&PerMode=PerGame&PlusMinus=N&PaceAdjust=N&Rank=N&LeagueID=00&Season=2018-19&TeamID=1610612755&Outcome=&Location=&Month=0&SeasonSegment=&DateFrom=02%2F05%2F2019&DateTo=02%2F06%2F2019&OpponentTeamID=0&VsConference=&VsDivision=&GameSegment=&Period=0&LastNGames=0&SeasonType=Regular%20Season"


while (!currentDate.isSame(new Date(), "day")) {
    // console.log(currentDate.format("MM/DD/YYYY") + " - " + currentDate.add(1,'days').format("MM/DD/YYYY"));
    // console.log( currentDate.add(1,'days').format("MM/DD/YYYY"));
    NBA.stats.teamPlayerDashboard({ LeagueID: "00", TeamID: "1610612755", DateFrom: currentDate.format("MM/DD/YYYY"), DateTo: currentDate.add(1, 'days').format("MM/DD/YYYY"), SeasonType: "Regular Season" }).then(function(data) {
            // console.log(data)
            console.log(data.playersSeasonTotals);
            for (var i = 0; i < data.playersSeasonTotals.length; i++) {
                for (var j = 0; j < data.playersSeasonTotals.length; j++) {
                    if (j != i) {
                        db.Players.findOneAndUpdate({ "_id": data.playersSeasonTotals[i].playerId }, {
                            "name": data.playersSeasonTotals[i].playerName,
                            "_id": data.playersSeasonTotals[i].playerId,
                            $addToSet: { hasPlayedWith: data.playersSeasonTotals[j].playerId }
                            },
                            { upsert: true, new: true }).then(function(result) {
                                console.log(result);
                     	})
                        }
                    }
                }
            })
}

    // NBA.stats.teamPlayerDashboard({ LeagueID: "00", TeamID: "1610612755", DateFrom: "11/22/2018", DateTo: "11/23/2018", SeasonType: "Regular Season" }).then(function(data) {
    //     console.log(data)
    //     // res.json(data.playersSeasonTotals);

    // })