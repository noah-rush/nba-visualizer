import React, { Component } from "react";

var ActivePlayer = (props) => {
    return (
        props.active ?
        <div className = "active-player">
 	<img  src = {`https://d2cwpp38twqe55.cloudfront.net/req/201902151/images/players/${props.active.data._id}.jpg`}></img>
 	       <div className = "active-player-name">
 	       		{props.active.data.name}
 	       </div>
 	       <input onKeyDown="return false" value = {props.depthNumber} type = "number" min ="1" onChange ={props.handleNumberChange}></input>

	 	       </div> :
        ""
    )

}

export default ActivePlayer;