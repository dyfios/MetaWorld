class EntityPlacement {
    constructor() {
        this.placingEntity = null;
        this.entityType = null;
        this.modelOffset = null;
        this.placingOffset = null;
        this.placementLocked = false;
        this.entityIndex = null;
        this.variantIndex = null;
        this.entityID = null;
        this.variantID = null;
        this.instanceID = null;
        this.orientationIndex = 0;
        this.scripts = {};
        
        this.PlacementUpdate = function() {
            var normalPlacementThreshold = 0.5;
            var entityPlacementComponent = Context.GetContext("ENTITY_PLACEMENT_COMPONENT");
            if (entityPlacementComponent == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }
            
            if (entityPlacementComponent.placingEntity == null) {
                //Logging.Log("[EntityPlacer] Placing Entity is null.");
                return;
            }
            
            if (entityPlacementComponent.modelOffset == null) {
                Logging.LogError("[EntityPlacer] Model Offset is null.");
                return;
            }
            
            if (entityPlacementComponent.modelOffset.x == null ||
                entityPlacementComponent.modelOffset.y == null ||
                entityPlacementComponent.modelOffset.z == null) {
                Logging.LogError("[EntityPlacer] Model Offset invalid.");
                return;
            }

            var gridEnabled = false;
            if (WorldStorage.GetItem("ENTITY-GRID-ENABLED") == "TRUE") {
                gridEnabled = true;
            }

            var gridSize = WorldStorage.GetItem("ENTITY-GRID-SIZE");
            if (gridSize === null || gridSize <= 0) {
                gridSize = 1;
            }

            /*if (Input.IsVR) {
                var gridSnappedPosition = Input.GetRightHandPosition();
                if (gridEnabled) {
                    gridSnappedPosition = new Vector3(
                        Math.round(gridSnappedPosition.x / gridSize) *
                            gridSize + entityPlacementComponent.modelOffset.x,
                        Math.round(gridSnappedPosition.y / gridSize) *
                            gridSize + entityPlacementComponent.modelOffset.y,
                        Math.round(gridSnappedPosition.z / gridSize) *
                            gridSize + entityPlacementComponent.modelOffset.z);
                }
                else {
                    gridSnappedPosition = new Vector3(
                        gridSnappedPosition.x + entityPlacementComponent.modelOffset.x,
                        gridSnappedPosition.y + entityPlacementComponent.modelOffset.y,
                        gridSnappedPosition.z + entityPlacementComponent.modelOffset.z);
                }
                entityPlacementComponent.placingEntity.SetPosition(
                    gridSnappedPosition, false, false);
                entityPlacementComponent.placingEntity.SetRotation(
                    Input.GetRightHandRotation(), false, false);
                return;
            }*/

            var hitInfo = Input.GetPointerRaycast(Vector3.forward);
            if (hitInfo != null) {
                if (hitInfo.entity != null) {
                    if (hitInfo.entity != entityPlacementComponent.placingEntity) {
                        var gridSnappedPosition;
                        if (gridEnabled) {
                            gridSnappedPosition = new Vector3(
                                Math.round(hitInfo.hitPoint.x / gridSize) *
                                    gridSize + entityPlacementComponent.modelOffset.x,
                                Math.round(hitInfo.hitPoint.y / gridSize) *
                                    gridSize + entityPlacementComponent.modelOffset.y,
                                Math.round(hitInfo.hitPoint.z / gridSize) *
                                    gridSize + entityPlacementComponent.modelOffset.z);
                            if (hitInfo.hitPointNormal.x >= normalPlacementThreshold) {
                                gridSnappedPosition.x += gridSize;
                            }
                            else if (hitInfo.hitPointNormal.x <= -1 * normalPlacementThreshold) {
                                gridSnappedPosition.x -= gridSize;
                            }
                            
                            if (hitInfo.hitPointNormal.y >= normalPlacementThreshold) {
                                //gridSnappedPosition.y += gridSize;
                            }
                            else if (hitInfo.hitPointNormal.y <= -1 * normalPlacementThreshold) {
                                gridSnappedPosition.y -= gridSize;
                            }
                            
                            if (hitInfo.hitPointNormal.z >= normalPlacementThreshold) {
                                //gridSnappedPosition.z += gridSize;
                            }
                            else if (hitInfo.hitPointNormal.z <= -1 * normalPlacementThreshold) {
                                gridSnappedPosition.z -= gridSize;
                            }
                        }
                        else {
                            gridSnappedPosition = new Vector3(
                                hitInfo.hitPoint.x + entityPlacementComponent.modelOffset.x,
                                hitInfo.hitPoint.y + entityPlacementComponent.modelOffset.y,
                                hitInfo.hitPoint.z + entityPlacementComponent.modelOffset.z);
                        }
                        
                        entityPlacementComponent.placingEntity.SetPosition(gridSnappedPosition, false, false);
                    }
                }
            }
        }
        
        this.StopPlacing = function() {
            var configModule = Context.GetContext("CONFIGURATION_MODULE");
            var identityModule = Context.GetContext("IDENTITY_MODULE");

            var entityPlacementComponent = Context.GetContext("ENTITY_PLACEMENT_COMPONENT");
            if (entityPlacementComponent == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }

            var worldRenderingModule = Context.GetContext("WORLD_RENDERING_MODULE");
            if (worldRenderingModule == null) {
                Logging.LogError("[EntityPlacer] Unable to get renderer context.");
                return;
            }
            
            var keepSpawning = false;
            if (WorldStorage.GetItem("ENTITY-KEEP-SPAWNING") === "TRUE") {
                keepSpawning = true;
            }

            if (entityPlacementComponent.placingEntity == null) {
                if (keepSpawning === true) {
                    var instanceUUID = UUID.NewUUID().ToString();
                MW_Entity_LoadEntity(entityPlacementComponent.entityType, instanceUUID, entityPlacementComponent.entityIndex,
                    entityPlacementComponent.variantIndex, entityPlacementComponent.entityID, entityPlacementComponent.variantID,
                    entityPlacementComponent.modelPath, null, entityPlacementComponent.modelOffset,
                    entityPlacementComponent.placingOffset, entityPlacementComponent.modelRotation, null);
                }
                return;
            }
            
            if (entityPlacementComponent.placementLocked == true) {
                return;
            }
            
            var pos = MW_Rend_GetWorldPositionForRenderedPosition(entityPlacementComponent.placingEntity.GetPosition(false));
            var rot = entityPlacementComponent.placingEntity.GetRotation(false);
            var terrainIndex = MW_Rend_GetRegionIndexForWorldPos(pos);
            var regionPos = MW_Rend_GetRegionPosForWorldPos(pos, terrainIndex);
            MW_REST_SendPositionEntityRequest(configModule.worldConfig["world-state-service"], terrainIndex,
                entityPlacementComponent.entityID, entityPlacementComponent.variantID, entityPlacementComponent.instanceID,
                regionPos, rot, identityModule.userID, identityModule.token, "MW_Entity_Placement_OnPositionEntityResponseReceived");
            
            var regionIndex = MW_Rend_GetRegionIndexForWorldPos(pos);
            MW_Sync_VSS_SendEntityAddUpdate(worldRenderingModule.regionSynchronizers[regionIndex.x + "." + regionIndex.y],
                entityPlacementComponent.instanceID, "{x:" + pos.x + ",y:" + pos.y + ",z:" + pos.z + "}",
                "{x:" + rot.x + ",y:" + rot.y + ",z:" + rot.z + ",w:" + rot.w + "}");
            
            if (entityPlacementComponent.scripts != null) {
                MW_Script_AddScriptEntity(entityPlacementComponent.placingEntity, entityPlacementComponent.scripts);

                MW_Script_RunOnCreateScript(entityPlacementComponent.placingEntity.id);

                if (entityPlacementComponent.scripts["0_25_update"]) {
                    MW_Script_Add0_25IntervalScript(entityPlacementComponent.placingEntity, entityPlacementComponent.scripts["0_25_update"]);
                }

                if (entityPlacementComponent.scripts["0_5_update"]) {
                    MW_Script_Add0_5IntervalScript(entityPlacementComponent.placingEntity, entityPlacementComponent.scripts["0_5_update"]);
                }

                if (entityPlacementComponent.scripts["1_0_update"]) {
                    MW_Script_Add1_0IntervalScript(entityPlacementComponent.placingEntity, entityPlacementComponent.scripts["1_0_update"]);
                }

                if (entityPlacementComponent.scripts["2_0_update"]) {
                    MW_Script_Add2_0IntervalScript(entityPlacementComponent.placingEntity, entityPlacementComponent.scripts["2_0_update"]);
                }
            }

            entityPlacementComponent.placingEntity.SetParent(MW_Rend_GetTerrainTileForIndex(terrainIndex));
            entityPlacementComponent.placingEntity.SetHighlight(false);
            if (entityPlacementComponent.placingEntity instanceof AutomobileEntity) {
                entityPlacementComponent.placingEntity.SetInteractionState(InteractionState.Physical);
            }
            entityPlacementComponent.placingEntity = null;
            
            if (keepSpawning === true) {
                var instanceUUID = UUID.NewUUID().ToString();
                MW_Entity_LoadEntity(entityPlacementComponent.entityType, instanceUUID, entityPlacementComponent.entityIndex, entityPlacementComponent.variantIndex,
                    entityPlacementComponent.entityID, entityPlacementComponent.variantID, entityPlacementComponent.modelPath, null, entityPlacementComponent.modelOffset,
                    entityPlacementComponent.placingOffset, entityPlacementComponent.modelRotation, null);
            }

            Context.DefineContext("ENTITY_PLACEMENT_COMPONENT", entityPlacementComponent);
            WorldStorage.SetItem("ENTITY-BEING-PLACED", "FALSE");
            Input.TurnLocomotionMode = Input.VRTurnLocomotionMode.Snap;
        }

        this.CancelPlacing = function() {
            var entityPlacementComponent = Context.GetContext("ENTITY_PLACEMENT_COMPONENT");
            if (entityPlacementComponent == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }

            if (entityPlacementComponent.placingEntity != null) {
                entityPlacementComponent.placingEntity.Delete();
                entityPlacementComponent.placingEntity = null;
            }

            Context.DefineContext("ENTITY_PLACEMENT_COMPONENT", entityPlacementComponent);
            WorldStorage.SetItem("ENTITY-BEING-PLACED", "FALSE");
            Input.TurnLocomotionMode = Input.VRTurnLocomotionMode.Snap;
        }
        
        this.EnterDeleteMode = function() {
            var entityPlacementComponent = Context.GetContext("ENTITY_PLACEMENT_COMPONENT");
            if (entityPlacementComponent == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }
            
            entityPlacementComponent.StopPlacing();
            WorldStorage.SetItem("ENTITY-DELETE-ENABLED", "TRUE");
        }
        
        this.ExitDeleteMode = function() {
            var entityPlacementComponent = Context.GetContext("ENTITY_PLACEMENT_COMPONENT");
            if (entityPlacementComponent == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }
            
            WorldStorage.SetItem("ENTITY-DELETE-ENABLED", "FALSE");
        }
        
        this.ToggleOrientation = function() {
            var entityPlacementComponent = Context.GetContext("ENTITY_PLACEMENT_COMPONENT");
            if (entityPlacementComponent == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }
            
            if (entityPlacementComponent.placingEntity == null) {
                //Logging.LogWarning("[EntityPlacer] Placing Entity not assigned. Cannot orient.");
                return;
            }
            
        var configModule = Context.GetContext("CONFIGURATION_MODULE");
            
            entityPlacementComponent.orientationIndex++;
            if (entityPlacementComponent.orientationIndex > configModule.entitiesConfig[entityPlacementComponent.entityIndex].variants[entityPlacementComponent.variantIndex].valid_orientations.length - 1) {
                entityPlacementComponent.orientationIndex = 0;
            }
            
            entityPlacementComponent.placingEntity.SetPosition(new Vector3(
                configModule.entitiesConfig[entityPlacementComponent.entityIndex].variants[entityPlacementComponent.variantIndex].valid_orientations[entityPlacementComponent.orientationIndex].model_offset.x,
                configModule.entitiesConfig[entityPlacementComponent.entityIndex].variants[entityPlacementComponent.variantIndex].valid_orientations[entityPlacementComponent.orientationIndex].model_offset.y,
                configModule.entitiesConfig[entityPlacementComponent.entityIndex].variants[entityPlacementComponent.variantIndex].valid_orientations[entityPlacementComponent.orientationIndex].model_offset.z), false);
            entityPlacementComponent.placingEntity.SetRotation(new Quaternion(
                configModule.entitiesConfig[entityPlacementComponent.entityIndex].variants[entityPlacementComponent.variantIndex].valid_orientations[entityPlacementComponent.orientationIndex].model_rotation.x,
                configModule.entitiesConfig[entityPlacementComponent.entityIndex].variants[entityPlacementComponent.variantIndex].valid_orientations[entityPlacementComponent.orientationIndex].model_rotation.y,
                configModule.entitiesConfig[entityPlacementComponent.entityIndex].variants[entityPlacementComponent.variantIndex].valid_orientations[entityPlacementComponent.orientationIndex].model_rotation.z,
                configModule.entitiesConfig[entityPlacementComponent.entityIndex].variants[entityPlacementComponent.variantIndex].valid_orientations[entityPlacementComponent.orientationIndex].model_rotation.w), false);
            entityPlacementComponent.modelOffset = configModule.entitiesConfig[entityPlacementComponent.entityIndex].variants[entityPlacementComponent.variantIndex].valid_orientations[entityPlacementComponent.orientationIndex].model_offset;
            entityPlacementComponent.placingOffset = configModule.entitiesConfig[entityPlacementComponent.entityIndex].variants[entityPlacementComponent.variantIndex].valid_orientations[entityPlacementComponent.orientationIndex].placement_offset;
            Context.DefineContext("ENTITY_PLACEMENT_COMPONENT", entityPlacementComponent);
        }
        
        this.RotateOneStep = function(axis, negative) {
            var entityPlacementComponent = Context.GetContext("ENTITY_PLACEMENT_COMPONENT");
            if (entityPlacementComponent == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }
            
            if (entityPlacementComponent.placingEntity == null) {
                //Logging.LogWarning("[EntityPlacer] Placing Entity not assigned. Cannot rotate.");
                return;
            }
            
            var currentRot = entityPlacementComponent.placingEntity.GetEulerRotation(false);
            var rotIncrement = WorldStorage.GetItem("ENTITY-ROTATION-INCREMENT");
            if (rotIncrement === null || rotIncrement <= 0) {
                rotIncrement = 90;
            }
            if (negative) {
                rotIncrement = -rotIncrement;
            }

            if (axis === "x") {
                entityPlacementComponent.placingEntity.SetEulerRotation(new Vector3(
                    currentRot.x + rotIncrement, currentRot.y, currentRot.z), false);
            }
            else if (axis === "y") {
                entityPlacementComponent.placingEntity.SetEulerRotation(new Vector3(
                    currentRot.x, currentRot.y + rotIncrement, currentRot.z), false);
            }
            else if (axis === "z") {
                entityPlacementComponent.placingEntity.SetEulerRotation(new Vector3(
                    currentRot.x, currentRot.y, currentRot.z + rotIncrement), false);
            }
            else {
                Logging.LogError("[EntityPlacer] Invalid placement axis.");
                return;
            }
        }
        
        Context.DefineContext("ENTITY_PLACEMENT_COMPONENT", this);
        Time.SetInterval(`
            var entityPlacementComponent = Context.GetContext("ENTITY_PLACEMENT_COMPONENT");
            if (entityPlacementComponent == null) {
                Logging.LogError("[EntityPlacer] Unable to get entity placement component.");
            }
            else {
                entityPlacementComponent.PlacementUpdate();
                entityPlacementComponent.placementLocked = false;
                Context.DefineContext("ENTITY_PLACEMENT_COMPONENT", entityPlacementComponent);
            }`,
        0.1);
        Context.DefineContext("ENTITY_PLACEMENT_COMPONENT", this);
    }
}

