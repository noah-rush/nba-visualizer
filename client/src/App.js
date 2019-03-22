import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import TeamBar from "./Components/TeamBar/TeamBar";
import TeamItem from "./Components/TeamBar/TeamItem.js";
import StatsArea from "./Components/StatsArea/StatsArea.js";
import Graph from "./Components/Graphs/Graph.js";
import PlayerCard from "./Components/Player/PlayerCard.js";
import PlayerBar from "./Components/Player/PlayerBar.js";
import PlayerMap from "./Components/PlayerMap";

// import PlayerStats from "./Components/Player/PlayerStats.js";
import TeamStatTable from "./Components/TeamStatTable/TeamStatTable.js";

import API from "./Utils/API";
import D3 from "./Utils/D3";
import GRAPHS from "./Utils/GRAPHS";





let statTranslationArray = {

    groupSet: "Group Set",
    playerId: "",
    playerName: "Name",
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
        switchSort: false,
        teamsLoaded: "not-active",
        playerLoaded: "not-active",
        graphStyle: "Pie",
        playerMap: [],
        allPlayerMap: [],

        allConnections:[],

        playerMapConnections:[]

    };
    componentDidMount() {
        // this.loadTeams();
        this.initPlayerMap();

    };
    initPlayerMap = () => {
        console.log("init player map")
        API.playerMap()
            .then(data => {
                // console.log(data.data);
                // data = data.data.map(x => {x.r = 50});
                console.log(data);
                data.data.data.forEach(function(element) { 
                    console.log(element.connections)
                    if(element.length == "NA"){
                        element.r = 50

                    }else{
                        element.r = element.length * 5; 
                    }
                    
                });
                this.setState({ playerMap: data.data.data});
                this.setState({ allPlayerMap: data.data.data});

                this.setState({ playerMapConnections: data.data.connections});
                this.setState({ allConnections: data.data.connections});

                // this.state.playerMapConnections = data.data.connections

                // D3.playerMap(data.data);
            })


    };
    loadTeams = () => {
        API.getTeams()
            .then(res => this.setState({
                teams: res.data,
                teamsLoaded: "active"
            }))
            .catch(err => console.log(err));
    };
    sort = (property) => {
        let currentState = { ...this.state };
        if (this.state.tableSort == property) {
            currentState.switchSort = !currentState.switchSort;
        } else {
            currentState.switchSort = false;
        }
        currentState.tableSort = property;
        this.setState(currentState)
        GRAPHS.statGraph(property, this.state.teams[this.state.activeTeam], this.state.graphStyle);

    }
    getTeam = (teamId, index) => {
        // console.log(teamId);
        // console.log(index);

        let currentState = { ...this.state };
        currentState.activeTeam = index;
        currentState.activePlayer = "false";
        currentState.viewMode = "team"
        // currentState.playerLoaded = "not-active";
        this.setState(currentState)
        if (currentState.teams[currentState.activeTeam].players.length == 0) {
            currentState.playerLoaded = "not-active";

            API.getTeam(teamId)
                .then(data => {
                    let currentState = { ...this.state };
                    currentState.playerLoaded = "active";
                    currentState.teams[currentState.activeTeam].players = data.data
                    this.setState(currentState)
                    D3.initPlusMinus(this.state.teams[index]);
                    GRAPHS.teamAssistToTurnover(this.state.teams[index])

                    // this.getPlayerImages(index);
                    // currentState.data.data
                })
        }


        // currentState.activeTeam.teamIndex = index

    };
    showFirstLevelConnections = (player) =>{
        console.log(playerId )
        let playerId = player._id;
                // let currentState = { ...this.state };
                // console.log(currentState);
        let currentPlayerConnections = this.state.playerMap.filter(x=>x._id == playerId)[0].connections;
        console.log(currentPlayerConnections);
        let activeConnections = this.state.allConnections.filter(x=> currentPlayerConnections.some(y => y == x._id))
        // console.log(activeConnections)
        let activePlayers = activeConnections.map(x => 
            {let player = x.players.replace(playerId + "|", "")
            player = player.replace( "|" + playerId, "")
            return player}
        )
        activePlayers = this.state.allPlayerMap.filter(x=> activePlayers.some(y => y == x._id))
        activePlayers.unshift(player)

        console.log(activePlayers);
        // console.log(activeConnections);
        // console.log(this.state.playerMap)
        this.setState({playerMapConnections:activeConnections,
        playerMap:activePlayers})
        // this.setState({playerMap:activePlayers })


    }


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
    toggleGraphType = event => {
        this.setState({ "graphStyle": event.target.value })
        GRAPHS.statGraph(this.state.tableSort, this.state.teams[this.state.activeTeam], event.target.value);

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

            <PlayerMap playerMapPlayerView = {true} firstLevelConnections ={this.showFirstLevelConnections} connections = {this.state.playerMapConnections} playerNodes = {this.state.playerMap} className = "player-connections">

            </PlayerMap>
      <TeamBar active = {this.state.teamsLoaded}>
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
   
    <div className = "row">
      <StatsArea>
   
        { 
          this.state.activeTeam != "false" ? 
           <TeamStatTable 
           colors = {this.state.teams[this.state.activeTeam].colors}
           tableSort = {this.state.tableSort ? this.state.tableSort : "" }
           sort = {this.sort}
        mode = {this.state.viewMode}
        playerId = {this.state.viewMode == "player" ? this.state.teams[this.state.activeTeam].players[this.state.activePlayer].playerId : ""}
        translationArray = {statTranslationArray}
        switchSort = {this.state.switchSort}
        team = { this.state.teams[this.state.activeTeam].players }></TeamStatTable>:"" }

       
      
      </StatsArea>
        {this.state.tableSort ?
        <div class = "graph-view-container">
       
        <Graph toggleGraphType = {this.toggleGraphType} graphName = {this.state.tableSort ? statTranslationArray[this.state.tableSort] : ""} className = "stat-graph"></Graph>


        </div>
        : ""}
      </div>
      </div>
        )


    }
}

export default App;