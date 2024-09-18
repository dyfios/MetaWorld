function EnableTerrain(terrain) {
    terrain.SetInteractionState(InteractionState.Physical);
    terrain.SetVisibility(true);
}

function OnTerrainReceived(terrainInfo) {
    terrainInfoObject = JSON.parse(terrainInfo);
    
    if (terrainInfoObject == null) {
        Logging.LogError("OnTerrainReceived: Unable to get terrain info.");
        return;
    }
    
    if (terrainInfoObject["base-ground"] == null) {
        Logging.LogError("OnTerrainReceived: Unable to get base ground.");
        return;
    }
    
    if (terrainInfoObject["ground_mods"] == null) {
        Logging.LogError("OnTerrainReceived: Unable to get ground mods.");
        return;
    }
    
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    
    heights = new Array(512).fill().map(() => new Array(512).fill(0));
    
    terrainEntityLayers = [];
    for (var terrainLayer in configContext.terrainConfig.layers) {
        var index = configContext.terrainConfig.layers[terrainLayer].layer;
        terrainEntityLayers[index] = new TerrainEntityLayer();
        terrainEntityLayers[index].diffuseTexture = configContext.terrainConfig.layers[terrainLayer].color_texture;
        terrainEntityLayers[index].normalTexture = configContext.terrainConfig.layers[terrainLayer].normal_texture;
        terrainEntityLayers[index].maskTexture = "";
        terrainEntityLayers[index].specular = Color.black;
        terrainEntityLayers[index].smoothness = 0;
        terrainEntityLayers[index].metallic = 0;
    }
    
    layerMasks = new TerrainEntityLayerMaskCollection();
    layerMasks.AddLayerMask(new TerrainEntityLayerMask(new Array(512).fill().map(() => new Array(512).fill(0.5))));
    
    for (i = 0; i < terrainInfoObject["base-ground"].length; i++) {
        if (terrainInfoObject["base-ground"][i] == null) {
            Logging.LogError("OnTerrainReceived: Invalid ground entry at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["base-ground"][i]["xindex"] == null) {
            Logging.LogError("OnTerrainReceived: Invalid ground entry xindex at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["base-ground"][i]["yindex"] == null) {
            Logging.LogError("OnTerrainReceived: Invalid ground entry yindex at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["base-ground"][i]["height"] == null) {
            Logging.LogError("OnTerrainReceived: Invalid ground entry height at index " + i + ".");
            continue;
        }
        
        if (terrainInfoObject["base-ground"][i]["layerid"] == null) {
            Logging.LogError("OnTerrainReceived: Invalid ground entry layerid at index " + i + ".");
            continue;
        }
        
        xIdx = terrainInfoObject["base-ground"][i]["xindex"];
        yIdx = terrainInfoObject["base-ground"][i]["yindex"];
        height = terrainInfoObject["base-ground"][i]["height"];
        heights[xIdx][yIdx] = parseInt(height) / 32;
        Logging.Log(heights[xIdx][yIdx]);
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
        
        mod = new TerrainEntityModification(operation, position, brushType, lyr);
        modifications.push(mod);
    }
    
    this.terrainEntity = TerrainEntity.CreateHybrid(null, 128, 128, 32, heights, terrainEntityLayers, layerMasks,
        modifications, Vector3.zero, Quaternion.identity, null, null, "EnableTerrain");
    Context.DefineContext("MainContext", this);
}

function OnEntitiesReceived(entityInfo) {
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    var entities = JSON.parse(entityInfo);
    
    for (var entity in entities.entities) {
        var entityName = WorldStorage.GetItem("METAWORLD.CONFIGURATION.ENTITYID." + entities.entities[entity].entityid);
        var variantName = WorldStorage.GetItem("METAWORLD.CONFIGURATION.VARIANTID." + entities.entities[entity].entityid + "." + entities.entities[entity].variantid);
        
        LoadEntity(entities.entities[entity].instanceid, null, null, entities.entities[entity].entityid, entities.entities[entity].variantid,
            configContext.entitiesConfig[entityName].variants[variantName].model,
            new Vector3(entities.entities[entity].xposition, entities.entities[entity].yposition, entities.entities[entity].zposition),
            Vector3.zero,
            new Quaternion(entities.entities[entity].xrotation, entities.entities[entity].yrotation, entities.entities[entity].zrotation, entities.entities[entity].wrotation),
            new Vector3(configContext.entitiesConfig[entityName].variants[variantName].grid_size.x,
                configContext.entitiesConfig[entityName].variants[variantName].grid_size.y,
                configContext.entitiesConfig[entityName].variants[variantName].grid_size.z), false);
    }
}

function OnTimeReceived(timeInfo) {
    var time = JSON.parse(timeInfo);
    
    if (time.day === null || time.seconds === null) {
        Logging.LogError("OnTimeReceived: Invalid time received.");
        return;
    }
    
    this.sun.UpdateTimeOfDay(time.seconds);
}

class WorldRenderer {
    constructor(startPos) {
        this.worldLoaded = false;
        Context.DefineContext("WORLDRENDERERCONTEXT", this);
        
        this.LoadWorld = function() {
            Time.SetInterval(`
                var context = Context.GetContext("WORLDRENDERERCONTEXT");
                var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
                if (configContext == null) {
                    Logging.LogError("LoadWorld: Unable to get context.");
                }
                else {
                    if (configContext.worldConfig != null && context.worldLoaded == false) {
                        // Set up sun.
                        this.sun = new Sun(configContext.worldConfig["base-light-intensity"], configContext.worldConfig["sun-light-intensity"]);
                        
                        // Set up terrain.
                        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/getterrain", "OnTerrainReceived");
                        
                        // Set up entities.
                        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/getentities", "OnEntitiesReceived");
                        context.worldLoaded = true;
                        Context.DefineContext("WORLDRENDERERCONTEXT", this);
                        this.sun.UpdateTimeOfDay(20000);
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