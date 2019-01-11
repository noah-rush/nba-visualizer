import React, { Component } from "react";


var TeamItem = (props) =>{
    return (
    	<button className = "team-btn" onClick = {() =>{props.getTeam(props.id, props.index)}}>
      	<img  data-tricode = {props.tricode} src = {props.logo}></img>
     	</button>
    )
  
}

export default TeamItem;
