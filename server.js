const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const axios = require("axios")
const nbaColor = require('nba-color');
const NBA = require("nba");

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Define API routes here

app.get('/api/teams', function(req, res) {

    console.log("dsds")
    axios.get('http://data.nba.net/10s/prod/v2/2018/teams.json').then(
    	function(data){
    		console.log(data.data);

        teams = data.data.league.standard;
        teams = teams.filter(x=>x.isNBAFranchise);
        for(var i =0; i<teams.length; i++){
          teams[i].logo = "https://www.nba.com/assets/logos/teams/primary/web/" + teams[i].tricode + ".svg"

          teamColors = nbaColor.getColors(teams[i].tricode);
          colorKeys = Object.keys(teamColors);
          colors = []
          for(var j =0; j<colorKeys.length; j++){
            colors.push(teamColors[colorKeys[j]].hex)
          }
          teams[i].colors = colors;

        }
        res.send(teams);
    	}).catch(function(err){
    		console.log(err);

    	})


})



app.get('/api/teams/:team', function(req, res) {
    var team = req.params.team
  
    NBA.stats.teamPlayerDashboard({ TeamID: team, SeasonType: "Regular Season" }).then(function(data) {
      console.log(data.playersSeasonTotals)
        res.json(data.playersSeasonTotals);

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


