const { argv } = require("process");
const ChunkFloraGenerator = require("./chunkfloragenerator");
const sqliteDatabase = require("./sqliteDatabase");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

PlaceFlora = async function(context, dbFile, groundChunkSize, groundHeightmapScale,
    largeFloraDensities, mediumFloraDensities, smallFloraDensities, waterLevel) {
    context.db = new sqliteDatabase();
    dbAlreadySetup = fs.existsSync(dbFile);
    if (!dbAlreadySetup) {
        console.log("File " + dbFile + " does not exist. Aborting.");
        return;
    }

    await context.db.Open(dbFile);

    numberOfFloraEntities = 0;
    summedLargeFloraWeights = 0;
    for (var floraDensity in largeFloraDensities) {
        summedLargeFloraWeights += largeFloraDensities[floraDensity]["density"];
        numberOfFloraEntities++;
    }
    
    summedMediumFloraWeights = 0;
    for (var floraDensity in mediumFloraDensities) {
        summedMediumFloraWeights += mediumFloraDensities[floraDensity]["density"];
        numberOfFloraEntities++;
    }
    
    summedSmallFloraWeights = 0;
    for (var floraDensity in smallFloraDensities) {
        summedSmallFloraWeights += smallFloraDensities[floraDensity]["density"];
        numberOfFloraEntities++;
    }
    
    summedFloraWeights = summedLargeFloraWeights + summedMediumFloraWeights + summedSmallFloraWeights;
    floraDensity = summedFloraWeights / numberOfFloraEntities;
    floraLocations = ChunkFloraGenerator.CreateFloraDistribution(
        groundChunkSize, 5 + ((1 - floraDensity) * 25),
        100 + ((1 - floraDensity) * groundChunkSize));
    
    for (var floraLocation in floraLocations) {
        floraTypeCorrelator = Math.random() * summedFloraWeights;
        floraTypeFinder = 0;
        floraType = -1;
        for (var floraDensity in largeFloraDensities) {
            floraTypeFinder += largeFloraDensities[floraDensity]["density"];
            if (floraTypeFinder > floraTypeCorrelator) {
                floraType = largeFloraDensities[floraDensity];
                break;
            }
        }
        if (floraType == -1) {
            for (var floraDensity in mediumFloraDensities) {
                floraTypeFinder += mediumFloraDensities[floraDensity]["density"];
                if (floraTypeFinder > floraTypeCorrelator) {
                    floraType = mediumFloraDensities[floraDensity];
                    break;
                }
            }
        }
        if (floraType == -1) {
            for (var floraDensity in smallFloraDensities) {
                floraTypeFinder += smallFloraDensities[floraDensity]["density"];
                if (floraTypeFinder > floraTypeCorrelator) {
                    floraType = smallFloraDensities[floraDensity];
                    break;
                }
            }
        }
        floraLocationHeight = GetGroundHeight(
            context, Math.round(floraLocations[floraLocation][0]), Math.round(floraLocations[floraLocation][1]),
            floraLocations[floraLocation][0], floraLocations[floraLocation][1], floraType, (x, y, ft, height) => {
            if (height != null && height > waterLevel) {
                PositionEntity(context, ft["entity-id"], ft["variant-id"], "'" + uuidv4() + "'", y * groundHeightmapScale, -1, x * groundHeightmapScale, 0, 0, 0, 1);
            }
        });
    }
}

GetGroundHeight = async function(context, roundX, roundY, x, y, floraType, callback) {
    context.db.GetRows("ground", { "xindex": roundX, "yindex": roundY }, (ground) => {
        if (ground == null || ground.length < 1) {
            if (callback != null) callback(x, y, null, null);
        }
        else {
            if (ground[0]["height"] == null) {
                if (callback != null) callback(x, y, null, null);
            }
            else {
                if (callback != null) callback(x, y, floraType, ground[0]["height"]);
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
                    "xrotation": xRot, "yrotation": yRot, "zrotation": zRot, "wrotation": wRot }, false);
        }
        else {
            context.db.UpdateInTable("entities",
                { "xposition": xPos, "yposition": yPos, "zposition": zPos,
                    "xrotation": xRot, "yrotation": yRot, "zrotation": zRot, "wrotation": wRot },
                { "entityid": entityID, "variantid": variantID, "instanceid": instanceID });
        }
    });
}

this.chunkDirectory = argv[2];
this.chunkXIndex = parseInt(argv[3]);
this.chunkYIndex = parseInt(argv[4]);
this.groundChunkSize = parseInt(argv[5]);
this.groundHeightmapScale = parseInt(argv[6]);
this.largeFloraDensities = JSON.parse(argv[7]);
this.mediumFloraDensities = JSON.parse(argv[8]);
this.smallFloraDensities = JSON.parse(argv[9]);
this.waterLevel = parseInt(argv[10]);

this.dbFile = path.join(this.chunkDirectory, "chunk-" + this.chunkXIndex.toString() + "." + this.chunkYIndex.toString() + ".db");

PlaceFlora(this, this.dbFile, this.groundChunkSize, this.groundHeightmapScale,
    this.largeFloraDensities, this.mediumFloraDensities, this.smallFloraDensities, this.waterLevel);