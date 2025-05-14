class WorldRenderingModule {
    constructor(startPos) {
        Logging.Log("Initializing World Rendering Module...");

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
        this.biomeMap = {};
        Context.DefineContext("WORLD_RENDERING_MODULE", this);
        this.currentRegion = MW_Rend_GetRegionIndexForWorldPos(startPos);
        this.worldOffset = new Vector3(
            this.currentRegion.x * this.regionSize * this.regionScale, startPos.y,
            this.currentRegion.y * this.regionSize * this.regionScale);
        this.currentPos = startPos;
        Context.DefineContext("WORLD_RENDERING_MODULE", this);

        Logging.Log("World Rendering Module Initialized.");
    }
}

function MW_Rend_WorldMaintenance() {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var characterController = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    if (configModule == null || worldRenderingModule == null || characterController == null) {
        
    }
    else {
        var renderedPos = Vector3.zero;
        if (characterController.characterEntity != null) {
            renderedPos = characterController.GetPosition();
        }
        var newRegion = MW_Rend_GetRegionIndexForWorldPos(MW_Rend_GetWorldPositionForRenderedPosition(renderedPos));
        if (worldRenderingModule.currentRegion != newRegion) {
            worldRenderingModule.currentRegion = newRegion;
        }
        //MW_Rend_SwitchRegion(rendererContext.currentRegion);
        MW_Rend_EnsureRegionsAreLoaded(worldRenderingModule.currentRegion);
        MW_Rend_UnloadUnnecessaryRegions(worldRenderingModule.currentRegion);

        MW_Rend_EnsureCharacterIsInCorrectSession();
    }
}

function MW_Rend_WorldUpdate() {
    MW_Rend_WorldMaintenance();
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    if (configModule == null) {
        Logging.LogError("MW_Rend_WorldUpdate: Unable to get context.");
    }
    else {
        if (configModule.worldConfig != null && worldRenderingModule.worldLoaded == false
                && worldRenderingModule.worldLoadInitiated == false) {
            // Set up sun.
            worldRenderingModule.sun = new SunController(configModule.worldConfig["base-light-intensity"],
                configModule.worldConfig["sun-light-intensity"]);
            var sunController = Context.GetContext("SUN_CONTROLLER");

            // Set up sky.
            Environment.SetLiteDayNightSky(sunController.sunEntity);
            
            MW_REST_SendBiomeInfoRequest(
                configModule.worldConfig["world-state-service"], "MW_Rend_OnBiomeInfoReceived");

            // Set up terrain.
            worldRenderingModule.worldLoadInitiated = true;
            Context.DefineContext("WORLD_RENDERING_MODULE", worldRenderingModule);
            MW_Rend_Sun_UpdateSunTimeOfDay(20000);

            // Set up water.
            WaterEntity.CreateWaterBody(null, Color.cyan, new Color(0, 66 / 255, 102 / 255, 1),
                Color.white, Color.blue, -2, 6, 32, 0.675, 1, 0.1, 0.5, 0.25, 1, 128, 1,
                new Vector3(512, 127, 512), Quaternion.identity, new Vector3(16384, 1, 16384),
                null, null, "MW_Rend_EnableWater");
        }
    }
}

function MW_Rend_TimeUpdate() {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    if (configModule == null) {
        Logging.LogError("MW_Rend_TimeUpdate: Unable to get context.");
    }
    else {
        MW_REST_SendTimeRequest(
            configModule.worldConfig["world-state-service"], "MW_Rend_OnTimeReceived");
    }
}

function MW_Rend_LoadWorld() {
    Time.SetInterval("MW_Rend_WorldUpdate();", 0.5);
    Time.SetInterval("MW_Rend_TimeUpdate();", 0.5);
}

