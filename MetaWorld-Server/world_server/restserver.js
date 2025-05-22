// argv[2]: REST service port.
// argv[3]: World directory.
// argv[4]: Main DB file.

const worldrestserver = require("./worldrestserver");
const fs = require("fs");
const sqliteDatabase = require("../sqlite/sqliteDatabase");
const Time = require("./time");
const path = require("path");
const { argv } = require("process");
const vosapp = require("../VOS/vosapp");
const { v4: uuidv4 } = require('uuid');

const mwASCIIArt =
"                                                                                    \n" +
",--.   ,--.,------.,--------. ,---.  ,--.   ,--. ,-----. ,------. ,--.   ,------.   \n" +
"|   `.'   ||  .---''--.  .--'/  O  \\ |  |   |  |'  .-.  '|  .--. '|  |   |  .-.  \\  \n" +
"|  |'.'|  ||  `--,    |  |  |  .-.  ||  |.'.|  ||  | |  ||  '--'.'|  |   |  |  \\  : \n" +
"|  |   |  ||  `---.   |  |  |  | |  ||   ,'.   |'  '-'  '|  |\\  \\ |  '--.|  '--'  / \n" +
"`--'   `--'`------'   `--'  `--' `--''--'   '--' `-----' `--' '--'`-----'`-------'  \n" +
"                                                                                    \n";

const serverVersion = "v3.0.0-rc0";

const defaultEntityOwner = "";
const defaultRegionOwner = "";
const defaultOwnerRead = 1;
const defaultOwnerWrite = 1;
const defaultOwnerUse = 1;
const defaultOwnerTake = 1;
const defaultOtherRead = 1;
const defaultOtherWrite = 0;
const defaultOtherUse = 0;
const defaultOtherTake = 0;

this.vosApp = new vosapp();

this.worldDirectory = argv[3];

this.mainDBFile = argv[4];

this.worldInfoFile = "../biomes.json";

/**
 * @function Log Log a message.
 * @param {*} text Text to log.
 */
Log = function(text) {
    console.log(text);
    if (process.platform == "win32") {
        fs.appendFile(".\\vos.log", text + "\n", function(err){
            
        });
    } else {
        fs.appendFile("./vos.log", text + "\n", function(err){

        });
    }
}

function StartServer(context, port) {
    Log(mwASCIIArt);
    Log("METAWORLD World Server " + serverVersion + "\n");

    Log("Starting Server...");
    
    Log("Getting Biome Information...");

    GetBiomeInfo(context);

    Log("Got Biome Information. Opening World Database: " + path.join(context.worldDirectory, context.mainDBFile) + ".");

    OpenTopLevelWorldDatabase(context, path.join(context.worldDirectory, context.mainDBFile));

    Log("World Database opened. Setting up World Region DB Map...");

    InitializeRegionDBMap(context);

    Log("World Region DB Map set up. Setting up World Region Synchronizer Map...");

    InitializeRegionSynchronizerMap(context);

    Log("World Region Synchronizer Map set up. Setting up User Token Map...");

    InitializeUserTokenMap(context);

    Log("User Token Map set up. Starting Time Service...");

    time = new Time(context, GetTime, SetTime, 86400, 5);

    Log("Time Service started. Starting REST Service...");

    worldRS = new worldrestserver(port, context, IsUserAuthentic, IsUserPermittedToReadRegion,
        IsUserPermittedToWriteRegion, IsUserPermittedToUseRegion, IsUserPermittedToTakeRegion,
        IsUserPermittedToReadEntity, IsUserPermittedToWriteEntity, IsUserPermittedToUseEntity,
        IsUserPermittedToTakeEntity, SetGround, ModifyTerrain, GetGroundInRange, GetAllEntities,
        PositionEntity, DeleteEntity, GetTime, GetRegionInfo, GetBiomeList);

    Log("REST Service started.");
    
    Log("Server Started.");
}

