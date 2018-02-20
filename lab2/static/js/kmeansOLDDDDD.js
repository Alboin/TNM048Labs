/**
* k means algorithm
* @param data
* @param k
* @return {Object}
*/

function kmeans(data, k) {

    //Implement the algorithm here..
    //Remember to reference any code that you have not implemented yourself!

    // Count number of dimensions in data
    var dimensions = Object.keys(data[0]);
    /*var dimensions = 0;
    for (x in data[0]) {
        dimensions++;
    }*/

    // Create centroids
    var centroids = [];
    for (var i = 0; i < k; i++)
    {
        //var centroid = [];
        var c = data[Math.floor((Math.random() * data.length) + 1)];
        //for (var dim = 0; dim < dimensions; dim++)
        //{
        //    centroid[dim] = Math.random();
        //}
        centroids.push(c);
    }
    console.log(centroids)


    var assignments;

    var iteration = 0;
    var error = 100000;
    // Loop until the quality of the centroids stops improving.
    while(true)
    {
        // Assign all datapoints to a centroid
        assignments = assignDataToCentroids(data, centroids);

        // Move the centroids to the center of each cluster
        var newCentroids = calculateNewCentroids(data, assignments, k, dimensions);

        centroids = newCentroids;

        //var newAssignments = assignDataToCentroids(data, newCentroids);

        // Compare the quality of the new centroids to the old ones.
        //var errorOld = calculateError(data, centroids, assignments);
        var errorNew = calculateError(data, centroids, assignments);

        //console.log("Error old: " + errorOld)
        //console.log("Error new: " + errorNew)

        console.log("Error: " + Math.abs(error - errorNew))

        //console.log(centroids)
        //console.log(newCentroids)

        // If quality is improved, use the new centroids. If not we are done!
        //if (errorNew < errorOld)
        iteration++;

        // If the error is small enough, stop the loop.
        if(Math.abs(error - errorNew) > 0.1 || iteration < 10)
        {
          centroids = newCentroids;
          error = errorNew;
        }
        else
            break;
    }

    var result = { "assignments": assignments, "centroids": centroids };
    return result;

};

function assignDataToCentroids(data, centroids)
{
    //loop through data and assign it to the closest centroid
    var assignments = [];
    // Select one data sample
    for (sample in data) {

        var smallestDist = [1000, -1];
        // Compare sample to centroids
        for (centroid in centroids) {
            var dist = 0;
            // Loop through the data in the sample
            for (datapoint in data[sample]) {
                dist += Math.pow(data[sample][datapoint] - centroids[centroid][datapoint], 2);
            }
            // Calculate the euclidian distance to a centroid
            dist = Math.sqrt(dist);

            // Save the smallest distance and centroid index
            if (dist < smallestDist[0])
                smallestDist = [dist, centroid];
        }
        assignments.push(smallestDist[1]);
    }
    // Remove last element from array
    assignments.splice(assignments.length - 1, 1);

    return assignments;
}

function calculateNewCentroids(data, assignments, k, dimensions)
{

    // Initiate new centroids
    var newCentroids = [];
    for (var i = 0; i < k; i++)
    {
        var c = data[Math.floor((Math.random() * data.length) + 1)];
        newCentroids.push(c);
    }


    var newCentroids = [];
    var sampleCounter = [];
    for (var i = 0; i < k; i++) {
        var centroid = [];
        for (var dim = 0; dim < dimensions; dim++) {
            centroid[dim] = 0;
        }
        newCentroids[i] = centroid;
        sampleCounter[i] = 0;
    }

    // Sum up the "positions" of all the samples belonging to the same cluster centroid
    for (var sample = 0; sample < data.length; sample++)
    {
        var dimIdx = 0;
        for (datapoint in data[sample])
        {

            newCentroids[assignments[sample]][dimIdx] += Number(data[sample][datapoint]);
            sampleCounter[assignments[sample]]++;
            dimIdx++;
        }
    }

    // Divide the previously created sum to get the average position of each centroid
    for (centroid in newCentroids)
    {
        if (sampleCounter[centroid] != 0)
            for (dim in newCentroids[centroid])
            {
                newCentroids[centroid][dim] /= sampleCounter[centroid];
            }
    }

    return newCentroids;
}



function calculateError(data, centroids, assignments)
{
    var error = 0;

    // Sum up the distance from each sample to its assigned centroid
    for (var sample = 0; sample < data.length; sample++)
    {
        var dist = 0;
        var dimIdx = 0;
        for (datapoint in data[sample])
        {
            dist += Math.pow(data[sample][datapoint] - centroids[assignments[sample]][dimIdx], 2);
            dimIdx++;
        }
        // Since the equation contains both a sqrt and ^2 and is already positive we can simply add it to the quality.
        error += dist;

      }
    return error;
}
