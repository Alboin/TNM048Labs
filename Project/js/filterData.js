function filterData(data)
{

  // Variables for the scroll-list
  var selectedData = data;
  var unselectedData = [];

  // Check the list for any selections, if there isn't any, make all data selected.
  if($(".selected").length == 0)
    return [selectedData, unselectedData];

  if($(".selected").length == 1)
  {
    unselectedData = data;
    selectedData = [];
  }


  // Loop over the list-items
  $(".scroll-menu").children().each(function(d, i)
  {
    if($(this).attr("status") == "justChanged")
    {
      // Check if it belongs to the class "unselected"
      if(i.className == "unselected")
      {
        console.log("un")
        // Find the data sample and move it from selected to unselected
        var index = findCategoryIndex(i.innerHTML, selectedData);
        unselectedData.push(selectedData[index]);
        selectedData.splice(index, 1);
      }
      // Do the opposite if it belongs to class "selected"
      else if(i.className == "selected")
      {
        console.log("se")

        // Find the data sample and move it from unselected to selected
        var index = findCategoryIndex(i.innerHTML, unselectedData);
        selectedData.push(unselectedData[index]);
        unselectedData.splice(index, 1);
      }
      $(this).removeAttr("status");
    }

  });

  console.log(selectedData)
  console.log(unselectedData)


  return [selectedData, unselectedData];
}

// Returns the index of the data sample with that subcategory
function findCategoryIndex(categoryName, inputData)
{
  for(var i = 0; i < inputData.length; i++)
  {
    if(inputData[i].category == categoryName)
      return i;
  }
  return -1;
}
