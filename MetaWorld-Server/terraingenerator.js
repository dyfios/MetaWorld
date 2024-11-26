const BasicTerrainGenerator = require("./basicterraingenerator");
const sqliteDatabase = require("./sqliteDatabase");
const fs = require("fs");

this.dbFile = "./world-73-86.db";
this.groundSeed = 1234;
//this.groundSeed = 1234567;
this.groundChunkSize = 512;
this.groundChunkHeight = 512;
this.groundChunks = 256;

// Layers:
// 0 - dirt
// 1 - light dirt
// 2 - grass
// 3 - stone
// 4 - moss stone
// 5 - sand
// 6 - pebbles
// 7 - moon rock
//
// Terrain Layering:
// 0-7m - Sea Floor (moon rock/layer 7)
// 8-123m - Base Ground (stone/layer 3)
// 124-128m - Beach (sand/layer 5) <-- Water level 127m
// 129-132m - Ground (grass/layer 2)
// 133-199m - Hills (grass/layer 2)
// 200-263m - Low Mountains (moss stone/layer 4)
// 264-511m - High Mountains (stone/layer 3)

CreateDatabase = async function (context, dbFile, groundSeed, groundChunkSize, groundChunkHeight) {
    context.db = new sqliteDatabase();

    dbAlreadySetup = fs.existsSync(dbFile);
    if (dbAlreadySetup) {
        console.log("File " + dbFile + " already exists. Aborting.");
    }
    await context.db.Open(dbFile);
    if (!dbAlreadySetup) {
        await CreateGroundTable(context);
        await CreateModificationsTable(context);
        await CreateEntitiesTable(context);
        await CreateTimeTable(context);

        //terrainGenerator = new BasicTerrainGenerator(groundSeed,
        //    groundChunkSize, groundChunkSize, groundChunkHeight - 1,
        //    1, 1, 2, 0.5, 4, 0.25, 8, 0.125, 16, 0.0625, 32, 0.03125, 1.5);
        terrainGenerator = new BasicTerrainGenerator(groundSeed,
            groundChunkSize, groundChunkSize * context.groundChunks, groundChunkHeight - 1,
            1, 1, 2, 0.5, 4, 0.25, 8, 0.125, 16, 0.0625, 32, 0.03125, 1.5);
        chunkHeights = terrainGenerator.GetChunkHeights(73, 86);
        for (let i = 0; i < groundChunkSize; i++) {
            for (let j = 0; j < groundChunkSize; j++) {
                let layer = 0;
                if (chunkHeights[i][j] < 8) {
                    // Sea floor.
                    layer = 7;
                }
                else if (chunkHeights[i][j] < 124) {
                    // Base ground.
                    layer = 3;
                }
                else if (chunkHeights[i][j] < 129) {
                    // Beach.
                    layer = 5;
                }
                else if (chunkHeights[i][j] < 200) {
                    // Ground/hills.
                    layer = 2.
                }
                else if (chunkHeights[i][j] < 264) {
                    // Low mountains.
                    layer = 4;
                }
                else {
                    // High mountains.
                    layer = 3;
                }
                SetGround(context, i, j, chunkHeights[i][j], layer);
            }
        }
    }
}

CreateGroundTable = async function(context) {
    await context.db.CreateTable("ground", {
        "'xindex'": "INT", "'yindex'": "INT", "'height'": "INT", "'layerid'": "INT"
    });
}

CreateModificationsTable = async function(context) {
    await context.db.CreateTable("ground_mods", {
        "'operation'": "INT", "'x'": "INT", "'y'": "INT", "'z'": "INT",
        "'brushtype'": "INT", "'layer'": "INT"
    });
}

CreateEntitiesTable = async function(context) {
    await context.db.CreateTable("entities", {
        "'entityid'": "INT", "'variantid'": "INT", "'instanceid'": "STRING",
        "'xposition'": "FLOAT", "'yposition'": "FLOAT", "zposition": "FLOAT",
        "'xrotation'": "FLOAT", "'yrotation'": "FLOAT", "'zrotation'": "FLOAT", "'wrotation'": "FLOAT"
    });
}

CreateTimeTable = async function(context) {
    await context.db.CreateTable("time", {
        "'day'": "INT", "'seconds'": "INT"
    });
    await context.db.InsertIntoTable("time", { "day": 0, "seconds": 0 });
}

SetGround = async function(context, x, y, height, id) {
    heights = await context.db.GetRows("ground",
        { "xindex": x, "yindex": y });
    if (heights == null || heights.length == 0) {
        await context.db.InsertIntoTable("ground",
            { "xindex": x, "yindex": y, "height": height,
            "layerid": id }, false);
    }
    else {
        await context.db.UpdateInTable("ground",
            { "layerid": id },
            { "xindex": x, "yindex": y, "height": height });
    }
}

function Run(context) {
    CreateDatabase(context, context.dbFile,
        context.groundSeed, context.groundChunkSize, context.groundChunkHeight);
}

Run(this);