function MW_Rend_EnableTerrain(terrain) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var identityModule = Context.GetContext("IDENTITY_MODULE");
    terrain.SetInteractionState(InteractionState.Physical);
    terrain.SetVisibility(true);

    var terrainIndex = MW_Rend_GetIndexForTerrainTile(terrain);

    // Set up entities.
    if (configModule == null || worldRenderingModule == null || identityModule == null) {
        Logging.LogError("MW_Rend_EnableTerrain: Unable to get context.");
    }
    else {
        worldRenderingModule.regionLoadInProgress = false;
        MW_REST_SendGetEntitiesRequest(
            configModule.worldConfig["world-state-service"], terrainIndex,
            identityModule.userID, identityModule.token, "MW_Rend_OnEntitiesReceived");
        MW_REST_SendRegionInfoRequest(
            configModule.worldConfig["world-state-service"], terrainIndex,
            identityModule.userID, identityModule.token, "MW_Rend_OnRegionInfoReceived");
    }
}

function MW_Rend_EnableWater(water) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    water.SetInteractionState(InteractionState.Static);
    water.SetVisibility(true);
    worldRenderingModule.worldLoaded = true;
}

function MW_Rend_OnTerrainReceived(terrainInfo) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");

    terrainInfoObject = JSON.parse(terrainInfo);
    
    if (terrainInfoObject == null) {
        Logging.LogError("MW_Rend_OnTerrainReceived: Unable to get terrain info.");
        return;
    }
    
    if (terrainInfoObject["region_x"] == null) {
        Logging.LogError("MW_Rend_OnTerrainReceived: Unable to get region X index.");
        return;
    }

    if (terrainInfoObject["region_y"] == null) {
        Logging.LogError("MW_Rend_OnTerrainReceived: Unable to get region Y index.");
        return;
    }

    if (terrainInfoObject["biome_id"] == null) {
        Logging.LogError("MW_Rend_OnTerrainReceived: Unable to get biome ID.");
        return;
    }

    if (terrainInfoObject["base_ground"] == null) {
        Logging.LogError("MW_Rend_OnTerrainReceived: Unable to get base ground.");
        return;
    }
    
    if (terrainInfoObject["base_ground"]["heights"] == null) {
        Logging.LogError("MW_Rend_OnTerrainReceived: Unable to get base ground heights.");
        return;
    }

    if (terrainInfoObject["base_ground"]["layers"] == null) {
        Logging.LogError("MW_Rend_OnTerrainReceived: Unable to get base ground layers.");
        return;
    }
    
    if (terrainInfoObject["ground_mods"] == null) {
        Logging.LogError("MW_Rend_OnTerrainReceived: Unable to get ground mods.");
        return;
    }
    
    terrainEntityLayers = [];
    terrainEntityLayerMasks = [];
    if (worldRenderingModule.biomeInfo[terrainInfoObject["biome_id"]] == null) {
        Logging.LogError("MW_Rend_OnTerrainReceived: Unable to find biome ID " + terrainInfoObject["biome_id"] + ".");
        return;
    }
    
    worldRenderingModule.biomeMap[terrainInfoObject["region_x"] + "." + terrainInfoObject["region_y"]] =
        terrainInfoObject["biome_id"];

    var terrainMaterials = worldRenderingModule.biomeInfo[terrainInfoObject["biome_id"]]["terrain-materials"];
    for (var terrainLayer in terrainMaterials) {
        var index = terrainMaterials[terrainLayer]["layer"];
        terrainEntityLayers[index] = new TerrainEntityLayer();
        terrainEntityLayers[index].diffuseTexture = configModule.worldURI +
            "/" + configModule.worldConfig["terrain-directory"] + "/" +
            terrainMaterials[terrainLayer].color_texture;
        terrainEntityLayers[index].normalTexture = configModule.worldURI +
            "/" + configModule.worldConfig["terrain-directory"] + "/" +
            terrainMaterials[terrainLayer].normal_texture;
        terrainEntityLayers[index].maskTexture = "";
        terrainEntityLayers[index].specular = Color.black;
        terrainEntityLayers[index].smoothness = 0;
        terrainEntityLayers[index].metallic = 0;
        terrainEntityLayers[index].sizeFactor = 8;
        //terrainEntityLayerMasks[index] = new TerrainEntityLayerMask(512, 512);
    }

    // Area for optimization: get in correct format to eliminate loop. This is adding bulk of delay.
    /*var yIdx = 0;
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
    }*/
    idx = 0;
    for (var lMask in terrainInfoObject["base_ground"]["layers"]) {
        terrainEntityLayerMasks[idx++] = new TerrainEntityLayerMask(terrainInfoObject["base_ground"]["layers"][lMask]);
    }

    layerMasks = new TerrainEntityLayerMaskCollection();
    for (var terrainEntityLayerMask in terrainEntityLayerMasks) {
        layerMasks.AddLayerMask(terrainEntityLayerMasks[terrainEntityLayerMask]);
    }

    modifications = [];
    for (i = 0; i < terrainInfoObject["ground_mods"].length; i++) {
        if (terrainInfoObject["ground_mods"][i]["operation"] == null) {
            Logging.LogError("MW_Rend_OnTerrainReceived: Invalid ground mod entry operation at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["ground_mods"][i]["brushtype"] == null) {
            Logging.LogError("MW_Rend_OnTerrainReceived: Invalid ground mod entry brushtype at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["ground_mods"][i]["layer"] == null) {
            Logging.LogError("MW_Rend_OnTerrainReceived: Invalid ground mod entry layer at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["ground_mods"][i]["x"] == null) {
            Logging.LogError("MW_Rend_OnTerrainReceived: Invalid ground mod entry x at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["ground_mods"][i]["y"] == null) {
            Logging.LogError("MW_Rend_OnTerrainReceived: Invalid ground mod entry y at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["ground_mods"][i]["z"] == null) {
            Logging.LogError("MW_Rend_OnTerrainReceived: Invalid ground mod entry z at index " + i + ".");
            continue;
        }

        if (terrainInfoObject["ground_mods"][i]["brushsize"] == null) {
            Logging.LogError("MW_Rend_OnTerrainReceived: Invalid ground mod entry brushsize at index " + i + ".");
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
            Logging.LogError("MW_Rend_OnTerrainReceived: Invalid operation value at index " + i + ".");
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
            Logging.LogError("MW_Rend_OnTerrainReceived: Invalid brushtype value at index " + i +  ".");
            continue;
        }
        
        position = new Vector3(parseFloat(terrainInfoObject["ground_mods"][i]["x"]),
            parseFloat(terrainInfoObject["ground_mods"][i]["y"]),
            parseFloat(terrainInfoObject["ground_mods"][i]["z"]));
        
        lyr = terrainInfoObject["ground_mods"][i]["layer"];

        sz = terrainInfoObject["ground_mods"][i]["brushsize"];
        
        mod = new TerrainEntityModification(operation, position, brushType, lyr, sz);
        modifications.push(mod);
    }

    var terrainEntity = TerrainEntity.CreateHybrid(null, 1024, 1024, 512, terrainInfoObject["base_ground"]["heights"],
        terrainEntityLayers, layerMasks, modifications,
        MW_Rend_GetRenderedPositionForWorldPosition(MW_Rend_GetWorldPosForRegionIndex(
            new Vector2Int(terrainInfoObject["region_x"], terrainInfoObject["region_y"]))),
            Quaternion.identity, null, "TerrainTile-" + terrainInfoObject["region_x"] + "." + terrainInfoObject["region_y"],
            "MW_Rend_EnableTerrain");
    worldRenderingModule.terrainTiles[terrainInfoObject["region_x"] + "." + terrainInfoObject["region_y"]] = terrainEntity;
    
    Context.DefineContext("MainContext", this);
}

function MW_Rend_OnEntitiesReceived(entityInfo) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");

    var entities = JSON.parse(entityInfo);
    
    if (entities["region_x"] == null) {
        Logging.LogError("MW_Rend_OnEntitiesReceived: Unable to get region X index.");
        return;
    }

    if (entities["region_y"] == null) {
        Logging.LogError("MW_Rend_OnEntitiesReceived: Unable to get region Y index.");
        return;
    }
    
    var terrainTile = worldRenderingModule.terrainTiles[entities["region_x"] + "." + entities["region_y"]];
    if (terrainTile == null) {
        Logging.LogError("MW_Rend_OnEntitiesReceived: Unable to get terrain tile.");
        return;
    }

    for (var entity in entities.entities) {
        var entityName = WorldStorage.GetItem("METAWORLD.CONFIGURATION.ENTITYID." +
            entities.entities[entity].entityid);
        var variantName = WorldStorage.GetItem("METAWORLD.CONFIGURATION.VARIANTID."
            + entities.entities[entity].entityid + "." + entities.entities[entity].variantid);
        var entityPos =
            new Vector3(entities.entities[entity].xposition, entities.entities[entity].yposition,
                entities.entities[entity].zposition);
        var entityType = configModule.entitiesConfig[entityName].variants[variantName].type;
        if (entityType == null || entityType == "") {
            entityType = "mesh";
        }
        
        MW_Entity_LoadEntity(entityType, entities.entities[entity].instanceid, null, null, entities.entities[entity].entityid,
            entities.entities[entity].variantid, configModule.entitiesConfig[entityName].variants[variantName].model,
            configModule.entitiesConfig[entityName].variants[variantName].wheels, entityPos, Vector3.zero,
            new Quaternion(entities.entities[entity].xrotation, entities.entities[entity].yrotation,
            entities.entities[entity].zrotation, entities.entities[entity].wrotation),
            configModule.entitiesConfig[entityName].variants[variantName].mass,
            configModule.entitiesConfig[entityName].variants[variantName].scripts, false, terrainTile);
    }
    worldRenderingModule.worldLoaded = true;
}

function MW_Rend_OnRegionInfoReceived(regionInfo) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var identityModule = Context.GetContext("IDENTITY_MODULE");
    var region = JSON.parse(regionInfo);
    
    if (region == null) {
        Logging.LogError("MW_Rend_OnRegionInfoReceived: Unable to get region info.");
        return;
    }

    if (region["synchronizer_id"] == null || region["synchronizer_id"] == "") {
        Logging.LogError("MW_Rend_OnRegionInfoReceived: Unable to get synchronizer id.");
        return;
    }

    if (region["synchronizer_tag"] == null || region["synchronizer_tag"] == "") {
        Logging.LogError("MW_Rend_OnRegionInfoReceived: Unable to get synchronizer tag.");
        return;
    }Logging.Log("joining session " + region["synchronizer_id"]);
    VOSSynchronization.JoinSession(configModule.worldConfig["vos-synchronization-service"]["host"],
        configModule.worldConfig["vos-synchronization-service"]["port"],
        configModule.worldConfig["vos-synchronization-service"].tls,
        region["synchronizer_id"], region["synchronizer_tag"], worldRenderingModule.worldOffset, null,
        configModule.worldConfig["vos-synchronization-service"].transport == "tcp" ?
            VSSTransport.TCP : VSSTransport.WebSocket, identityModule.userID, identityModule.token);
    worldRenderingModule.regionSynchronizers[terrainInfoObject["region_x"] + "." + terrainInfoObject["region_y"]]
        = region["synchronizer_id"];
}

function MW_Rend_OnTimeReceived(timeInfo) {
    var time = JSON.parse(timeInfo);
    
    if (time.day === null || time.seconds === null) {
        Logging.LogError("MW_Rend_OnTimeReceived: Invalid time received.");
        return;
    }
    
    MW_Rend_Sun_UpdateSunTimeOfDay(time.seconds);
}

function MW_Rend_OnBiomeInfoReceived(biomeInfo) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");

    if (biomeInfo == null || biomeInfo == "") {
        Logging.LogError("MW_Rend_OnBiomeInfoReceived: Invalid biome info received.");
        return;
    }

    worldRenderingModule.biomeInfo = JSON.parse(biomeInfo);
}

function MW_Rend_SwitchRegion(regionIdx) {

}

function MW_Rend_EnsureRegionsAreLoaded(centerRegionIdx) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    if (worldRenderingModule.regionLoadInProgress == true) {
        return;
    }

    if (worldRenderingModule.terrainTiles[centerRegionIdx.x + "." + centerRegionIdx.y] == null) {
        MW_Rend_LoadRegion(centerRegionIdx);
        return;
    }

    if (worldRenderingModule.terrainTiles[centerRegionIdx.x + "." + (centerRegionIdx.y + 1)] == null) {
        MW_Rend_LoadRegion(new Vector2Int(centerRegionIdx.x, centerRegionIdx.y + 1));
        return;
    }

    if (worldRenderingModule.terrainTiles[(centerRegionIdx.x + 1) + "." + centerRegionIdx.y] == null) {
        MW_Rend_LoadRegion(new Vector2Int(centerRegionIdx.x + 1, centerRegionIdx.y));
        return;
    }

    if (worldRenderingModule.terrainTiles[(centerRegionIdx.x + 1) + "." + (centerRegionIdx.y + 1)] == null) {
        MW_Rend_LoadRegion(new Vector2Int(centerRegionIdx.x + 1, centerRegionIdx.y + 1));
        return;
    }

    if (worldRenderingModule.terrainTiles[centerRegionIdx.x + "." + (centerRegionIdx.y - 1)] == null) {
        MW_Rend_LoadRegion(new Vector2Int(centerRegionIdx.x, centerRegionIdx.y - 1));
        return;
    }

    if (worldRenderingModule.terrainTiles[(centerRegionIdx.x - 1) + "." + centerRegionIdx.y] == null) {
        MW_Rend_LoadRegion(new Vector2Int(centerRegionIdx.x - 1, centerRegionIdx.y));
        return;
    }

    if (worldRenderingModule.terrainTiles[(centerRegionIdx.x - 1) + "." + (centerRegionIdx.y - 1)] == null) {
        MW_Rend_LoadRegion(new Vector2Int(centerRegionIdx.x - 1, centerRegionIdx.y - 1));
        return;
    }

    if (worldRenderingModule.terrainTiles[(centerRegionIdx.x - 1) + "." + (centerRegionIdx.y + 1)] == null) {
        MW_Rend_LoadRegion(new Vector2Int(centerRegionIdx.x - 1, centerRegionIdx.y + 1));
        return;
    }

    if (worldRenderingModule.terrainTiles[(centerRegionIdx.x + 1) + "." + (centerRegionIdx.y - 1)] == null) {
        MW_Rend_LoadRegion(new Vector2Int(centerRegionIdx.x + 1, centerRegionIdx.y - 1));
        return;
    }
}

