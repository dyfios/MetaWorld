class EnvironmentModifier {
    constructor() {
        Logging.Log("Initializing Environment Modifier...");

        Logging.Log("Environment Modifier Initialized.");
    }
}

function MW_Input_EnvMod_HandleLeftPress() {
    var entityModule = Context.GetContext("ENTITY_MODULE");
    //var digMode = WorldStorage.GetItem("DIG-MODE");
    var interactionMode = WorldStorage.GetItem("INTERACTION-MODE");

    var hitInfo = Input.GetPointerRaycast(Vector3.forward);

    if (interactionMode == "HAND") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo instanceof AutomobileEntity) {
                    
                }
                else if (hitInfo.entity instanceof AirplaneEntity) {
                    
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-1") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-2") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 2);
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-4") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 4);
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-8") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 8);
                }
            }
        }
    }
    else if (interactionMode == "SLEDGE-HAMMER") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof MeshEntity || hitInfo.entity instanceof AirplaneEntity) {
                    MW_Input_EnvMod_DeleteEntity(hitInfo.entity);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-0") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 0);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-1") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-2") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 2);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-3") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 3);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-4") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 4);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-5") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 5);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-6") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 6);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-7") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 7);
                }
            }
        }
    }
    else if (interactionMode == "ENTITY-PLACING") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity || hitInfo.entity instanceof MeshEntity) {
                    WorldStorage.SetItem("ENTITY-KEEP-SPAWNING", "TRUE");
                    entityModule.entityPlacement.StopPlacing();
                }
            }
        }
    }

    /*var hitInfo = Input.GetPointerRaycast(Vector3.forward);
    
    if (hitInfo != null) {
        if (hitInfo.entity != null) {
            if (hitInfo instanceof AutomobileEntity) {
                MW_Input_EnvMod_PlaceCharacterInAutomobile(hitInfo.entity);
            }
            else if (hitInfo.entity instanceof AirplaneEntity) {
                MW_Input_EnvMod_PlaceCharacterInAirplane(hitInfo.entity);
            }
            else if (hitInfo.entity instanceof TerrainEntity) {
                if (digMode != 0) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo);
                }

                MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo);
            }

            /*if (hitInfo instanceof AutomobileEntity) {
                MW_Input_EnvMod_PlaceCharacterInAutomobile(hitInfo.entity);
            }
            else if (hitInfo.entity instanceof AirplaneEntity) {
                MW_Input_EnvMod_PlaceCharacterInAirplane(hitInfo.entity);
            }
            else if (hitInfo.entity instanceof TerrainEntity) {
                MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo);
            }
            else if (hitInfo.entity instanceof MeshEntity) {

            }
        }
    }*/
}

function MW_Input_EnvMod_HandleRightPress() {
    var entityModule = Context.GetContext("ENTITY_MODULE");

    var interactionMode = WorldStorage.GetItem("INTERACTION-MODE");

    var hitInfo = Input.GetPointerRaycast(Vector3.forward);

    if (interactionMode == "HAND") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof AutomobileEntity) {
                    MW_Input_EnvMod_PlaceCharacterInAutomobile(hitInfo.entity);
                }
                else if (hitInfo.entity instanceof AirplaneEntity) {
                    MW_Input_EnvMod_PlaceCharacterInAirplane(hitInfo.entity);
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-1") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-2") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-4") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-8") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    
                }
            }
        }
    }
    else if (interactionMode == "SLEDGE-HAMMER") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof MeshEntity) {
                    
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-0") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-1") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-2") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-3") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-4") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-5") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-6") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-7") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "ENTITY-PLACING") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity || hitInfo.entity instanceof MeshEntity) {
                    entityModule.entityPlacement.CancelPlacing();
                }
            }
        }
    }


    /*entityModule.entityPlacement.StopPlacing();
    
    var hitInfo = Input.GetPointerRaycast(Vector3.forward);
    
    if (hitInfo != null) {
        if (hitInfo.entity != null) {
            if (hitInfo instanceof AutomobileEntity) {
                MW_Input_EnvMod_DeleteEntity(hitInfo.entity);
            }
            else if (hitInfo.entity instanceof AirplaneEntity) {
                MW_Input_EnvMod_DeleteEntity(hitInfo.entity);
            }
            else if (hitInfo.entity instanceof TerrainEntity) {
                MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo);
            }
            else if (hitInfo.entity instanceof MeshEntity) {
                MW_Input_EnvMod_DeleteEntity(hitInfo.entity);
            }
        }
    }*/
}

