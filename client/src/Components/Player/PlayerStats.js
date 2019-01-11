import React from "react";



var PlayerStats = (props) =>{

    return (
      <div className = "player-stats">
      Per Game Stats: 
      <div class = "pts-per-game">Points: {props.stats.pts}</div>
      <div class = "rebounds-per-game">Rebounds: {props.stats.reb}</div>
      <div class = "ast-per-game">Assists: {props.stats.ast}</div>
      <div class = "blocks-per-game">Blocks: {props.stats.blk}</div>
      <div class = "steals-per-game">Steals: {props.stats.stl}</div>
      <div class = "orebounds-per-game">Offensive Rebounds: {props.stats.oreb}</div>
      <div class = "drebounds-per-game">Defensive Rebounds: {props.stats.dreb}</div>


      </div>
    )
  
}

export default PlayerStats;
