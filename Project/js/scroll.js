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
    					
   //populate the scroll list

   for(sample in data)
   {
   		
   		console.log(data[sample].category);
   		var htmlstring = '<a href= "#">' + data[sample].category + "</a>";

   		//create 
   		scrollList.append(htmlstring);
   }


};