function MW_Entity_Placement_OnPositionEntityResponseReceived(response) {
    if (response != null) {
        var parsedResponse = JSON.parse(response);
        if (parsedResponse != null) {
            if (parsedResponse["accepted"] == true) {

            }
            else {
                Logging.Log("Position Entity Rejected: " + parsedResponse["response"]);
            }
        }
    }
}

function MW_Entity_Placement_StartPlacing(entityToPlace, entityType, entityIndex, variantIndex,
    entityID, variantID, modelPath, instanceID, offset = Vector3.zero,
    rotation = Quaternion.identity, scripts, placementOffset = Vector3.zero) {
    WorldStorage.SetItem("TERRAIN-EDIT-LAYER", "-1");
    var entityPlacementComponent = Context.GetContext("ENTITY_PLACEMENT_COMPONENT");
    if (entityPlacementComponent == null) {
        Logging.LogError("[EntityPlacer] Unable to get context.");
        return;
    }
    
    entityPlacementComponent.ExitDeleteMode();
    
    if (entityPlacementComponent.placingEntity != null) {
        Logging.LogWarning("[EntityPlacer] Placing Entity already assigned. Placing Entity must be stopped.");
        return;
    }
    
    if (entityToPlace == null) {
        Logging.LogWarning("[EntityPlacer] Invalid entity to place.");
        return;
    }
    
    entityPlacementComponent.entityType = entityType;
    entityPlacementComponent.modelOffset = offset;
    entityPlacementComponent.modelRotation = rotation;
    entityPlacementComponent.placingOffset = placementOffset;
    entityPlacementComponent.placingEntity = entityToPlace;
    entityPlacementComponent.placementLocked = true;
    entityPlacementComponent.entityIndex = entityIndex;
    entityPlacementComponent.variantIndex = variantIndex;
    entityPlacementComponent.entityID = entityID;
    entityPlacementComponent.variantID = variantID;
    entityPlacementComponent.modelPath = modelPath;
    entityPlacementComponent.instanceID = instanceID;
    entityPlacementComponent.orientationIndex = 0;
    entityPlacementComponent.scripts = scripts;
    Context.DefineContext("ENTITY_PLACEMENT_COMPONENT", entityPlacementComponent);
    entityToPlace.SetHighlight(true);
    WorldStorage.SetItem("ENTITY-BEING-PLACED", "TRUE");
    Input.TurnLocomotionMode = Input.VRTurnLocomotionMode.None;
}