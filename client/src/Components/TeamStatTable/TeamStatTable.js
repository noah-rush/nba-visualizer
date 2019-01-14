import React from "react";
import StatHeaderCell from './StatHeaderCell';


var TeamStatTable = (props) => {






    let statHeaderBar = []
    let statRows = []
    // console.log(props.stats);
    // console.log(props.team)
    let teamStats = [...props.team]

    console.log(props.playerId)
    console.log()

    if(props.tableSort){
      if(props.switchSort){
      teamStats.sort((a,b) => a[props.tableSort] - b[props.tableSort])

      }else{
      teamStats.sort((a,b) => b[props.tableSort] - a[props.tableSort])

      }
    }

    for (var player of teamStats) {
        // console.log(player);
        let statRow = []
        if (props.mode == "player") {
          if(props.playerId == player.playerId){
              for (var property in player) {
                
                if (player.hasOwnProperty(property) && property != "profile" && property.indexOf("Rank") < 0) {
                    statRow.push(<td>{player[property]}</td>);
                    statHeaderBar.push(<th>{props.translationArray[property]}</th>);

                }


            }
          }
        } else {
            for (var property in player) {
                if (player == props.team[0]) {
                    if (player.hasOwnProperty(property) && property != "profile" && property.indexOf("Rank") < 0) {


                        statHeaderBar.push(<StatHeaderCell property = {property}
                                                            label = {props.translationArray[property]}
                                                            sort = {props.sort}
                                                            switchSort = {props.tableSort == property}>
                                                            </StatHeaderCell>
                                      );
                    }
                }
                if (player.hasOwnProperty(property) && property != "profile" && property.indexOf("Rank") < 0) {

                    statRow.push(<td>{player[property]}</td>);
                }


            }


        }
            statRows.push(<tr>{statRow}</tr>)

    }


    // for (var property in props.stats) {


    //   statTable.push()
    //   if (props.stats.hasOwnProperty(property) && property != "profile" && property.indexOf("Rank") < 0) {
    //     let children = props.stats[property];

    //     statTable.push(<div className = {`stat-${property} stat`} key = {property}>{statTranslationArray[property]} : {props.stats[property]}</div>)
    //   }
    // }
    // console.log(statTable)





    return (
        <div className = "team-stat-table">
      <table>
      <tbody>
      <tr>{statHeaderBar}</tr>
      {statRows}
      </tbody>

</table>

      </div>
    )

}

export default TeamStatTable;