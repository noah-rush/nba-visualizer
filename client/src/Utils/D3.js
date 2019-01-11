import { select, selectAll, enter } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { axisTop } from 'd3-axis'
import {extent} from 'd3-array'
import { transition } from 'd3-transition'

export default {
  initPlusMinus:function(team){


      let data = team.players;
      console.log(data);
      let totalWidth = 800;
      let margin = { top: 20, right: 30, bottom: 30, left: 40 };
      let width = totalWidth - margin.left - margin.right;
      let height = 700;
      let svg = select("svg")
        .attr("width", width + margin.left + margin.right)


      svg.selectAll(".x-axis").remove()

      let xAxisCall = axisTop();
      let xScale = scaleLinear()

      let colorScale = scaleLinear().domain(extent(team.players, function(d) { return d.plusMinus; })).range([team.colors[1], team.colors[0]]);

      height = data.length * 30
      svg.attr("height", data.length * 30 + margin.top + margin.bottom)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      let x = scaleLinear()
          .domain(extent(data, function(d) { return d.plusMinus; }))
          .range([150, width - 200]);


      let bars = svg.selectAll('rect').data(data);
      bars.enter().append("rect").merge(bars).transition()
          .attr("width", function(d) { return Math.abs(x(d.plusMinus) - x(0)); })
          .attr("x", function(d) { return x(Math.min(0, d.plusMinus)); })
          .attr("fill", function(d) { return colorScale(d.plusMinus) })
      bars.exit().remove();


      let texts = svg.selectAll('text').data(data);
      texts.enter().append("text").merge(texts)
        .attr("x", function(d) {
            return d.plusMinus > 0 ? x(0) - 10 : x(0) + 10

        })
        .style("text-anchor", function(d) { return d.plusMinus > 0 ? "end" : "start" })
        .attr("y", 15)
        .attr("dy", "1.25em")
        .transition()
        .text(function(d) { return d.playerName + ": " + d.plusMinus; });
         texts.exit().remove();

        svg.selectAll('rect').style("height", "30px");
        svg.selectAll('rect').attr("y", function(d, i) { return (30 * i) + "px" });
        svg.selectAll('text').attr("y", function(d, i) { return (30 * i) + "px" });



    var min = Math.min(...data.map(x=>x.plusMinus));
    var max = Math.max(...data.map(x=>x.plusMinus));

    // // console.log(min);
    // // console.log(max);



    let axis = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + 100 + ")")

    xScale.domain([min, max]).range([150, width - 200]);
    // // //     // var yRange = d3.scaleLinear()
    // // //     //     .domain(y_domain).range([360, 40]);


    xAxisCall.scale(xScale)
    axis.call(xAxisCall);
    axis.attr("transform", "translate(0," + (height + 30) + ")")


  },
    lineGraph:function(graphObj){

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

