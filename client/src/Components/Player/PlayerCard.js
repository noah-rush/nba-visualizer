import React from "react";



var PlayerCard = (props) =>{

	let playerName = props.name
	let firstLast = playerName.split(" ");
	// console.log(firstLast);


    return (
      <div className = "player-card">
      
      <img src = {`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${props.id}.png`}></img>
      <div className = "player-name">{props.name}</div>
      {props.children}
      </div>
    )
  
}

export default PlayerCard;
