const NBA = require("nba");
const mongoose = require('mongoose');
const moment = require('moment');
const _axios = require('axios')
const cheerio = require('cheerio')
// var db = require("./models");

const axiosRetry = require('axios-retry')

const axios = _axios.create()


mongoose.connect('mongodb://localhost/basketball-reference');

var db = require("./models");

const retryDelay = (retryNumber = 0) => {
    const seconds = Math.pow(2, retryNumber) * 1000;
    const randomMs = 1000 * Math.random();
    return seconds + randomMs;
};

axiosRetry(axios, {
    retries: 5,
    retryDelay,
    // retry on Network Error & 5xx responses
    retryCondition: axiosRetry.isRetryableError,
});



// 202710
let startDate = "9/01/2015";

let endDate = "1/20/2021";

let year = "2021";

let currentDate = moment(startDate, "MM/DD/YYYY");

// NBA.stats.scoreboard({LeagueID: "00", DayOffset: "0", gameDate:startDate}).then(function(data){
//     console.log(data);
// })
let boxscoreHrefs = []

function getMonthBoxScores(startDate, endDate) {
    console.log(currentDate.format("MM") + currentDate.format("YYYY"))
    month = currentDate.format("MM")
    currentDate = startDate
    let returns = 0
    let sends = 0
    while (month == currentDate.format("MM") && !currentDate.isSame(new Date(endDate), "day")) {

        axios.get("https://www.basketball-reference.com/boxscores/?month=" + currentDate.format("MM") + "&day=" + currentDate.format("DD") + "&year=" + currentDate.format("YYYY"), { timeout:3000 }).then(function(data) {
            // console.log("returning");
            returns += 1
            const $ = cheerio.load(data.data);
            $(".gamelink a").each(function(e) {
                boxscoreHrefs.push($(this).attr("href"))
            })
            console.log(returns)
            console.log(sends)
            if (returns == sends) {
                console.log("done 1")
                // console.log(returns)
                if (currentDate.isSame(new Date(endDate), "day")) {
                    console.log("all done")
                    const fs = require('fs')

                    // Data which will write in a file. 
                    let data = JSON.stringify(boxscoreHrefs)

                    // Write data in 'Output.txt' . 
                    fs.writeFile('boxscoresLinks.txt', data, (err) => {

                        if (err) throw err;
                    })


                } else {
                    console.log("month done")
                    getMonthBoxScores(currentDate, endDate)
                    return
                }
                // return true

            }
        }).catch(function(error) {
            console.log(error);
            returns += 1
        })
        currentDate.add(1, 'days')
        sends += 1
        // console.log(currentDate.format("DD"))
    }
}


getMonthBoxScores(currentDate, endDate)


// while(returns != sends ){
//     console.log("sends:" + sends)
//     console.log("returns:" + returns)

// }

// const fs = require('fs') 

// // Data which will write in a file. 
// let data = JSON.stringify(boxscoreHrefs)

// // Write data in 'Output.txt' . 
// fs.writeFile('boxscoresLinks.txt', data, (err) => { 

//     if (err) throw err; 
// }) 


function getPlayers($, teamCode) {
    team.code = teamCode
    team.players = [];
    $('#box-' + teamCode.toUpperCase() + '-game-basic tbody').find("tr").each(function() {
        player = {
            name: $(this).find('a').text(),
            _id: $(this).find('th.left').attr("data-append-csv")
        }
        if ($(this).find('td[data-stat="mp"]').text() && player._id != undefined) {
            // console.log($(this).find('a').text());

            team.players.push(player)
        }

    })
    return team
}

function addToDB(team) {
    for (var i = 0; i < team.players.length; i++) {

        for (var j = i + 1; j < team.players.length; j++) {
            player1Id = team.players[i]._id;
            player2Id = team.players[j]._id;
            var playerString = player1Id > player2Id ? player2Id + "|" + player1Id : player1Id + "|" + player2Id
            // console.log(playerString)
            db.Connections.findOneAndUpdate({ players: playerString }, { players: playerString, team: team1.code, year: year }, { upsert: true, new: true }).then(function(result) {
                // console.log(result);
                var players = result.players.split("|");
                db.Players.findOneAndUpdate({ "_id": players[0] }, {
                    "_id": players[0],
                    team: result.team,
                    $addToSet: { "connections": result._id }
                }, { upsert: true, new: true }).then(function(result) {
                    console.log(result);
                }).catch(function(error) {
                    console.log("connection already entered")
                })
                db.Players.findOneAndUpdate({ "_id": players[1] }, {
                    "_id": players[1],
                    team: result.team,
                    $addToSet: { "connections": result._id }
                }, { upsert: true, new: true }).then(function(result) {
                    console.log(result);
                }).catch(function(error) {
                    console.log("connection already entered")
                })
            })


        }
    }

}
// for (var i = 0; i < hrefs.length; i++) {
//     axios.get("https://www.basketball-reference.com" + hrefs[i]).then(function(data) {
//         const $ = cheerio.load(data.data);
//         // console.log(data.data);
//         let teams = []
//         //             // console.log($('.game_summary').find('a').text());
//         $(".in_list").find("a").each(function(e) {
//             // console.log($(this))
//             teamCode = $(this).attr("href").replace("/teams/", "").substring(0, 3).toLowerCase();
//             if (e != 2) {
//                 teams.push(teamCode)
//             }
//         })

//         team1 = getPlayers($, teams[0])
//         team2 = getPlayers($, teams[1])








//     })
// }