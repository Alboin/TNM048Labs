function scatterplot(data, selectedX, selectedY)
{
  // Format data so that numbers are numbers and not strings.
  for(sample in data)
    for(point in data[sample])
      if(!isNaN(Number(data[sample][point])))
        data[sample][point] = Number(data[sample][point]);

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
    .style("opacity", 0);


  // setup x
  var xValue = function(d) {
      if(selectedX == "backers")
        return d.backers / (d.success + d.failed);
      else if(selectedX == "goal")
        return d.goal;
      else
        return d.pledged;
      }; // data -> value
      var xScale = d3.scale.linear().range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) {
      if(selectedY == "backers")
        return d.backers / (d.success + d.failed);
      else if(selectedY == "goal")
        return d.goal;
      else
        return d.pledged;
  }; // data -> value
      var yScale = d3.scale.linear().range([height, 0]), // value -> display
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

    // Make sure the axes have the right label depending on plotted data.
    var xAxisLabel, yAxisLabel;
    if(selectedX == "backers")
      xAxisLabel = "Backers/project";
    else if(selectedX == "goal")
      xAxisLabel = "Goal ($)";
    else
      xAxisLabel = "Pledged ($)";
    if(selectedY == "backers")
      yAxisLabel = "Backers/project";
    else if(selectedY == "goal")
      yAxisLabel = "Goal ($)";
    else
      yAxisLabel = "Pledged ($)";

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
     .text(xAxisLabel);

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
     .text(yAxisLabel);


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

    //$("#Xcontrols").children().on("click", updateAxes);
    //$("#Ycontrols").children().on("click", updateAxes);

    /*function updateAxes()
    {
      var selectedX = $('input[name=x-scale]:checked').val();
      var selectedY = $('input[name=y-scale]:checked').val();
      console.log(selectedX + " " + selectedY)

      // Scale the range of the data again
      xScale.domain(d3.extent(data, function(d) { return d.success; }));
      yScale.domain([0, d3.max(data, function(d) { return d.failure; })]);

      // Select the section we want to apply our changes to
      var svg = d3.select("body").transition();

      // Make the changes
        svg.select(".line")   // change the line
            .duration(750)
            .attr("d", valueline(data));
        svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);


    }*/


          /*yScale.domain([0,Math.floor((Math.random()*90)+11)])  // change scale to 0, to between 10 and 100
          vis.select(".yaxis")
                  .transition().duration(1500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
                  .call(yAxis);
          vis.select(".yaxis_label")
              .text("Rescaled Axis");
      */


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



}
