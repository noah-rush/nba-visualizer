
import React, { Component } from "react";


var PlayerMap = (props) =>{
    return (
      <div className = "player-map">

        <svg className = {props.className}>
       
        <g className = "graph-inner">
        </g>
        </svg>

      </div>
    )
  
}

export default PlayerMap;
