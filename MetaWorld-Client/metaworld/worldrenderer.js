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
        rendererContext.regionLoadInProgress = false;
        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] +
            "/getentities?regionX=" + terrainIndex.x + "&regionY=" + terrainIndex.y, "OnEntitiesReceived");
        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] +
            "/getregioninfo?regionX=" + terrainIndex.x + "&regionY=" + terrainIndex.y, "OnRegionInfoReceived");
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
    
    if (terrainInfoObject["region_x"] == null) {
        Logging.LogError("OnTerrainReceived: Unable to get region X index.");
        return;
    }

    if (terrainInfoObject["region_y"] == null) {
        Logging.LogError("OnTerrainReceived: Unable to get region Y index.");
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

    // Area for optimization: get in correct format to eliminate loop. This is adding bulk of delay.
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
        GetRenderedPositionForWorldPosition(GetWorldPosForRegionIndex(
            new Vector2Int(terrainInfoObject["region_x"], terrainInfoObject["region_y"]))),
        /*new Quaternion(0, 0.7071, 0, 0.7071)*/ Quaternion.identity, null, "TerrainTile-" + terrainInfoObject["region_x"] + "." + terrainInfoObject["region_y"],
        "EnableTerrain");
    rendererContext.terrainTiles[terrainInfoObject["region_x"] + "." + terrainInfoObject["region_y"]] = terrainEntity;
    
    Context.DefineContext("MainContext", this);
}

function OnEntitiesReceived(entityInfo) {
    var context = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    var entities = JSON.parse(entityInfo);
    
    if (entities["region_x"] == null) {
        Logging.LogError("OnEntitiesReceived: Unable to get region X index.");
        return;
    }

    if (entities["region_y"] == null) {
        Logging.LogError("OnEntitiesReceived: Unable to get region Y index.");
        return;
    }
    
    var terrainTile = context.terrainTiles[entities["region_x"] + "." + entities["region_y"]];
    if (terrainTile == null) {
        Logging.LogError("OnEntitiesReceived: Unable to get terrain tile.");
        return;
    }

    for (var entity in entities.entities) {
        var entityName = WorldStorage.GetItem("METAWORLD.CONFIGURATION.ENTITYID." + entities.entities[entity].entityid);
        var variantName = WorldStorage.GetItem("METAWORLD.CONFIGURATION.VARIANTID."
            + entities.entities[entity].entityid + "." + entities.entities[entity].variantid);
        var entityPos = //GetRenderedPositionForWorldPosition(GetWorldPosForRegionPos(
            new Vector3(entities.entities[entity].xposition, entities.entities[entity].yposition, entities.entities[entity].zposition);//,
            //new Vector2Int(entities["region_x"], entities["region_y"])));
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

function OnRegionInfoReceived(regionInfo) {
    var context = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    var region = JSON.parse(regionInfo);
    
    if (region == null) {
        Logging.LogError("OnRegionInfoReceived: Unable to get region info.");
        return;
    }

    if (region["synchronizer_id"] == null || region["synchronizer_id"] == "") {
        Logging.LogError("OnRegionInfoReceived: Unable to get synchronizer id.");
        return;
    }

    if (region["synchronizer_tag"] == null || region["synchronizer_tag"] == "") {
        Logging.LogError("OnRegionInfoReceived: Unable to get synchronizer tag.");
        return;
    }
    VOSSynchronization.JoinSession(configContext.worldConfig["vos-synchronization-service"]["host"],
        configContext.worldConfig["vos-synchronization-service"]["port"],
        configContext.worldConfig["vos-synchronization-service"].tls,
        region["synchronizer_id"], region["synchronizer_tag"], context.worldOffset, null,
        configContext.worldConfig["vos-synchronization-service"].transport == "tcp" ?
            VSSTransport.TCP : VSSTransport.WebSocket);
    context.regionSynchronizers[terrainInfoObject["region_x"] + "." + terrainInfoObject["region_y"]]
        = region["synchronizer_id"];
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
        var newRegion = GetRegionIndexForWorldPos(GetWorldPositionForRenderedPosition(renderedPos));
        if (rendererContext.currentRegion != newRegion) {
            rendererContext.currentRegion = newRegion;
        }
        //SwitchRegion(rendererContext.currentRegion);
        EnsureRegionsAreLoaded(rendererContext.currentRegion);
        UnloadUnnecessaryRegions(rendererContext.currentRegion);

        EnsureCharacterIsInCorrectSession();
    }
}

function SwitchRegion(regionIdx) {

}

function EnsureRegionsAreLoaded(centerRegionIdx) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    if (rendererContext.regionLoadInProgress == true) {
        return;
    }

    if (rendererContext.terrainTiles[centerRegionIdx.x + "." + centerRegionIdx.y] == null) {
        LoadRegion(centerRegionIdx);
        return;
    }

    if (rendererContext.terrainTiles[centerRegionIdx.x + "." + (centerRegionIdx.y + 1)] == null) {
        LoadRegion(new Vector2Int(centerRegionIdx.x, centerRegionIdx.y + 1));
        return;
    }

    if (rendererContext.terrainTiles[(centerRegionIdx.x + 1) + "." + centerRegionIdx.y] == null) {
        LoadRegion(new Vector2Int(centerRegionIdx.x + 1, centerRegionIdx.y));
        return;
    }

    if (rendererContext.terrainTiles[(centerRegionIdx.x + 1) + "." + (centerRegionIdx.y + 1)] == null) {
        LoadRegion(new Vector2Int(centerRegionIdx.x + 1, centerRegionIdx.y + 1));
        return;
    }

    if (rendererContext.terrainTiles[centerRegionIdx.x + "." + (centerRegionIdx.y - 1)] == null) {
        LoadRegion(new Vector2Int(centerRegionIdx.x, centerRegionIdx.y - 1));
        return;
    }

    if (rendererContext.terrainTiles[(centerRegionIdx.x - 1) + "." + centerRegionIdx.y] == null) {
        LoadRegion(new Vector2Int(centerRegionIdx.x - 1, centerRegionIdx.y));
        return;
    }

    if (rendererContext.terrainTiles[(centerRegionIdx.x - 1) + "." + (centerRegionIdx.y - 1)] == null) {
        LoadRegion(new Vector2Int(centerRegionIdx.x - 1, centerRegionIdx.y - 1));
        return;
    }

    if (rendererContext.terrainTiles[(centerRegionIdx.x - 1) + "." + (centerRegionIdx.y + 1)] == null) {
        LoadRegion(new Vector2Int(centerRegionIdx.x - 1, centerRegionIdx.y + 1));
        return;
    }

    if (rendererContext.terrainTiles[(centerRegionIdx.x + 1) + "." + (centerRegionIdx.y - 1)] == null) {
        LoadRegion(new Vector2Int(centerRegionIdx.x + 1, centerRegionIdx.y - 1));
        return;
    }
}

