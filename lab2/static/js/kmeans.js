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
    var dimensions = 0;
    for (x in data[0]) {
        dimensions++;
    }

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

    console.log(data[10])

    //loop through data and assign it to the closest centroid
    var assignments = [];
    // Select one data sample
    for (sample in data) {

        var centroidIdx = 0;
        var smallestDist = [1000, -1];
        // Compare sample to centroids
        for (centroid in centroids)
        {
            var dist = 0;
            // Loop through the data in the sample

            dimIdx = 0;
            //for (var dimIdx = 0; dimIdx < dimensions; dimIdx++) {
            for (datapoint in data[sample]) {

                dist += Math.pow(data[sample][datapoint] - centroids[centroid][dimIdx], 2);

                //console.log(data[sample][datapoint]);
                //console.log(centroids[centroid][dimIdx])
                dimIdx++;
            }
            // Calculate the euclidian distance to a centroid
            dist = Math.sqrt(dist);

            // Save the smallest distance and centroid index
            if (dist < smallestDist[0])
                smallestDist = [dist, centroidIdx];

            centroidIdx++;
        }
        assignments.push(smallestDist[1]);
    }
    // Remove last element from array
    assignments.splice(assignments.length - 1, 1);

    console.log(assignments)



    //return result;

};


