// Load data
queue()
  .defer(d3.csv,'data/categories.csv')
  .defer(d3.csv,'data/months.csv')
  .await(draw);

$("body").height($(document).height());
$("body").width($(document).width());


var sp;
var piechart;
var scrollSub, scrollMain;


function draw(error, data_c, data_m){
  if (error) throw error;

  //console.log(data_c)

  // Format data so that numbers are numbers and not strings.
  for(sample in data_c)
    for(point in data_c[sample])
      if(!isNaN(Number(data_c[sample][point])))
        data_c[sample][point] = Number(data_c[sample][point]);

  // This function creates the scatterplot with the user-defined data.
  updateScatterplot();

  // Create pie-chart
  piechart = new piechart(data_m)
  // Create scroll-lists
  scrollSub = new scrollSubCategory(data_c);

  scrollMain = new scrollMainCategory(data_c);

  // Set the radio-buttons to update the scatterplot on click.
  $("#Xcontrols").children().on("click", updateScatterplot);
  $("#Ycontrols").children().on("click", updateScatterplot);

  // Set up the elements in the scroll-list to update the scatterplot on click.
  $(".scroll-menu").children().on("click", function(d)
  {
    // Switch class between selected/unselected.
    if($(this).attr("class") == "selected")
      $(this).removeClass("selected").attr("class", "unselected");
    else
      $(this).removeClass("unselected").attr("class", "selected");

    // Add a class to tell that this item just changed.
    $(this).attr("status", "justChanged");

    updateScatterplot();
  });

  function updateScatterplot()
  {
    var dataFiltered = filterData(data_c);

    // Remove any old scatterplot before creating a new one.
    sp = undefined;
    $("#scatter-plot").children().remove();
    // Retrieve which data the user want to plot.
    var selectedX = $('input[name=x-scale]:checked').val();
    var selectedY = $('input[name=y-scale]:checked').val();
    // Create the scatterplot.
    sp = new scatterplot(dataFiltered[0], selectedX, selectedY, dataFiltered[1], data_c);
  }




  // Correct page sizes
  $("#pie-month-info").css("height", $("#scatter-plot").height() + $("#title").height() );
  $("#pie-month-info").css("min-height", $("#monthInfo").position().top + $("#monthInfo").height() + $("#title").height() );
  var titleHeight = $("#title").height();
  $("#title").html("<img id='logo' src='Kickstarter_logo.svg.png'>&nbsp; project statistics");
  $("#logo").height(titleHeight);

}
