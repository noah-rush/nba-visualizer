import { select, selectAll, enter, event } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { axisTop, axisBottom, axisLeft } from 'd3-axis'
import { extent, max } from 'd3-array'
import { transition } from 'd3-transition'

export default {
    initPlusMinus: function(team) {


        let data = team.players;
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



        var min = Math.min(...data.map(x => x.plusMinus));
        var max = Math.max(...data.map(x => x.plusMinus));
        let axis = svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + 100 + ")")
        xScale.domain([min, max]).range([150, width - 200]);
        xAxisCall.scale(xScale)
        axis.call(xAxisCall);
        axis.attr("transform", "translate(0," + (height + 30) + ")")


    },
    lineGraph: function(graphObj) {


        let data = graphObj.dataSet
        let totalWidth = 800;
        let margin = { top: 20, right: 30, bottom: 30, left: 40 };
        let width = totalWidth - margin.left - margin.right;
        let height = 700;
        let plotArea = select(graphObj.target)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        plotArea.select(".scatter-x").remove()
        plotArea.select(".scatter-y").remove()


        let div = select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        let abbrev;
        let xAxisCall = axisTop();
        let xScale = scaleLinear()
        let colors

        var x = scaleLinear().range([margin.left, width ]);
        var y = scaleLinear().range([height, 0 + margin.top]);


        x.domain(extent(data, function(d) { return d.xValue; }));
        y.domain([0, max(data, function(d) { return d.yValue; })]);


        let dots = plotArea.selectAll('circle').data(data);

        plotArea.selectAll("line").remove();
        plotArea.append("line") // attach a line
            .style("stroke", "black") // colour the line
            .attr("x1", function(d) { return margin.left; }) // x position of the first end of the line
            .attr("y1", function(d) { return y(0); }) // y position of the first end of the line
            .attr("x2", function(d) { return x(10); }) // x position of the second end of the line
            .attr("y2", function(d) { return y(10); })

        dots.enter().append("circle").merge(dots)
            .on("mouseover", function(d) {
                // console.log("Dsds")
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.name)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            }).attr("r", function(d) {
                if (d.yValue != 0) {
                    return 3 * d.xValue / d.yValue
                } else {
                    return 3;
                }
            }).transition()
            .attr("cx", function(d) { return x(d.xValue); })
            .attr("cy", function(d) { return y(d.yValue); })
            .attr("fill", "blue")





        // Add the X Axis
        plotArea.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "scatter-x")

            .call(axisBottom(x));

        // // Add the Y Axis
        plotArea.append("g")
            .attr("transform", "translate(" + margin.left +",0)")

            .attr("class", "scatter-y")
            .call(axisLeft(y));














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