GetRegionInfo = async function (context, regionX, regionY, callback) {
    context.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
        if (rows == null || rows.length == 0) {
            callback?.({
                "region_x": regionX,
                "region_y": regionY,
                "biome_id": -1,
                "biome_state": -1,
                "synchronizer_id": "",
                "synchronizer_tag": ""
            });
        }
        else {
            GetRegionSynchronizer(context, regionX, regionY, (regionSynchronizer) => {
                if (regionSynchronizer == null) {
                    callback?.({
                        "region_x": regionX,
                        "region_y": regionY,
                        "biome_id": rows[0]["biomeid"],
                        "biome_state": rows[0]["state"],
                        "synchronizer_id": "",
                        "synchronizer_tag": ""
                    });
                }
                else {
                    GetBiomeList(context, (biomeList) => {
                        if (biomeList == null) {
                            callback?.({
                                "region_x": regionX,
                                "region_y": regionY,
                                "biome_id": rows[0]["biomeid"],
                                "biome_state": rows[0]["state"],
                                "synchronizer_id": regionSynchronizer,
                                "synchronizer_tag": `region.${regionX}.${regionY}`,
                                "generation_layers": ""
                            });
                        }
                        else {
                            callback?.({
                                "region_x": regionX,
                                "region_y": regionY,
                                "biome_id": rows[0]["biomeid"],
                                "biome_state": rows[0]["state"],
                                "synchronizer_id": regionSynchronizer,
                                "synchronizer_tag": `region.${regionX}.${regionY}`,
                                "generation_layers": biomeList[rows[0]["biomeid"]]["terrain-layers"]
                            });
                        }
                    });
                }
            });
        }
    });
}

GetBiomeList = async function (context, callback) {
    callback?.(context.biomeInfo);
}

SetGround = async function(context, regionX, regionY, x, y, height, id) {
    GetRegionDB(context, regionX, regionY, (regionDB) => {
        if (regionDB == null) {
        
        }
        else {
            regionDB.GetRows("ground", { "xindex": x, "yindex": y }, (heights) => {
                if (heights == null || heights.length == 0) {
                    regionDB.InsertIntoTable("ground",
                        { "xindex": x, "yindex": y, "height": height, "layerid": id }, false);
                }
                else {
                    regionDB.UpdateInTable("ground",
                        { "layerid": id }, { "xindex": x, "yindex": y, "height": height });
                }
            });
        }
    });
}

