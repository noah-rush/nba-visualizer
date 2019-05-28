const NBA = require("nba");
const mongoose = require('mongoose');
const moment = require('moment');
const axios = require('axios')
const cheerio = require('cheerio')
// var db = require("./models");



mongoose.connect('mongodb://localhost/basketball-reference');

var db = require("./models");




// 202710
let startDate = "10/01/2017";

let endDate = "11/01/2017";

let year = "2017";

let currentDate = moment(startDate, "MM/DD/YYYY");

// NBA.stats.scoreboard({LeagueID: "00", DayOffset: "0", gameDate:startDate}).then(function(data){
//     console.log(data);
// })

while (!currentDate.isSame(new Date(endDate), "day")) {
    console.log(currentDate.format("MM"))

    axios.get("https://www.basketball-reference.com/boxscores/?month=" + currentDate.format("MM") + "&day=" + currentDate.format("DD") + "&year=" + currentDate.format("YYYY")).then(function(data) {
        // console.log(data.data);
        const $ = cheerio.load(data.data);
        let hrefs = []
        $(".gamelink a").each(function(e) {
            hrefs.push($(this).attr("href"))
        })
        // console.log(hrefs);
        for (var i = 0; i < hrefs.length; i++) {
            axios.get("https://www.basketball-reference.com" + hrefs[i]).then(function(data) {
                const $ = cheerio.load(data.data);
                // console.log(data.data);
                let teams = []
                // console.log($('.game_summary').find('a').text());
                $(".in_list").find("a").each(function(e) {
                    // console.log($(this))
                    teamCode = $(this).attr("href").replace("/teams/", "").substring(0, 3).toLowerCase();
                    if (e != 2) {
                        teams.push(teamCode)
                    }
                })

                team1 = {}
                team1.code = teams[0]
                team1.players = [];
                $('#div_box_' + teams[0] + '_basic tbody').find("tr").each(function() {
                    player = {
                        name: $(this).find('a').text(),
                        _id: $(this).find('th.left').attr("data-append-csv")
                    }
                    if ($(this).find('td[data-stat="mp"]').text()) {
                        // console.log($(this).find('a').text());
                        team1.players.push(player)
                    }

                })
                team2 = {}
                team2.code = teams[1]
                team2.players = [];
                $('#div_box_' + teams[1] + '_basic tbody').find("tr").each(function() {
                    // console.log($(this).find('a').text());
                    // console.log($(this).find('th.left').attr("data-append-csv"));
                    // console.log($(this).find('td[data-stat="mp"]').text());
                    player = {
                        name: $(this).find('a').text(),
                        _id: $(this).find('th.left').attr("data-append-csv")
                    }
                    if ($(this).find('td[data-stat="mp"]').text()) {
                        // console.log($(this).find('a').text());
                        team2.players.push(player)
                    }
                })
                // console.log(team1);
                // console.log(team2);



                for (var i = 0; i < team1.players.length; i++) {
                    // db.Players.findOneAndUpdate({ "_id": team1.players[i]._id }, {
                    //     "name": team1.players[i].name,
                    //     "_id": team1.players[i]._id,
                    //     "team": team1.code
                    // }, { upsert: true, new: true }).then(function(result) {
                    //     console.log(result);
                    // }).catch(function(error) {
                    //     console.log("dude already entered")
                    // })
                    for (var j = 0; j < team1.players.length; j++) {
                        if (j != i) {
                            player1Id = team1.players[i]._id;
                            player2Id = team1.players[j]._id;
                            var playerString = player1Id > player2Id ? player2Id + "|" + player1Id : player1Id + "|" + player2Id
                            // console.log(playerString)
                            db.Connections.findOneAndUpdate({ players: playerString }, { players: playerString, team: team1.code, year: year }, { upsert: true, new: true }).then(function(result) {
                                // console.log(result);
                                var players = result.players.split("|");
                                db.Players.findOneAndUpdate({ "_id": players[0] }, {
                                    "_id": players[0],
                                    $addToSet: { "connections": result._id }
                                }, { upsert: true, new: true }).then(function(result) {
                                    console.log(result);
                                }).catch(function(error) {
                                    console.log("connection already entered")
                                })
                                db.Players.findOneAndUpdate({ "_id": players[1] }, {
                                    "_id": players[1],
                                    $addToSet: { "connections": result._id }
                                }, { upsert: true, new: true }).then(function(result) {
                                    console.log(result);
                                }).catch(function(error) {
                                    console.log("connection already entered")
                                })
                            })

                            // db.Connection.create
                        }
                    }
                }





                for (var i = 0; i < team2.players.length; i++) {
                    // db.Players.findOneAndUpdate({ "_id": team2.players[i]._id }, {
                    //     "name": team2.players[i].name,
                    //     "_id": team2.players[i]._id,
                    //     "team": team2.code
                    // }, { upsert: true, new: true }).then(function(result) {
                    //     console.log(result);
                    // })
                    for (var j = 0; j < team2.players.length; j++) {
                        if (j != i) {
                            player1Id = team2.players[i]._id;
                            player2Id = team2.players[j]._id;
                            var playerString = player1Id > player2Id ? player2Id + "|" + player1Id : player1Id + "|" + player2Id
                            // console.log(playerString)
                            db.Connections.findOneAndUpdate({ players: playerString }, { players: playerString, team: team2.code, year: year }, { upsert: true, new: true }).then(function(result) {
                                console.log(result);
                                var players = result.players.split("|");
                                db.Players.findOneAndUpdate({ "_id": players[0] }, {
                                    "_id": players[0],
                                    $addToSet: { "connections": result._id }
                                }, { upsert: true, new: true }).then(function(result) {
                                    console.log(result);
                                }).catch(function(error) {
                                    console.log("connection already entered")
                                })
                                db.Players.findOneAndUpdate({ "_id": players[1] }, {
                                    "_id": players[1],
                                    $addToSet: { "connections": result._id }
                                }, { upsert: true, new: true }).then(function(result) {
                                    console.log(result);
                                })
                            }).catch(function(error) {
                                    console.log("connection already entered")
                                })

                            // db.Connection.create
                        }
                    }
                }







            })
        }

    })
    currentDate.add(1, 'days')

}