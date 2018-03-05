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
   		var htmlstring = '<a href= "#" class="listItem" id="' + sortedData[sample].category + '">' + sortedData[sample].category + "    " + sortedData[sample].successrate + "%  </a>";
   		//create
   		scrollList.append(htmlstring);
   }

   var scrollItem = d3.selectAll(".listItem").on("click", function(d) {
     sp.logit(d);
   });

};



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

};
