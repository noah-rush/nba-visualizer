import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import TeamBar from "./Components/TeamBar/TeamBar";
import TeamItem from "./Components/TeamBar/TeamItem.js";

import API from "./Utils/API";


class App extends Component {

	state = {
		teams:[]
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

  render() {
    return (
      <TeamBar>
      {this.state.teams.map(team => (
       	<TeamItem key = {team.teamId}
       			  logo = {team.logo}
       			  tricode = {team.tricode}>
       	</TeamItem>
       	))}
      </TeamBar>
    );
  }
}

export default App;
