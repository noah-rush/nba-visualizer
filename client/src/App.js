import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import TeamBar from "./Components/TeamBar/TeamBar";
import TeamItem from "./Components/TeamBar/TeamItem.js";
import StatsArea from "./Components/StatsArea/StatsArea.js";
import Graph from "./Components/Graphs/Graph.js";
import PlayerCard from "./Components/Player/PlayerCard.js";
import PlayerStats from "./Components/Player/PlayerStats.js";

import API from "./Utils/API";
import D3 from "./Utils/D3";



class App extends Component {

	state = {
		teams:[],
    activeTeam:"false",
    activePlayer:"false"

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
      let currentState = {...this.state};
      currentState.activeTeam = index;
      currentState.activePlayer = "false";
      this.setState(currentState)

      // currentState.activeTeam.teamIndex = index
      API.getTeam(teamId)
        .then(data=>{
      let currentState = {...this.state};

          currentState.teams[currentState.activeTeam].players = data.data
          this.setState(currentState)
          D3.initPlusMinus(this.state.teams[index]);
          // this.getPlayerImages(index);
          // currentState.data.data
        })
    };
    getPlayer = (playerId, teamIndex, playerIndex) => {
      let currentState = {...this.state};
      currentState.activePlayer = playerIndex;
      this.setState(currentState)
      API.getPlayer(playerId)
      .then(data =>{
              let currentState = {...this.state};

        currentState.teams[teamIndex].players[playerIndex].profile = data.data;
        this.setState(currentState)
      })

      


    }
    createStatTable = (stats) =>{
      let statTable = []
      console.log(stats);
      for (var property in stats) {

        if (stats.hasOwnProperty(property) && property != "profile" && property.indexOf("Rank") < 0) {
          let children = stats[property];
          statTable.push(<div key = {property}>{property} : {stats[property]}</div>)
        }
      }
      console.log(statTable)
      return statTable;

  }
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
      <div className = "main-container">
      <TeamBar>
      {this.state.teams.map((team, index) => (
       	<TeamItem key = {team.teamId}
              id = {team.teamId}
       			  logo = {team.logo}
              index = {index}
              active = {index == this.state.activeTeam ? "active" : ""}

       			  tricode = {team.tricode}
              getTeam = {this.getTeam}>
       	</TeamItem>
       	))}
      </TeamBar>
      <div className = "player-row">
    {
      isNaN(this.state.activeTeam) ? "" :
      this.state.teams[this.state.activeTeam].players.map((player,index)=>(
          <PlayerCard key = {player.playerId}
                      id = {player.playerId}
                      index = {index}
                      active = {index == this.state.activePlayer ? "active" : ""}
                      teamIndex = {this.state.activeTeam}
                      name = {player.playerName}
                      getPlayer = {this.getPlayer}
          ></PlayerCard>
      ))
      }
    </div>
      <StatsArea>
      {isNaN(this.state.activePlayer) ? "" :
        <PlayerStats stats = {this.state.teams[this.state.activeTeam].players[this.state.activePlayer]}>

        </PlayerStats>
        }
        <Graph></Graph>
      </StatsArea>
      </div>


    );
  }
}

export default App;
