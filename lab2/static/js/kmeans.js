/**
* k means algorithm
* @param data
* @param k
* @return {Object}
*/


function kmeans(data, k) {

  // Create a set of centroids with random starting positions.
  var centroids = [];
  for(var i = 0; i < k; i++)
    centroids.push(data[Math.floor(Math.random() * data.length)]);


  var improvement = 999999;

  // Loop until the error is small enough.
  while(improvement > 0.1)
  {
    // Assign all data samples to closest centroid.
    assignments = assignToCentroid(data, centroids);
    // Calculate an error for these centroids.
    error1 = calculateError(data, assignments, centroids);
    // Move the centroids to the mean position of each cluster.
    centroids = moveCentroids(data, assignments, centroids);
    // Calculate a new error for the moved centroids.
    error2 = calculateError(data, assignments, centroids);
    // Calculate the "improvement" in error.
    improvement = error1 - error2;
    console.log(error1);
    console.log(error2);
    console.log(improvement);
  }

  return {"assignments": assignments}
}


// Assign each data-sample to closest centroid.
function assignToCentroid(data, centroids)
{
  var assignments = [];

  for (var sample in data)
  {
    var minDist = [999999, -1];
    for (var centroid in centroids)
    {
      // Measure the distance between a sample and each centroid.
      var distance = euclidianDistance(data[sample], centroids[centroid]);
      // If the distance is smaller, save the distance and the index to that centroid.
      if (distance < minDist[0])
        minDist = [distance, centroid];
    }
    assignments.push(Number(minDist[1]));
  }
  // The last value in the array is for some reason junk, so we remove that.
  assignments.splice(assignments.length - 1, 1);

  return assignments;
}

// Moves the centroid to the mean positions of each assigned cluster.
function moveCentroids(data, assignments, centroids)
{
  // Create a new centroid variable with all 0's
  var temp = jQuery.extend(true, {}, centroids);
  var newCentroids = [];
  for (var centroid in temp)
  {
    for (var dim in temp[centroid])
      temp[centroid][dim] = 0;

    newCentroids.push(temp[centroid]);
  }

  // Variable for counting the number of samples assigned to each centroid.
  var numberOfSamplesPerCentroid = jQuery.extend(true, {}, newCentroids);

  var t1 = jQuery.extend(true, {}, newCentroids);
  var t2 = jQuery.extend(true, {}, centroids);
  var t3 = jQuery.extend(true, {}, tCentroids);

  /*console.log(t1);
  console.log(t2);
  console.log(t3);
  console.log(newCentroids);
*/
  log(centroids, -2);
  log(tCentroids, -1);
  log(numberOfSamplesPerCentroid, 0);

  /*console.log(JSON.stringify(newCentroids));
  console.log(JSON.stringify(centroids));
  console.log(JSON.stringify(tCentroids));

  console.dir(newCentroids);
  console.dir(centroids);
  console.dir(tCentroids);*/
  log(newCentroids, 1);
  // Add up the positions of all the assigned samples for each centroid.
  for (var sample in data)
    if(!isNaN(sample))
      for (var dim in newCentroids[0])
      {
        newCentroids[assignments[sample]][dim] += Number(data[sample][dim]);
        // Put the number of samples/centroid in the first dimension of the objects in the array.
        numberOfSamplesPerCentroid[assignments[sample]][Object.keys(data[0])[0]]++;
      }
  }
  log(numberOfSamplesPerCentroid, 1.5);
  log(newCentroids, 2);

  // Divide the summed values by number of assigned centroids to get the mean position.
  for (var centroid in newCentroids)
    for(var dim in newCentroids[centroid])
      newCentroids[centroid][dim] /= numberOfSamplesPerCentroid[centroid][Object.keys(data[0])[0]];

  return newCentroids;
}

// Calculate the squared error over all the samples for their assigned centroid.
function calculateError(data, assignments, theCentroids)
{
  var error = 0;
  // Since we know which centroid each sample is assigned to we only need one loop.
  for (var sample in data)
      error += Math.pow(euclidianDistance(theCentroids[assignments[sample]], data[sample]), 2);

  return error;
}


// Calculate the euclidian distance between two data samples.
function euclidianDistance(sample1, sample2)
{
  var dist = 0;
  for (var dim in sample1)
    dist += Math.pow(sample1[dim] - sample2[dim], 2);
  dist = Math.sqrt(dist);
  return dist;
}

// Since the console.log-function executes asynchroniously we wrote an own log-function to fix this.
function log(input, row)
{
  var temp = input;
  if(typeof(input) == "object")
    temp = jQuery.extend(true, {}, input);
  if(row != undefined)
    console.log("Print no " + row + ":");
  console.log(temp);
}
