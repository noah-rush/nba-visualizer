import React from "react";
import StatHeaderCell from './StatHeaderCell';


var TeamStatTable = (props) => {






    let statHeaderBar = []
    let statRows = []
    // console.log(props.stats);
    // console.log(props.team)
    let teamStats = [...props.team]

    // console.log(props.playerId)
    // console.log()

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
                    if (player.hasOwnProperty(property) && property != "profile" && property.indexOf("Rank") < 0 && property != "groupSet" ) {

                        // if(p)

                        statHeaderBar.push(<StatHeaderCell property = {property}
                                                            label = {props.translationArray[property]}
                                                            sort = {props.sort}
                                                            >
                                                            </StatHeaderCell>
                                      );
                    }
                }
                if (player.hasOwnProperty(property) && property != "profile" && property.indexOf("Rank") < 0 && property != "groupSet") {
                    if(property == "playerId"){
                    let img = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" + player[property] + ".png";
                    statRow.push(<td className = "headcol"><img src = {img}/></td>);

                  }else if(property == "playerName"){
                    statRow.push(<td className = "name">{player[property]}</td>);

                  }else{
                    if(props.tableSort == property){
                     statRow.push(<td className = "active-prop">{player[property]}</td>);
                  }else{
                     statRow.push(<td >{player[property]}</td>);

                  }
                  }
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
      <table className = "table table-striped ">
      <thead style = {{ backgroundColor: props.colors[0] }} className = "thead-dark">
            <tr style = {{ color: props.colors[1] }} >{statHeaderBar}</tr>

      </thead>
      <tbody>
      {statRows}
      </tbody>

</table>

      </div>
    )

}

export default TeamStatTable;