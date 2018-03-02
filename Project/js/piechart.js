function piechart(data)
{

  // Format data so that numbers are numbers and not strings.
  for(sample in data)
    for(point in data[sample])
      if(!isNaN(Number(data[sample][point])))
        data[sample][point] = Number(data[sample][point]);

  console.log(data);

    var width = 600,                        
    height = 600,                            
    maxRadius = 200,
    minRadius = 50,
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
        })
        ;

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
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = maxRadius;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { 
                                var percent = Math.round(100 * d.data.success / (d.data.success + d.data.failed)); // NEW
                                return data[i].month  ; });        //get the label from our original data array
		


	// create the tooltip for hovering over a slice

        var tooltip = d3.select("body").append("div")
		    .attr("class", "tooltip")
		    .style("opacity", 0);
        
        tooltip.append('div')                                           
                 .attr('class', 'label');
        tooltip.append('div')                                           
                .attr('class', 'succeeded'); 
        tooltip.append('div')                                           
                 .attr('class', 'failed'); 



          // apply the tooltip 
        arcs.on("mouseover", function(d) {		
		        tooltip.transition()		
		            .duration(200)		
		            .style("opacity", .9);
                
                var percent = Math.round(100 * d.data.success / (d.data.success + d.data.failed)); 

                tooltip.select('.label').html(d.data.month);                
                tooltip.select('.succeeded').html("succeded: " + d.data.success);                
                tooltip.select('.failed').html("failed: " + d.data.failed); 
    		    tooltip.style("left", d3.event.pageX +"px")
    		            .style("top", d3.event.pageY +"px");
		        })					
    		.on("mouseout", function(d) {		
	        		tooltip.transition()		
	            	.duration(500)		
	            	.style("opacity", 0)});                        
	
}



function colorMonth(factor)
{
    
    var myColor;

    if(factor <= 8){
        myColor = d3.rgb(20+10*factor,20+10*factor,60+10*factor);
    }
    else {
        myColor = d3.rgb(10*factor,10*factor,30+10*factor);
    }

    console.log(myColor)
    return myColor;
}