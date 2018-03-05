function filterData(data)
{
  // If no single element is selected from list, make all dots/sample selected.
  if($(".selected").length == 0)
  {
    for(sample in data)
      data[sample]["selected"] = true;
    return data;
  }


  // If only one element has been selected, make all other elements unselected.
  if($(".selected").length == 1)
    for(sample in data)
      data[sample]["selected"] = false;

  // Loop over the list-items
  $(".scroll-menu").children().each(function(d, i)
  {
    // Find the data sample and move it from selected to unselected
    var index = findCategoryIndex(i.id, data);

    // Check if it belongs to the class "unselected"
    if(i.className.split(' ').pop() == "unselected")
    {
      // Set the data-sample's status to not selected.
      data[index]["selected"] = false;
    }
    // Do the opposite if it belongs to class "selected"
    else if(i.className.split(' ').pop() == "selected")
    {
      data[index]["selected"] = true;
    }
  });


  return data;

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
