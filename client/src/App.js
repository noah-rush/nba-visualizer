import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import TeamBar from "./Components/TeamBar/TeamBar";
import TeamItem from "./Components/TeamBar/TeamItem.js";
import StatsArea from "./Components/StatsArea/StatsArea.js";
import Graph from "./Components/Graphs/Graph.js";
import PlayerCard from "./Components/Player/PlayerCard.js";
import PlayerStats from "./Components/Player/PlayerStats.js";
import TeamStatTable from "./Components/TeamStatTable/TeamStatTable.js";

import API from "./Utils/API";
import D3 from "./Utils/D3";
import GRAPHS from "./Utils/GRAPHS";





let statTranslationArray = {

    groupSet: "Group Set",
    playerId: "Player Id",
    playerName: "Player Name",
    gp: "Games Played",
    w: "Wins",
    l: "Losses",
    wPct: "Win Percentage",
    min: "Minutes",
    fgm: "Field Goals Made",
    fga: "Field Goals Attempted",
    fgPct: "Field Goal Percentage",
    fG3M: "3Pt Fields Goals Made",
    fG3A: "3Pt Fields Goals Attempted",
    fg3Pct: "3Pt Field Goal Percentage",
    ftm: "Free Throws Made",
    fta: "Free Throws Attempted",
    ftPct: "Free Throw Percentage",
    oreb: "Offensive Rebounds",
    dreb: "Defensive Rebounds",
    reb: "Rebounds",
    ast: "Assists",
    tov: "Turnovers",
    stl: "Steals",
    blk: "Blocks",
    blka: "Shots Blocked",
    pf: "Pensonal Fails",
    pfd: "Personal Fails Drawn",
    pts: "Points",
    plusMinus: "Plus Minus",
    nbaFantasyPts: "Fantasy Points",
    dD2: "Double Doubles",
    tD3: "Triple Doubles"

}







class App extends Component {

    state = {
        teams: [],
        activeTeam: "false",
        activePlayer: "false",
        viewMode: "team",
        switchSort: false

    };
    componentDidMount() {
        this.loadTeams();

    };
    loadTeams = () => {
        API.getTeams()
            .then(res => this.setState({
                teams: res.data
            }))
            .catch(err => console.log(err));
    };
    sort = (property) =>{
      let currentState = { ...this.state };
      if(this.state.tableSort == property){
        currentState.switchSort = !currentState.switchSort;
      }else{
        currentState.switchSort = false;
      }
      currentState.tableSort = property;
      this.setState(currentState)

    }
    getTeam = (teamId, index) => {
        // console.log(teamId);
        // console.log(index);
        let currentState = { ...this.state };
        currentState.activeTeam = index;
        currentState.activePlayer = "false";
        currentState.viewMode = "team"

        this.setState(currentState)

        // currentState.activeTeam.teamIndex = index
        API.getTeam(teamId)
            .then(data => {
                let currentState = { ...this.state };

                currentState.teams[currentState.activeTeam].players = data.data
                this.setState(currentState)
                D3.initPlusMinus(this.state.teams[index]);
                GRAPHS.teamAssistToTurnover(this.state.teams[index])

                // this.getPlayerImages(index);
                // currentState.data.data
            })
    };
    getPlayer = (playerId, teamIndex, playerIndex) => {
        let currentState = { ...this.state };
        currentState.activePlayer = playerIndex;
        currentState.viewMode = "player"
        this.setState(currentState)
        API.getPlayer(playerId)
            .then(data => {
                let currentState = { ...this.state };

                currentState.teams[teamIndex].players[playerIndex].profile = data.data;
                this.setState(currentState)
            })




    }
    createStatTable = (stats) => {
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
   
        { this.state.activeTeam != "false" ? 
           <TeamStatTable 
           tableSort = {this.state.tableSort ? this.state.tableSort : "" }
           sort = {this.sort}
        mode = {this.state.viewMode}
        playerId = {this.state.viewMode == "player" ? this.state.teams[this.state.activeTeam].players[this.state.activePlayer].playerId : ""}
        translationArray = {statTranslationArray}
        switchSort = {this.state.switchSort}
        team = { this.state.teams[this.state.activeTeam].players }></TeamStatTable>:"" }

        {this.state.viewMode == "team" && this.state.activeTeam != "false" ? 

        <div class = "team-view-container">
       
        <Graph className = "graph"></Graph>
        <Graph className = "ast-to-tov"></Graph>
        </div>
        : ""
      }
      </StatsArea>
      </div>


        );
    }
}

export default App;