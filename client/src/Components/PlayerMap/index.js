import React, { Component } from "react";
import { select, selectAll, enter, event, each } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisTop, axisBottom, axisLeft } from 'd3-axis'
import { extent, max, sum } from 'd3-array'
import { transition } from 'd3-transition'
import { packSiblings, pack, hierarchy } from 'd3-hierarchy'
import DragScrollProvider from 'drag-scroll-provider'
import Autocomplete from './autocomplete'

const styles = {
    transform: `translate(50%, 50%)`
};

var PlayerMap = (props) => {

    // if (props.activePlayer || props.activePlayer === 0) {
    //     // console.log("sds");].r = 150;
    // }
    //     props.playerNodes[props.activePlayer
    // console.log(props.playerNodes);
    // let structure = hierarchy(props.playerNodes)
    console.log(props.playerNodes)
    var height = 600 + props.playerNodes.children.length * 120;
    var width = 600 + props.playerNodes.children.length * 120

    let root = pack().size([width, height]).padding(5)(hierarchy(props.playerNodes)
        .sum(d => d.r));
    console.log(root);
    // console.log(root.descendants());
    let nodes = root.descendants();
    // var packed = packSiblings(props.playerNodes);
    console.log(nodes)
    nodes - nodes.shift();
    let lines = []
    // console.log(props.connections)
    // console.log(props.playerNodes)
    // var minY = 0;
    // var maxY = 0;
    // var extentHeight = extent(props.playerNodes, function(d) { return d.y; });
    // var height = extentHeight[1] - extentHeight[0] + 500;
    // var extentWidth = extent(props.playerNodes, function(d) { return d.x; });
    // var width = extentWidth[1] - extentHeight[0] + 500;
    // var halfWidth = width/2;
    // var halfHeight = height/2
    // console.log(props)
        // console.log(props.playerNodes);

    // var allPlayers = props.playerNodes.children.map(x=>x.children);
    // console.log(allPlayers)


    for (let connection of props.connections) {
        // console.log(connection.players.split("|")[0])
        // console.log(connection.players.split("|")[1])

        let player1 = connection.players.split("|")[0];
        let player2 = connection.players.split("|")[1];
        // console.log(props.playerNodes);
        player1 = nodes.filter(x => x.data._id == player1);
        player2 = nodes.filter(x => x.data._id == player2);
        // player2 = props.playerNodes.filter(x => x._id == player2);
        // console.log(player1);
        // console.log(player2);

        if (player1.length != 0 && player2.length != 0) {
            connection.x1 = player1[0].x
            connection.y1 = player1[0].y
            connection.x2 = player2[0].x
            connection.y2 = player2[0].y
            lines.push(<line x1 = {connection.x1} y1 = {connection.y1} x2 = {connection.x2} y2 =  {connection.y2} stroke = "black" key = {connection._id}></line>)
            // if(connection.y2)
        }

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

        <DragScrollProvider threshold={0.015}>
    {({ onMouseDown, ref }) => (
      
        <div className="player-map scrollable"
          ref={ref}
          onMouseDown={onMouseDown}>

        <a onClick = {props.reset} className = "reset-playerMap">Back To All</a>
        <svg height = {width}  width = {height} className = {props.className}  >
        {
            nodes.map((player,index) => (
            <pattern id = {player.data._id} x = "0%" y ="0%" height = "100%" width= "100%" key = {player.data._id}>

            {player.depth == 2 ? <circle fill={props.activePlayer === index ? "red" : "white"} r = "300px" ></circle>:""}
                            {player.depth == 1 && player.data.children.length ==1 ?
                                 <image 
                xlinkHref= {player.depth == 2 ? `https://d2cwpp38twqe55.cloudfront.net/req/201902151/images/players/${player.data._id}.jpg` : player.depth == 1 ? `https://www.nba.com/assets/logos/teams/primary/web/${player.data._id.toUpperCase()}.svg` : ""}
                    width = { player.r * 4 + "px"}
                    height = { player.r * 3  + "px"}
                    x = "0%"
                    y = "0%"></image>
:
                 <image 
                xlinkHref= {player.depth == 2 ? `https://d2cwpp38twqe55.cloudfront.net/req/201902151/images/players/${player.data._id}.jpg` : player.depth == 1 ? `https://www.nba.com/assets/logos/teams/primary/web/${player.data._id.toUpperCase()}.svg` : ""}
                    width = { player.r * 2 * 0.84 + "px"}
                    height = { player.r * 2 * 0.84 + "px"}
                    x = "0%"
                    y = "0%"></image>

}
            </pattern>
            )
        )
    }

        <g className = "graph-inner" transform = {`translate(-${width}px,-${height}px)`} >
        <g>

            {lines}
         
            
        {nodes.map((player,index) => (

            <g key = {player.data._id} onClick = {player.depth == 2 ? () => props.firstLevelConnections(player) : () =>{}} className = {player.depth == 2 ? "group group-player" : player.depth == 1 ? "group group-team" : ""} width = { player.r * 2 * 0.84 + "px"}  transform = {`translate(${player.x},${player.y})`}>
           
            {player.depth == 1 && player.data.children.length ==1 ?
             <circle  fill = {"url(#" + player.data._id + ")"}  r ={player.r*1.5} stroke = "lightblue"  strokeWidth = {player.depth == 2 ? "1px" : player.depth == 1 ? "0px" : "0px"}>
            </circle> 
            :
            <circle  fill = {"url(#" + player.data._id + ")"}  r ={player.r*0.84} stroke = "lightblue"  strokeWidth = {player.depth == 2 ? "1px" : player.depth == 1 ? "0px" : "0px"}>
            </circle>
        }
                <text x="0%" y="0%" textAnchor="middle" stroke="#51c5cf" strokeWidth="1px" dy=".3em" width ={player.r*0.84} >{player.data.name}</text>

            </g>
            )
        )}

      


        </g>
        </g>
        </svg>

      </div>
      )}
    </DragScrollProvider>
    )

}

export default PlayerMap;