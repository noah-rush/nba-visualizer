import React, { Component } from "react";


var TeamItem = (props) =>{
    return (
    	<button className = {`team-btn ${props.active}`} onClick = {() =>{if(props.active == "active"){}else{props.getTeam(props.id, props.index)}}}>
      	<img  data-tricode = {props.tricode} src = {props.logo}></img>
     	</button>
    )
  
}

export default TeamItem;