function MW_Rend_UnloadUnnecessaryRegions(centerRegionIdx) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    for (const tile in worldRenderingModule.terrainTiles) {
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
            worldRenderingModule.terrainTiles[tile].Delete(false);
            delete worldRenderingModule.terrainTiles[tile];
        }
    }
}

function MW_Rend_EnsureCharacterIsInCorrectSession() {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var characterController = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");

    if (characterController.characterEntity === null) {
        return;
    }

    if (worldRenderingModule) {

    }

    if (worldRenderingModule.characterSynchronizer == null) {
        if (worldRenderingModule.regionSynchronizers[worldRenderingModule.currentRegion.x
            + "." + worldRenderingModule.currentRegion.y] == null) {
                return;
        }

        if (!VOSSynchronization.IsSessionEstablished(
            worldRenderingModule.regionSynchronizers[worldRenderingModule.currentRegion.x
            + "." + worldRenderingModule.currentRegion.y])) {
            return;
        }

        VOSSynchronization.StartSynchronizingEntity(
            worldRenderingModule.regionSynchronizers[worldRenderingModule.currentRegion.x
            + "." + worldRenderingModule.currentRegion.y], characterController.characterEntity.id, true);
        worldRenderingModule.characterSynchronizer
            = worldRenderingModule.currentRegion.x + "." + worldRenderingModule.currentRegion.y;
    }
    else if (worldRenderingModule.characterSynchronizer
        != worldRenderingModule.currentRegion.x + "." + worldRenderingModule.currentRegion.y) {
        VOSSynchronization.StopSynchronizingEntity(
            worldRenderingModule.regionSynchronizers[worldRenderingModule.characterSynchronizer],
            characterController.characterEntity.id);
        
        if (!VOSSynchronization.IsSessionEstablished(
            worldRenderingModule.regionSynchronizers[worldRenderingModule.currentRegion.x
            + "." + worldRenderingModule.currentRegion.y])) {
            return;
        }
        worldRenderingModule.characterSynchronizer = null;
        
        VOSSynchronization.StartSynchronizingEntity(
            worldRenderingModule.regionSynchronizers[worldRenderingModule.currentRegion.x
            + "." + worldRenderingModule.currentRegion.y], characterController.characterEntity.id, true);
        worldRenderingModule.characterSynchronizer
            = worldRenderingModule.currentRegion.x + "." + worldRenderingModule.currentRegion.y;
    }
}

