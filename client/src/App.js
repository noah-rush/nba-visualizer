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
import Autocomplete from './Components/PlayerMap/autocomplete'
import ActivePlayer from './Components/PlayerMap/activePlayer'
import HoverPlayer from './Components/PlayerMap/hoverPlayer'

// import PlayerStats from "./Components/Player/PlayerStats.js";
import TeamStatTable from "./Components/TeamStatTable/TeamStatTable.js";

import API from "./Utils/API";
import D3 from "./Utils/D3";
import GRAPHS from "./Utils/GRAPHS";
import AUTOCOMPLETE from "./Utils/Autocomplete";
import CONNECTIONS from "./Utils/CONNECTIONS";

import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
// import Autosuggest from 'react-autosuggest';



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
    tD3: "Triple Doubles",
    searchValue: ""

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
        playerMap: {
            children:[]
        },
        allPlayerMap: [],
        suggestions: [],
        allConnections: [],
        searchValue: "",
        playerMapConnections: [],
        playerMapFocus: "",
        depthNumber:1,
        hoverPlayer:false,
        updateMap: true
    };
    componentDidMount() {
        // this.loadTeams();
        this.initPlayerMap();
        this.loadTeams();

    };

    handleNumberChange = (event) => {
        this.setState({
            depthNumber: event.target.value
        })
        this.showNthLevelConnections(this.state.playerMapFocus, event.target.value)
    }
    handleSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    handleChange = name => (event, { newValue }) => {
        console.log(newValue)
        this.setState({
            searchValue: newValue,
        });
    };
    handleSelectionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {

        let player = {};

        player.data = suggestion
        this.showFirstLevelConnections(player)





    }

    getSuggestions = (value) => {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;

        return inputLength === 0 ? [] :
            this.state.suggestionMasterList.filter(suggestion => {
                let keep = ""
                if(suggestion.name != undefined){
                     keep = count < 5 && suggestion.name.slice(0, inputLength).toLowerCase() === inputValue ? suggestion : "";
                }
                if (keep != "") {
                    count += 1;
                }

                return keep;
            });
    }


    teamFilter = (tricode) => {
                let allPlayerMap = JSON.parse(JSON.stringify({...this.state.allPlayerMap}));
                let team = allPlayerMap.children.filter(x => x._id == tricode.toLowerCase());
                let playerMap = {}
                playerMap.children = team;
                playerMap.name = "PlayerMap"
                this.setState({ playerMap: playerMap})

    }
    initPlayerMap = () => {
        // console.log("init player map")
        API.playerMap()
            .then(data => {
                var players = {}
                players.name = "PlayerMap"
                players.children = data.data.data
                let suggestionMasterList = []

                players.children.forEach(function(element, index) {
                    element.index = index;
                    element.type = "team"
                    element.children.forEach(function(x, index) {
                        x.type = "player"

                        if (x.length == "NA") {
                            x.r = 50
                            x.value = 50;
                        } else {
                            x.r = x.length * 8;
                            x.value = x.length * 8;
                        }
                      suggestionMasterList.push(x);
                    })

                });
                this.setState({ playerMap: players,
                    allPlayerMap: players,
                    suggestionMasterList: suggestionMasterList,
                    suggestions: suggestionMasterList,
                    playerMapConnections: data.data.connections,
                    allConnections: data.data.connections
                 });
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
    resetPlayerMap = () => {
        let allConnections = [...this.state.allConnections];

        let allPlayers = {...this.state.allPlayerMap}
        // console.log(allPlayers);
      
        this.setState({
            playerMapConnections: allConnections,
            playerMap: allPlayers,
            playerMapFocus: ""
            // playerMapFocus: ""
        })

    }
    showFirstLevelConnections = (player) => {
        let newState = CONNECTIONS.firstLevelConnections(player, this.state.allPlayerMap, this.state.allConnections)
        this.setState(newState)
        // this.setState({updateMap:true})
    }

    showNthLevelConnections = (player, levels) => {
        let firstLevel = CONNECTIONS.firstLevelConnections(player, this.state.allPlayerMap, this.state.allConnections).playerMap;
        let newState = CONNECTIONS.nthLevelConnections(levels, player, firstLevel, this.state.allPlayerMap,this.state.playerMapConnections, this.state.allConnections)
        
        this.setState(newState)
        // this.setState({updateMap:true})

    }
    //   showThirdLevelConnections = (player) => {
    //     let newState = CONNECTIONS.nthLevelConnections(3, player, this.state.playerMap, this.state.allPlayerMap,this.state.playerMapConnections, this.state.allConnections)
        
    //     this.setState(newState)
    // }


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
    playerHover = (playerIndex) =>{
        console.log(playerIndex)
        let hoverPlayer = this.state.suggestionMasterList.filter(x => x._id == playerIndex)
        this.setState({hoverPlayer: hoverPlayer[0]})
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
        // console.log(statTable)
        return statTable;

    }
    callUpdated = () =>{
        this.setState({updateMap:false})
    }

    render() {
        return (
            <div className = "main-container">
           
            <ActivePlayer 
                nthLevel = {this.showNthLevelConnections}
                handleNumberChange = {this.handleNumberChange}
                depthNumber = {this.depthNumber}  
                active = {this.state.playerMapFocus}></ActivePlayer>

                <HoverPlayer hover = {this.state.hoverPlayer}></HoverPlayer>
  
  {
        <Autocomplete
         suggestions = {this.state.suggestions} 
         className = "search-playerMap" 
         value = {this.state.searchValue}
         handleChange = {this.handleChange}
         handleSuggestionsFetchRequested = {this.handleSuggestionsFetchRequested}
         handleSuggestionsClearRequested = {this.handleSuggestionsClearRequested}
         handleSelectionSelected = {this.handleSelectionSelected}
         ></Autocomplete>
     }

            <PlayerMap  
            reset = {this.resetPlayerMap} 
            activePlayer ={this.state.playerMapFocus}
            hoverPlayer ={this.state.hoverPlayer} 
            playerMapPlayerView = {true} 
            firstLevelConnections ={this.showFirstLevelConnections} 
            connections = {this.state.playerMapConnections} 
            playerNodes = {this.state.playerMap} 
            playerHover = {this.playerHover}
            updated = {this.state.updateMap}
            callUpdated = {this.callUpdated}
            className = "player-connections">

            </PlayerMap>
      <TeamBar active = {this.state.teamsLoaded}>
      {this.state.teams.map((team, index) => (
        <TeamItem key = {team.teamId}
              id = {team.teamId}
              logo = {team.logo}
              index = {index}
              active = {index == this.state.activeTeam ? "active" : ""}
              teamFilter = {this.teamFilter}
              tricode = {team.tricode}
              getTeam = {this.getTeam}>
        </TeamItem>
        ))}
      </TeamBar>
   
    <div className = "row">
    {
      // <StatsArea>
   
      //   { 
      //     this.state.activeTeam != "false" ? 
      //      <TeamStatTable 
      //      colors = {this.state.teams[this.state.activeTeam].colors}
      //      tableSort = {this.state.tableSort ? this.state.tableSort : "" }
      //      sort = {this.sort}
      //   mode = {this.state.viewMode}
      //   playerId = {this.state.viewMode == "player" ? this.state.teams[this.state.activeTeam].players[this.state.activePlayer].playerId : ""}
      //   translationArray = {statTranslationArray}
      //   switchSort = {this.state.switchSort}
      //   team = { this.state.teams[this.state.activeTeam].players }></TeamStatTable>:"" }

       
      
      // </StatsArea>
  }
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