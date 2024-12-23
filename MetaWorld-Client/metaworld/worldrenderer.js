function EnableTerrain(terrain) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    terrain.SetInteractionState(InteractionState.Physical);
    terrain.SetVisibility(true);

    var terrainIndex = GetIndexForTerrainTile(terrain);

    // Set up entities.
    if (configContext == null || rendererContext == null) {
        Logging.LogError("EnableTerrain: Unable to get context.");
    }
    else {
        rendererContext.chunkLoadInProgress = false;
        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] +
            "/getentities?chunkX=" + terrainIndex.x + "&chunkY=" + terrainIndex.y, "OnEntitiesReceived");
    }
}

function GetIndexForTerrainTile(terrainTile) {
    var terrainTileTag = terrainTile.tag;
    var terrainIndexStart = terrainTileTag.indexOf("-");
    if (terrainIndexStart == -1) {
        Logging.LogError("GetIndexForTerrainTile: Unable to get index of terrain tile.");
        return;
    }

    var terrainIndexParts = terrainTileTag.substring(terrainIndexStart + 1).split(".");
    if (terrainIndexParts.length != 2) {
        Logging.LogError("GetIndexForTerrainTile: Invalid terrain tile index.");
        return;
    }

    return new Vector2Int(parseInt(terrainIndexParts[0]), parseInt(terrainIndexParts[1]));
}

function GetTerrainTileForIndex(index) {
    return Entity.GetByTag("TerrainTile-" + index.x + "." + index.y);
}

function GetTerrainTileIndexForEntity(entity) {
    var parentTerrain = entity.GetParent();
    if (parentTerrain == null) {
        Logging.Log("GetTerrainTileIndexForEntity: Unable to get parent terrain.");
        return Vector2Int.zero;
    }

    if (!parentTerrain instanceof TerrainEntity) {
        Logging.Log("GetTerrainTileIndexForEntity: Parent entity not terrain.");
        return Vector2Int.zero;
    }

    return GetIndexForTerrainTile(parentTerrain);
}

function EnableWater(water) {
    water.SetInteractionState(InteractionState.Static);
    water.SetVisibility(true);
    context.worldLoaded = true;
}

