$("body").height($(document).height());
$("body").width($(document).width());


var sp;
var piechart;
var scrollSub, scrollMain;

var zoom = 0;


function draw(error, data_c, data_m){
  if (error) throw error;

  //console.log(data_c)

  // Format data so that numbers are numbers and not strings.
  for(sample in data_c)
  {
    for(point in data_c[sample])
      if(!isNaN(Number(data_c[sample][point])))
        data_c[sample][point] = Number(data_c[sample][point]);
    // Add an element to the data, used for "brushing"
    data_c[sample]["selected"] = true;
  }


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
  	 d.preventDefault(); //to prevent the scroll to jump up to top
    // Switch class between selected/unselected.
    if($(this).hasClass("selected"))
      $(this).removeClass("selected").addClass("unselected");
    else
      $(this).removeClass("unselected").addClass("selected");

    if($(this).hasClass("maincatListItem"))
    {
      updateSubcategories($(this));
    }

    if($(".selected").length != 0)
       activateButton("#buttonClear");

    updateScatterplot();
  });

  //handle the select buttons
  $( "#buttonClear").click(function() {
    clearScroll(".scroll-menu");
    disableButton("#buttonClear");
    updateScatterplot();
  });



  // When page has finished loading, reload the scatterplot.
  $(document).ready(updateScatterplot);

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
    sp = new scatterplot(dataFiltered, selectedX, selectedY, zoom);
    addScroll();
  }

  // Function for updating selected subcategories depending on which
  // main categories are selected.
  function updateSubcategories(maincategory)
  {
    // Go through each main category list-item
    maincategory.each(function() {
      var maincat = "[maincategory='" + maincategory.attr("id") + "']";

      // If the main category list item is selected
      if($(this).hasClass("selected")) {
        // Find all its subcategories and select them
        $(maincat).each(function() {
          if($(this).hasClass("unselected"))
            $(this).trigger("click");
        });
      }
      // If the main category list item is not selected
      else if($(this).hasClass("unselected")) {
        // Find all its subcategories and unselect them
        $(maincat).each(function() {
        if($(this).hasClass("selected"))
          $(this).trigger("click").trigger("mouseleave");
        });
      }
    });
  }

  function clearScroll(scrollName)
  {
  	if($(".selected").length != 0)
  		$(scrollName).children().removeClass("selected").addClass("unselected").trigger("mouseout");
  }

  function activateButton(buttonName)
  {
  	$(buttonName).attr("class", "buttonActive");
  }

   function disableButton(buttonName)
  {
	$(buttonName).attr("class", "buttonDisabled");
  }

  function addScroll()
  {
    $(document).ready(function(){
        $('#scatterplot-svg').bind('DOMMouseScroll mousewheel', function(e){
          zoom += Math.sign(e.originalEvent.detail);
          updateScatterplot();
        });
    });
  }




  // Correct page sizes
  $("#pie-month-info").css("height", $("#scatter-plot").height() + $("#title").height());// + $(".controls").height());
  $("#pie-month-info").css("min-height", $("#monthInfo").position().top + $("#monthInfo").height() + $("#title").height() );
  var titleHeight = $("#title").height();
  $("#title").html("<a href='https://www.kickstarter.com/'><img id='logo' src='Kickstarter_logo.svg.png'></a>&nbsp; project statistics");
  $("#logo").height(titleHeight);
  $("#subscroll").height($("#lists").height() - $("#subscroll").position().top - 15); //15 is the top padding of #lists
  // Add number of main- and sub-categories to the titles.
  $("#title-main-cat").html($("#title-main-cat").html() + " (" + $(".maincatListItem").length + ")");
  $("#title-sub-cat").html($("#title-sub-cat").html() + " (" + ($(".listItem").length - $(".maincatListItem").length) + ")");

}

// Load data
queue()
  .defer(d3.csv,'data/categories.csv')
  .defer(d3.csv,'data/months.csv')
  .await(draw);
