// Copyright (c) 2019-2025 Five Squared Interactive. All rights reserved.

// argv[2]: TCP port.
// argv[3]: WebSockets port.
// argv[4]: CA file.
// argv[5]: Private key file.
// argv[6]: Certificate file.

const fs = require("fs");
const sqliteDatabase = require("../sqlite/sqliteDatabase");
const vosapp = require("../VOS/vosapp");
const VOSSynchronizationService = require("./VOS-Synchronization/vossynchronizationservice");
const WorldCommands = require("./VOS-Synchronization/worldcommands");
const { argv } = require("process");
const path = require("path");

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

let worldDBContext = this;

function ConnectToVOS(context) {
    context.vosApp.ConnectToVOS("syncmanager", () => {
        context.vosApp.SubscribeToVOS("syncmanager", "vos/app/sync/#", (topic, msg) => {
            if (topic == "vos/app/sync/createsession") {
                if (msg == null) {
                    context.vosApp.Log("No content received for createsession message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["id"] == null) {
                    context.vosApp.Log("Missing required field id in createsession message.");
                    return;
                }

                if (deserialized["tag"] == null) {
                    context.vosApp.Log("Missing required field tag in createsession message.");
                    return;
                }
                
                context.vss.CreateSession(deserialized["id"], deserialized["tag"]);
            }
            else if (topic == "vos/app/sync/deletesession") {
                if (msg == null) {
                    context.vosApp.Log("No content received for deletesession message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["id"] == null) {
                    context.vosApp.Log("Missing required field id in deletesession message.");
                    return;
                }
                
                context.vss.DeleteSession(deserialized["id"]);
            }
            else if (topic == "vos/app/sync/getsessions") {
                if (msg == null) {
                    context.vosApp.Log("No content received for getsessions message.");
                    return;
                }

                deserialized = JSON.parse(msg);

                if (deserialized["replytopic"] == null) {
                    context.vosApp.Log("Missing required field replytopic in getsessions message.");
                    return;
                }

                context.vosApp.PublishOnVOS(deserialized["replytopic"], JSON.stringify(context.vss.GetSessions()));
            }
            else if (topic == "vos/app/sync/usertoken") {
                if (msg == null) {
                    context.vosApp.Log("No content received for usertoken message.");
                    return;
                }
                
                deserialized = JSON.parse(msg);

                if (deserialized["user_id"] == null) {
                    context.vosApp.Log("Missing required field user_id in usertoken message.");
                    return;
                }

                if (deserialized["token"] == null) {
                    context.vosApp.Log("Missing required field token in usertoken message.");
                    return;
                }

                SetUserToken(context, deserialized["user_id"], deserialized["token"]);
                context.vosApp.Log("User token message received: " + msg);
            }
            else {
                context.vosApp.Log("Invalid VOS message topic: " + topic);
            }
        });
    });
}

this.userTokenMap = new Map();

GetUserToken = function(context, userID) {
    if (context.userTokenMap.has(userID)) {
        return context.userTokenMap.get(userID);
    }
    else {
        return null;
    }
}

SetUserToken = function(context, userID, userToken) {
    context.userTokenMap.set(userID, userToken);
}

IsUserAuthentic = async function(context, userID, userToken, callback) {
    GetUserToken(context, userID, (correctUserToken) => {
        if (correctUserToken == null) {
            callback(false);
        }
        else {
            if (correctUserToken == userToken && userToken != null) {
                callback(true);
            }
            else {
                callback(false);
            }
        }
    });
}

IsUserPermittedToReadRegion = async function(context, regionX, regionY, userID) {
    return new Promise(resolve => {
        worldDBContext.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
            if (rows == null || rows.length == 0) {
                resolve(false);
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

                resolve(permittedToRead);
            }
        });
    });
}

IsUserPermittedToWriteRegion = async function(context, regionX, regionY, userID) {
    return new Promise(resolve => {
        worldDBContext.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
            if (rows == null || rows.length == 0) {
                resolve(false);
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
    
                resolve(permittedToWrite);
            }
        });
    });
}