GetGroundInRange = async function(context, regionX, regionY, minX, maxX, minY, maxY, callback) {
    context.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
        if (rows == null || rows.length == 0) {
            GetRegionDB(context, regionX, regionY, (regionDB) => {
                if (regionDB == null) {
                    callback?.({
                        "region_x": regionX,
                        "region_y": regionY,
                        "biome_id": -1,
                        "biome_state": -1,
                        "base_ground": {},
                        "ground_mods": {}
                    });
                }
                else {
                    regionDB.GetRowsWithWhereStatement("ground", "height",
                        `xindex >= ${minX} AND xindex <= ${maxX} AND yindex >= ${minY} AND yindex <= ${maxY}`,
                        "xindex, yindex",
                        (heights) => {
                        if (heights == null) {
                            callback?.({
                                "region_x": regionX,
                                "region_y": regionY,
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
                        regionDB.GetRowsWithWhereStatement("ground", "layerid",
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
                
                                regionDB.GetAllRows("ground_mods", (groundMods) => {
                                    result = {
                                        "region_x": regionX,
                                        "region_y": regionY,
                                        "biome_id": -1,
                                        "biome_state": -1,
                                        "base_ground": ground,
                                        "ground_mods": groundMods
                                    };
                                    callback?.(result);
                                });
                            }
                        );
                    });
                }
            });
        }
        else {
            GetRegionDB(context, regionX, regionY, (regionDB) => {
                if (regionDB == null) {
                    callback?.({
                        "region_x": regionX,
                        "region_y": regionY,
                        "biome_id": rows[0]["biomeid"],
                        "biome_state": rows[0]["state"],
                        "base_ground": {},
                        "ground_mods": {}
                    });
                }
                else {
                    regionDB.GetRowsWithWhereStatement("ground", "height",
                        `xindex >= ${minX} AND xindex <= ${maxX} AND yindex >= ${minY} AND yindex <= ${maxY}`,
                        "xindex, yindex",
                        (heights) => {
                        if (heights == null) {
                            callback?.({
                                "region_x": regionX,
                                "region_y": regionY,
                                "biome_id": rows[0]["biomeid"],
                                "biome_state": rows[0]["state"],
                                "base_ground": {},
                                "ground_mods": {}
                            });
                            return;
                        }
                
                        heightsResult = [];
                        //layersResult = [];
                        numRows = maxY - minY;
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
                        regionDB.GetRowsWithWhereStatement("ground", "layerid",
                            `xindex >= ${minX} AND xindex <= ${maxX} AND yindex >= ${minY} AND yindex <= ${maxY}`,
                            "xindex, yindex",
                            (layers) => {
                                rowNum = 0;
                                rowIndex = 0;
                
                                layerMasks = [];
                                layerMasks[0] = Array(itemsPerRow).fill(undefined).map(
                                    () => Array(numRows).fill(0));
                                layerMasks[1] = Array(itemsPerRow).fill(undefined).map(
                                    () => Array(numRows).fill(0));
                                layerMasks[2] = Array(itemsPerRow).fill(undefined).map(
                                    () => Array(numRows).fill(0));
                                layerMasks[3] = Array(itemsPerRow).fill(undefined).map(
                                    () => Array(numRows).fill(0));
                                layerMasks[4] = Array(itemsPerRow).fill(undefined).map(
                                    () => Array(numRows).fill(0));
                                layerMasks[5] = Array(itemsPerRow).fill(undefined).map(
                                    () => Array(numRows).fill(0));
                                layerMasks[6] = Array(itemsPerRow).fill(undefined).map(
                                    () => Array(numRows).fill(0));
                                layerMasks[7] = Array(itemsPerRow).fill(undefined).map(
                                    () => Array(numRows).fill(0));
                                for (var layer in layers) {
                                    if (rowIndex >= itemsPerRow) {
                                        rowNum++;
                                        rowIndex = 0;
                                    }
                                    layerMasks[layers[layer]["layerid"]][rowNum][rowIndex] = 1;
                                    rowIndex++;
                                }

                                /*layersResult[0] = [];
                                for (var layer in layers) {
                                    if (rowIndex >= itemsPerRow) {
                                        rowNum++;
                                        layersResult[rowNum] = [];
                                        rowIndex = 0;
                                    }
                                    layersResult[rowNum].push(layers[layer]["layerid"]);
                                    rowIndex++;
                                }
                
                                layersResult = layersResult[0].map((_, colIndex) => layersResult.map(row => row[colIndex]));*/
                                layersResult = layerMasks;
                                ground = {
                                    "heights": heightsResult,
                                    "layers": layersResult
                                };
                
                                regionDB.GetAllRows("ground_mods", (groundMods) => {
                                    result = {
                                        "region_x": regionX,
                                        "region_y": regionY,
                                        "biome_id": rows[0]["biomeid"],
                                        "biome_state": rows[0]["state"],
                                        "base_ground": ground,
                                        "ground_mods": groundMods
                                    };
                                    callback?.(result);
                                });
                            }
                        );
                    });
                }
            });
        }
    });
}

ModifyTerrain = async function(context, regionX, regionY, x, y, z, operation, brushType, layer, brushSize) {
    GetRegionDB(context, regionX, regionY, (regionDB) => {
        if (regionDB == null) {
        
        }
        else {
            regionDB.GetRows("ground_mods", { "x": x, "y": y, "z": z }, (heights) => {
                if (heights == null || heights.length == 0) {
                    regionDB.InsertIntoTable("ground_mods",
                        { "x": x, "y": y, "z": z, "operation": "'" + operation + "'", "brushtype": "'" + brushType + "'",
                        "layer": layer, "brushsize": brushSize }, false);
                }
                else {
                    regionDB.UpdateInTable("ground_mods",
                        { "operation": operation, "brushtype": brushType, "layer": layer, "brushsize": brushSize },
                        { "x": x, "y": y, "z": z });
                }
            });
        }
    });
}

