function EnableTerrain(terrain) {
    terrain.SetInteractionState(InteractionState.Physical);
    terrain.SetVisibility(true);

    // Set up entities.
    if (configContext == null) {
        Logging.LogError("EnableTerrain: Unable to get context.");
    }
    else {
        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/getentities", "OnEntitiesReceived");
    }
}

function EnableWater(water) {
    water.SetInteractionState(InteractionState.Static);
    water.SetVisibility(true);
}

async function OnTerrainReceived(terrainInfo) {
    terrainInfoObject = JSON.parse(terrainInfo);
    
    if (terrainInfoObject == null) {
        Logging.LogError("OnTerrainReceived: Unable to get terrain info.");
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
    for (var terrainLayer in configContext.terrainConfig.layers) {
        var index = configContext.terrainConfig.layers[terrainLayer].layer;
        terrainEntityLayers[index] = new TerrainEntityLayer();
        terrainEntityLayers[index].diffuseTexture = configContext.terrainConfig.layers[terrainLayer].color_texture;
        terrainEntityLayers[index].normalTexture = configContext.terrainConfig.layers[terrainLayer].normal_texture;
        terrainEntityLayers[index].maskTexture = "";
        terrainEntityLayers[index].specular = Color.black;
        terrainEntityLayers[index].smoothness = 0;
        terrainEntityLayers[index].metallic = 0;
        terrainEntityLayers[index].sizeFactor = 8;
        terrainEntityLayerMasks[index] = new TerrainEntityLayerMask(new Array(512).fill().map(() => new Array(512).fill(0)));
    }

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

    this.terrainEntity = TerrainEntity.CreateHybrid(null, 1024, 1024, 512, terrainInfoObject["base_ground"]["heights"],
        terrainEntityLayers, layerMasks, modifications, Vector3.zero, Quaternion.identity,
        null, null, "EnableTerrain");
    
    this.waterEntity = WaterEntity.CreateWaterBody(null, Color.cyan, new Color(0, 66 / 255, 102 / 255, 1), Color.white, Color.blue, -2, 6, 32, 0.675,
        1, 1, 0.5, 2, 8, 128, 1, new Vector3(512, 127, 512), Quaternion.identity, new Vector3(4096, 1, 4096), null, null, "EnableWater");
    Context.DefineContext("MainContext", this);
}

function OnEntitiesReceived(entityInfo) {
    var context = Context.GetContext("WORLDRENDERERCONTEXT");
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
    context.worldLoaded = true;
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

                        // Set up sky.
                        Environment.SetSkyTexture(configContext.worldURI + "/" + configContext.worldConfig["sky-texture"]);
                        
                        // Set up terrain.
                        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] +
                        "/getterrain?minX=0&maxX=512&minY=0&maxY=512" ,
                        "OnTerrainReceived");
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