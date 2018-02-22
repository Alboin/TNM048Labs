/**
* k means algorithm
* @param data
* @param k
* @return {Object}
*/

function kmeans(data, k) {

  // Reformat data
  newData = [];
  for (sample in data)
  {
    var newSample = [];
    for (dimension in data[sample])
      newSample.push(Number(data[sample][dimension]));

    newData.push(newSample);
  }
  newData.splice(newData.length - 1, 1);

  // Create centroids
  var centroids = [];
  for (var i = 0; i < k; i++)
  {
      var c = newData[Math.floor((Math.random() * data.length) + 1)];
      centroids.push(c);
  }




  var assignments = assignToCentroid(newData, centroids);

  var centroidsUpdated = moveCentroids(newData, assignments, centroids);

  var error1 = calculateError(newData, assignments, centroids);
  var error2 = calculateError(newData, assignments, centroidsUpdated);

  //console.log(error1)
  //console.log(newCentroids)

  var result = { "assignments": assignments, "centroids": centroids };
  return result;

}

function assignToCentroid(newData, theCentroids)
{
  var assignments = [];

  for (sample in newData)
  {
    var minDist = [999999, -1]; // [distance, centroid index]
    for(centroid in theCentroids)
    {
      var dist = 0;
      for (dimension in newData[sample])
        dist += Math.pow(newData[sample][dimension] - theCentroids[centroid][dimension], 2);

      dist = Math.sqrt(dist);

      if(dist < minDist[0])
      {
        minDist[0] = dist;
        minDist[1] = (centroid);
      }
    }
    // Add the centroid index
    assignments.push(minDist[1]);
  }
  return assignments;
}

function moveCentroids(newData, assignments, theCentroids)
{

  var numberOfSamplesPerCentroid = [];
  ost =  [];//jQuery.extend(true, {}, theCentroids);
  console.log(theCentroids)
  console.log(ost)

  // Initiate newCentroids with 0's
  for (var i = 0; i < 4; i++)
  {
    numberOfSamplesPerCentroid.push(0);
    var temp = [];
    for (var dim = 0; dim <3; dim++)
    {
      temp.push(0);
      //newCentroids[i][dim] = 0;
      //console.log(newCentroids[i][dim])
    }
    ost.push(temp);
  }



  console.log(newCentroids)

  // Count number of samples assigned to each centroid
  for (sample in newData)
  {
    numberOfSamplesPerCentroid[assignments[sample]]++;
    // Calculate distance to assigned centroid
    for (dimension in newData[sample])
      newCentroids[assignments[sample]][dimension] += newData[sample][dimension];
  }

  // Divide by the number of samples in each centroid
  for(centroid in newCentroids)
  {
    if(numberOfSamplesPerCentroid[centroid] != 0)
      for (dimension in newCentroids)
        newCentroids[centroid][dimension] /= numberOfSamplesPerCentroid[centroid];
  }

  return newCentroids;
}

function calculateError(newData, assignments, theCentroids)
{
  var error = 0;
  for (sample in newData)
      error += Math.pow(euclidianDistance(theCentroids[assignments[sample]], newData[sample]), 2);

  return error;
}

function euclidianDistance(sample1, sample2)
{
  var dist = 0;
  for(dimension in sample1)
    dist += Math.pow(sample1[dimension] - sample2[dimension], 2);
  dist = Math.sqrt(dist);
  return dist;
}




//nej!