function MW_Rend_LoadRegion(regionIdx) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var identityModule = Context.GetContext("IDENTITY_MODULE");
    if (worldRenderingModule == null || configModule == null || identityModule == null) {
        Logging.LogError("MW_Rend_LoadRegion: Unable to get modules.");
    }
    else {
        worldRenderingModule.regionLoadInProgress = true;
        worldRenderingModule.terrainTiles[(regionIdx.x + "." + regionIdx.y)] = "loading";
        MW_REST_SendGetTerrainRequest(
            configModule.worldConfig["world-state-service"], regionIdx,
            identityModule.userID, identityModule.token, "MW_Rend_OnTerrainReceived");
    }
}

function MW_Rend_GetRegionIndexForWorldPos(worldPos) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    if (configModule == null || worldRenderingModule == null) {
        Logging.LogError("MW_Rend_GetRegionIndexForWorldPos: Unable to get modules.");
        return Vector2Int.zero;
    }
    else {
        var regionSize_meters = worldRenderingModule.regionSize * worldRenderingModule.regionScale;
        return new Vector2Int(Math.floor(worldPos.x / regionSize_meters), Math.floor(worldPos.z / regionSize_meters));
    }
}

function MW_Rend_GetWorldPosForRegionIndex(regionIdx) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    if (configModule == null || worldRenderingModule == null) {
        Logging.LogError("MW_Rend_GetWorldPosForRegionIndex: Unable to get modules.");
        return Vector3.zero;
    }
    else {
        var regionSize_meters = worldRenderingModule.regionSize * worldRenderingModule.regionScale;
        return new Vector3(regionIdx.x * regionSize_meters, 0, regionIdx.y * regionSize_meters);
    }
}

