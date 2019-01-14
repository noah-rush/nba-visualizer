import React from "react";



var PlayerStats = (props) =>{






      let statTable = []
      console.log(props.stats);
      for (var property in props.stats) {


        statTable.push()
        if (props.stats.hasOwnProperty(property) && property != "profile" && property.indexOf("Rank") < 0) {
          let children = props.stats[property];

          statTable.push(<div className = {`stat-${property} stat`} key = {property}>{statTranslationArray[property]} : {props.stats[property]}</div>)
        }
      }
      console.log(statTable)
      




    return (
      <div className = "player-card-container">
      <table>

      {statTable}


      </div>
    )
  
}

export default PlayerStats;