async function OnTerrainReceived(terrainInfo) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    terrainInfoObject = JSON.parse(terrainInfo);
    
    if (terrainInfoObject == null) {
        Logging.LogError("OnTerrainReceived: Unable to get terrain info.");
        return;
    }
    
    if (terrainInfoObject["chunk_x"] == null) {
        Logging.LogError("OnTerrainReceived: Unable to get chunk X index.");
        return;
    }

    if (terrainInfoObject["chunk_y"] == null) {
        Logging.LogError("OnTerrainReceived: Unable to get chunk Y index.");
        return;
    }

    if (terrainInfoObject["biome_id"] == null) {
        Logging.LogError("OnTerrainReceived: Unable to get biome ID.");
        return;
    }

    if (terrainInfoObject["base_ground"] == null) {
        Logging.LogError("OnTerrainReceived: Unable to get base ground.");
        return;
    }
    
    if (terrainInfoObject["base_ground"]["heights"] == null) {
        Logging.LogError("OnTerrainReceived: Unable to get base ground heights.");
        return;
    }

    if (terrainInfoObject["base_ground"]["layers"] == null) {
        Logging.LogError("OnTerrainReceived: Unable to get base ground layers.");
        return;
    }
    
    if (terrainInfoObject["ground_mods"] == null) {
        Logging.LogError("OnTerrainReceived: Unable to get ground mods.");
        return;
    }
    
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    
    terrainEntityLayers = [];
    terrainEntityLayerMasks = [];
    if (rendererContext.biomeInfo[terrainInfoObject["biome_id"]] == null) {
        Logging.LogError("OnTerrainReceived: Unable to find biome ID " + terrainInfoObject["biome_id"] + ".");
        return;
    }

    var terrainMaterials = rendererContext.biomeInfo[terrainInfoObject["biome_id"]]["terrain-materials"];
    for (var terrainLayer in terrainMaterials) {
        var index = terrainMaterials[terrainLayer]["layer"];
        terrainEntityLayers[index] = new TerrainEntityLayer();
        terrainEntityLayers[index].diffuseTexture = configContext.worldURI + "/" + configContext.worldConfig["terrain-directory"] + "/" +
            terrainMaterials[terrainLayer].color_texture;
        terrainEntityLayers[index].normalTexture = configContext.worldURI + "/" + configContext.worldConfig["terrain-directory"] + "/" +
            terrainMaterials[terrainLayer].normal_texture;
        terrainEntityLayers[index].maskTexture = "";
        terrainEntityLayers[index].specular = Color.black;
        terrainEntityLayers[index].smoothness = 0;
        terrainEntityLayers[index].metallic = 0;
        terrainEntityLayers[index].sizeFactor = 8;
        terrainEntityLayerMasks[index] = new TerrainEntityLayerMask(512, 512);
    }

    // Area for optimization: get in correct format to eliminate loop.
    var yIdx = 0;
    var layersObject = terrainInfoObject["base_ground"]["layers"];
    for (var lyrRow in layersObject) {
        var xIdx = 0;
        
        for (var lyr in layersObject[lyrRow]) {
            if (terrainEntityLayerMasks[layersObject[lyrRow][lyr]] != null) {
                terrainEntityLayerMasks[layersObject[lyrRow][lyr]].SetHeight(xIdx, yIdx, 1);
            }
            xIdx++;
        }
        yIdx++;
    }

    layerMasks = new TerrainEntityLayerMaskCollection();
    for (var terrainEntityLayerMask in terrainEntityLayerMasks) {
        layerMasks.AddLayerMask(terrainEntityLayerMasks[terrainEntityLayerMask]);
    }

    modifications = [];
    for (i = 0; i < terrainInfoObject["ground_mods"].length; i++) {
        if (terrainInfoObject["ground_mods"][i]["operation"] == null) {
            Logging.LogError("OnTerrainReceived: Invalid ground mod entry operation at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["ground_mods"][i]["brushtype"] == null) {
            Logging.LogError("OnTerrainReceived: Invalid ground mod entry brushtype at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["ground_mods"][i]["layer"] == null) {
            Logging.LogError("OnTerrainReceived: Invalid ground mod entry layer at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["ground_mods"][i]["x"] == null) {
            Logging.LogError("OnTerrainReceived: Invalid ground mod entry x at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["ground_mods"][i]["y"] == null) {
            Logging.LogError("OnTerrainReceived: Invalid ground mod entry y at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["ground_mods"][i]["z"] == null) {
            Logging.LogError("OnTerrainReceived: Invalid ground mod entry z at index " + i + ".");
            continue;
        }

        if (terrainInfoObject["ground_mods"][i]["brushsize"] == null) {
            Logging.LogError("OnTerrainReceived: Invalid ground mod entry brushsize at index " + i + ".");
            continue;
        }
        
        operation = TerrainEntityOperation.Unset;
        if (terrainInfoObject["ground_mods"][i]["operation"] == "dig") {
            operation = TerrainEntityOperation.Dig;
        }
        else if (terrainInfoObject["ground_mods"][i]["operation"] == "build") {
            operation = TerrainEntityOperation.Build;
        }
        else {
            Logging.LogError("OnTerrainReceived: Invalid operation value at index " + i + ".");
            continue;
        }
        
        brushType = TerrainEntityBrushType.sphere;
        if (terrainInfoObject["ground_mods"][i]["brushtype"] == "sphere") {
            brushType = TerrainEntityBrushType.sphere;
        }
        else if (terrainInfoObject["ground_mods"][i]["brushtype"] == "roundedCube") {
            brushType = TerrainEntityBrushType.roundedCube;
        }
        else {
            Logging.LogError("OnTerrainReceived: Invalid brushtype value at index " + i +  ".");
            continue;
        }
        
        position = new Vector3(parseFloat(terrainInfoObject["ground_mods"][i]["x"]),
            parseFloat(terrainInfoObject["ground_mods"][i]["y"]), parseFloat(terrainInfoObject["ground_mods"][i]["z"]));
        
        lyr = terrainInfoObject["ground_mods"][i]["layer"];

        sz = terrainInfoObject["ground_mods"][i]["brushsize"];
        
        mod = new TerrainEntityModification(operation, position, brushType, lyr, sz);
        modifications.push(mod);
    }

    var terrainEntity = TerrainEntity.CreateHybrid(null, 1024, 1024, 512, terrainInfoObject["base_ground"]["heights"],
        terrainEntityLayers, layerMasks, modifications,
        GetRenderedPositionForWorldPosition(GetWorldPosForChunkIndex(
            new Vector2Int(terrainInfoObject["chunk_x"], terrainInfoObject["chunk_y"]))),
        /*new Quaternion(0, 0.7071, 0, 0.7071)*/ Quaternion.identity, null, "TerrainTile-" + terrainInfoObject["chunk_x"] + "." + terrainInfoObject["chunk_y"],
        "EnableTerrain");
    rendererContext.terrainTiles[terrainInfoObject["chunk_x"] + "." + terrainInfoObject["chunk_y"]] = terrainEntity;
    
    Context.DefineContext("MainContext", this);
}

function OnEntitiesReceived(entityInfo) {
    var context = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    var entities = JSON.parse(entityInfo);
    
    if (entities["chunk_x"] == null) {
        Logging.LogError("OnEntitiesReceived: Unable to get chunk X index.");
        return;
    }

    if (entities["chunk_y"] == null) {
        Logging.LogError("OnEntitiesReceived: Unable to get chunk Y index.");
        return;
    }
    
    var terrainTile = context.terrainTiles[entities["chunk_x"] + "." + entities["chunk_y"]];
    if (terrainTile == null) {
        Logging.LogError("OnEntitiesReceived: Unable to get terrain tile.");
        return;
    }

    for (var entity in entities.entities) {
        var entityName = WorldStorage.GetItem("METAWORLD.CONFIGURATION.ENTITYID." + entities.entities[entity].entityid);
        var variantName = WorldStorage.GetItem("METAWORLD.CONFIGURATION.VARIANTID."
            + entities.entities[entity].entityid + "." + entities.entities[entity].variantid);
        var entityPos = //GetRenderedPositionForWorldPosition(GetWorldPosForChunkPos(
            new Vector3(entities.entities[entity].xposition, entities.entities[entity].yposition, entities.entities[entity].zposition);//,
            //new Vector2Int(entities["chunk_x"], entities["chunk_y"])));
        //var entityRot = Quaternion.Combine(new Quaternion(entities.entities[entity].xrotation, entities.entities[entity].yrotation,
        //    entities.entities[entity].zrotation, entities.entities[entity].wrotation),
        //    new Quaternion(0, 0.7071, 0, 0.7071));
//Logging.Log(entityRot.x + " " + entityRot.y + " " + entityRot.z + " " + entityRot.w);
        LoadEntity(entities.entities[entity].instanceid, null, null, entities.entities[entity].entityid, entities.entities[entity].variantid,
            configContext.entitiesConfig[entityName].variants[variantName].model,
            entityPos, Vector3.zero, new Quaternion(entities.entities[entity].xrotation, entities.entities[entity].yrotation,
                entities.entities[entity].zrotation, entities.entities[entity].wrotation), false, terrainTile);
    }
    context.worldLoaded = true;
}

function OnTimeReceived(timeInfo) {
    var context = Context.GetContext("WORLDRENDERERCONTEXT");
    var time = JSON.parse(timeInfo);
    
    if (time.day === null || time.seconds === null) {
        Logging.LogError("OnTimeReceived: Invalid time received.");
        return;
    }
    
    UpdateSunTimeOfDay(time.seconds);
}

function OnBiomeInfoReceived(biomeInfo) {
    var context = Context.GetContext("WORLDRENDERERCONTEXT");

    if (biomeInfo == null || biomeInfo == "") {
        Logging.LogError("OnBiomeInfoReceived: Invalid biome info received.");
        return;
    }

    context.biomeInfo = JSON.parse(biomeInfo);
}

function WorldMaintenance() {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    var characterContext = Context.GetContext("thirdPersonCharacterContext");
    if (configContext == null || rendererContext == null || characterContext == null) {
        
    }
    else {
        var renderedPos = Vector3.zero;
        if (characterContext.characterEntity != null) {
            renderedPos = characterContext.GetPosition();
        }
        var newChunk = GetChunkIndexForWorldPos(GetWorldPositionForRenderedPosition(renderedPos));
        if (rendererContext.currentChunk != newChunk) {
            rendererContext.currentChunk = newChunk;
        }
        //SwitchChunk(rendererContext.currentChunk);
        EnsureChunksAreLoaded(rendererContext.currentChunk);
        UnloadUnnecessaryChunks(rendererContext.currentChunk);
    }
}

function SwitchChunk(chunkIdx) {

}

function EnsureChunksAreLoaded(centerChunkIdx) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    if (rendererContext.chunkLoadInProgress == true) {
        return;
    }

    if (rendererContext.terrainTiles[centerChunkIdx.x + "." + centerChunkIdx.y] == null) {
        LoadChunk(centerChunkIdx);
        return;
    }

    if (rendererContext.terrainTiles[centerChunkIdx.x + "." + (centerChunkIdx.y + 1)] == null) {
        LoadChunk(new Vector2Int(centerChunkIdx.x, centerChunkIdx.y + 1));
        return;
    }

    if (rendererContext.terrainTiles[(centerChunkIdx.x + 1) + "." + centerChunkIdx.y] == null) {
        LoadChunk(new Vector2Int(centerChunkIdx.x + 1, centerChunkIdx.y));
        return;
    }

    if (rendererContext.terrainTiles[(centerChunkIdx.x + 1) + "." + (centerChunkIdx.y + 1)] == null) {
        LoadChunk(new Vector2Int(centerChunkIdx.x + 1, centerChunkIdx.y + 1));
        return;
    }

    if (rendererContext.terrainTiles[centerChunkIdx.x + "." + (centerChunkIdx.y - 1)] == null) {
        LoadChunk(new Vector2Int(centerChunkIdx.x, centerChunkIdx.y - 1));
        return;
    }

    if (rendererContext.terrainTiles[(centerChunkIdx.x - 1) + "." + centerChunkIdx.y] == null) {
        LoadChunk(new Vector2Int(centerChunkIdx.x - 1, centerChunkIdx.y));
        return;
    }

    if (rendererContext.terrainTiles[(centerChunkIdx.x - 1) + "." + (centerChunkIdx.y - 1)] == null) {
        LoadChunk(new Vector2Int(centerChunkIdx.x - 1, centerChunkIdx.y - 1));
        return;
    }

    if (rendererContext.terrainTiles[(centerChunkIdx.x - 1) + "." + (centerChunkIdx.y + 1)] == null) {
        LoadChunk(new Vector2Int(centerChunkIdx.x - 1, centerChunkIdx.y + 1));
        return;
    }

    if (rendererContext.terrainTiles[(centerChunkIdx.x + 1) + "." + (centerChunkIdx.y - 1)] == null) {
        LoadChunk(new Vector2Int(centerChunkIdx.x + 1, centerChunkIdx.y - 1));
        return;
    }
}

function UnloadUnnecessaryChunks(centerChunkIdx) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    for (const tile in rendererContext.terrainTiles) {
        if (tile != centerChunkIdx.x + "." + centerChunkIdx.y &&
            tile != centerChunkIdx.x + "." + (centerChunkIdx.y + 1) &&
            tile != (centerChunkIdx.x + 1) + "." + centerChunkIdx.y &&
            tile != (centerChunkIdx.x + 1) + "." + (centerChunkIdx.y + 1) &&
            tile != centerChunkIdx.x + "." + (centerChunkIdx.y - 1) &&
            tile != (centerChunkIdx.x - 1) + "." + centerChunkIdx.y &&
            tile != (centerChunkIdx.x - 1) + "." + (centerChunkIdx.y - 1) &&
            tile != (centerChunkIdx.x - 1) + "." + (centerChunkIdx.y + 1) &&
            tile != (centerChunkIdx.x + 1) + "." + (centerChunkIdx.y - 1)
        ) {
            rendererContext.terrainTiles[tile].Delete(false);
            delete rendererContext.terrainTiles[tile];
        }
    }
}

function LoadChunk(chunkIdx) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (rendererContext == null || configContext == null) {
        Logging.LogError("LoadChunk: Unable to get contexts.");
    }
    else {
        rendererContext.chunkLoadInProgress = true;
        rendererContext.terrainTiles[(chunkIdx.x + "." + chunkIdx.y)] = "loading";
        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] +
            "/getterrain?chunkX=" + chunkIdx.x + "&chunkY=" + chunkIdx.y +
            "&minX=0&maxX=512&minY=0&maxY=512", "OnTerrainReceived");
    }
}

