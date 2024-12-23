const simplexNoise = require("simplex-noise");
const Alea = require("alea");

module.exports = function(seed, chunkSize, globalScale = 1024, localScale = 64, maxHeight = 128,
    firstOctaveFrequency = 1, firstOctaveDivisor = 1,
    secondOctaveFrequency = 2, secondOctaveDivisor = 0.5,
    thirdOctaveFrequency = 4, thirdOctaveDivisor = 0.25,
    fourthOctaveFrequency = 8, fourthOctaveDivisor = 0.125,
    fifthOctaveFrequency = 16, fifthOctaveDivisor = 0.0625,
    sixthOctaveFrequency = 32, sixthOctaveDivisor = 0.03125,
    redistribution = 1, localNoiseFactor = 1) {
    let noise = simplexNoise.createNoise3D(Alea(seed));
    let noise2d = simplexNoise.createNoise2D(Alea(seed));
    let octaveFrequencies = [];
    let octaveDivisors = [];

    this.GetGlobalHeight = function(x, y) {
        let angleX = Math.PI * 2 * x;
        return noise(Math.cos(angleX) / (Math.PI * 2), Math.sin(angleX) / (Math.PI * 2), y);
    }

    this.GetLocalHeight = function(x, y) {
        return noise2d(y, x);
    }

    this.GetChunkHeights = function(x, y) {
        startX = chunkSize * x;
        startY = chunkSize * y;
        let chunk = [];
        for (let x = startX; x <= startX + chunkSize; x++) {
            chunk[x - startX] = [];
            for (let y = startY; y <= startY + chunkSize; y++) {
                let nx = x / globalScale;
                let ny = y / globalScale;

                let ox = (x % localScale) / localScale;
                let oy = (y % localScale) / localScale;

                let summedOctaveAmplitude = firstOctaveDivisor;
                globalBase = octaveDivisors[0] * (this.GetGlobalHeight(octaveFrequencies[0] * nx, octaveFrequencies[0] * ny) + 1) / 2;
                localBase = octaveDivisors[0] * (this.GetLocalHeight(octaveFrequencies[0] * 100 * nx, octaveFrequencies[0] * 100 * ny) + 1) / 2;
                for (let i = 1; i < octaveFrequencies.length; i++) {
                    globalBase += octaveDivisors[i] * (this.GetGlobalHeight(octaveFrequencies[i] * 2 * nx, octaveFrequencies[i] * 2 * ny) + 1) / 2;
                    localBase += octaveDivisors[i] * (this.GetLocalHeight(octaveFrequencies[i] * 100 * 2 * nx, octaveFrequencies[i] * 100 * 2 * ny) + 1) / 2;
                    summedOctaveAmplitude += octaveDivisors[i];
                }

                var xPart = 2 * (0.5 - Math.abs(ox - 0.5));
                var yPart = 2 * (0.5 - Math.abs(oy - 0.5));
                let d = Math.min(1, (xPart * xPart * yPart * yPart) / Math.SQRT2);
                chunk[x - startX][y - startY] = Math.pow(globalBase / summedOctaveAmplitude, redistribution) * maxHeight +
                Math.pow((((localBase / summedOctaveAmplitude) * 0.03 * maxHeight * localNoiseFactor) - (maxHeight * localNoiseFactor * 0.03 * 0.5)), 5);//lerp(0, localBase, 0.5) * maxHeight * localNoiseFactor * 0.1;//lerp(0, lerp(localBase, 1 - d, 0.85) * maxHeight - maxHeight / 2, 0.5) * localNoiseFactor;
                /*chunk[x - startX][y - startY] = lerp(
                    Math.pow(globalBase / summedOctaveAmplitude, redistribution) * maxHeight,
                    //Math.pow(localBase / summedOctaveAmplitude, redistribution) * maxHeight
                    Math.max(1, lerp(localBase, 1 - d, 0.85) * maxHeight - maxHeight / 2), 0.1 * localNoiseFactor);*/
                //let d = Math.min(1, ((nx - 0.5) * (nx - 0.5) + (ny - 0.5) * (ny - 0.5)) / Math.SQRT2);//  1 - (1 - (nx * nx)) * (1 - (ny * ny));
                //chunk[x - startX][y - startY] = Math.max(1, lerp(base, 1 - d, 0.85) * maxHeight - 340);
            }
        }
        return chunk;
    }

    this.GetChunkHeightsGlobalOnly = function(x, y) {
        startX = chunkSize * x;
        startY = chunkSize * y;
        let chunk = [];
        for (let x = startX; x <= startX + chunkSize; x++) {
            chunk[x - startX] = [];
            for (let y = startY; y <= startY + chunkSize; y++) {
                let nx = x / globalScale;
                let ny = y / globalScale;

                let summedOctaveAmplitude = firstOctaveDivisor;
                globalBase = octaveDivisors[0] * (this.GetGlobalHeight(octaveFrequencies[0] * nx, octaveFrequencies[0] * ny) + 1) / 2;
                for (let i = 1; i < octaveFrequencies.length; i++) {
                    globalBase += octaveDivisors[i] * (this.GetGlobalHeight(octaveFrequencies[i] * 2 * nx, octaveFrequencies[i] * 2 * ny) + 1) / 2;
                    summedOctaveAmplitude += octaveDivisors[i];
                }
                
                chunk[x - startX][y - startY] = Math.pow(globalBase / summedOctaveAmplitude, redistribution) * maxHeight;
            }
        }
        return chunk;
    }

    this.AddOctave = function(frequency, divisor) {
        octaveFrequencies[octaveFrequencies.length] = frequency;
        octaveDivisors[octaveDivisors.length] = divisor;
    }

    this.AddOctave(firstOctaveFrequency, firstOctaveDivisor);
    this.AddOctave(secondOctaveFrequency, secondOctaveDivisor);
    this.AddOctave(thirdOctaveFrequency, thirdOctaveDivisor);
    this.AddOctave(fourthOctaveFrequency, fourthOctaveDivisor);
    this.AddOctave(fifthOctaveFrequency, fifthOctaveDivisor);
    this.AddOctave(sixthOctaveFrequency, sixthOctaveDivisor);

    function lerp( a, b, alpha ) {
        return a + alpha * ( b - a );
    }
}