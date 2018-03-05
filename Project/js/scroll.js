//credit to  Bill White for his Virtual Scroller
//http://www.billdwhite.com/wordpress/2014/05/17/d3-scalability-virtual-scrolling-for-large-visualizations/
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

   		var htmlstring = '<a href= "#" style="' + generateBackgroundColor(false, sortedData[sample].successrate) + '" class="listItem unselected" id="' + sortedData[sample].category + '">' + sortedData[sample].category + "    " + sortedData[sample].successrate + "%  </a>";
   		//create
   		scrollList.append(htmlstring);

   }

   // Following rows make sure that the color of the list-items changes upon
   // hovering and selection.
   $(".listItem").mouseover(function() {
     var tempString = $(this).html();
     var percentage = Number(tempString.replace( /^\D+/g, '').replace("%", ""));
     $(this).attr("style", generateBackgroundColor(true, percentage));
   })
   .mouseleave(function() {
     var tempString = $(this).html();
     var percentage = Number(tempString.replace( /^\D+/g, '').replace("%", ""));

     if($(this).attr("class").split(' ').pop() == "selected")
     {
       $(this).attr("style", generateBackgroundColor(false, percentage, true));
     } else {
       $(this).attr("style", generateBackgroundColor(false, percentage, false));
     }

   })
   .on("click", function() {
     var tempString = $(this).html();
     var percentage = Number(tempString.replace( /^\D+/g, '').replace("%", ""));
     $(this).attr("style", generateBackgroundColor(true, percentage));
   });

   // Generate the correct background-color based on successrate and list-item status.
   function generateBackgroundColor(hover, percentage, click)
   {
     var greenColor = " rgba(180, 255, 180,1) ";
     var redColor = " rgba(255, 195, 181,1) ";

     if(hover)
     {
       greenColor = " rgba(140, 255, 140,1) ";
       redColor = " rgba(255, 157, 135, 1) ";
     }
     else if(click)
     {
       greenColor = " rgba(90, 221, 90,1) ";
       redColor = " rgba(209, 108, 85, 1) ";
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

        // 
    data.forEach(function(sample) {
    	   //check if the maincategory is undefined
    	   if(dataObjSum[sample.maincategory] == undefined)
    	   {
    	   		//if undefined, set to an empty dataObjSum
    	   		dataObjSum[sample.maincategory] = {"success":sample.success, "failed": sample.failed, "successrate": 0.0};
    	   } 
	    	   //add the num of failed and succeeded projects
				dataObjSum[sample.maincategory].success += sample.success;
				dataObjSum[sample.maincategory].failed += sample.failed;  
				dataObjSum[sample.maincategory].successrate = Math.round(10000* dataObjSum[sample.maincategory].success / (dataObjSum[sample.maincategory].success + dataObjSum[sample.maincategory].failed)) /100;   	
 	
        });

    //sort the data
    for (sample in dataObjSum) {
	    mainSumData.push([sample, dataObjSum[sample].successrate]);
	}

    mainSumData.sort(function(a, b) {
    		return parseFloat(b[1]) - parseFloat(a[1]);
    });

   //populate the scroll list

   for(sample in mainSumData)
   {
   		var htmlstring = '<a href= "#" class="listItem" id="' + mainSumData[sample][0] + '">' 
   							+ mainSumData[sample][0] + "    " + mainSumData[sample][1] + "%  </a>";
   		//create
   		scrollList.append(htmlstring);
   }

}
