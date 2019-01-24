import React, { Component } from "react";
// import TeamItem from "./TeamItem.js"

var PlayerBar = (props) =>{
    return (
      <div className = {`player-row ${props.active}`}>
      {props.children}
      </div>
    )
  
}

export default PlayerBar;