function MW_Rend_GetWorldPositionForRenderedPosition(renderedPos) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    if (configModule == null || worldRenderingModule == null) {
        Logging.LogError("MW_Rend_GetWorldPositionForRenderedPosition: Unable to get modules.");
        return Vector3.zero;
    }
    else {
        return new Vector3(renderedPos.z + worldRenderingModule.worldOffset.x, renderedPos.y, renderedPos.x + worldRenderingModule.worldOffset.z);
    }
}

function MW_Rend_GetRenderedPositionForWorldPosition(worldPos) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    if (configModule == null || worldRenderingModule == null) {
        Logging.LogError("MW_Rend_GetRenderedPositionForWorldPosition: Unable to get modules.");
        return Vector3.zero;
    }
    else {
        return new Vector3((worldPos.z - worldRenderingModule.worldOffset.z), worldPos.y, (worldPos.x - worldRenderingModule.worldOffset.x));
    }
}

function MW_Rend_GetWorldPosForRegionPos(regionPos, regionIdx) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    if (configModule == null || worldRenderingModule == null) {
        Logging.LogError("MW_Rend_GetWorldPosForRegionPos: Unable to get modules.");
        return Vector3.zero;
    }
    else {
        var regionSize_meters = worldRenderingModule.regionSize * worldRenderingModule.regionScale;
        return new Vector3(regionIdx.x * regionSize_meters + regionPos.x, regionPos.y, regionIdx.y * regionSize_meters + regionPos.z);
    }
}

