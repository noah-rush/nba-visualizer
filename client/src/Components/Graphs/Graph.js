import React, { Component } from "react";


var Graph = (props) =>{
    return (
       <div >
       	<svg className = {props.className}>
       	<g className = "graph-inner">
       	</g>
       	</svg>
       </div>
    )
  
}

export default Graph;
