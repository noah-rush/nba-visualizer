import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import TeamBar from "./Components/TeamBar/TeamBar";
import TeamItem from "./Components/TeamBar/TeamItem.js";
import StatsArea from "./Components/StatsArea/StatsArea.js";
import Graph from "./Components/Graphs/Graph.js";
import PlayerCard from "./Components/Player/PlayerCard.js";

import API from "./Utils/API";
import D3 from "./Utils/D3";



class App extends Component {

	state = {
		teams:[],
    activeTeam:{
      players:[]
    }
  	};
  	componentDidMount(){
  		  		this.loadTeams();

  	};
  	loadTeams = () => {
	    API.getTeams()
	      .then(res => this.setState({ 
	      	teams: res.data }))
	      .catch(err => console.log(err));
  	};
    getTeam = (teamId, index) => {
      // console.log(teamId);
      // console.log(index);
      let currentState = this.state;
      currentState.activeTeam = this.state.teams[index];
      currentState.activeTeam.teamIndex = index
      API.getTeam(teamId)
        .then(data=>{
          currentState.teams[index].players = data.data
          this.setState(currentState)
          D3.initPlusMinus(this.state.activeTeam);
          // this.getPlayerImages(index);
          // currentState.data.data
        })
    };

    // getPlayerImages = (index) =>{
    //   for(let player of this.state.activeTeam.players){
    //     console.log(player);
    //   API.getPlayerData(player.playerId)
    //     .then(function(data){
    //       console.log(data)
    //     })
    //   }

    // }


  render() {
    return (
      <div>
      <TeamBar>
      {this.state.teams.map((team, index) => (
       	<TeamItem key = {team.teamId}
              id = {team.teamId}
       			  logo = {team.logo}
              index = {index}
       			  tricode = {team.tricode}
              getTeam = {this.getTeam}>
       	</TeamItem>
       	))}
      </TeamBar>
    {this.state.activeTeam.players.map((player,index)=>(
          <PlayerCard key = {player.playerId}
                      id = {player.playerId}
                      teamId = {this.state.activeTeam.teamId}
                      index = {index}
                      teamIndex = {this.state.activeTeam.index}
                      name = {player.playerName}
          ></PlayerCard>

      ))}
      <StatsArea>
        <Graph></Graph>
      </StatsArea>
      </div>


    );
  }
}

export default App;
