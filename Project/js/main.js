// Load data
queue()
  .defer(d3.csv,'data/categories.csv')
  .defer(d3.csv,'data/months.csv')
  .await(draw);

$("body").height($(document).height());
$("body").width($(document).width());

var scatterplot;
var piechart;

function draw(error, data_c, data_m){
  if (error) throw error;

  scatterplot = new scatterplot(data_c);
  piechart = new piechart(data_m)

}
