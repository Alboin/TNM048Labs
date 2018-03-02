// Load data
queue()
  .defer(d3.csv,'data/categories.csv')
  .defer(d3.csv,'data/months.csv')
  .await(draw);

$("body").height($(document).height());
$("body").width($(document).width());


var sp;
var piechart;
var scroll;


function draw(error, data_c, data_m){
  if (error) throw error;
  // This function creates the scatterplot with the user-defined data.
  updateAxes();

  // Set the radio-buttons to update the scatterplot on click.
  $("#Xcontrols").children().on("click", updateAxes);
  $("#Ycontrols").children().on("click", updateAxes);

  function updateAxes()
  {
    // Remove any old scatterplot before creating a new one.
    sp = undefined;
    $("#scatter-plot").children().remove();
    // Retrieve which data the user want to plot.
    var selectedX = $('input[name=x-scale]:checked').val();
    var selectedY = $('input[name=y-scale]:checked').val();
    // Create the scatterplot.
    sp = new scatterplot(data_c, selectedX, selectedY);
  }

  // Create pie-chart
  piechart = new piechart(data_m)
  scroll = new scroll(data_c);


  // Correct page sizes
  $("#pie-month-info").css("height", $("#scatter-plot").height() + $("#title").height() );
  $("#pie-month-info").css("min-height", $("#monthInfo").position().top + $("#monthInfo").height() + $("#title").height() );
  var titleHeight = $("#title").height();
  $("#title").html("<img id='logo' src='Kickstarter_logo.svg.png'>&nbsp; project statistics");
  $("#logo").height(titleHeight);

}
