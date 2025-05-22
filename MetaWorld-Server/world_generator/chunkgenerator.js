const { argv } = require("process");
const ChunkTerrainGenerator = require("./chunkterraingenerator");
const sqliteDatabase = require("../sqlite/sqliteDatabase");
const fs = require("fs");
const path = require("path");

const defaultEntityOwner = "";
const defaultOwnerRead = 1;
const defaultOwnerWrite = 1;
const defaultOwnerUse = 1;
const defaultOwnerTake = 1;
const defaultOtherRead = 0;
const defaultOtherWrite = 0;
const defaultOtherUse = 0;
const defaultOtherTake = 0;

this.chunkDirectory = ".";
this.dbFile = "./chunk-x-y.db";
this.groundSeed = 1234;
this.groundChunkSize = 512;
this.groundChunkHeight = 512;
this.groundChunks = 256;
this.chunkXIndex = 0;
this.chunkYIndex = 0;

CreateDatabase = async function (context, dbFile, groundSeed, groundChunkSize,
    groundChunkHeight, xIndex, yIndex, layers, localNoiseFactor) {
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

        terrainGenerator = new ChunkTerrainGenerator(groundSeed,
            groundChunkSize, groundChunkSize * context.groundChunks, groundChunkSize,
            groundChunkHeight - 1, 1, 1, 2, 0.5, 4, 0.25, 8, 0.125, 16, 0.0625, 32, 0.03125, 1.5,
            localNoiseFactor);
        chunkHeights = terrainGenerator.GetChunkHeights(xIndex, yIndex);

        for (let i = 0; i < groundChunkSize; i++) {
            groundArray = [];
            for (let j = 0; j < groundChunkSize; j++) {
                let layer = 0;
                let reachedLastLayer = false;
                for (var lyr in layers) {
                    if (chunkHeights[i][j] >= layers[lyr]["height"]) {
                        reachedLastLayer = true;
                    }
                    else if (reachedLastLayer) {
                        layer = layers[lyr]["layer"];
                        break;
                    }
                }
                groundArray.push([i, j, chunkHeights[i][j], layer]);
                //SetGround(context, i, j, chunkHeights[i][j], layer);
            }
            SetGround(context, ["xindex", "yindex", "height", "layerid"], groundArray);
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
        "'brushtype'": "INT", "'layer'": "INT", "'brushsize'": "INT"
    });
}

CreateEntitiesTable = async function(context) {
    await context.db.CreateTable("entities", {
        "'entityid'": "INT", "'variantid'": "INT", "'instanceid'": "STRING",
        "'xposition'": "FLOAT", "'yposition'": "FLOAT", "zposition": "FLOAT",
        "'xrotation'": "FLOAT", "'yrotation'": "FLOAT", "'zrotation'": "FLOAT",
        "'wrotation'": "FLOAT", "'state'": "STRING",
        "'owner'": "STRING",
        "'ownerread'": "INT", "'ownerwrite'": "INT", "'owneruse'": "INT", "'ownertake'": "INT",
        "'otherread'": "INT", "'otherwrite'": "INT", "'otheruse'": "INT", "'othertake'": "INT"
    });
}

CreateTimeTable = async function(context) {
    await context.db.CreateTable("time", {
        "'day'": "INT", "'seconds'": "INT"
    });
    await context.db.InsertIntoTable("time", { "day": 0, "seconds": 0 });
}

SetGround = async function(context, cols, groundArray) {
//SetGround = async function(context, x, y, height, id) {
    context.db.InsertBatchIntoTable("ground", cols, groundArray);
    
    /*context.db.GetRows("ground", { "xindex": x, "yindex": y }, (heights) => {
        if (heights == null || heights.length == 0) {
            context.db.InsertIntoTable("ground",
                { "xindex": x, "yindex": y, "height": height,
                "layerid": id }, false);
        }
        else {
            context.db.UpdateInTable("ground",
                { "layerid": id },
                { "xindex": x, "yindex": y, "height": height });
        }
    });*/
}

GetGroundHeight = async function(context, x, y, callback) {
    context.db.GetRows("ground", { "xindex": x, "yindex": y }, (ground) => {
        if (ground == null || ground.length < 1) {
            if (callback != null) callback(null);
        }
        else {
            if (ground[0]["height"] == null) {
                if (callback != null) callback(null);
            }
            else {
                if (callback != null) callback(ground[0]["height"]);
            }
        }
    });
}

PositionEntity = async function(context, entityID, variantID, instanceID, xPos, yPos, zPos, xRot, yRot, zRot, wRot) {
    context.db.GetRows("entities", { "instanceid": instanceID }, (entities) => {
        if (entities == null || entities.length == 0) {
            context.db.InsertIntoTable("entities",
                { "entityid": entityID, "variantid": variantID, "instanceid": instanceID,
                    "xposition": xPos, "yposition": yPos, "zposition": zPos,
                    "xrotation": xRot, "yrotation": yRot, "zrotation": zRot, "wrotation": wRot,
                "owner": defaultEntityOwner,
                "ownerread": defaultOwnerRead, "ownerwrite": defaultOwnerWrite, "owneruse": defaultOwnerUse, "ownertake": defaultOwnerTake,
                "otherread": defaultOtherRead, "otherwrite": defaultOtherWrite, "otheruse": defaultOtherUse, "othertake": defaultOtherTake },
                false);
        }
        else {
            context.db.UpdateInTable("entities",
                { "xposition": xPos, "yposition": yPos, "zposition": zPos,
                    "xrotation": xRot, "yrotation": yRot, "zrotation": zRot, "wrotation": wRot },
                { "entityid": entityID, "variantid": variantID, "instanceid": instanceID });
        }
    });
}

// Args: chunk directory, seed, chunk size, chunk height, chunk x index, chunk y index, local noise factor, layers.
this.chunkDirectory = argv[2];
this.groundSeed = parseInt(argv[3]);
this.groundChunkSize = parseInt(argv[4]);
this.groundChunkHeight = parseInt(argv[5]);
this.chunkXIndex = parseInt(argv[6]);
this.chunkYIndex = parseInt(argv[7]);
this.localNoiseFactor = parseFloat(argv[8]);

this.layers = {};
for (let i = 9; i < argv.length; i+= 2) {
    this.layers[(i - 9) / 2] = {"height": parseInt(argv[i]), "layer": parseInt(argv[i + 1])};
}

this.dbFile = path.join(this.chunkDirectory, "chunk-" + this.chunkXIndex.toString() + "." + this.chunkYIndex.toString() + ".db");

CreateDatabase(this, this.dbFile, this.groundSeed, this.groundChunkSize,
    this.groundChunkHeight, this.chunkXIndex,
    this.chunkYIndex, this.layers, this.localNoiseFactor);