PositionEntity = async function(context, regionX, regionY, entityID, variantID, instanceID, xPos, yPos, zPos, xRot, yRot, zRot, wRot) {
    GetRegionDB(context, regionX, regionY, (regionDB) => {
        if (regionDB == null) {
        
        }
        else {
            regionDB.GetRows("entities", { "instanceid": instanceID }, (entities) => {
                if (entities == null || entities.length == 0) {
                    regionDB.InsertIntoTable("entities",
                        { "entityid": entityID, "variantid": variantID, "instanceid": instanceID,
                            "xposition": xPos, "yposition": yPos, "zposition": zPos,
                            "xrotation": xRot, "yrotation": yRot, "zrotation": zRot, "wrotation": wRot,
                            "owner": defaultEntityOwner,
                            "ownerread": defaultOwnerRead, "ownerwrite": defaultOwnerWrite, "owneruse": defaultOwnerUse, "ownertake": defaultOwnerTake,
                            "otherread": defaultOtherRead, "otherwrite": defaultOtherWrite, "otheruse": defaultOtherUse, "othertake": defaultOtherTake }, false);
                }
                else {
                    regionDB.UpdateInTable("entities",
                        { "xposition": xPos, "yposition": yPos, "zposition": zPos,
                            "xrotation": xRot, "yrotation": yRot, "zrotation": zRot, "wrotation": wRot },
                        { "entityid": entityID, "variantid": variantID, "instanceid": instanceID });
                }
            });
        }
    });
}

DeleteEntity = async function(context, regionX, regionY, instanceID) {
    GetRegionDB(context, regionX, regionY, (regionDB) => {
        if (regionDB == null) {
        
        }
        else {
            regionDB.GetRows("entities", { "instanceid": "'" + instanceID + "'" }, (entities) => {
                if (entities != null && entities.length > 0) {
                    regionDB.DeleteFromTable("entities", { "instanceid": "'" + instanceID + "'" });
                }
            });
        }
    });
}

GetAllEntities = async function(context, regionX, regionY, callback) {
    GetRegionDB(context, regionX, regionY, (regionDB) => {
        if (regionDB == null) {
            callback?.(null);
        }
        else {
            regionDB.GetAllRows("entities", (entities) => {
                result = {
                    "region_x": regionX,
                    "region_y": regionY,
                    "entities": entities
                };
                callback?.(result);
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
        callback?.(result);
    });
}

IsUserAuthentic = async function(context, userID, userToken, callback) {
    GetUserToken(context, userID, (correctUserToken) => {
        if (correctUserToken == null) {
            callback?.(false);
        }
        else {
            if (correctUserToken == userToken && userToken != null) {
                callback?.(true);
            }
            else {
                callback?.(false);
            }
        }
    });
}

IsUserPermittedToReadRegion = async function(context, regionX, regionY, userID, callback) {
    context.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
        if (rows == null || rows.length == 0) {
            callback?.(false);
        }
        else {
            var regionOwner = rows[0]["owner"];
            if (regionOwner == null) {
                regionOwner = defaultRegionOwner;
            }

            var permittedToRead = false;

            if (rows[0]["ownerread"] == null) {
                rows[0]["ownerread"] = defaultOwnerRead;
            }

            if (rows[0]["otherread"] == null) {
                rows[0]["otherread"] = defaultOtherRead;
            }

            if (regionOwner == userID) {
                if (rows[0]["ownerread"] == 1) {
                    permittedToRead = true;
                }
            }
            else {
                if (rows[0]["otherread"] == 1) {
                    permittedToRead = true;
                }
            }

            callback?.(permittedToRead);
        }
    });
}

IsUserPermittedToWriteRegion = async function(context, regionX, regionY, userID, callback) {
    context.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
        if (rows == null || rows.length == 0) {
            callback?.(false);
        }
        else {
            var regionOwner = rows[0]["owner"];
            if (regionOwner == null) {
                regionOwner = defaultRegionOwner;
            }

            var permittedToWrite = false;

            if (rows[0]["ownerread"] == null) {
                rows[0]["ownerread"] = defaultOwnerRead;
            }

            if (rows[0]["otherread"] == null) {
                rows[0]["otherread"] = defaultOtherRead;
            }

            if (regionOwner == userID) {
                if (rows[0]["ownerwrite"] == 1) {
                    permittedToWrite = true;
                }
            }
            else {
                if (rows[0]["otherwrite"] == 1) {
                    permittedToWrite = true;
                }
            }

            callback?.(permittedToWrite);
        }
    });
}