function GetChunkIndexForWorldPos(worldPos) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (configContext == null || rendererContext == null) {
        Logging.LogError("GetChunkIndexForWorldPos: Unable to get contexts.");
        return Vector2Int.zero;
    }
    else {
        var chunkSize_meters = rendererContext.chunkSize * rendererContext.chunkScale;
        return new Vector2Int(Math.floor(worldPos.x / chunkSize_meters), Math.floor(worldPos.z / chunkSize_meters));
    }
}

function GetWorldPosForChunkIndex(chunkIdx) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (configContext == null || rendererContext == null) {
        Logging.LogError("GetWorldPosForChunkIndex: Unable to get contexts.");
        return Vector3.zero;
    }
    else {
        var chunkSize_meters = rendererContext.chunkSize * rendererContext.chunkScale;
        return new Vector3(chunkIdx.x * chunkSize_meters, 0, chunkIdx.y * chunkSize_meters);
    }
}

function GetWorldPositionForRenderedPosition(renderedPos) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (configContext == null || rendererContext == null) {
        Logging.LogError("GetWorldPositionForRenderedPosition: Unable to get contexts.");
        return Vector3.zero;
    }
    else {
        return new Vector3(renderedPos.z + rendererContext.worldOffset.x, renderedPos.y, renderedPos.x + rendererContext.worldOffset.z);
    }
}

