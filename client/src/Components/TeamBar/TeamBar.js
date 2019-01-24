import React, { Component } from "react";
import TeamItem from "./TeamItem.js"

var TeamBar = (props) =>{
    return (
      <div className = {`logo-sidebar ${props.active}`}>
      {props.children}
      </div>
    )
  
}

export default TeamBar;
