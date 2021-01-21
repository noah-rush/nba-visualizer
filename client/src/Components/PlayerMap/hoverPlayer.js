import React, { Component } from "react";

var HoverPlayer = (props) => {
    return (
        props.hover ?
        <div className = "hover-player">
 	<img  src = {`https://d2cwpp38twqe55.cloudfront.net/req/201902151/images/players/${props.hover._id}.jpg`}></img>
 	       <div className = "hover-player-name">
 	       		{props.hover.name}
 	       </div>

	 	       </div> :
        ""
    )

}

export default HoverPlayer;