function UnloadUnnecessaryRegions(centerRegionIdx) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    for (const tile in rendererContext.terrainTiles) {
        if (tile != centerRegionIdx.x + "." + centerRegionIdx.y &&
            tile != centerRegionIdx.x + "." + (centerRegionIdx.y + 1) &&
            tile != (centerRegionIdx.x + 1) + "." + centerRegionIdx.y &&
            tile != (centerRegionIdx.x + 1) + "." + (centerRegionIdx.y + 1) &&
            tile != centerRegionIdx.x + "." + (centerRegionIdx.y - 1) &&
            tile != (centerRegionIdx.x - 1) + "." + centerRegionIdx.y &&
            tile != (centerRegionIdx.x - 1) + "." + (centerRegionIdx.y - 1) &&
            tile != (centerRegionIdx.x - 1) + "." + (centerRegionIdx.y + 1) &&
            tile != (centerRegionIdx.x + 1) + "." + (centerRegionIdx.y - 1)
        ) {
            rendererContext.terrainTiles[tile].Delete(false);
            delete rendererContext.terrainTiles[tile];
        }
    }
}

function EnsureCharacterIsInCorrectSession() {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    var characterContext = Context.GetContext("thirdPersonCharacterContext");

    if (characterContext.characterEntity === null) {
        return;
    }

    if (rendererContext) {

    }

    if (rendererContext.characterSynchronizer == null) {
        if (rendererContext.regionSynchronizers[rendererContext.currentRegion.x
            + "." + rendererContext.currentRegion.y] == null) {
                return;
        }

        if (!VOSSynchronization.IsSessionEstablished(
            rendererContext.regionSynchronizers[rendererContext.currentRegion.x
            + "." + rendererContext.currentRegion.y])) {
            return;
        }

        VOSSynchronization.StartSynchronizingEntity(
            rendererContext.regionSynchronizers[rendererContext.currentRegion.x
            + "." + rendererContext.currentRegion.y], characterContext.characterEntity.id, true);
        rendererContext.characterSynchronizer
            = rendererContext.currentRegion.x + "." + rendererContext.currentRegion.y;
    }
    else if (rendererContext.characterSynchronizer
        != rendererContext.currentRegion.x + "." + rendererContext.currentRegion.y) {
        VOSSynchronization.StopSynchronizingEntity(
            rendererContext.regionSynchronizers[rendererContext.characterSynchronizer],
            characterContext.characterEntity.id);
        
        if (!VOSSynchronization.IsSessionEstablished(
            rendererContext.regionSynchronizers[rendererContext.currentRegion.x
            + "." + rendererContext.currentRegion.y])) {
            return;
        }
        rendererContext.characterSynchronizer = null;
        
        VOSSynchronization.StartSynchronizingEntity(
            rendererContext.regionSynchronizers[rendererContext.currentRegion.x
            + "." + rendererContext.currentRegion.y], characterContext.characterEntity.id, true);
        rendererContext.characterSynchronizer
            = rendererContext.currentRegion.x + "." + rendererContext.currentRegion.y;
    }
}