function GetRenderedPositionForWorldPosition(worldPos) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (configContext == null || rendererContext == null) {
        Logging.LogError("GetRenderedPositionForWorldPosition: Unable to get contexts.");
        return Vector3.zero;
    }
    else {
        return new Vector3((worldPos.z - rendererContext.worldOffset.z), worldPos.y, (worldPos.x - rendererContext.worldOffset.x));
    }
}

function GetWorldPosForChunkPos(chunkPos, chunkIdx) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (configContext == null || rendererContext == null) {
        Logging.LogError("GetWorldPosForChunkPos: Unable to get contexts.");
        return Vector3.zero;
    }
    else {
        var chunkSize_meters = rendererContext.chunkSize * rendererContext.chunkScale;
        return new Vector3(chunkIdx.x * chunkSize_meters + chunkPos.x, chunkPos.y, chunkIdx.y * chunkSize_meters + chunkPos.z);
    }
}

function GetChunkPosForWorldPos(worldPos, chunkIdx) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (configContext == null || rendererContext == null) {
        Logging.LogError("GetWorldPosForChunkPos: Unable to get contexts.");
        return Vector3.zero;
    }
    else {
        var chunkSize_meters = rendererContext.chunkSize * rendererContext.chunkScale;
        return new Vector3(worldPos.z - chunkIdx.y * chunkSize_meters, worldPos.y,
            worldPos.x - chunkIdx.x * chunkSize_meters);
    }
}

