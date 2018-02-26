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

  assignments = assignToCentroid(data, centroids);
  centroids = moveCentroids(data, assignments, centroids);


  return {"assignments": assignments}
}


// Assign each data-sample to closest centroid.
function assignToCentroid(data, centroids)
{
  var assignments = [];

  for (sample in data)
  {
    var minDist = [999999, -1];
    for (centroid in centroids)
    {
      var distance = euclidianDistance(data[sample], centroids[centroid]);
      if (distance < minDist[0])
        minDist = [distance, centroid];
    }
    assignments.push(Number(minDist[1]));
  }
  assignments.splice(assignments.length - 1, 1);

  return assignments;
}

function moveCentroids(data, assignments, centroids)
{
  // Create a new centroid variable with all 0's
  console.log(centroids);
  var newCentroids = jQuery.extend(true, {}, centroids);
  var tCentroids = [];
  for (var centroid in newCentroids)
  {
    for (var dim in newCentroids[centroid])
    {
      newCentroids[centroid]["" + dim + ""] = 0.;

    }
    tCentroids.push(newCentroids[centroid]);

  }
      //newCentroids
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
  {
    if(!isNaN(sample))
      for (var dim in newCentroids[0])
      {
        newCentroids[assignments[sample]][dim] += Number(data[sample][dim]);
        numberOfSamplesPerCentroid[assignments[sample]][0]++;
      }
  }
  log(numberOfSamplesPerCentroid, 1.5);
  log(newCentroids, 2);

//console.log(numberOfSamplesPerCentroid)
  //for (centroid in newCentroids)
  //  for()
  //console.log(newCentroids)
  return newCentroids;
}

// Calculate the euclidian distance between two data samples.
function euclidianDistance(sample1, sample2)
{
  var dist = 0;
  for (dim in sample1)
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
