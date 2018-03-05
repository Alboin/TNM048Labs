//credit to  Bill White for his Virtual Scroller
//http://www.billdwhite.com/wordpress/2014/05/17/d3-scalability-virtual-scrolling-for-large-visualizations/


function scroll(data)
{
	  // Format data so that numbers are numbers and not strings.
  for(sample in data)
    for(point in data[sample])
      if(!isNaN(Number(data[sample][point])))
        data[sample][point] = Number(data[sample][point]);


    var div = '#lists';
    var scrollList = $(".scroll-menu");

    var sortedData = data;

        // tack on index to each data item for easy to read display
    sortedData.forEach(function(sample,i) {
    	   //var successrate = Math.round(10000* data[sample].success / ( data[sample].success + data[sample].failed)) /100;
            sample.successrate = Math.round(10000* sample.success / (sample.success + sample.failed)) /100;
        });


    sortedData.sort(function(a, b) {
    		return parseFloat(b.successrate) - parseFloat(a.successrate);
    });


   //populate the scroll list

   for(sample in sortedData)
   {
     var greenColor = " rgba(180, 255, 180,1) ";
     var redColor = " rgba(255, 195, 181,1) ";

      var styleString =
    "background: -moz-linear-gradient(right, " + greenColor + " 0%, " + greenColor + sortedData[sample].successrate + "%, " + redColor + (sortedData[sample].successrate + 0.01) + "%, " + redColor + " 100%);" +/* FF3.6+ */
    "background: -webkit-gradient(linear, right top, left bottom, color-stop(0%, " + greenColor + "), color-stop(" + sortedData[sample].successrate + "%,rgba(41,137,216,0)), color-stop(" + (sortedData[sample].successrate + 0.01) + "%,rgba(255,48,48,1)), color-stop(100%,rgba(255,0,0,1)));" +/* Chrome,Safari4+ */
    "background: -webkit-linear-gradient(right, " + greenColor + " 0%," + greenColor + sortedData[sample].successrate + "%," + redColor + (sortedData[sample].successrate + 0.01) + "%," + redColor + " 100%);" +/* Chrome10+,Safari5.1+ */
    "background: -o-linear-gradient(right, " + greenColor + " 0%," + greenColor + sortedData[sample].successrate + "%," + redColor + (sortedData[sample].successrate + 0.01) + "%," + redColor + " 100%);" +/* Opera 11.10+ */
    "background: -ms-linear-gradient(right, " + greenColor + " 0%, " + greenColor + sortedData[sample].successrate + "%," + redColor + (sortedData[sample].successrate + 0.01) + "%," + redColor + " 100%);" +/* IE10+ */
    "background: linear-gradient(to right, " + greenColor + " 0%, " + greenColor + sortedData[sample].successrate + "%," + redColor + (sortedData[sample].successrate + 0.01) + "%," + redColor + " 100%);"; /* W3C */

   		var htmlstring = '<a href= "#" style="' + styleString + '" class="listItem" id="' + sortedData[sample].category + '">' + sortedData[sample].category + "    " + sortedData[sample].successrate + "%  </a>";
   		//create
   		scrollList.append(htmlstring);
   }

   var scrollItem = d3.selectAll(".listItem").on("click", function(d) {
     sp.logit(d);
   });



};
