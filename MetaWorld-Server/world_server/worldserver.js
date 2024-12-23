const worldrestserver = require("./worldrestserver");
const fs = require("fs");
const sqliteDatabase = require("../sqlite/sqliteDatabase");
const Time = require("./time");
const path = require("path");

const mwASCIIArt =
"                                                                                    \n" +
",--.   ,--.,------.,--------. ,---.  ,--.   ,--. ,-----. ,------. ,--.   ,------.   \n" +
"|   `.'   ||  .---''--.  .--'/  O  \\ |  |   |  |'  .-.  '|  .--. '|  |   |  .-.  \\  \n" +
"|  |'.'|  ||  `--,    |  |  |  .-.  ||  |.'.|  ||  | |  ||  '--'.'|  |   |  |  \\  : \n" +
"|  |   |  ||  `---.   |  |  |  | |  ||   ,'.   |'  '-'  '|  |\\  \\ |  '--.|  '--'  / \n" +
"`--'   `--'`------'   `--'  `--' `--''--'   '--' `-----' `--' '--'`-----'`-------'  \n" +
"                                                                                    \n";

const serverVersion = "v2.0.0-rc0";

this.worldDirectory = "../world"

this.mainDBFile = "world.db";

this.worldInfoFile = "../biomes.json";

function StartServer(context, port) {
    console.log(mwASCIIArt);
    console.log("METAWORLD World Server " + serverVersion + "\n");

    console.log("Starting Server...");
    
    console.log("Getting Biome Information...");

    GetBiomeInfo(context);

    console.log("Got Biome Information. Opening World Database: " + path.join(context.worldDirectory, context.mainDBFile) + ".");

    OpenTopLevelWorldDatabase(context, path.join(context.worldDirectory, context.mainDBFile));

    console.log("World Database opened. Setting up World Chunk Map...");

    InitializeChunkMap(context);

    console.log("Starting Time Service...");

    time = new Time(context, GetTime, SetTime, 86400, 5);

    console.log("Time Service started. Starting REST Service...");

    worldRS = new worldrestserver(port, context, SetGround, ModifyTerrain, GetGroundInRange,
        GetAllEntities, PositionEntity, DeleteEntity, GetTime, GetChunkInfo, GetBiomeList);

    console.log("REST Service started.");
    
    console.log("Server Started.");
}

GetChunkInfo = async function (context, chunkX, chunkY, callback) {
    context.worldDB.GetRows("biomes", { "xindex": chunkX, "yindex": chunkY }, (rows) => {
        if (rows == null || rows.length == 0) {
            callback({
                "chunk_x": chunkX,
                "chunk_y": chunkY,
                "biome_id": -1,
                "biome_state": -1
            });
        }
        else {
            callback({
                "chunk_x": chunkX,
                "chunk_y": chunkY,
                "biome_id": rows[0]["biomeid"],
                "biome_state": rows[0]["state"]
            });
        }
    });
}

GetBiomeList = async function (context, callback) {
    callback(context.biomeInfo);
}

SetGround = async function(context, chunkX, chunkY, x, y, height, id) {
    GetChunkDB(context, chunkX, chunkY, (chunkDB) => {
        if (chunkDB == null) {
        
        }
        else {
            chunkDB.GetRows("ground", { "xindex": x, "yindex": y }, (heights) => {
                if (heights == null || heights.length == 0) {
                    chunkDB.InsertIntoTable("ground",
                        { "xindex": x, "yindex": y, "height": height, "layerid": id }, false);
                }
                else {
                    chunkDB.UpdateInTable("ground",
                        { "layerid": id }, { "xindex": x, "yindex": y, "height": height });
                }
            });
        }
    });
}

