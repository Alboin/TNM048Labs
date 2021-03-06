/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/
function map(data, world_map_json){

  this.data = data;
  this.world_map_json = world_map_json;

  var div = '#world-map';
  var parentWidth = $(div).parent().width();
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = parentWidth - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

  /*~~ Task 10  initialize color variable ~~*/

  //initialize zoom
  var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on('zoom', move);

  //initialize tooltip
  var tooltip = d3.select(div).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


  /*~~ Task 11  initialize projection and path variable ~~*/

  var svg = d3.select(div).append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

  var projection = d3.geoMercator().center([60,40]).scale(120);

  var path = d3.geoPath().projection(projection);

  var g = svg.append("g");




  var countries = topojson.feature(world_map_json,
        world_map_json.objects.countries).features;

  var country = g.selectAll(".country")
      .data(countries);

  /*~~ Task 12  initialize color array ~~*/
  var cc = [];
  var color = d3.scaleOrdinal(d3.schemeCategory20);
  for (var i = 0; i < data.length; i++) {
      cc.push(color(i));
  }

  country.enter().insert("path")
      .attr("class", "country")
      .attr("d", path)

      /*~~ Task 11  add path variable as attr d here. ~~*/

      .attr("id", function (d) { return d.id; })
      .attr("title", function (d) {  return d.properties.name; })
      .style("fill", function (d) {
          for (var i = 0; i < data.length; i++) {
              if (data[i]["Country"] == d.properties.name)
              {
                  return cc[i];
              }
          }
       })

      //tooltip
      .on("mousemove", function(d) {
        d3.select(this).style('stroke','white');

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
        tooltip
        .attr("style", "left:"+(mouse[0]+30)+"px;top:"+(mouse[1]+30)+"px")
        .html(d.properties.name);
      })
      .on("mouseout",  function(d) {

          d3.select(this).style('stroke','none');
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      })

      //selection
      .on("click", function (d) {

          sp.selectDots(d);
          pc.selectLine(d);
          //selectCountry(d.properties.name);
          /*~~ call the other graphs method for selection here ~~*/
      });

  function move() {
      g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
      g.attr("transform", d3.event.transform);
  }


  /*~~ Highlight countries when filtering in the other graphs~~*/
  this.selectCountry = function (value) {
      console.log(value)

  }


}