IsUserPermittedToUseRegion = async function(context, regionX, regionY, userID, callback) {
    context.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
        if (rows == null || rows.length == 0) {
            callback?.(false);
        }
        else {
            var regionOwner = rows[0]["owner"];
            if (regionOwner == null) {
                regionOwner = defaultRegionOwner;
            }

            var permittedToUse = false;

            if (rows[0]["ownerread"] == null) {
                rows[0]["ownerread"] = defaultOwnerRead;
            }

            if (rows[0]["otherread"] == null) {
                rows[0]["otherread"] = defaultOtherRead;
            }

            if (regionOwner == userID) {
                if (rows[0]["owneruse"] == 1) {
                    permittedToUse = true;
                }
            }
            else {
                if (rows[0]["otheruse"] == 1) {
                    permittedToUse = true;
                }
            }

            callback?.(permittedToUse);
        }
    });
}

IsUserPermittedToTakeRegion = async function(context, regionX, regionY, userID, callback) {
    context.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
        if (rows == null || rows.length == 0) {
            callback?.(false);
        }
        else {
            var regionOwner = rows[0]["owner"];
            if (regionOwner == null) {
                regionOwner = defaultRegionOwner;
            }

            var permittedToTake = false;

            if (rows[0]["ownerread"] == null) {
                rows[0]["ownerread"] = defaultOwnerRead;
            }

            if (rows[0]["otherread"] == null) {
                rows[0]["otherread"] = defaultOtherRead;
            }

            if (regionOwner == userID) {
                if (rows[0]["ownertake"] == 1) {
                    permittedToTake = true;
                }
            }
            else {
                if (rows[0]["othertake"] == 1) {
                    permittedToTake = true;
                }
            }

            callback?.(permittedToTake);
        }
    });
}

IsUserPermittedToReadEntity = async function(context, regionX, regionY, instanceID, userID, callback) {
    GetRegionDB(context, regionX, regionY, (regionDB) => {
        if (regionDB == null) {
            callback?.(false);
        }
        else {
            regionDB.GetRows("entities", { "instanceid": instanceID }, (rows) => {
                if (rows == null || rows.length == 0) {
                    callback?.(false);
                }
                else {
                    var entityOwner = rows[0]["owner"];
                    if (entityOwner == null) {
                        entityOwner = defaultRegionOwner;
                    }
        
                    var permittedToRead = false;

                    if (rows[0]["ownerread"] == null) {
                        rows[0]["ownerread"] = defaultOwnerRead;
                    }
        
                    if (rows[0]["otherread"] == null) {
                        rows[0]["otherread"] = defaultOtherRead;
                    }

                    if (entityOwner == userID) {
                        if (rows[0]["ownerread"] == 1) {
                            permittedToRead = true;
                        }
                    }
                    else {
                        if (rows[0]["otherread"] == 1) {
                            permittedToRead = true;
                        }
                    }
        
                    callback?.(permittedToRead);
                }
            });
        }
    });
}