GetGroundInRange = async function(context, chunkX, chunkY, minX, maxX, minY, maxY, callback) {
    context.worldDB.GetRows("biomes", { "xindex": chunkX, "yindex": chunkY }, (rows) => {
        if (rows == null || rows.length == 0) {
            GetChunkDB(context, chunkX, chunkY, (chunkDB) => {
                if (chunkDB == null) {
                    callback({
                        "chunk_x": chunkX,
                        "chunk_y": chunkY,
                        "biome_id": -1,
                        "biome_state": -1,
                        "base_ground": {},
                        "ground_mods": {}
                    });
                }
                else {
                    chunkDB.GetRowsWithWhereStatement("ground", "height",
                        `xindex >= ${minX} AND xindex <= ${maxX} AND yindex >= ${minY} AND yindex <= ${maxY}`,
                        "xindex, yindex",
                        (heights) => {
                        if (heights == null) {
                            callback({
                                "chunk_x": chunkX,
                                "chunk_y": chunkY,
                                "biome_id": -1,
                                "biome_state": -1,
                                "base_ground": {},
                                "ground_mods": {}
                            });
                            return;
                        }
                
                        heightsResult = [];
                        layersResult = [];
                        numRows = maxY - minY + 1;
                        itemsPerRow = heights.length / numRows;
                
                        rowNum = 0;
                        rowIndex = 0;
                
                        heightsResult[0] = [];
                        for (var height in heights) {
                            if (rowIndex >= itemsPerRow) {
                                rowNum++;
                                heightsResult[rowNum] = [];
                                rowIndex = 0;
                            }
                            heightsResult[rowNum].push(heights[height]["height"]);
                            rowIndex++;
                        }
                        chunkDB.GetRowsWithWhereStatement("ground", "layerid",
                            `xindex >= ${minX} AND xindex <= ${maxX} AND yindex >= ${minY} AND yindex <= ${maxY}`,
                            "xindex, yindex",
                            (layers) => {
                                rowNum = 0;
                                rowIndex = 0;
                
                                layersResult[0] = [];
                                for (var layer in layers) {
                                    if (rowIndex >= itemsPerRow) {
                                        rowNum++;
                                        layersResult[rowNum] = [];
                                        rowIndex = 0;
                                    }
                                    layersResult[rowNum].push(layers[layer]["layerid"]);
                                    rowIndex++;
                                }
                
                                layersResult = layersResult[0].map((_, colIndex) => layersResult.map(row => row[colIndex]));
                                ground = {
                                    "heights": heightsResult,
                                    "layers": layersResult
                                };
                
                                chunkDB.GetAllRows("ground_mods", (groundMods) => {
                                    result = {
                                        "chunk_x": chunkX,
                                        "chunk_y": chunkY,
                                        "biome_id": -1,
                                        "biome_state": -1,
                                        "base_ground": ground,
                                        "ground_mods": groundMods
                                    };
                                    callback(result);
                                });
                            }
                        );
                    });
                }
            });
        }
        else {
            GetChunkDB(context, chunkX, chunkY, (chunkDB) => {
                if (chunkDB == null) {
                    callback({
                        "chunk_x": chunkX,
                        "chunk_y": chunkY,
                        "biome_id": rows[0]["biomeid"],
                        "biome_state": rows[0]["state"],
                        "base_ground": {},
                        "ground_mods": {}
                    });
                }
                else {
                    chunkDB.GetRowsWithWhereStatement("ground", "height",
                        `xindex >= ${minX} AND xindex <= ${maxX} AND yindex >= ${minY} AND yindex <= ${maxY}`,
                        "xindex, yindex",
                        (heights) => {
                        if (heights == null) {
                            callback({
                                "chunk_x": chunkX,
                                "chunk_y": chunkY,
                                "biome_id": rows[0]["biomeid"],
                                "biome_state": rows[0]["state"],
                                "base_ground": {},
                                "ground_mods": {}
                            });
                            return;
                        }
                
                        heightsResult = [];
                        layersResult = [];
                        numRows = maxY - minY + 1;
                        itemsPerRow = heights.length / numRows;
                
                        rowNum = 0;
                        rowIndex = 0;
                
                        heightsResult[0] = [];
                        for (var height in heights) {
                            if (rowIndex >= itemsPerRow) {
                                rowNum++;
                                heightsResult[rowNum] = [];
                                rowIndex = 0;
                            }
                            heightsResult[rowNum].push(heights[height]["height"]);
                            rowIndex++;
                        }
                        chunkDB.GetRowsWithWhereStatement("ground", "layerid",
                            `xindex >= ${minX} AND xindex <= ${maxX} AND yindex >= ${minY} AND yindex <= ${maxY}`,
                            "xindex, yindex",
                            (layers) => {
                                rowNum = 0;
                                rowIndex = 0;
                
                                layersResult[0] = [];
                                for (var layer in layers) {
                                    if (rowIndex >= itemsPerRow) {
                                        rowNum++;
                                        layersResult[rowNum] = [];
                                        rowIndex = 0;
                                    }
                                    layersResult[rowNum].push(layers[layer]["layerid"]);
                                    rowIndex++;
                                }
                
                                layersResult = layersResult[0].map((_, colIndex) => layersResult.map(row => row[colIndex]));
                                ground = {
                                    "heights": heightsResult,
                                    "layers": layersResult
                                };
                
                                chunkDB.GetAllRows("ground_mods", (groundMods) => {
                                    result = {
                                        "chunk_x": chunkX,
                                        "chunk_y": chunkY,
                                        "biome_id": rows[0]["biomeid"],
                                        "biome_state": rows[0]["state"],
                                        "base_ground": ground,
                                        "ground_mods": groundMods
                                    };
                                    callback(result);
                                });
                            }
                        );
                    });
                }
            });
        }
    });
}