function MW_Rend_GetRegionPosForWorldPos(worldPos, regionIdx) {
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    if (configModule == null || worldRenderingModule == null) {
        Logging.LogError("MW_Rend_GetWorldPosForRegionPos: Unable to get modules.");
        return Vector3.zero;
    }
    else {
        var regionSize_meters = worldRenderingModule.regionSize * worldRenderingModule.regionScale;
        return new Vector3(worldPos.z - regionIdx.y * regionSize_meters, worldPos.y,
            worldPos.x - regionIdx.x * regionSize_meters);
    }
}

function MW_Rend_GetIndexForTerrainTile(terrainTile) {
    var terrainTileTag = terrainTile.tag;
    var terrainIndexStart = terrainTileTag.indexOf("-");
    if (terrainIndexStart == -1) {
        Logging.LogError("MW_Rend_GetIndexForTerrainTile: Unable to get index of terrain tile.");
        return;
    }

    var terrainIndexParts = terrainTileTag.substring(terrainIndexStart + 1).split(".");
    if (terrainIndexParts.length != 2) {
        Logging.LogError("MW_Rend_GetIndexForTerrainTile: Invalid terrain tile index.");
        return;
    }

    return new Vector2Int(parseInt(terrainIndexParts[0]), parseInt(terrainIndexParts[1]));
}

