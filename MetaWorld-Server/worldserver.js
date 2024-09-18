const worldrestserver = require("./worldrestserver");
const fs = require("fs");
const sqliteDatabase = require("./sqliteDatabase");
const BasicTerrainGenerator = require("./basicterraingenerator");
const Time = require("./time");

this.dbFile = "./world.db";
this.groundSeed = 1234;
this.groundChunkSize = 512;
this.groundChunkHeight = 32;

function StartServer(context, port) {
    console.log("Starting Server...");
    
    CreateWorldDatabase(context, context.dbFile,
        context.groundSeed, context.groundChunkSize, context.groundChunkHeight);

    time = new Time(context, 86400, 5);

    worldRS = new worldrestserver(port, context, GetAllGround, SetGround, ModifyTerrain,
        GetAllEntities, PositionEntity, DeleteEntity, GetTime);
    
    console.log("Server Started.");
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

GetAllGround = async function(context, callback) {
    context.db.GetAllRows("ground", (ground) => {
        context.db.GetAllRows("ground_mods", (groundMods) => {
            result = {
                "base-ground": ground,
                "ground_mods": groundMods
            };
            callback(result);
        });
    });
}

ModifyTerrain = async function(context, x, y, z, operation, brushType, layer) {
    heights = await context.db.GetRows("ground_mods",
        { "x": x, "y": y, "z": z });
    if (heights == null || heights.length == 0) {
        await context.db.InsertIntoTable("ground_mods",
            { "x": x, "y": y, "z": z, "operation": "'" + operation + "'", "brushtype": "'" + brushType + "'",
            "layer": layer }, false);
    }
    else {
        await context.db.UpdateInTable("ground_mods",
            { "operation": operation, "brushtype": brushType, "layer": layer }, { "x": x, "y": y, "z": z });
    }
}

PositionEntity = async function(context, entityID, variantID, instanceID, xPos, yPos, zPos, xRot, yRot, zRot, wRot) {
    entities = await context.db.GetRows("entities",
        { "instanceid": instanceID });
    
    if (entities == null || entities.length == 0) {
        await context.db.InsertIntoTable("entities",
            { "entityid": entityID, "variantid": variantID, "instanceid": instanceID,
                "xposition": xPos, "yposition": yPos, "zposition": zPos,
                "xrotation": xRot, "yrotation": yRot, "zrotation": zRot, "wrotation": wRot }, false);
    }
    else {
        await context.db.UpdateInTable("entities",
            { "xposition": xPos, "yposition": yPos, "zposition": zPos,
                "xrotation": xRot, "yrotation": yRot, "zrotation": zRot, "wrotation": wRot },
            { "entityid": entityID, "variantid": variantID, "instanceid": instanceID });
    }
}

DeleteEntity = async function(context, instanceID) {
    entities = await context.db.GetRows("entities",
        { "instanceid": instanceID });
    
    if (entities != null && entities.length > 0) {
        await context.db.DeleteFromTable("entities", { "instanceid": instanceID });
    }
}

GetAllEntities = async function(context, callback) {
    context.db.GetAllRows("entities", (entities) => {
        result = {
            "entities": entities
        };
        callback(result);
    });
}

GetTime = async function(context, callback) {
    context.db.GetAllRows("time", (time) => {
        result = {
            "day": time[0].day,
            "seconds": time[0].seconds
        };
        callback(result);
    });
}

CreateWorldDatabase = async function(context, dbFile, groundSeed, groundChunkSize, groundChunkHeight) {
    context.db = new sqliteDatabase();

    dbAlreadySetup = fs.existsSync(dbFile);
    await context.db.Open(dbFile);
    if (!dbAlreadySetup) {
        await CreateGroundTable(context);
        await CreateModificationsTable(context);
        await CreateEntitiesTable(context);
        await CreateTimeTable(context);

        terrainGenerator = new BasicTerrainGenerator(groundSeed, groundChunkSize, 1, groundChunkHeight, 0.025);
        chunkHeights = terrainGenerator.GetChunkHeights(0, 0);
        for (let i = 0; i < groundChunkSize; i++) {
            for (let j = 0; j < groundChunkSize; j++) {
                SetGround(context, i, j, chunkHeights[i][j], 0);
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

StartServer(this, 25252);