ModifyTerrain = async function(context, chunkX, chunkY, x, y, z, operation, brushType, layer, brushSize) {
    GetChunkDB(context, chunkX, chunkY, (chunkDB) => {
        if (chunkDB == null) {
        
        }
        else {
            chunkDB.GetRows("ground_mods", { "x": x, "y": y, "z": z }, (heights) => {
                if (heights == null || heights.length == 0) {
                    chunkDB.InsertIntoTable("ground_mods",
                        { "x": x, "y": y, "z": z, "operation": "'" + operation + "'", "brushtype": "'" + brushType + "'",
                        "layer": layer, "brushsize": brushSize }, false);
                }
                else {
                    chunkDB.UpdateInTable("ground_mods",
                        { "operation": operation, "brushtype": brushType, "layer": layer, "brushsize": brushSize },
                        { "x": x, "y": y, "z": z });
                }
            });
        }
    });
}

PositionEntity = async function(context, chunkX, chunkY, entityID, variantID, instanceID, xPos, yPos, zPos, xRot, yRot, zRot, wRot) {
    GetChunkDB(context, chunkX, chunkY, (chunkDB) => {
        if (chunkDB == null) {
        
        }
        else {
            chunkDB.GetRows("entities", { "instanceid": instanceID }, (entities) => {
                if (entities == null || entities.length == 0) {
                    chunkDB.InsertIntoTable("entities",
                        { "entityid": entityID, "variantid": variantID, "instanceid": instanceID,
                            "xposition": xPos, "yposition": yPos, "zposition": zPos,
                            "xrotation": xRot, "yrotation": yRot, "zrotation": zRot, "wrotation": wRot }, false);
                }
                else {
                    chunkDB.UpdateInTable("entities",
                        { "xposition": xPos, "yposition": yPos, "zposition": zPos,
                            "xrotation": xRot, "yrotation": yRot, "zrotation": zRot, "wrotation": wRot },
                        { "entityid": entityID, "variantid": variantID, "instanceid": instanceID });
                }
            });
        }
    });
}

