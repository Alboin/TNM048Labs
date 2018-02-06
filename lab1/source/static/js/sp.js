/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/

function sp(data){

    this.data = data;
    var div = '#scatter-plot';

    var height = 500;
    var parentWidth = $(div).parent().width();
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = parentWidth - margin.right - margin.left,
        height = height - margin.top - margin.bottom;

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    /* Task 2
      Initialize 4 (x,y,country,circle-size)
      variables and assign different data attributes from the data filter
      Then use domain() and extent to scale the axes

      x and y domain code here*/

    // Create arrays with selected data.
    var dataName1 = "Household_income";
    var dataName2 = "Employment_rate";

    var country = [];
    for(i = 0; i < data.length; i++)
        country.push(data[i]["Country"]);

    var cx_temp = [];
    for(i = 0; i < data.length; i++)
        cx_temp.push(data[i][dataName1]);

    var cy_temp = [];
    for(i = 0; i < data.length; i++)
        cy_temp.push(data[i][dataName2])

    var radius_temp = [];
    for(i = 0; i < data.length; i++)
        radius_temp.push(data[i]["Life_satisfaction"]);

        
    // Normalize data
    var cx = [], cy = [], radius = [];
    for(i = 0; i < data.length; i++)
    {
        cx.push((cx_temp[i] - Math.min(...cx_temp)) / (Math.max(...cx_temp) - Math.min(...cx_temp)));
        cy.push((cy_temp[i] - Math.min(...cy_temp)) / (Math.max(...cy_temp) - Math.min(...cy_temp)));
        radius.push((radius_temp[i] - Math.min(...radius_temp)) / (Math.max(...radius_temp) - Math.min(...radius_temp)));
    }

    x.domain([Math.min(...cx_temp), Math.max(...cx_temp)]);
    y.domain([Math.min(...cy_temp), Math.max(...cy_temp)]);


    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");
        
        /* ~~ Task 3 Add the x and y Axis and title  ~~ */

        var xAxis = d3.axisBottom().scale(x);
    
        var yAxis = d3.axisLeft().scale(y);

        svg.append("svg:g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.append("svg:g")
        .attr("transform", "translate(0,0)")
        .call(yAxis);

        // now add titles to the axes
        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (-30) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text(dataName2);

        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (width/2) +","+ (height + 35) +")")  // centre below axis
            .text(dataName1);
            

        /* ~~ Task 4 Add the scatter dots. ~~ */
        var circles = [];
        for(i = 0; i < data.length; i++)
        {
            var color = d3.hsl(Math.random() * 80 + 200, 0.5, 0.5);

            circles.push(svg.append("circle")
                     .attr("cx", cx[i] * width)
                     .attr("cy", cy[i] * height)            
                     .attr("r", radius[i] * 15 + 5)
                     .attr("fill", color)
                     .attr("country", country[i])
                     .on("mouseover", function(d) {		
                        tooltip.transition()		
                            .duration(200)		
                            .style("opacity", .9);		
                        tooltip.html($(this).attr("country"))
                            .style("left", (d3.event.pageX - width) + "px")		
                            .style("top", (d3.event.pageY) + "px")
                            .style("position", "absolute");
                        })					
                    .on("mouseout", function(d) {		
                        tooltip.transition()		
                            .duration(500)		
                            .style("opacity", 0)}));
        }
        
        /* ~~ Task 5 create the brush variable and call highlightBrushedCircles() ~~ */


         //highlightBrushedCircles function
         function highlightBrushedCircles() {
             if (d3.event.selection != null) {
                 // revert circles to initial style
                 circles.attr("class", "non_brushed");
                 var brush_coords = d3.brushSelection(this);
                 // style brushed circles
                   circles.filter(function (){
                            var cx = d3.select(this).attr("cx");
                            var cy = d3.select(this).attr("cy");
                            return isBrushed(brush_coords, cx, cy);
                  })
                  .attr("class", "brushed");
                   var d_brushed =  d3.selectAll(".brushed").data();


                   /* ~~~ Call pc or/and map function to filter ~~~ */

             }
         }//highlightBrushedCircles
         function isBrushed(brush_coords, cx, cy) {
              var x0 = brush_coords[0][0],
                  x1 = brush_coords[1][0],
                  y0 = brush_coords[0][1],
                  y1 = brush_coords[1][1];
             return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
         }//isBrushed



         //Select all the dots filtered
         this.selecDots = function(value){

         };


}//End