class WorldRenderer {
    constructor(startPos) {
        this.biomeInfo = {};
        this.terrainTiles = {};
        this.worldLoaded = false;
        this.worldLoadInitiated = false;
        this.chunkLoadInProgress = false;
        this.chunkSize = 512;
        this.chunkScale = 2;
        this.currentPos = startPos;
        Context.DefineContext("WORLDRENDERERCONTEXT", this);
        this.currentChunk = GetChunkIndexForWorldPos(startPos);
        this.worldOffset = new Vector3(this.currentChunk.x * this.chunkSize * this.chunkScale, startPos.y,
            this.currentChunk.y * this.chunkSize * this.chunkScale);
        this.currentPos = startPos;
        Context.DefineContext("WORLDRENDERERCONTEXT", this);
        
        this.LoadWorld = function() {
            Time.SetInterval(`
                WorldMaintenance();
                var context = Context.GetContext("WORLDRENDERERCONTEXT");
                var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
                if (configContext == null) {
                    Logging.LogError("LoadWorld: Unable to get context.");
                }
                else {
                    if (configContext.worldConfig != null && context.worldLoaded == false && context.worldLoadInitiated == false) {
                        // Set up sun.
                        context.sun = new Sun(configContext.worldConfig["base-light-intensity"], configContext.worldConfig["sun-light-intensity"]);

                        // Set up sky.
                        Environment.SetSkyTexture(configContext.worldURI + "/" + configContext.worldConfig["sky-texture"]);
                        
                        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/getbiomeinfo", "OnBiomeInfoReceived");

                        // Set up terrain.
                        //LoadChunk(context.currentChunk);
                        context.worldLoadInitiated = true;
                        Context.DefineContext("WORLDRENDERERCONTEXT", context);
                        UpdateSunTimeOfDay(20000);

                        // Set up water.
                        WaterEntity.CreateWaterBody(null, Color.cyan, new Color(0, 66 / 255, 102 / 255, 1), Color.white, Color.blue,
                            -2, 6, 32, 0.675, 1, 0.1, 0.5, 0.25, 1, 128, 1, new Vector3(512, 127, 512), Quaternion.identity,
                            new Vector3(16384, 0.01, 16384), null, null, "EnableWater");
                    }
                }`,
            0.5);
            
            Time.SetInterval(`
                var context = Context.GetContext("WORLDRENDERERCONTEXT");
                var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
                if (configContext == null) {
                    Logging.LogError("LoadWorld: Unable to get context.");
                }
                else {
                    HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/gettime", "OnTimeReceived");
                }`,
            5);
        }
    }
}