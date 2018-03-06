function scrollSubCategory(data)
{
	  // Format data so that numbers are numbers and not strings.
  for(sample in data)
    for(point in data[sample])
      if(!isNaN(Number(data[sample][point])))
        data[sample][point] = Number(data[sample][point]);

    var scrollList = $("#subscroll");

    var sortedData = data;

        // calculate each successrate and append to the data as .successrate
    sortedData.forEach(function(sample) {

            sample.successrate = Math.round(10000* sample.success / (sample.success + sample.failed)) /100;
        });



    sortedData.sort(function(a, b) {
    		return parseFloat(b.successrate) - parseFloat(a.successrate);
    });


   //populate the scroll list

   for(sample in sortedData)
   {
   		var htmlstring = '<a href= "#" style="'
          + generateBackgroundColor(false, sortedData[sample].successrate)
          + '" class="listItem unselected" id="' + sortedData[sample].category + '">'
          + "<div class='row'><div class='col-sm-1 catColor'></div><div class='col-sm-10'><label class='listItemName'>"
          + sortedData[sample].category + "</label> <label class='nprojects'>(" + sortedData[sample].nprojects + ")</label> <label class='percent'>" + sortedData[sample].successrate
          + "%</label></div></div></a>";
   		//create
   		scrollList.append(htmlstring);
      scrollList.children().last().attr("maincategory", sortedData[sample].maincategory).attr("percentage", sortedData[sample].successrate);
   }
   setHoverColors();
}

function scrollMainCategory(data)
{
	// Format data so that numbers are numbers and not strings.
  for(sample in data)
    for(point in data[sample])
      if(!isNaN(Number(data[sample][point])))
        data[sample][point] = Number(data[sample][point]);

    //var div = '#lists';
    var scrollList = $("#mainscroll");
    var dataObjSum = {}; //[maincategory, success, failed, successrate]
    var mainSumData = []; //= new Array(dataObjSum);

    data.forEach(function(sample) {
    	   //check if the maincategory is undefined
    	   if(dataObjSum[sample.maincategory] == undefined)
    	   {
    	   		//if undefined, set to an empty dataObjSum
    	   		dataObjSum[sample.maincategory] = {"success":sample.success, "failed": sample.failed, "successrate": 0.0, "nprojects": 0};
    	   }
	    	   //add the num of failed and succeeded projects
				dataObjSum[sample.maincategory].success += sample.success;
				dataObjSum[sample.maincategory].failed += sample.failed;
        dataObjSum[sample.maincategory].nprojects += sample.nprojects;
				dataObjSum[sample.maincategory].successrate = Math.round(10000* dataObjSum[sample.maincategory].success / (dataObjSum[sample.maincategory].success + dataObjSum[sample.maincategory].failed)) /100;

   });

    //sort the data
    for (sample in dataObjSum)
	    mainSumData.push([sample, dataObjSum[sample].successrate, dataObjSum[sample].nprojects]);

    mainSumData.sort(function(a, b) {
    		return parseFloat(b[1]) - parseFloat(a[1]);
    });

   //populate the scroll list

   for(sample in mainSumData)
   {
     var htmlstring = '<a href= "#" style="'
        + generateBackgroundColor(false, mainSumData[sample][1])
        + '" class="listItem maincatListItem unselected" id="' + mainSumData[sample][0] + '">'
        + "<div class='row'><div class='col-sm-1 catColor'></div><div class='col-sm-10'><label class='listItemName'>"
        + mainSumData[sample][0] + "</label> <label class='nprojects'>("+ mainSumData[sample][2] + ")</label> &nbsp;&nbsp;<label class='percent'>" + mainSumData[sample][1]
        + "%</label></div></div></a>";


   		//var htmlstring = '<a href= "#" style="' + generateBackgroundColor(false, mainSumData[sample][1]) + '" class="listItem maincatListItem unselected" id="' + mainSumData[sample][0] + '">'
   		//					+ mainSumData[sample][0] + "    " + mainSumData[sample][1] + "%  </a>";

      //create
   		scrollList.append(htmlstring);
      scrollList.children().last().attr("maincategory", mainSumData[sample][0]).attr("percentage",  mainSumData[sample][1]);
   }

   setHoverColors();

}

function setHoverColors()
{
  // Following rows make sure that the color of the list-items changes upon
  // hovering and selection.
  $(".listItem")
  .mouseover(function() {
    var tempString = $(this).attr("percentage");
    var percentage = Number(tempString.replace( /^\D+/g, '').replace("%", ""));


    if($(this).hasClass("selected"))
    {
      $(this).attr("style", generateBackgroundColor(true, percentage, true));
    } else {
      $(this).attr("style", generateBackgroundColor(true, percentage, false));
    }
  })
  .mouseleave(function() {
    var tempString = $(this).attr("percentage");
    var percentage = Number(tempString.replace( /^\D+/g, '').replace("%", ""));

    if($(this).hasClass("selected"))
    {
      $(this).attr("style", generateBackgroundColor(false, percentage, true));
    } else {
      $(this).attr("style", generateBackgroundColor(false, percentage, false));
    }

  })
  .on("click", function() {
    var tempString = $(this).attr("percentage");
    var percentage = Number(tempString.replace( /^\D+/g, '').replace("%", ""));
    $(this).attr("style", generateBackgroundColor(true, percentage, true));
  });

}

// Generate the correct background-color based on successrate and list-item status.
function generateBackgroundColor(hover, percentage, click)
{
  var greenColor = " rgba(180, 255, 180,1) ";
  var redColor = " rgba(255, 195, 181,1) ";

  if(click && hover)
  {
    greenColor = " rgba(110, 240, 110,1) ";
    redColor = " rgba(230, 130, 110, 1) ";
  }
  else if(hover)
  {
    greenColor = " rgba(140, 255, 140,1) ";
    redColor = " rgba(255, 157, 135, 1) ";
  }
  else if(click)
  {
    greenColor = " rgba(90, 221, 90,0.8) ";
    redColor = " rgba(209, 108, 85, 0.8) ";
  }


   var styleString =
 "background: -moz-linear-gradient(right, " + greenColor + " 0%, " + greenColor + percentage + "%, " + redColor + (percentage + 0.01) + "%, " + redColor + " 100%);" +/* FF3.6+ */
 "background: -webkit-gradient(linear, right top, left bottom, color-stop(0%, " + greenColor + "), color-stop(" + percentage + "%,rgba(41,137,216,0)), color-stop(" + (percentage + 0.01) + "%,rgba(255,48,48,1)), color-stop(100%,rgba(255,0,0,1)));" +/* Chrome,Safari4+ */
 "background: -webkit-linear-gradient(right, " + greenColor + " 0%," + greenColor + percentage + "%," + redColor + (percentage + 0.01) + "%," + redColor + " 100%);" +/* Chrome10+,Safari5.1+ */
 "background: -o-linear-gradient(right, " + greenColor + " 0%," + greenColor + percentage + "%," + redColor + (percentage + 0.01) + "%," + redColor + " 100%);" +/* Opera 11.10+ */
 "background: -ms-linear-gradient(right, " + greenColor + " 0%, " + greenColor + percentage + "%," + redColor + (percentage + 0.01) + "%," + redColor + " 100%);" +/* IE10+ */
 "background: linear-gradient(to right, " + greenColor + " 0%, " + greenColor + percentage + "%," + redColor + (percentage + 0.01) + "%," + redColor + " 100%);"; /* W3C */

 return styleString;
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
          if(zoom > 0)
            zoom = 0;
          updateScatterplot();
        });
    });
  }

  