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

    //sort based on successrate
    sortedData.sort(function(a, b) {
    		return parseFloat(b.successrate) - parseFloat(a.successrate);
		});


   //populate the scroll list

   for(sample in sortedData)
   {
   		var htmlstring = '<a href= "#">' + sortedData[sample].category + "    " + sortedData[sample].successrate + "%  </a>";
   		//create 
   		scrollList.append(htmlstring);
   }



};