function MW_Input_EnvMod_HandleTriggerPress() {
    var entityModule = Context.GetContext("ENTITY_MODULE");
    var interactionMode = WorldStorage.GetItem("INTERACTION-MODE");

    var hitInfo = Input.GetPointerRaycast(Vector3.forward, 1);

    if (interactionMode == "HAND") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo instanceof AutomobileEntity) {
                    
                }
                else if (hitInfo.entity instanceof AirplaneEntity) {
                    
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-1") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-2") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 2);
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-4") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 4);
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-8") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 8);
                }
            }
        }
    }
    else if (interactionMode == "SLEDGE-HAMMER") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof MeshEntity || hitInfo.entity instanceof AirplaneEntity) {
                    MW_Input_EnvMod_DeleteEntity(hitInfo.entity);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-0") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 0);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-1") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-2") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 2);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-3") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 3);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-4") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 4);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-5") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 5);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-6") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 6);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-7") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo, 7);
                }
            }
        }
    }
    else if (interactionMode == "ENTITY-PLACING") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity || hitInfo.entity instanceof MeshEntity) {
                    WorldStorage.SetItem("ENTITY-KEEP-SPAWNING", "TRUE");
                    entityModule.entityPlacement.StopPlacing();
                }
            }
        }
    }



    /*var entityModule = Context.GetContext("ENTITY_MODULE");

    entityModule.entityPlacement.StopPlacing();

    var hitInfo = Input.GetPointerRaycast(Vector3.forward, 1);

    if (hitInfo != null) {
        if (hitInfo.entity != null) {
            if (hitInfo.entity.Dig != null) {
                MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo);
            }

            if (WorldStorage.GetItem("ENTITY-DELETE-ENABLED") == "TRUE") {
                if (hitInfo.entity instanceof MeshEntity || hitInfo.entity instanceof AutomobileEntity) {
                    MW_Input_EnvMod_DeleteEntity(hitInfo.entity);
                }
            }
        }
    }*/
}

function MW_Input_EnvMod_HandleGripPress() {
    var entityModule = Context.GetContext("ENTITY_MODULE");

    var interactionMode = WorldStorage.GetItem("INTERACTION-MODE");

    var hitInfo = Input.GetPointerRaycast(Vector3.forward, 1);

    if (interactionMode == "HAND") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo instanceof AutomobileEntity) {
                    MW_Input_EnvMod_PlaceCharacterInAutomobile(hitInfo.entity);
                }
                else if (hitInfo.entity instanceof AirplaneEntity) {
                    MW_Input_EnvMod_PlaceCharacterInAirplane(hitInfo.entity);
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-1") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-2") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-4") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    
                }
            }
        }
    }
    else if (interactionMode == "SQUARE-SHOVEL-8") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    
                }
            }
        }
    }
    else if (interactionMode == "SLEDGE-HAMMER") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof MeshEntity) {
                    
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-0") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-1") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-2") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-3") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-4") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-5") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-6") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "TERRAIN-LAYER-7") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity) {
                    MW_Input_EnvMod_PerformDig(hitInfo.entity, hitInfo, 1);
                }
            }
        }
    }
    else if (interactionMode == "ENTITY-PLACING") {
        if (hitInfo != null) {
            if (hitInfo.entity != null) {
                if (hitInfo.entity instanceof TerrainEntity || hitInfo.entity instanceof MeshEntity) {
                    entityModule.entityPlacement.CancelPlacing();
                }
            }
        }
    }



    /*var entityModule = Context.GetContext("ENTITY_MODULE");

    entityModule.entityPlacement.CancelPlacing();

    var hitInfo = Input.GetPointerRaycast(Vector3.forward, 1);

    if (hitInfo != null) {
        if (hitInfo.entity != null) {
            if (hitInfo.entity.Build != null) {
                MW_Input_EnvMod_PerformBuild(hitInfo.entity, hitInfo);
            }
            else {
                if (hitInfo.entity instanceof AutomobileEntity) {
                    MW_Input_EnvMod_PlaceCharacterInAutomobile(hitInfo.entity);
                }
            }
        }
    }*/
}

function MW_Input_EnvMod_OnTerrainDigResponseReceived(response) {
    if (response != null) {
        var parsedResponse = JSON.parse(response);
        if (parsedResponse != null) {
            if (parsedResponse["accepted"] == true) {

            }
            else {
                Logging.Log("Terrain Dig Rejected: " + parsedResponse["response"]);
            }
        }
    }
}

function MW_Input_EnvMod_PerformDig(entityToDigOn, hitInfo, brushSize) {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var identityModule = Context.GetContext("IDENTITY_MODULE");

    //var layerToDig = parseInt(WorldStorage.GetItem("TERRAIN-EDIT-LAYER"));
    //var brushSize = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-SIZE"));
    var brushMinHeight = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-MIN-HEIGHT"));
    var terrainIndex = MW_Rend_GetIndexForTerrainTile(entityToDigOn);
    var gridSize = configModule.terrainConfig["grid-size"];

    //if (layerToDig > -1) { // TODO: replace with configured grid size.
    var alignedHitPoint = new Vector3(
        Math.round(hitInfo.hitPoint.x / gridSize) * gridSize,
        Math.round(hitInfo.hitPoint.y / gridSize) * gridSize,
        Math.round(hitInfo.hitPoint.z / gridSize) * gridSize);

    if (alignedHitPoint.y >= brushMinHeight) {
        var layerToUse = MW_Rend_GetMaterialForDigging(terrainIndex, alignedHitPoint.y);

        entityToDigOn.Dig(alignedHitPoint, TerrainEntityBrushType.roundedCube, layerToUse, brushSize);
        MW_REST_SendTerrainDigRequest(configModule.worldConfig["world-state-service"],
            terrainIndex, alignedHitPoint, layerToUse, brushSize,
            identityModule.userID, identityModule.token, "MW_Input_EnvMod_OnTerrainDigResponseReceived");
        MW_Sync_VSS_SendTerrainDigUpdate(
            worldRenderingModule.regionSynchronizers[terrainIndex.x + "." + terrainIndex.y],
            "{x:" + alignedHitPoint.x + ",y:" + alignedHitPoint.y + ",z:" + alignedHitPoint.z + "}",
            "roundedcube", layerToUse); // TODO add brush size.
    }
    //}
}