IsUserPermittedToUseRegion = async function(context, regionX, regionY, userID) {
    return new Promise(resolve => {
        worldDBContext.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
            if (rows == null || rows.length == 0) {
                resolve(false);
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
    
                resolve(permittedToUse);
            }
        });
    });
}

IsUserPermittedToTakeRegion = async function(context, regionX, regionY, userID) {
    return new Promise(resolve => {
        worldDBContext.worldDB.GetRows("biomes", { "xindex": regionX, "yindex": regionY }, (rows) => {
            if (rows == null || rows.length == 0) {
                resolve(false);
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
    
                resolve(permittedToTake);
            }
        });
    });
}

IsUserPermittedToReadEntity = async function(context, regionX, regionY, instanceID, userID) {
    return new Promise(resolve => {
        GetRegionDB(context, regionX, regionY, (regionDB) => {
            if (regionDB == null) {
                resolve(false);
            }
            else {
                regionDB.GetRows("entities", { "instanceid": instanceID }, (rows) => {
                    if (rows == null || rows.length == 0) {
                        resolve(false);
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
            
                        resolve(permittedToRead);
                    }
                });
            }
        });
    });
}

IsUserPermittedToWriteEntity = async function(context, regionX, regionY, instanceID, userID) {
    return new Promise(resolve => {
        GetRegionDB(context, regionX, regionY, (regionDB) => {
            if (regionDB == null) {
                resolve(false);
            }
            else {
                regionDB.GetRows("entities", { "instanceid": instanceID }, (rows) => {
                    if (rows == null || rows.length == 0) {
                        resolve(false);
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
            
                        resolve(permittedToWrite);
                    }
                });
            }
        });
    });
}

IsUserPermittedToUseEntity = async function(context, regionX, regionY, instanceID, userID) {
    return new Promise(resolve => {
        GetRegionDB(context, regionX, regionY, (regionDB) => {
            if (regionDB == null) {
                resolve(false);
            }
            else {
                regionDB.GetRows("entities", { "instanceid": instanceID }, (rows) => {
                    if (rows == null || rows.length == 0) {
                        resolve(false);
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
            
                        resolve(permittedToUse);
                    }
                });
            }
        });
    });
}

IsUserPermittedToTakeEntity = async function(context, regionX, regionY, instanceID, userID) {
    return new Promise(resolve => {
        GetRegionDB(context, regionX, regionY, (regionDB) => {
            if (regionDB == null) {
                resolve(false);
            }
            else {
                regionDB.GetRows("entities", { "instanceid": instanceID }, (rows) => {
                    if (rows == null || rows.length == 0) {
                        resolve(false);
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
            
                        resolve(permittedToTake);
                    }
                });
            }
        });
    });
}

GetRegionDB = function(context, regionX, regionY, callback) {
    var regionMapID = GetRegionMapID(regionX, regionY);
    if (context.regionDBMap.has(regionMapID)) {
        callback(context.regionDBMap.get(regionMapID));
    }
    else {
        //Log("Region x=" + regionX + ", y=" + regionY + " not in region DB map. Attempting to add it...");
        if (RegionDatabaseExists(context, regionX, regionY)) {
            // Open and add to map.
            OpenRegionDatabase(GetRegionDBPath(context, regionX, regionY), (newDB) => {
                if (newDB != null) {
                    context.regionDBMap.set(regionMapID, newDB);
                    callback(newDB);
                }
                else {
                    console.error("GetRegionDB(): Region identified but not loaded.");
                    callback(null);
                }
            });
        }
        else {
            //Log("Region x=" + regionX + ", y=" + regionY + " does not exist. Requesting creation...");
            // TODO create region.
            callback(null);
        }
    }
}

OpenTopLevelWorldDatabase = async function(context, dbFile) {
    context.worldDB = new sqliteDatabase();
    worldDBContext.worldDB = context.worldDB;

    if (fs.existsSync(dbFile)) {
        await worldDBContext.worldDB.Open(dbFile);
    }
}

RegionDatabaseExists = function(context, regionX, regionY) {
    var regionDBPath = GetRegionDBPath(context, regionX, regionY);
    return fs.existsSync(regionDBPath);
}

