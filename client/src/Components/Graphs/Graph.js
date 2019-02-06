import React, { Component } from "react";


var Graph = (props) =>{
    return (
       <div >
       <h3>{props.graphName}</h3>
       <label for ="Pie">Pie</label>
    	<input onClick ={(event) =>{props.toggleGraphType(event)}} type = "radio" name = "graphSelector" value = "Pie"/>
    	 <label for ="Bar">Bar</label>
    	<input onClick ={(event) =>{props.toggleGraphType(event)}} type = "radio" name = "graphSelector" value = "Bar"/>

       	<svg className = {props.className}>
       	<g className = "graph-inner">
       	</g>
       	</svg>
       </div>
    )
  
}

export default Graph;
