import React from "react";



var PlayerStats = (props) =>{

      let statTranslationArray = {

        groupSet: "Group Set",
playerId:  "Player Id",
playerName: "Player Name",
gp: "Games Played",
w:"Wins",
l:"Losses",
wPct:"Win Percentage",
min:"Minutes",
fgm:"Field Goals Made",
fga:"Field Goals Attempted",
fgPct:"Field Goal Percentage",
fG3M:"3Pt Fields Goals Made",
fG3A:"3Pt Fields Goals Attempted",
fg3Pct:"3Pt Field Goal Percentage",
ftm:"Free Throws Made",
fta:"Free Throws Attempted",
ftPct:"Free Throw Percentage",
oreb:"Offensive Rebounds",
dreb:"Defensive Rebounds",
reb:"Rebounds",
ast:"Assists",
tov:"Turnovers",
stl:"Steals",
blk:"Blocks",
blka:"Shots Blocked",
pf:"Pensonal Fails",
pfd:"Personal Fails Drawn",
pts:"Points",
plusMinus:"Plus Minus",
nbaFantasyPts:"Fantasy Points",
dD2:"Double Doubles",
tD3:"Triple Doubles"

      }




      let statTable = []
      console.log(props.stats);
      for (var property in props.stats) {

        if (props.stats.hasOwnProperty(property) && property != "profile" && property.indexOf("Rank") < 0) {
          let children = props.stats[property];
          statTable.push(<div className = {`stat-${property} stat`} key = {property}>{statTranslationArray[property]} : {props.stats[property]}</div>)
        }
      }
      console.log(statTable)
      




    return (
      <div className = "player-card-container">
      {statTable}


      </div>
    )
  
}

export default PlayerStats;