function MW_Input_EnvMod_OnTerrainBuildResponseReceived(response) {
    if (response != null) {
        var parsedResponse = JSON.parse(response);
        if (parsedResponse != null) {
            if (parsedResponse["accepted"] == true) {

            }
            else {
                Logging.Log("Terrain Build Rejected: " + parsedResponse["response"]);
            }
        }
    }
}

function MW_Input_EnvMod_PerformBuild(entityToBuildOn, hitInfo, layerToBuild, brushSize) {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var identityModule = Context.GetContext("IDENTITY_MODULE");

    //var layerToBuild = parseInt(WorldStorage.GetItem("TERRAIN-EDIT-LAYER"));
    var brushSize = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-SIZE"));
    var brushMaxHeight = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-MAX-HEIGHT"));
    var terrainIndex = MW_Rend_GetIndexForTerrainTile(entityToBuildOn);
    var gridSize = configModule.terrainConfig["grid-size"];
    if (layerToBuild > -1) {
        var alignedHitPoint = new Vector3( // TODO: replace with configured grid size.
            Math.round(hitInfo.hitPoint.x / gridSize) * gridSize,
            Math.round(hitInfo.hitPoint.y / gridSize) * gridSize,
            Math.round(hitInfo.hitPoint.z / gridSize) * gridSize);
        if (alignedHitPoint.y <= brushMaxHeight) {
            entityToBuildOn.Build(alignedHitPoint, TerrainEntityBrushType.roundedCube, layerToBuild, brushSize);
            MW_REST_SendTerrainBuildRequest(configModule.worldConfig["world-state-service"],
                terrainIndex, alignedHitPoint, layerToBuild, brushSize,
                identityModule.userID, identityModule.token, "MW_Input_EnvMod_OnTerrainBuildResponseReceived");
            MW_Sync_VSS_SendTerrainBuildUpdate(
                worldRenderingModule.regionSynchronizers[terrainIndex.x + "." + terrainIndex.y],
                "{x:" + alignedHitPoint.x + ",y:" + alignedHitPoint.y + ",z:" + alignedHitPoint.z + "}",
                "roundedcube", layerToBuild); // TODO add brush size.
        }
    }
}

function MW_Input_EnvMod_PerformRotate(direction, negative) {
    entityModule.entityPlacement.RotateOneStep(direction, negative);
}

function MW_Input_EnvMod_OnEntityDeleteResponseReceived(response) {
    if (response != null) {
        var parsedResponse = JSON.parse(response);
        if (parsedResponse != null) {
            if (parsedResponse["accepted"] == true) {

            }
            else {
                Logging.Log("Entity Delete Rejected: " + parsedResponse["response"]);
            }
        }
    }
}

function MW_Input_EnvMod_DeleteEntity(entityToDelete) {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
    var identityModule = Context.GetContext("IDENTITY_MODULE");

    var terrainIndex = MW_Rend_GetTerrainTileIndexForEntity(entityToDelete);
    MW_REST_SendDeleteEntityRequest(configModule.worldConfig["world-state-service"],
        terrainIndex, entityToDelete.id.ToString(),
        identityModule.userID, identityModule.token, "MW_Input_EnvMod_OnEntityDeleteResponseReceived");
    MW_Sync_VSS_SendEntityDeleteUpdate(
        worldRenderingModule.regionSynchronizers[terrainIndex.x + "." + terrainIndex.y],
        entityToDelete.id.ToString());
    MW_Script_RemoveIntervalScripts(entityToDelete.id.ToString());
    MW_Script_RunOnDestroyScript(entityToDelete.id.ToString());
    entityToDelete.Delete();
}

function MW_Input_EnvMod_PlaceCharacterInAutomobile(automobileEntity) {
    MW_Player_ThirdPerson_PlaceCharacterInAutomobileEntity(automobileEntity);
}

function MW_Input_EnvMod_PlaceCharacterInAirplane(airplaneEntity) {
    MW_Player_ThirdPerson_PlaceCharacterInAirplaneEntity(airplaneEntity);
}