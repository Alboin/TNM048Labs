/**
* k means algorithm
* @param data
* @param k
* @return {Object}
*/

function kmeans(data, k, assignments, centroids) {

    //Implement the algorithm here..
    //Remember to reference any code that you have not implemented yourself! 

    // Count number of dimensions in data
    var dimensions = 0;
    for (x in data[0]) {
        dimensions++;
    }

    if (centroids == null)
    {
        // Create centroids
        var centroids = [];
        for (var i = 0; i < k; i++)
        {
            var centroid = [];
            for (var dim = 0; dim < dimensions; dim++)
            {
                centroid[dim] = Math.random();
            }
            centroids[i] = centroid;
        }
    }


    var assignments;

    // Loop until the quality of the centroids stops improving.
    while(true)
    {
        // Assign all datapoints to a centroid
        assignments = assignDataToCentroids(data, centroids);

        // Move the centroids to the center of each cluster
        var newCentroids = calculateNewCentroids(data, assignments, k, dimensions);

        var newAssignments = assignDataToCentroids(data, newCentroids);

        // Compare the quality of the new centroids to the old ones.
        var errorOld = calculateError(data, centroids, assignments);
        var errorNew = calculateError(data, newCentroids, newAssignments);

        console.log("Error old: " + errorOld)
        console.log("Error new: " + errorNew)

        console.log(centroids)
        console.log(newCentroids)

        // If quality is improved, use the new centroids. If not we are done!
        if (errorNew < errorOld)
            centroids = newCentroids;
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
            var dimIdx = 0;
            // Loop through the data in the sample
            for (datapoint in data[sample]) {
                dist += Math.pow(data[sample][datapoint] - centroids[centroid][dimIdx], 2);
                dimIdx++;
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
    var quality = 0;

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
        quality += dist;
    }

    return quality;
}