OpenRegionDatabase = async function(dbFile, callback) {
    var db = new sqliteDatabase();

    if (fs.existsSync(dbFile)) {
        await db.Open(dbFile);
        callback(db);
    }
    else {
        callback(null);
    }
}

InitializeRegionDBMap = function(context) {
    context.regionDBMap = new Map();
}

InitializeRegionSynchronizerMap = function(context) {
    context.regionSynchronizerMap = new Map();
}

AddRegionSynchronizer = async function(context, regionX, regionY, sessionID) {
    var regionMapID = GetRegionMapID(regionX, regionY);
    context.regionSynchronizerMap[sessionID] = regionMapID;
}

GetSynchronizerRegionID = function(context, sessionID) {
    var regionMapID = null;
    if (context.regionSynchronizerMap[sessionID]) {
        regionMapID = context.regionSynchronizerMap[sessionID];
        if (regionMapID == null) {
            return null;
        }
        else {
            return GetRegionCoords(regionMapID);
        }
    }
    else {
        context.vosApp.Log("Session " + sessionID + " not in region synchronizer map.");
        return null;
    }
}

GetRegionMapID = function(regionX, regionY) {
    return regionX + "." + regionY;
}

GetRegionCoords = function(regionMapID) {
    if (regionMapID == null) {
        return null;
    }
    else {
        parts = regionMapID.split(".");
        if (parts.length == 2) {
            return {
                x: parseInt(parts[0]),
                y: parseInt(parts[1])
            };
        }
        else {
            return null;
        }
    }
}

this.vosApp = new vosapp();

this.vosApp.Log("Synchronization Manager Started");

this.vss = new VOSSynchronizationService();

// Create and inject world commands handler
this.worldCommandsHandler = new WorldCommands();
this.vss.worldCommandsHandler = this.worldCommandsHandler;

this.vss.sessionCreatedCallback = (sessionID, sessionTag) => {
    var sessionIDParts = sessionTag.split(".");
    if (sessionIDParts.length != 3) {
        return;
    }

    var x = parseInt(sessionIDParts[1]);
    var y = parseInt(sessionIDParts[2]);

    AddRegionSynchronizer(this, x, y, sessionID);
};

this.createSessionAuthCallback = async (userId, userToken) => {
    return false;
};

this.destroySessionAuthCallback = async (userId, userToken) => {
    return false;
};

this.vss.joinSessionAuthCallback = async (userId, userToken, sessionId) => {
    foundToken = GetUserToken(this, userId);
    if (foundToken == null) {
        return false;
    }
    
    if (userToken == foundToken) {
        regionID = GetSynchronizerRegionID(this, sessionId);
        if (regionID == null || regionID["x"] == null || regionID["y"] == null) {
            return false;
        }
        else {
            result = await IsUserPermittedToReadRegion(this, regionID["x"], regionID["y"], userId);
            return result;
        }
    }
    else {
        return false;
    }
};

this.exitSessionAuthCallback = async (userId, userToken, sessionId) => {
    return true;
};

this.giveHeartbeatAuthCallback = async (userId, userToken, sessionId) => {
    foundToken = GetUserToken(this, userId);
    if (foundToken == null) {
        return false;
    }

    if (userToken == foundToken) {
        regionID = GetSynchronizerRegionID(this, sessionId);
        if (regionID == null || regionID["x"] == null || regionID["y"] == null) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
};

this.getSessionStateAuthCallback = async (userId, userToken, sessionId) => {
    foundToken = GetUserToken(this, userId);
    if (foundToken == null) {
        return false;
    }
    
    if (userToken == foundToken) {
        regionID = GetSynchronizerRegionID(this, sessionId);
        if (regionID == null || regionID["x"] == null || regionID["y"] == null) {
            return false;
        }
        else {
            result = await IsUserPermittedToReadRegion(this, regionID["x"], regionID["y"], userId);
            return result;
        }
    }
    else {
        return false;
    }
};

this.createContainerEntityAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

this.createMeshEntityAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

this.createCharacterEntityAuthCallback = async (userId, userToken, sessionId) => {
    foundToken = GetUserToken(this, userId);
    if (foundToken == null) {
        return false;
    }
    
    if (userToken == foundToken) {
        regionID = GetSynchronizerRegionID(this, sessionId);
        if (regionID == null || regionID["x"] == null || regionID["y"] == null) {
            return false;
        }
        else {
            result = await IsUserPermittedToWriteRegion(this, regionID["x"], regionID["y"], userId);
            return result;
        }
    }
    else {
        return false;
    }
};

this.createButtonEntityAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};
    
