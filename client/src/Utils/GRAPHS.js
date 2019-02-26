import d3 from './D3.js'

export default {
    teamAssistToTurnover(team) {
        let graphObject = {}
        graphObject.dataSet = team.players.map(x => { return { id: x.playerId, name: x.playerName, xValue: x.ast, yValue: x.tov } });
        console.log(graphObject)
        graphObject.target = ".ast-to-tov"
        graphObject.headShots = true
        d3.lineGraph(graphObject)
    },
    statGraph(stat, team, style) {
        let graphObject = {}
        graphObject.dataSet = team.players.map(x => { return { id: x.playerId, xValue: x.playerName, yValue: x[stat] } });
        graphObject.target = ".stat-graph"
        graphObject.colorScale = team.colors;
        switch (style) {
            case "Pie":
                d3.pieChart(graphObject);
                break;
            case "Bar":
                d3.barGraph(graphObject);
                break;
        }

    },
    
};





// import axios from "axios";

// export default {
//   // Gets all books
//   getTeams: function() {
//     return axios.get("/api/teams");
//   },
//   // Gets the book with the given id
//   getTeam: function(id) {
//     return axios.get("/api/teams/" + id);
//   },
//   // Deletes the book with the given id
//   deleteBook: function(id) {
//     return axios.delete("/api/books/" + id);
//   },
//   // Saves a book to the database
//   saveBook: function(bookData) {
//     return axios.post("/api/books", bookData);
//   }
// };