DeleteEntity = async function(context, chunkX, chunkY, instanceID) {
    GetChunkDB(context, chunkX, chunkY, (chunkDB) => {
        if (chunkDB == null) {
        
        }
        else {
            chunkDB.GetRows("entities", { "instanceid": "'" + instanceID + "'" }, (entities) => {
                if (entities != null && entities.length > 0) {
                    chunkDB.DeleteFromTable("entities", { "instanceid": "'" + instanceID + "'" });
                }
            });
        }
    });
}

GetAllEntities = async function(context, chunkX, chunkY, callback) {
    GetChunkDB(context, chunkX, chunkY, (chunkDB) => {
        if (chunkDB == null) {
            callback(null);
        }
        else {
            chunkDB.GetAllRows("entities", (entities) => {
                result = {
                    "chunk_x": chunkX,
                    "chunk_y": chunkY,
                    "entities": entities
                };
                callback(result);
            });
        }
    });
}

SetTime = async function(context, day, seconds) {
    context.worldDB.UpdateInTable("time", { "day": day, "seconds": seconds });
}

GetTime = async function(context, callback) {
    context.worldDB.GetAllRows("time", (time) => {
        result = {
            "day": time[0].day,
            "seconds": time[0].seconds
        };
        callback(result);
    });
}

OpenTopLevelWorldDatabase = async function(context, dbFile) {
    context.worldDB = new sqliteDatabase();

    if (fs.existsSync(dbFile)) {
        await context.worldDB.Open(dbFile);
    }
}

OpenChunkDatabase = async function(dbFile, callback) {
    var db = new sqliteDatabase();

    if (fs.existsSync(dbFile)) {
        await db.Open(dbFile);
        callback(db);
    }
    else {
        callback(null);
    }
}

ChunkDatabaseExists = function(context, chunkX, chunkY) {
    var chunkDBPath = GetChunkDBPath(context, chunkX, chunkY);
    return fs.existsSync(chunkDBPath);
}

InitializeChunkMap = function(context) {
    context.chunkMap = new Map();
}

GetChunkDB = function(context, chunkX, chunkY, callback) {
    var chunkMapID = GetChunkMapID(chunkX, chunkY);
    if (context.chunkMap.has(chunkMapID)) {
        callback(context.chunkMap.get(chunkMapID));
    }
    else {
        console.log("Chunk x=" + chunkX + ", y=" + chunkY + " not in chunk map. Attempting to add it...");
        if (ChunkDatabaseExists(context, chunkX, chunkY)) {
            // Open and add to map.
            OpenChunkDatabase(GetChunkDBPath(context, chunkX, chunkY), (newDB) => {
                if (newDB != null) {
                    context.chunkMap.set(chunkMapID, newDB);
                    callback(newDB);
                }
                else {
                    console.error("GetChunkDB(): Chunk identified but not loaded.");
                    callback(null);
                }
            });
        }
        else {
            console.log("Chunk x=" + chunkX + ", y=" + chunkY + " does not exist. Requesting creation...");
            // TODO create chunk.
            callback(null);
        }
    }
}

GetChunkDBPath = function(context, chunkX, chunkY) {
    return path.join(context.worldDirectory, "world-chunks", "chunk-" + chunkX + "." + chunkY + ".db");
}

GetChunkMapID = function(chunkX, chunkY) {
    return chunkX + "." + chunkY;
}

GetBiomeInfo = function(context) {
    context.biomeInfo = {};
    var filePath = path.join(context.worldDirectory, context.worldInfoFile);
    if (fs.existsSync(filePath)) {
        rawFileData = fs.readFileSync(filePath, "utf-8");
        jsonFileData = JSON.parse(rawFileData);
        for (var biome in jsonFileData["biomes"]) {
            context.biomeInfo[biome] = {
                "name": jsonFileData["biomes"][biome]["name"],
                "temperature": jsonFileData["biomes"][biome]["temperature"],
                "moisture": jsonFileData["biomes"][biome]["moisture"],
                "terrain-materials": jsonFileData["biomes"][biome]["terrain-materials"]
            };
        }
    }
}

StartServer(this, 25252);