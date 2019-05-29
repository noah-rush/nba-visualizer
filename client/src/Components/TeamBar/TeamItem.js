import React, { Component } from "react";


var TeamItem = (props) =>{
    return (
    	<button className = {`team-btn ${props.active}`} onClick = {() =>{props.teamFilter(props.tricode)}}>
      	<img  data-tricode = {props.tricode} src = {props.logo}></img>
     	</button>
    )
  
}

export default TeamItem;
