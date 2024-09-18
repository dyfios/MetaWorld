const simplexNoise = require("simplex-noise");
const Alea = require("alea");

module.exports = function(seed, chunkSize, scale = 1024, maxHeight = 128, firstOctaveFrequency = 1, firstOctaveDivisor = 1, redistribution = 1) {
    let noise = simplexNoise.createNoise2D(Alea(seed));
    let octaveFrequencies = [];
    let octaveDivisors = [];

    this.GetHeight = function(x, y) {
        return noise(y, x);
    }

    this.GetChunkHeights = function(x, y) {
        startX = chunkSize * x;
        startY = chunkSize * y;
        let chunk = [];
        for (let y = startY; y < startY + chunkSize; y++) {
            chunk[y - startY] = [];
            for (let x = startX; x < startX + chunkSize; x++) {
                let nx = x / scale;
                let ny = y / scale;
                base = octaveDivisors[0] * (this.GetHeight(octaveFrequencies[0] * nx, octaveFrequencies[0] * ny) + 1) / 2;
                for (let i = 1; i < octaveFrequencies.length; i++) {
                    base += octaveDivisors[i] * (this.GetHeight(octaveFrequencies[i] * nx, octaveFrequencies[0] * ny) + 1) / 2;
                }
                chunk[y - startY][x - startX] = Math.round(Math.pow(base, redistribution) / 1.5 * maxHeight);
            }
        }
        return chunk;
    }

    this.AddOctave = function(frequency, divisor) {
        octaveFrequencies[octaveFrequencies.length] = frequency;
        octaveDivisors[octaveDivisors.length] = divisor;
    }

    this.AddOctave(firstOctaveFrequency, firstOctaveDivisor);
}