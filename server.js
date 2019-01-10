const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const axios = require("axios")
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
        }
        res.send(teams);
    	}).catch(function(err){
    		console.log(err);

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