this.createCanvasEntityAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

this.createInputEntityAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

this.createLightEntityAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

this.createTerrainEntityAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

this.createTextEntityAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

this.createVoxelEntityAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

this.sendMessageAuthCallback = async (userId, userToken, sessionId) => {
    foundToken = GetUserToken(this, userId);
    if (foundToken == null) {
        return false;
    }
    
    if (userToken == foundToken) {
        return true
    }
    else {
        return false;
    }
};

this.deleteEntityAuthCallback = async (userId, userToken, sessionId, entityId) => {
    foundToken = GetUserToken(this, userId);
    if (foundToken == null) {
        return false;
    }
    
    if (userToken == foundToken) {
        regionID = GetSynchronizerRegionID(this, sessionId);
        if (regionID == null || regionID["x"] == null || regionID["y"] == null) {
            return false;
        }
        else {
            result = await IsUserPermittedToWriteEntity(this, regionID["x"], regionID["y"],
                entityId, userId);
            return result;
        }
    }
    else {
        return false;
    }
};

this.removeEntityAuthCallback = async (userId, userToken, sessionId, entityId) => {
    foundToken = GetUserToken(this, userId);
    if (foundToken == null) {
        return false;
    }
    
    if (userToken == foundToken) {
        regionID = GetSynchronizerRegionID(this, sessionId);
        if (regionID == null || regionID["x"] == null || regionID["y"] == null) {
            return false;
        }
        else {
            result = await IsUserPermittedToWriteEntity(this, regionID["x"], regionID["y"],
                entityId, userId);
            return result;
        }
    }
    else {
        return false;
    }
};

this.vss.positionEntityAuthCallback = async (userId, userToken, sessionId, entityId) => {
    foundToken = GetUserToken(this, userId);
    if (foundToken == null) {
        return false;
    }
    
    if (userToken == foundToken) {
        regionID = GetSynchronizerRegionID(this, sessionId);
        if (regionID == null || regionID["x"] == null || regionID["y"] == null) {
            return false;
        }
        else {
            result = await IsUserPermittedToWriteEntity(this, regionID["x"], regionID["y"],
                entityId, userId);
            return result;
        }
    }
    else {
        return false;
    }
};

this.rotateEntityAuthCallback = async (userId, userToken, sessionId, entityId) => {
    foundToken = GetUserToken(this, userId);
    if (foundToken == null) {
        return false;
    }
    
    if (userToken == foundToken) {
        regionID = GetSynchronizerRegionID(this, sessionId);
        if (regionID == null || regionID["x"] == null || regionID["y"] == null) {
            return false;
        }
        else {
            result = await IsUserPermittedToWriteEntity(this, regionID["x"], regionID["y"],
                entityId, userId);
            return result;
        }
    }
    else {
        return false;
    }
};

this.scaleEntityAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

this.sizeEntityAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

this.modifyTerrainEntityAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

this.setEntityCanvasTypeAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

this.setEntityHighlightStateAuthCallback = async (userId, userToken, sessionId) => {
    return false;
};

OpenTopLevelWorldDatabase(this, argv[7]);

this.vss.RunMQTT(argv[2], argv[3], argv[4] == "null" ? null : argv[4],
    argv[5] == "null" ? null : argv[5], argv[6] == "null" ? null : argv[6]);
this.vss.ConnectToMQTT(argv[2]);

InitializeRegionDBMap(this);
InitializeRegionSynchronizerMap(this);

ConnectToVOS(this);