function MW_Rend_GetTerrainTileForIndex(index) {
    return Entity.GetByTag("TerrainTile-" + index.x + "." + index.y);
}

function MW_Rend_GetTerrainTileIndexForEntity(entity) {
    var parentTerrain = entity.GetParent();
    if (parentTerrain == null) {
        Logging.Log("MW_Rend_GetTerrainTileIndexForEntity: Unable to get parent terrain.");
        return Vector2Int.zero;
    }

    if (!parentTerrain instanceof TerrainEntity) {
        Logging.Log("MW_Rend_GetTerrainTileIndexForEntity: Parent entity not terrain.");
        return Vector2Int.zero;
    }

    return MW_Rend_GetIndexForTerrainTile(parentTerrain);
}

function MW_Rend_GetMaterialForDigging(regionIdx, height) { // biome id for a given region
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    if (configModule == null || worldRenderingModule == null) {
        Logging.LogError("MW_Rend_GetMaterialForDigging: Unable to get modules.");
        return;
    }

    var biomeID = worldRenderingModule.biomeMap[regionIdx.x + "." + regionIdx.y];
    if (biomeID == null) {
        Logging.LogError("MW_Rend_GetMaterialForDigging: Unable to get biome ID.");
        return;
    }

    var terrainLayers = worldRenderingModule.biomeInfo[biomeID]["terrain-layers"];

    var diggingLayer = 0;
    for (var i = 0; i < Object.keys(terrainLayers).length; i++) {
        var terrainLayer = terrainLayers[Object.keys(terrainLayers)[i]];
        if (terrainLayer["max-height"] <= height) {
            diggingLayer = Object.keys(terrainLayers)[i];
        }
    }

    var randomizer = Math.random();
    if (randomizer < 0.125) {
        if (diggingLayer - 1 < 0) {
            return diggingLayer;
        }
        else {
            return diggingLayer - 1;
        }
    }
    else if (randomizer < 0.875) {
        return diggingLayer;
    }
    else {
        if (parseInt(diggingLayer) + 1 >= Object.keys(terrainLayers).length) {
            return diggingLayer;
        }
        else {
            return parseInt(diggingLayer) + 1;
        }
    }
}