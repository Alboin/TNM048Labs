// Load data
queue()
  .defer(d3.csv,'data/categories.csv')
  .defer(d3.csv,'data/months.csv')
  .await(draw);

$("body").height($(document).height());
$("body").width($(document).width());

var scatterplot;

function draw(error, data_c, data_m){
  if (error) throw error;

  scatterplot = new scatterplot(data_c);

}
    var div = '#pie-chart';

    console.log($(div).parent().width())

    var width = 500,//$(div).parent().width(),
    height = 400,//$(div).parent().width(),
    maxRadius = 200,
    minRadius = 100,
    color = d3.scale.category20c();     //builtin range of colors

    data = [{"Month":"Jan", "success":7122, "failed":17141},
            {"Month":"Feb", "success":8358, "failed":16127},
            {"Month":"Mar", "success":12137, "failed":20437},
            {"Month":"Apr", "success":12344, "failed":20222},
            {"Month":"May", "success":12604, "failed":21155},
            {"Month":"Jun", "success":11711, "failed":20339},
            {"Month":"Jul", "success":12103, "failed":21600},
            {"Month":"Aug", "success":11959, "failed":24330},
            {"Month":"Sep", "success":10551, "failed":21209},
            {"Month":"Oct", "success":11467, "failed":20565},
            {"Month":"Nov", "success":11801, "failed":20189},
            {"Month":"Dec", "success":11799, "failed":11799}];

    var vis = d3.select(div)
        .append("svg:svg")              //create the SVG element inside the <body>
        .data([data])                   //associate our data with the document
            .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", height)
        .append("svg:g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + maxRadius + "," + maxRadius + ")")    //move the center of the pie chart from 0, 0 to maxRadius, maxRadius

    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        //.outerRadius(maxRadius)
        .outerRadius(function(d) {

        	var radius = minRadius + d.data.success/(d.data.failed+d.data.success) * 100;

        	return radius ;
        })
        .padRadius(30);

        console.log(arc);
    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return 100; });    //return the val controlling the arc angle

    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)

        arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc)
                .each(function(d) { d.outerRadius = maxRadius - 20; });
                                   //this creates the actual SVG path using the associated data (pie) with the arc drawing function

        arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = maxRadius;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return data[i].Month; });        //get the label from our original data array