IsUserPermittedToWriteEntity = async function(context, regionX, regionY, instanceID, userID, callback) {
    GetRegionDB(context, regionX, regionY, (regionDB) => {
        if (regionDB == null) {
            callback?.(false);
        }
        else {
            regionDB.GetRows("entities", { "instanceid": instanceID }, (rows) => {
                if (rows == null || rows.length == 0) {
                    callback?.(false);
                }
                else {
                    var entityOwner = rows[0]["owner"];
                    if (entityOwner == null) {
                        entityOwner = defaultRegionOwner;
                    }
        
                    var permittedToWrite = false;

                    if (rows[0]["ownerread"] == null) {
                        rows[0]["ownerread"] = defaultOwnerRead;
                    }
        
                    if (rows[0]["otherread"] == null) {
                        rows[0]["otherread"] = defaultOtherRead;
                    }

                    if (entityOwner == userID) {
                        if (rows[0]["ownerwrite"] == 1) {
                            permittedToWrite = true;
                        }
                    }
                    else {
                        if (rows[0]["otherwrite"] == 1) {
                            permittedToWrite = true;
                        }
                    }
        
                    callback?.(permittedToWrite);
                }
            });
        }
    });
}

IsUserPermittedToUseEntity = async function(context, regionX, regionY, instanceID, userID, callback) {
    GetRegionDB(context, regionX, regionY, (regionDB) => {
        if (regionDB == null) {
            callback?.(false);
        }
        else {
            regionDB.GetRows("entities", { "instanceid": instanceID }, (rows) => {
                if (rows == null || rows.length == 0) {
                    callback?.(false);
                }
                else {
                    var entityOwner = rows[0]["owner"];
                    if (entityOwner == null) {
                        entityOwner = defaultRegionOwner;
                    }
        
                    var permittedToUse = false;

                    if (rows[0]["ownerread"] == null) {
                        rows[0]["ownerread"] = defaultOwnerRead;
                    }
        
                    if (rows[0]["otherread"] == null) {
                        rows[0]["otherread"] = defaultOtherRead;
                    }

                    if (entityOwner == userID) {
                        if (rows[0]["owneruse"] == 1) {
                            permittedToUse = true;
                        }
                    }
                    else {
                        if (rows[0]["otheruse"] == 1) {
                            permittedToUse = true;
                        }
                    }
        
                    callback?.(permittedToUse);
                }
            });
        }
    });
}

IsUserPermittedToTakeEntity = async function(context, regionX, regionY, instanceID, userID, callback) {
    GetRegionDB(context, regionX, regionY, (regionDB) => {
        if (regionDB == null) {
            callback?.(false);
        }
        else {
            regionDB.GetRows("entities", { "instanceid": instanceID }, (rows) => {
                if (rows == null || rows.length == 0) {
                    callback?.(false);
                }
                else {
                    var entityOwner = rows[0]["owner"];
                    if (entityOwner == null) {
                        entityOwner = defaultRegionOwner;
                    }
        
                    var permittedToTake = false;

                    if (rows[0]["ownerread"] == null) {
                        rows[0]["ownerread"] = defaultOwnerRead;
                    }
        
                    if (rows[0]["otherread"] == null) {
                        rows[0]["otherread"] = defaultOtherRead;
                    }
                    
                    if (entityOwner == userID) {
                        if (rows[0]["ownertake"] == 1) {
                            permittedToTake = true;
                        }
                    }
                    else {
                        if (rows[0]["othertake"] == 1) {
                            permittedToTake = true;
                        }
                    }
        
                    callback?.(permittedToTake);
                }
            });
        }
    });
}

OpenTopLevelWorldDatabase = async function(context, dbFile) {
    context.worldDB = new sqliteDatabase();

    if (fs.existsSync(dbFile)) {
        await context.worldDB.Open(dbFile);
    }
}

OpenRegionDatabase = async function(dbFile, callback) {
    var db = new sqliteDatabase();

    if (fs.existsSync(dbFile)) {
        await db.Open(dbFile);
        callback?.(db);
    }
    else {
        callback?.(null);
    }
}

