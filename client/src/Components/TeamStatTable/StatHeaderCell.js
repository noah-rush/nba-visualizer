import React from "react";



var StatHeaderCell = (props) => {

return (
	<th>
	<button onClick = {() =>{props.sort(props.property)}}>{props.label}</button>
	</th>
	)

}


export default StatHeaderCell;