/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/

//https://bl.ocks.org/EfratVil/d956f19f2e56a05c31fb6583beccfda7

function sp(data){

    this.data = data;
    var div = '#scatter-plot';

    //console.log(data[1].Household_income);

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

    var cx_temp = [];
    for(i = 0; i < data.length; i++)
        cx_temp.push(data[i][dataName1]);

    var cy_temp = [];
    for(i = 0; i < data.length; i++)
        cy_temp.push(data[i][dataName2])


        
    // Normalize data
    var cx = [], cy = [];
    for(i = 0; i < data.length; i++)
    {
        cx.push((cx_temp[i] - Math.min(...cx_temp)) / (Math.max(...cx_temp) - Math.min(...cx_temp)));
        cy.push((cy_temp[i] - Math.min(...cy_temp)) / (Math.max(...cy_temp) - Math.min(...cy_temp)));
    }

    //Handle Axis

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


        svg.append("g")
            .attr("class", "x axis")
            .attr('id', "axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("text")
            .style("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 8)
            .text(dataName2);

        svg.append("g")
            .attr("class", "y axis")
            .attr('id', "axis--y")
            .call(yAxis);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .text(dataName1);



        /* ~~ Task 4 Add the scatter dots. ~~ */
        var circles = svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "circle")
            .attr("r", 4)
            .attr("cx", function (d) { return x(d[dataName1]); })
            .attr("cy", function (d) { return y(d[dataName2]); })
            .attr("opacity", 0.5)
            .attr("class", "non_brushed")
            .style("fill", "#4292c6");


        
        /* ~~ Task 5 create the brush variable and call highlightBrushedCircles() ~~ */

        var brush = d3.brush()
                    .on("brush", highlightBrushedCircles);

        svg.append("g")
            .call(brush);

        //highlightBrushedCircles function
        function highlightBrushedCircles() {
            if (d3.event.selection != null) {

                    // revert circles to initial style
                    circles.attr("class", "non_brushed");
                    var brush_coords = d3.brushSelection(this);
                    // style brushed circles
                    circles.filter(function () {
                        var cx = d3.select(this).attr("cx");
                        var cy = d3.select(this).attr("cy");
                        return isBrushed(brush_coords, cx, cy);
                    })
                        .attr("class", "brushed")
                        .attr("fill", "red");

                    var d_brushed = d3.selectAll(".brushed").data();
                    
                    

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
         this.selectDots = function (value) {
             circles.attr("class", "non_brushed");

             circles.filter(function (d) {
                 //console.log(d.Country)
                 //console.log(value.properties.name )
                 return value.properties.name == d.Country; 
             }).attr("class", "brushed")
                 .attr("fill", "red");
         };


}//End
