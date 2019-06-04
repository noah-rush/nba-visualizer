// import d3 from './D3.js'

export default {
    firstLevelConnections(player, allPlayers, allConnections) {
        let playerId = player.data._id;
        let playerConnections = player.data.connections
        // let allPlayerMap = JSON.parse(JSON.stringify({ allPlayers }));
        let allPlayerMap = JSON.parse(JSON.stringify({ ...allPlayers }))
        let activeConnections = allConnections.filter(x => playerConnections.some(y => y == x._id))
        let activePlayerIDs = activeConnections.map(x => {
            let player = x.players.replace(playerId + "|", "")
            player = player.replace("|" + playerId, "")
            return player
        })
        activePlayerIDs.unshift(playerId);




        let newPlayerMap = allPlayerMap.children.filter(
            function(team) {
                // console.log(team.children);
                let teamChildrenFilter = team.children.filter(player => activePlayerIDs.some(x => x == player._id));
                // console.log(teamChildrenFilter);
                if (teamChildrenFilter.length == 0) {
                    return false;
                } else {
                    return true;
                }
            })
        activePlayerIDs.shift();


        newPlayerMap = newPlayerMap.map(team => {
            team.children = team.children.filter(player => activePlayerIDs.some(x => x == player._id));
            return team;
        })
        // console.log(newPlayerMap);
        // console.log(player)
        newPlayerMap.map(x => {
            if (x._id == player.data.team) {
                // player.data.r = 1000;
                x.children.unshift(player.data)
                return x;
            } else {
                return x;
            }
        })
        // newPlayerMap[player.data.team].unshift(player.data);
        // newPlayerMap
        newPlayerMap = {
            name: "PlayerMap",
            children: newPlayerMap
        }
        newPlayerMap.children.forEach(function(element, index) {
            element.index = index;
            element.children.forEach(function(x, index) {
                if (x._id == player.data._id) {
                    x.r = 1000

                } else if (x.length == "NA") {
                    x.r = 50
                    x.value = 50;
                } else {
                    x.r = x.length * 8;
                    x.value = x.length * 8;
                }
                // suggestionMasterList.push(x);

            })

        });
        // console.log(newPlayerMap);
        // this.setState({
        //     playerMap: newPlayerMap,
        //     playerMapConnections: activeConnections,
        //     playerMapFocus: player
        // })
        return {
            playerMap: newPlayerMap,
            playerMapConnections: activeConnections,
            playerMapFocus: player
        }

        // activePlayers = allPlayerMap.filter(x => activePlayers.some(y => y == x._id))
        // activePlayers.unshift(player)
        // activePlayers = activePlayers.map((x, index) => {
        //     x.r = x.length * 8;
        //     return x
        // });
        // // console.log(activePlayers)
        // this.setState({
        //     playerMapConnections: activeConnections,
        //     playerMap: activePlayers,
        //     playerMapFocus: 0
        // })


    },
    nthLevelConnections(n, player, firstLevel, allPlayers, activeConnections, allConnections) {
        let allPlayerMap = JSON.parse(JSON.stringify({ ...allPlayers }))
        let playersToIgnore = []
        let playerConnections = []
        let firstLevelConnections = activeConnections;
        // console.log(activeConnections)
        // console.log(firstLevelConnections)

        playersToIgnore.push(player.data._id);
        for (var i = 0; i < firstLevel.children.length; i++) {
            for (var j = 0; j < firstLevel.children[i].children.length; j++) {
                playersToIgnore.push(firstLevel.children[i].children[j]._id)
            }
        }
        // playersToIgnore.shift();
        // console.log(playersToIgnore)
        firstLevel.type = "nest"
        let prevLevel = firstLevel
        let newPlayerMap
        newPlayerMap = firstLevel
        let nthLevelConnections
        for (var i = 1; i < n; i++) {
            let nthLevelPlayerIds = [];
            let nthLevelConnections = allConnections.filter(
                function(x) {
                    let player1Id = x.players.split("|")[0];
                    let player2Id = x.players.split("|")[1];
                    let player1 = playersToIgnore.some(x => player1Id == x);
                    let player2 = playersToIgnore.some(x => player2Id == x);
                    // console.log(player1Id +": " + player1 )
                    // console.log(player2Id +": " + player2 )

                    if (player1 && player2) {
                        return false
                    }
                    if (player1 && !player2) {
                        console.log(player1Id + " + " + player2Id + " added")
                        nthLevelPlayerIds.push(player2Id)
                        return true
                    }
                    if (!player1 && player2) {
                        console.log(player1Id + " + " + player2Id + " added")
                        nthLevelPlayerIds.push(player1Id)

                        return true
                    }

                })
            nthLevelPlayerIds = [...new Set(nthLevelPlayerIds)];
            playersToIgnore = nthLevelPlayerIds.concat(playersToIgnore);
            // console.log(nthLevelPlayerIds);
            console.log(playersToIgnore)
            // console.log(playersToIgnore)

            let nthPlayerMap = allPlayerMap.children.filter(
                function(team) {
                    // console.log(team.children);
                    let teamChildrenFilter = team.children.filter(player => nthLevelPlayerIds.some(x => x == player._id));
                    // console.log(teamChildrenFilter);
                    if (teamChildrenFilter.length == 0) {
                        return false;
                    } else {
                        return true;
                    }
                })
            nthPlayerMap = nthPlayerMap.map(team => {
                team.children = team.children.filter(player => nthLevelPlayerIds.some(x => x == player._id));
                return team;
            })
            // console.log(nthPlayerMap)
            nthPlayerMap.unshift(prevLevel);
            newPlayerMap = {
                type: "nest",
                name: i + "level",
                children: nthPlayerMap
            }
            prevLevel = newPlayerMap
            // firstLevel.type = "nest"
            // newPlayerMap.children.unshift(
            //     firstLevel
            // )

            // console.log(newPlayerMap)
           
            // console.log(nthLevelConnections)
            // let activeConnections = allConnections.filter(x => playerConnections.some(y => y == x._id))
            // let activePlayerIDs = activeConnections.map(x => {
            //     let player = x.players.replace(playerId + "|", "")
            //     player = player.replace("|" + playerId, "")
            //     return player
            // })
            // activePlayerIDs.unshift(playerId);


        }

        console.log(newPlayerMap);
         return {
            playerMap: newPlayerMap,
            playerMapConnections: firstLevelConnections.concat(nthLevelConnections)
            }

        // {
        //     name: "nth level"
        //     children:[
        //     {
        //         _id:teamId,
        //         children:
        //         [
        //         bunch of players
        //         ]
        //     },
        //     name:"nth level - 1"
        //     children:[
        //     {   
        //         _id:teamId,
        //         childnre:[
        //         bunch of players]
        //     }]
        //     ]
        // }
    }

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