function LoadRegion(regionIdx) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (rendererContext == null || configContext == null) {
        Logging.LogError("LoadRegion: Unable to get contexts.");
    }
    else {
        rendererContext.regionLoadInProgress = true;
        rendererContext.terrainTiles[(regionIdx.x + "." + regionIdx.y)] = "loading";
        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] +
            "/getterrain?regionX=" + regionIdx.x + "&regionY=" + regionIdx.y +
            "&minX=0&maxX=512&minY=0&maxY=512", "OnTerrainReceived");
    }
}

function GetRegionIndexForWorldPos(worldPos) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (configContext == null || rendererContext == null) {
        Logging.LogError("GetRegionIndexForWorldPos: Unable to get contexts.");
        return Vector2Int.zero;
    }
    else {
        var regionSize_meters = rendererContext.regionSize * rendererContext.regionScale;
        return new Vector2Int(Math.floor(worldPos.x / regionSize_meters), Math.floor(worldPos.z / regionSize_meters));
    }
}

function GetWorldPosForRegionIndex(regionIdx) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (configContext == null || rendererContext == null) {
        Logging.LogError("GetWorldPosForRegionIndex: Unable to get contexts.");
        return Vector3.zero;
    }
    else {
        var regionSize_meters = rendererContext.regionSize * rendererContext.regionScale;
        return new Vector3(regionIdx.x * regionSize_meters, 0, regionIdx.y * regionSize_meters);
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

function GetWorldPosForRegionPos(regionPos, regionIdx) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (configContext == null || rendererContext == null) {
        Logging.LogError("GetWorldPosForRegionPos: Unable to get contexts.");
        return Vector3.zero;
    }
    else {
        var regionSize_meters = rendererContext.regionSize * rendererContext.regionScale;
        return new Vector3(regionIdx.x * regionSize_meters + regionPos.x, regionPos.y, regionIdx.y * regionSize_meters + regionPos.z);
    }
}

function GetRegionPosForWorldPos(worldPos, regionIdx) {
    var rendererContext = Context.GetContext("WORLDRENDERERCONTEXT");
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (configContext == null || rendererContext == null) {
        Logging.LogError("GetWorldPosForRegionPos: Unable to get contexts.");
        return Vector3.zero;
    }
    else {
        var regionSize_meters = rendererContext.regionSize * rendererContext.regionScale;
        return new Vector3(worldPos.z - regionIdx.y * regionSize_meters, worldPos.y,
            worldPos.x - regionIdx.x * regionSize_meters);
    }
}

class WorldRenderer {
    constructor(startPos) {
        this.biomeInfo = {};
        this.terrainTiles = {};
        this.worldLoaded = false;
        this.worldLoadInitiated = false;
        this.regionLoadInProgress = false;
        this.regionSize = 512;
        this.regionScale = 2;
        this.currentPos = startPos;
        this.characterSynchronizer = null;
        this.regionSynchronizers = {};
        Context.DefineContext("WORLDRENDERERCONTEXT", this);
        this.currentRegion = GetRegionIndexForWorldPos(startPos);
        this.worldOffset = new Vector3(this.currentRegion.x * this.regionSize * this.regionScale, startPos.y,
            this.currentRegion.y * this.regionSize * this.regionScale);
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
                        var sunContext = Context.GetContext("SUNCONTEXT");

                        // Set up sky.
                        Environment.SetLiteDayNightSky(sunContext.sunEntity);
                        
                        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/getbiomeinfo", "OnBiomeInfoReceived");

                        // Set up terrain.
                        //LoadRegion(context.currentRegion);
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