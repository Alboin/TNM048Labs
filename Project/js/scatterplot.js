function scatterplot(data, selectedX, selectedY, zoomLevel)
{
  console.log(zoomLevel)
  if(zoomLevel > 0)
    zoomLevel = 0;
  else
  {
    if(zoomLevel > -10)
      zoomLevel = zoomLevel * 300;
    else
      zoomLevel = Math.pow(Math.abs(zoomLevel), 1.1) * -300;

  }


  var div = '#scatter-plot';

  //The base-code for the scatterplot is from
  //http://bl.ocks.org/weiglemc/6185069

  // Remove any old tooltips
  $(".tooltip").remove();


  var margin = {top: 50, right: 50, bottom: 60, left: 80};
  var width = $(".col-sm-5").width() - margin.right - margin.left;
  var height = 0.85 * $(document).height() - margin.top - margin.bottom - $(".controls").height() - $("#title").height();
  // Modify number of ticks on x-axis depending on screen width.
  var number_ticks_x = Math.round($(document).width() / 1200 * 4) - zoomLevel / 150;
  var number_ticks_y = Math.round($(document).height() / 800 * 10) - zoomLevel / 150;

  // setup fill color
  var cValue = function(d) { return d.maincategory;},
    color = d3.scale.category10();

    // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("width", 200)
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
      var xScale = d3.scale.linear().range([0, width - zoomLevel]), // value -> display
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
      var yScale = d3.scale.linear().range([height, zoomLevel]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");

  // add the graph canvas to the body of the webpage
  var svg = d3.select(div).append("svg")
      .attr("id", "scatterplot-svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scale.linear()
          .domain([-width / 2, width / 2])
          .range([0, width]);

      var y = d3.scale.linear()
          .domain([-height / 2, height / 2])
          .range([height, 0]);

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

      //svg.append("g").call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on("zoom", function() { zoom(); console.log("Jek")}))

    // x-axis
 svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis.ticks(number_ticks_x))
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
     .call(yAxis.ticks(number_ticks_y))
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
     .attr("r", function (d) {
       if($(".selected").length == 0)
        return 4.0;
       if(d.selected)
        return 6.0;
      return 3.0;
     })
     .attr("cx", xMap)
     .attr("cy", yMap)
     .style("fill", function(d) { return color(cValue(d));})
     // Distinguish the selected dots from the unselected ones.
     .attr("opacity", function(d) {
       if(d.selected)
         return 0.9;
      return 0.2;})
     .on("mouseover", function(d) {
         tooltip.transition()
              .duration(50)
              .style("opacity", .9);

        var xText, yText;

        if(selectedX == "backers")
          xText = formatNumber(Math.round(xValue(d))) + " backers/project";
        else if(selectedX == "goal")
          xText = "Goal: $" + formatNumber(Math.round(xValue(d)));
        else
          xText = "Pledged: $" + formatNumber(Math.round(xValue(d)));
        if(selectedY == "backers")
          yText = formatNumber(Math.round(yValue(d))) + " backers/project";
        else if(selectedY == "goal")
          yText = "Goal: $" + formatNumber(Math.round(yValue(d)));
        else
          yText = "Pledged: $" + formatNumber(Math.round(yValue(d)));


         tooltip.html("<b>" + d.category + "</b><br/>" + xText + "<br>" + yText)
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

        $(".listItem").each(function() {
          $(this).find(".catColor")
            .css("background-color", color($(this).attr("maincategory")))
            .css("opacity", 0.7)
            .css("filter", "hue-rotate(100)");
        });

    // draw legend text
    legend.append("text")
        .attr("x", width - 15)
        .attr("y", 3)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;});

        function zoom() {
          svg.select(".x.axis").call(xAxis);
          svg.select(".y.axis").call(yAxis);
        }

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
