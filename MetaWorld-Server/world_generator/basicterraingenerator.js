const simplexNoise = require("simplex-noise");
const Alea = require("alea");

module.exports = function(seed, chunkSize, scale = 1024, maxHeight = 128,
    firstOctaveFrequency = 1, firstOctaveDivisor = 1,
    secondOctaveFrequency = 2, secondOctaveDivisor = 0.5,
    thirdOctaveFrequency = 4, thirdOctaveDivisor = 0.25,
    fourthOctaveFrequency = 8, fourthOctaveDivisor = 0.25,
    fifthOctaveFrequency = 16, fifthOctaveDivisor = 0.25,
    sixthOctaveFrequency = 32, sixthOctaveDivisor = 0.25,
    redistribution = 1) {
    //let noise = simplexNoise.createNoise2D(Alea(seed));
    let noise = simplexNoise.createNoise3D(Alea(seed));
    //let noise = simplexNoise.createNoise4D(Alea(seed));
    let octaveFrequencies = [];
    let octaveDivisors = [];
    let TAU = 6.283185;

    this.GetHeight = function(x, y) {
        let angleX = TAU * x;
        let angleY = TAU * y;
        //return noise(Math.cos(angleX) / TAU, Math.sin(angleX) / TAU, Math.cos(angleY) / TAU, Math.sin(angleY) / TAU) * 1.2247;
        return noise(Math.cos(angleX) / TAU, Math.sin(angleX) / TAU, y);
        //return noise(y, x);
    }

    this.GetChunkHeights = function(x, y) {
        startX = chunkSize * x;
        startY = chunkSize * y;
        let chunk = [];
        for (let x = startX; x < startX + chunkSize; x++) {
            chunk[x - startX] = [];
            for (let y = startY; y < startY + chunkSize; y++) {
                let nx = x / scale;
                let ny = y / scale;
                let ox = x * 512 / scale;
                let oy = y * 512 / scale;
                let summedOctaveAmplitude = firstOctaveDivisor;
                base = octaveDivisors[0] * (this.GetHeight(octaveFrequencies[0] * nx, octaveFrequencies[0] * ny) + 1) / 2;
                base2 = octaveDivisors[0] * (this.GetHeight(octaveFrequencies[0] * ox, octaveFrequencies[0] * oy) + 1) / 2;
                for (let i = 1; i < octaveFrequencies.length; i++) {
                    base += octaveDivisors[i] * (this.GetHeight(octaveFrequencies[i] * 2 * nx, octaveFrequencies[i] * 2 * ny) + 1) / 2;
                    base2 += octaveDivisors[i] * (this.GetHeight(octaveFrequencies[i] * 2 * ox, octaveFrequencies[i] * 2 * oy) + 1) / 2;
                    summedOctaveAmplitude += octaveDivisors[i];
                }
                //chunk[y - startY][x - startX] = (base * maxHeight);
                chunk[x - startX][y - startY] = lerp(
                    Math.pow(base / summedOctaveAmplitude, redistribution) * maxHeight,
                    Math.pow(base2 / summedOctaveAmplitude, redistribution) * maxHeight, 0.0005);
                let d = Math.min(1, ((nx - 0.5) * (nx - 0.5) + (ny - 0.5) * (ny - 0.5)) / Math.SQRT2);//  1 - (1 - (nx * nx)) * (1 - (ny * ny));
                //chunk[x - startX][y - startY] = Math.max(1, lerp(base, 1 - d, 0.85) * maxHeight - 340);
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