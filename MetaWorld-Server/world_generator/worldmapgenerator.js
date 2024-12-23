const { argv } = require("process");
const ChunkTerrainGenerator = require("./chunkterraingenerator");
const sqliteDatabase = require("../sqlite/sqliteDatabase");
const fs = require("fs");
const path = require("path");

this.chunkDirectory = ".";
this.dbFile = "./chunk-x-y.db";
this.groundSeed = 1234;
this.groundChunkSize = 512;
this.groundChunkHeight = 512;
this.groundChunks = 256;
this.chunkXIndex = 0;
this.chunkYIndex = 0;

CreateDatabase = async function (context, dbFile, groundSeed,
    groundChunkHeight, layers, localNoiseFactor, resolution, chunksPerPixel) {
    context.db = new sqliteDatabase();

    dbAlreadySetup = fs.existsSync(dbFile);
    if (dbAlreadySetup) {
        console.log("File " + dbFile + " already exists. Aborting.");
    }
    await context.db.Open(dbFile);
    if (!dbAlreadySetup) {
        await CreateGroundTable(context);
        terrainGenerator = new ChunkTerrainGenerator(groundSeed,
            resolution, resolution, chunksPerPixel,
            groundChunkHeight - 1, 1, 1, 2, 0.5, 4, 0.25, 8, 0.125, 16, 0.0625, 32, 0.03125, 1.5,
            localNoiseFactor);
            worldHeights = terrainGenerator.GetChunkHeightsGlobalOnly(0, 0);
            for (let i = 0; i < resolution; i++) {
                groundArray = [];
                for (let j = 0; j < resolution; j++) {
                    let layer = 0;
                    let reachedLastLayer = false;
                    for (var lyr in layers) {
                        if (worldHeights[i][j] >= layers[lyr]["height"]) {
                            reachedLastLayer = true;
                        }
                        else if (reachedLastLayer) {
                            layer = layers[lyr]["layer"];
                            break;
                        }
                    }
                    groundArray.push([i, j, worldHeights[i][j], layer]);
                }
                SetGround(context, ["xindex", "yindex", "height", "layerid"], groundArray);
            }console.log("fgh");
    }
}

CreateGroundTable = async function(context) {
    await context.db.CreateTable("ground", {
        "'xindex'": "INT", "'yindex'": "INT", "'height'": "INT", "'layerid'": "INT"
    });
}

SetGround = async function(context, cols, groundArray) {
    context.db.InsertBatchIntoTable("ground", cols, groundArray);
}

this.worldDirectory = argv[2];
this.groundSeed = parseInt(argv[3]);
this.groundChunkHeight = parseInt(argv[4]);
this.resolution = parseInt(argv[5]);

this.layers = {};
for (let i = 6; i < argv.length; i+= 2) {
    this.layers[(i - 6) / 2] = {"height": parseInt(argv[i]), "layer": parseInt(argv[i + 1])};
}

this.dbFile = path.join(this.worldDirectory, "world-lowdetail.db");

CreateDatabase(this, this.dbFile, this.groundSeed, this.groundChunkHeight,
    this.layers, this.localNoiseFactor, this.resolution, this.chunksPerPixel);