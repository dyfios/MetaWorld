const { argv } = require("process");
const { spawnSync } = require('child_process');

this.minX = parseInt(argv[2]);
this.maxX = parseInt(argv[3]);
this.minY = parseInt(argv[4]);
this.maxY = parseInt(argv[5]);
this.chunkDirectory = argv[6];
this.seed = argv[7];
this.groundChunkSize = argv[8];
this.groundChunkHeight = argv[9];
this.localNoiseFactor = argv[10];
this.groundHeightmapScale = argv[11];
this.waterLevel = argv[12];
this.largeFloraDensities = argv[13];
this.mediumFloraDensities = argv[14];
this.smallFloraDensities = argv[15];

this.layers = [];
for (let i = 16; i < argv.length; i+= 2) {
    this.layers[i - 16] = argv[i];
    this.layers[i - 15] = argv[i + 1];
}

for (let i = this.minX; i <= this.maxX; i++) {
    for (let j = this.minY; j <= this.maxY; j++) {
        var arguments = [ "chunkgenerator.js", this.chunkDirectory,
            this.seed, this.groundChunkSize, this.groundChunkHeight,
            i.toString(), j.toString(), this.localNoiseFactor ];
        for (var layer in this.layers) {
            arguments.push(this.layers[layer]);
        }
        
        let child = spawnSync('node', arguments);
        
        var floraPlacerArgs = [ "floraplacer.js", this.chunkDirectory,
            i.toString(), j.toString(), this.groundChunkSize,
            this.groundHeightmapScale, this.largeFloraDensities,
            this.mediumFloraDensities, this.smallFloraDensities,
            this.waterLevel ];
        
        let floraPlacer = spawnSync('node', floraPlacerArgs);

        /*child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
            
        child.stderr.on('error', (data) => {
            console.error(`stderr: ${data}`);
        });
            
        child.on('close', (code) => {
            console.log(`Chunk generator exited with code ${code}`);
            if (code == 0) {
                var floraPlacerArgs = [ "floraplacer.js", this.chunkDirectory,
                    i.toString(), j.toString(), this.groundChunkSize,
                    this.groundHeightmapScale, this.largeFloraDensities,
                    this.mediumFloraDensities, this.smallFloraDensities,
                    this.waterLevel ];
                
                let floraPlacer = spawn('node', floraPlacerArgs);
                floraPlacer.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });
                    
                floraPlacer.stderr.on('error', (data) => {
                    console.error(`stderr: ${data}`);
                });

                floraPlacer.on('close', (code) => {
                    console.log(`Flora Placer exited with code ${code}`);
                });
            }
            console.log(`child process exited with code ${code}`);
        });*/
    }
}