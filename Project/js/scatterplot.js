function scatterplot(data)
{
  // Format data so that numbers are numbers and not strings.
  for(sample in data)
    for(point in data[sample])
      if(!isNaN(Number(data[sample][point])))
        data[sample][point] = Number(data[sample][point]);

  console.log(data);

  var div = '#scatter-plot';

  //The base-code for the scatterplot is from
  //http://bl.ocks.org/weiglemc/6185069


  var margin = {top: 50, right: 50, bottom: 60, left: 80};
  var width = $(".col-sm-4").width() - margin.right - margin.left;
  var height = 0.9 * $(document).height() - margin.top - margin.bottom - $(".controls").height();
  // Modify number of ticks on x-axis depending on screen width.
  var number_ticks = Math.round($(document).width() / 1200 * 4);

  // setup fill color
  var cValue = function(d) { return d.maincategory;},
    color = d3.scale.category10();

    // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("width", 100)
    .style("height", 18)
    .style("opacity", 0);


  // setup x
  var xValue = function(d) { return d.backers / (d.success + d.failed)}, // data -> value
      xScale = d3.scale.linear().range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) { return d.goal;}, // data -> value
      yScale = d3.scale.linear().range([height, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");

  // add the graph canvas to the body of the webpage
  var svg = d3.select(div).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    // x-axis
 svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis.ticks(number_ticks))
   .append("text")
     .attr("class", "label")
     .attr("x", width)
     .attr("y", -6)
     .style("text-anchor", "end")
     .attr("opacity", 0.4)
     .attr("font-size", 26)
     .text("Backers/project");

 // y-axis
 svg.append("g")
     .attr("class", "y axis")
     .call(yAxis)
   .append("text")
     .attr("class", "label")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", ".71em")
     .style("text-anchor", "end")
     .attr("opacity", 0.4)
     .attr("font-size", 26)
     .text("Goal ($)");


 // draw dots
 svg.selectAll(".dot")
     .data(data)
   .enter().append("circle")
     .attr("class", "dot")
     .attr("r", 4.0)
     .attr("cx", xMap)
     .attr("cy", yMap)
     .style("fill", function(d) { return color(cValue(d));})
     .attr("opacity", 0.8)
     .on("mouseover", function(d) {
         tooltip.transition()
              .duration(50)
              .style("opacity", .9);
         tooltip.html(d.category/* + "<br/> (" + xValue(d)
         + ", " + yValue(d) + ")"*/)
              .style("left", (d3.event.pageX + 5) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
     })
     .on("mouseout", function(d) {
         tooltip.transition()
              .duration(200)
              .style("opacity", 0);
     });

     // draw legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
        .attr("opacity", 0.5)
        .on("mouseover", function(d) {
          $(this).attr("opacity", 1.0);
        })
        .on("mouseout", function(d) {
          $(this).attr("opacity", 0.5);
        });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 10)
        .attr("width", 8)
        .attr("height", 8)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width - 15)
        .attr("y", 3)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;});

    //Function originally from
    //https://gist.github.com/phoebebright/3098488
    //and then modified to suit this application

    $("#rescale").on("click", function(d) {


          /*yScale.domain([0,Math.floor((Math.random()*90)+11)])  // change scale to 0, to between 10 and 100
          vis.select(".yaxis")
                  .transition().duration(1500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
                  .call(yAxis);
          vis.select(".yaxis_label")
              .text("Rescaled Axis");
      */

      console.log("click!");

      /*
                // setup x
                xValue = function(d) { return Number(d.backers)}, // data -> value
                    xScale = d3.scale.linear().range([0, width]), // value -> display
                    xMap = function(d) { return xScale(xValue(d));}, // data -> display
                    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

                // setup y
                yValue = function(d) { return Number(d.goal);}, // data -> value
                    yScale = d3.scale.linear().range([height, 0]), // value -> display
                    yMap = function(d) { return yScale(yValue(d));}, // data -> display
                    yAxis = d3.svg.axis().scale(yScale).orient("left");

*/
    });


}
