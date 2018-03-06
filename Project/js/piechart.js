function piechart(data)
{

  var div = '#pie-chart';


  // Format data so that numbers are numbers and not strings.
  for(sample in data)
    for(point in data[sample])
      if(!isNaN(Number(data[sample][point])))
        data[sample][point] = Number(data[sample][point]);




    var width = $("#pie-month-info").width(),
    height = $("#pie-month-info").width(),
    maxRadius = width / 2,
    minRadius = width / 10,
    sliceScale = 300;


    var div = '#pie-chart';

    var vis = d3.select(div)
        .append("svg:svg")              //create the SVG element inside the <body>
        .data([data])                   //associate our data with the document
            .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", height)
        .append("svg:g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + maxRadius + "," + maxRadius + ")") ;   //move the center of the pie chart from 0, 0 to maxRadius, maxRadius


    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        //.outerRadius(maxRadius)
        .outerRadius(function(d) {

        	var radius = minRadius + d.data.success/(d.data.failed+d.data.success) * sliceScale;

        	return radius ;
        });

    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return 1; });    //return the val controlling the arc angle

    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)

        arcs.append("svg:path")
                .attr("fill", function(d, i) { return colorMonth(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc);
                                   //this creates the actual SVG path using the associated data (pie) with the arc drawing function

        arcs.append("svg:text")                                     //add a label to each slice
                .attr("class", "monthText")
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = maxRadius;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("stroke-width", "1.5px" )
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) {
                                var percent = Math.round(100 * d.data.success / (d.data.success + d.data.failed)); // NEW
                                return data[i].month  ; });        //get the label from our original data array


        var strokeColor = "#000";
        arcs.on("mouseover", function(d, i) {

                // Makes the last selected still being selected when the mouse leaves.
                arcs.attr("stroke-width", 0);
                $(this).attr("stroke", strokeColor).attr("stroke-width", "1.5px");
                $(".monthText").attr("stroke-width", 0);

                var percent = Math.round(10000 * d.data.success / (d.data.success + d.data.failed)) / 100;

                // Show which month is selected.
                var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                $("#selectedMonth").html(monthNames[i]);

                // Display detailed data for that month.
                $("#monthStatistics").html("Successful projects: &nbsp;" + formatNumber(data[i].success)
                    + "<br>Failed projects: &nbsp;" + formatNumber(data[i].failed)
                    + "<br>Success rate: &nbsp;" + percent + "%");

                // Change the comparison circle radius to the selected slice's radius
                circleBorder.attr("r", minRadius + d.data.success/(d.data.failed+d.data.success) * sliceScale);

		        });

        arcs.on("mouseout", function(d, i) {
                 //circleBorder.attr("r", minRadius);
                 arcs.attr("stroke-width", 0);
        });


        // Create circle for comparison between slices.
        var circleBorder = vis.append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", minRadius)
              .style("stroke", strokeColor)
              .style("fill", "none");


}



function colorMonth(factor)
{
    var intensity = 0.6 + 0.07 * (factor % 2);
    var myColor = d3.hsl(230, 0.5, intensity);
    //var myColor = d3.hsl(220,0.4,0.6 * Math.sqrt(Math.sqrt((12 - factor+1) / 12)));

    return myColor;
}
