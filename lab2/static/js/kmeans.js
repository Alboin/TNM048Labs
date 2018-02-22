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
  var newCentroids = centroids;
  for (centroid in newCentroids)
    for (dim in newCentroids[centroid])
      newCentroids[centroid][dim] = 0;

  // Variable for counting the number of samples assigned to each centroid.
  var numberOfSamplesPerCentroid = newCentroids;
  console.log(newCentroids)

  // Add up the positions of all the assigned samples for each centroid.
  for (sample in data)
  {
    if(!isNaN(sample))
      for (dim in newCentroids[0])
      {
        newCentroids[assignments[sample]][dim] += Number(data[sample][dim]);
        numberOfSamplesPerCentroid[assignments[sample]][0]++;
      }
  }

console.log(numberOfSamplesPerCentroid)
  //for (centroid in newCentroids)
  //  for()
  console.log(newCentroids)
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
