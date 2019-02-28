import React, { Component } from "react";
import { select, selectAll, enter, event, each } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisTop, axisBottom, axisLeft } from 'd3-axis'
import { extent, max, sum } from 'd3-array'
import { transition } from 'd3-transition'
import { packSiblings } from 'd3-hierarchy'

const styles = { 
        transform: `translate(50%, 50%)` 
    };

var PlayerMap = (props) => {

    console.log(props.playerNodes)
	var packed = packSiblings(props.playerNodes);
	// console.log(packed)
    let lines = []
    // console.log(props.connections)
    // console.log(props.playerNodes)

    for(let connection of props.connections){
        // console.log(connection.players.split("|")[0])
        // console.log(connection.players.split("|")[1])

        let player1 = connection.players.split("|")[0];
        let player2 = connection.players.split("|")[1];
        player1 = props.playerNodes.filter(x => x._id == player1);
        player2 = props.playerNodes.filter(x => x._id == player2);

        connection.x1 = player1[0].x
        connection.y1 = player1[0].y
        connection.x2 = player2[0].x
        connection.y2 = player2[0].y
        lines.push(<line x1 = {connection.x1} y1 = {connection.y1} x2 = {connection.x2} y2 =  {connection.y2} stroke = "black" key = {connection._id}></line>            )

    }
// console.log(lines)
    

 // .attr("id", function(d) {
 //                return d._id
 //            }).attr("x", "0%").attr("y", "0%").attr("height", "100%").attr("width", "100%")


 //        defs.append("circle").attr("fill", "white").attr("x", "0%").attr("y", "0%").attr("r", "250px").attr("width", "250px")
 //        defs.append("image").attr("xlink:href", function(d) {
 //            return "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" + d._id + ".png";

 //        }).attr("x", "0%").attr("y", "1%").attr("height", function(d) {
 //            return d.r * 2 * 0.84 + "px";
 //        }).attr("width", function(d) {
 //            return d.r * 2 * 0.84 + "px";
 //        })


    return (
        <div className = "player-map">

        <svg className = {props.className}  width="1000" height="1000">
		{props.playerNodes.map((player,index) => (
        	<pattern id = {player._id} x = "0%" y ="0%" height = "100%" width= "100%" key = {player._id}>
        		<circle fill="white" r = "250px" >
        		</circle>
                 <image 
                xlinkHref= {`https://d2cwpp38twqe55.cloudfront.net/req/201902151/images/players/${player._id}.jpg`}
                    width = { player.r * 2 * 0.84 + "px"}
                    height = { player.r * 2 * 0.84 + "px"}
                    x = "0%"
                    y = "1%"></image>
        	</pattern>
        	)
        )}

        <g className = "graph-inner"  width="1000" height="1000">
        <g style={styles}>

            {lines}
         
        	
        {props.playerNodes.map((player,index) => (
        	<circle onClick = {() => props.firstLevelConnections(player)} fill = {"url(#" + player._id + ")"} cx = {player.x} cy ={player.y} r ={player.r*0.84} stroke = "lightblue" key = {player._id}></circle>
        	)
        )}

      


        </g>
        </g>
        </svg>

      </div>
    )

}

export default PlayerMap;