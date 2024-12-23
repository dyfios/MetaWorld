const PoissonDiskSampling = require("poisson-disk-sampling");

CreateFloraDistribution = function(chunkSize, minDistance, maxDistance) {
    var p = new PoissonDiskSampling({
        shape: [ chunkSize, chunkSize ],
        minDistance: minDistance,
        maxDistance: maxDistance,
        tries: 3
    });
    var points = p.fill();

    return points;
}

module.exports = {
    CreateFloraDistribution
};