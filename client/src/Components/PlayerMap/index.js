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

class PlayerMap extends Component {

    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.hoverPlayer == nextProps.hoverPlayer) {
            return true;
        } else {
            return false;
        }
    }

    render() {

        var height = 1000
        var width = 1000

        let root = pack().size([width, height]).padding(15)(hierarchy(this.props.playerNodes)
            .sum(d => d.r));

        let nodes = root.descendants();
        nodes - nodes.shift();

        return (

            <DragScrollProvider vertical = 'true' horizontal = 'true' threshold={0.040}>
    {({ onMouseDown, ref }) => (
      
        <div className="player-map scrollable"
          ref={ref}
          onMouseDown={onMouseDown}>

        <svg height = {width}  width = {height} className = {this.props.className}  >
        {
            nodes.map((player,index) => (
            <pattern id = {player.data._id + player.depth} x = "0%" y ="0%" height = "100%" width= "100%" key = {player.data._id + player.depth}>

            {player.data.type == "player" ? <circle  fill= "white" r = "800px" ></circle>:""}

            {player.data.type == "team" ?
                                 <image 
                xlinkHref= {`https://www.nba.com/assets/logos/teams/primary/web/${player.data._id.toUpperCase()}.svg`}
                     width = { player.r * 2 + "px"}
                    height = { player.r * 2 + "px"}
                    x = "0%"
                    y = "0%"></image>
:
                 <image 

                xlinkHref= {`https://d2cwpp38twqe55.cloudfront.net/req/201902151/images/players/${player.data._id}.jpg`}
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

         
            
        {nodes.map((player,index) => (

            <g fill = {player.data.type == "nest" ? "black" : ""} key = {player.data.type == "nest" ? player.name : player.data._id + player.depth} id = {`move-${player.data._id}`} onClick = {player.data.type == "player" ? () => this.props.firstLevelConnections(player) : () =>{}} className = {player.data.type == "player" ? "group group-player" : player.data.type == "team" ? "group group-team" : "group-nest"} width = { player.r * 2 * 0.84 + "px"}  transform = {`translate(${player.x},${player.y})`}>
           
            {player.data.type == "team" ?
             <circle stroke ="black" fill = {"url(#" + player.data._id + player.depth + ")"}  r ={player.r*1} >
            </circle> 
            : player.data.type == "player" ?
            <circle onMouseEnter = {() =>{this.props.playerHover(player.data._id)}}  fill = {"url(#" + player.data._id + player.depth +  ")"}  r ={player.r*0.84}  >
            </circle>
            :
            <circle  stroke ="black" fill = {"rgba(0,0,0,0.4"}  r ={player.r*0.84}  >
            </circle>
            }

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
}

export default PlayerMap;