import React, { Component } from "react";
import TeamItem from "./TeamItem.js"

var TeamBar = (props) =>{
    return (
      <div className = "logo-sidebar">
      {props.children}
      </div>
    )
  
}

export default TeamBar;
