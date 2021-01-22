const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const axios = require("axios")
const nbaColor = require('nba-color');
const NBA = require("nba");
const mongoose = require('mongoose');
const moment = require('moment');


var db = require("./models");

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

// Define API routes here
// 
// const mongoose = require('mongoose');


const uri =  process.env.MONGODB_URI;
// const uri = 'mongodb://localhost/basketball-reference'
mongoose.connect(uri);





// 202710
// let startDate = "2/01/2019";

// let currentDate = moment(startDate, "MM/DD/YYYY");
// while(!currentDate.isSame(new Date(), "day")){
//   // console.log(currentDate.format("MM/DD/YYYY") + " - " + currentDate.add(1,'days').format("MM/DD/YYYY"));
// // console.log( currentDate.add(1,'days').format("MM/DD/YYYY"));
// NBA.stats.teamPlayerDashboard({ LeagueID: "00", TeamID:"1610612755",  DateFrom:currentDate.format("MM/DD/YYYY"), DateTo: currentDate.add(1,'days').format("MM/DD/YYYY"), SeasonType: "Regular Season"}).then(function(data) {
//       console.log(data)
//         // res.json(data.playersSeasonTotals);

//     })
// // currentDate = currentDate.add(1,'days');
// }


NBA.stats.teamPlayerDashboard({ LeagueID: "00", TeamID: "1610612755", DateFrom: "11/22/2018", DateTo: "11/23/2018", SeasonType: "Regular Season" }).then(function(data) {
    // console.log(data)
    // res.json(data.playersSeasonTotals);

}).catch(function(eerr) {
    // console.log("eerr");
})


// NBA.stats.playerProfile({SeasonType: "Regular Season", PlayerID:"202710", Season: "2015-16" }).then(function(data) {
//       console.log(data)
//         // res.json(data.playersSeasonTotals);

//     })


app.get('/api/teams', function(req, res) {

    // console.log("dsds")
    axios.get('http://data.nba.net/10s/prod/v2/2018/teams.json').then(
        function(data) {
            // console.log(data.data);

            teams = data.data.league.standard;
            teams = teams.filter(x => x.isNBAFranchise);

            for (var i = 0; i < teams.length; i++) {
                teams[i].logo = "https://www.nba.com/assets/logos/teams/primary/web/" + teams[i].tricode + ".svg"
                teams[i].players = []
                teamColors = nbaColor.getColors(teams[i].tricode);
                colorKeys = Object.keys(teamColors);
                colors = []
                for (var j = 0; j < colorKeys.length; j++) {
                    colors.push(teamColors[colorKeys[j]].hex)
                }
                teams[i].colors = colors;

            }
            res.send(teams);
        }).catch(function(err) {
        console.log(err);

    })


})



app.get('/api/teams/:team', function(req, res) {
    var team = req.params.team

    NBA.stats.teamPlayerDashboard({ TeamID: team, SeasonType: "Regular Season" }).then(function(data) {
        // console.log(data.playersSeasonTotals)
        res.json(data.playersSeasonTotals);

    })

})

app.get('/api/playerMap', function(req, res) {


    // db.Players.find({}).populate("connections").then(function(data){
    //  let results = {data:data, connections:[]}

    //     res.json(results)
    // })
    db.Players.aggregate([{
                "$project": {
                    "_id": 1,
                    "name": 1,
                    "connections": 1,
                    "team": 1,
                                  "length": { $cond: { if: { $isArray: "$connections" }, then: { $size: "$connections" }, else: "NA"} }

                }
            },
            {
                "$group": {
                    "_id": "$team",
                    children: {
                        $push: {
                            "$cond": [
                                { $gt: ["$connections", null] },
                                { name: "$name", connections: "$connections", "team": "$team", "_id": "$_id",                                 "length": { $cond: { if: { $isArray: "$connections" }, then: { $size: "$connections" }, else: "NA"} }
 },
                                null

                            ]
                        }
                    }
                }
            }
        ])
        .then(function(data) {

            data = data.filter(x => x._id != null);
            data = data.map((x) => {let filtChild= x.children.filter(y => y !=null)
                    x.children = filtChild
                    return x}
                )
            data = data.filter(x => x.children.length >0)

            let players = data.map(x => x.children)
            players = players.reduce((acc, val) => acc.concat(val), []);
            // players = players.filter(x => x.connections ? true : false)
            // data = data.map((x) => x.children.filter(y => y !=null))
            console.log(data)

            let connections = players.map(x => x.connections);
            connections = connections.reduce((acc, val) => acc.concat(val), []);
            // connections = connections.filter(x => x != undefined);
            // console.log(connections);

            // connections = [];
            db.Connections.find({ "_id": { "$in": connections } }).then(function(connections) {
                // console.log(connections);
                let results = { data: data.reverse(), connections: connections }
                res.json(results);

            })
        })

})


app.get('/api/player/:player', function(req, res) {
    var player = req.params.player

    NBA.stats.playerProfile({ PlayerID: player, SeasonType: "Regular Season" }).then(function(data) {

        res.json(data);

    })

})


// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
    console.log(`🌎 ==> Server now on port ${PORT}!`);
});