AddRegionSynchronizer = async function(context, regionX, regionY) {
    var regionMapID = GetRegionMapID(regionX, regionY);
    var newID = uuidv4();
    context.regionSynchronizerMap.set(regionMapID, newID);
    context.vosApp.PublishOnVOS("vos/app/sync/createsession", `{
        "id":"${newID}",
        "tag":"region.${regionX}.${regionY}"
    }`);
}

RegionDatabaseExists = function(context, regionX, regionY) {
    var regionDBPath = GetRegionDBPath(context, regionX, regionY);
    return fs.existsSync(regionDBPath);
}

InitializeRegionDBMap = function(context) {
    context.regionDBMap = new Map();
}

InitializeRegionSynchronizerMap = function(context) {
    context.regionSynchronizerMap = new Map();
}

InitializeUserTokenMap = function(context) {
    context.userTokenMap = new Map();
}

GetRegionDB = function(context, regionX, regionY, callback) {
    var regionMapID = GetRegionMapID(regionX, regionY);
    if (context.regionDBMap.has(regionMapID)) {
        callback?.(context.regionDBMap.get(regionMapID));
    }
    else {
        Log("Region x=" + regionX + ", y=" + regionY + " not in region DB map. Attempting to add it...");
        if (RegionDatabaseExists(context, regionX, regionY)) {
            // Open and add to map.
            OpenRegionDatabase(GetRegionDBPath(context, regionX, regionY), (newDB) => {
                if (newDB != null) {
                    context.regionDBMap.set(regionMapID, newDB);
                    Log("Adding synchronizer for region x=" + regionX + ", y=" + regionY + "...");
                    AddRegionSynchronizer(context, regionX, regionY);
                    callback?.(newDB);
                }
                else {
                    console.error("GetRegionDB(): Region identified but not loaded.");
                    callback?.(null);
                }
            });
        }
        else {
            Log("Region x=" + regionX + ", y=" + regionY + " does not exist. Requesting creation...");
            // TODO create region.
            callback?.(null);
        }
    }
}

GetRegionSynchronizer = function(context, regionX, regionY, callback) {
    var regionMapID = GetRegionMapID(regionX, regionY);
    if (context.regionSynchronizerMap.has(regionMapID)) {
        callback?.(context.regionSynchronizerMap.get(regionMapID));
    }
    else {
        Log("Region x=" + regionX + ", y=" + regionY + " not in region synchronizer map.");
        callback?.(null);
    }
}

GetUserToken = function(context, userID, callback) {
    if (context.userTokenMap.has(userID)) {
        callback?.(context.userTokenMap.get(userID));
    }
    else {
        Log("User ID " + userID + " not in user token map.");
        callback?.(null);
    }
}

SetUserToken = function(context, userID, userToken) {
    context.userTokenMap.set(userID, userToken);
}

GetRegionDBPath = function(context, regionX, regionY) {
    return path.join(context.worldDirectory, "world-regions", "region-" + regionX + "." + regionY + ".db");
}

GetRegionMapID = function(regionX, regionY) {
    return regionX + "." + regionY;
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
                "terrain-materials": jsonFileData["biomes"][biome]["terrain-materials"],
                "terrain-layers": jsonFileData["biomes"][biome]["terrain-layers"]
            };
        }
    }
}

function ConnectToVOS(context) {
    context.vosApp.ConnectToVOS("restserver", () => {
        context.vosApp.SubscribeToVOS("restserver", "vos/app/rest/#", (topic, msg) => {
            if (topic == "vos/app/rest/none") {
                
            }
            if (topic == "vos/app/rest/usertoken") {
                if (msg == null) {
                    context.vosApp.Log("No content received for user token message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["user_id"] == null) {
                    context.vosApp.Log("Missing required field user_id in user token message.");
                    return;
                }

                if (deserialized["token"] == null) {
                    context.vosApp.Log("Missing required field token in user token message.");
                    return;
                }

                SetUserToken(context, deserialized["user_id"], deserialized["token"]);
            }
            else {
                context.vosApp.Log("Invalid VOS message topic: " + topic);
            }
        });
    });
}

ConnectToVOS(this);
StartServer(this, argv[2]);