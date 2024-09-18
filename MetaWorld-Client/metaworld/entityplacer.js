class EntityPlacer {
    constructor() {
        this.placingEntity = null;
        this.modelOffset = null;
        this.placingOffset = null;
        this.gridSize = Vector3.one;
        this.placementLocked = false;
        this.entityIndex = null;
        this.variantIndex = null;
        this.entityID = null;
        this.variantID = null;
        this.instanceID = null;
        this.orientationIndex = 0;
        
        this.PlacementUpdate = function() {
            var normalPlacementThreshold = 0.5;
            var context = Context.GetContext("entityPlacementContext");
            if (context == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }
            
            if (context.placingEntity == null) {
                //Logging.Log("[EntityPlacer] Placing Entity is null.");
                return;
            }
            
            if (context.modelOffset == null) {
                Logging.LogError("[EntityPlacer] Model Offset is null.");
                return;
            }
            
            if (context.modelOffset.x == null || context.modelOffset.y == null || context.modelOffset.z == null) {
                Logging.LogError("[EntityPlacer] Model Offset invalid.");
                return;
            }
            
            var hitInfo = Input.GetPointerRaycast(Vector3.forward);
            if (hitInfo != null) {
                if (hitInfo.entity != null) {
                    if (hitInfo.entity != context.placingEntity) {
                        var gridSnappedPosition = new Vector3(
                        Math.round(hitInfo.hitPoint.x / context.gridSize.x) * context.gridSize.x + context.modelOffset.x,
                        Math.round(hitInfo.hitPoint.y / context.gridSize.y) * context.gridSize.y + context.modelOffset.y,
                        Math.round(hitInfo.hitPoint.z / context.gridSize.z) * context.gridSize.z + context.modelOffset.z);
                        
                        if (hitInfo.hitPointNormal.x >= normalPlacementThreshold) {
                            gridSnappedPosition.x += context.gridSize.x;
                        }
                        else if (hitInfo.hitPointNormal.x <= -1 * normalPlacementThreshold) {
                            gridSnappedPosition.x -= context.gridSize.x;
                        }
                        
                        if (hitInfo.hitPointNormal.y >= normalPlacementThreshold) {
                            //gridSnappedPosition.y += context.gridSize.y;
                        }
                        else if (hitInfo.hitPointNormal.y <= -1 * normalPlacementThreshold) {
                            gridSnappedPosition.y -= context.gridSize.y;
                        }
                        
                        if (hitInfo.hitPointNormal.z >= normalPlacementThreshold) {
                            //gridSnappedPosition.z += context.gridSize.z;
                        }
                        else if (hitInfo.hitPointNormal.z <= -1 * normalPlacementThreshold) {
                            gridSnappedPosition.z -= context.gridSize.z;
                        }
                        
                        context.placingEntity.SetPosition(gridSnappedPosition, false, false);
                    }
                }
            }
        }
        
        this.StartPlacing = function(entityToPlace, entityIndex, variantIndex, entityID, variantID, instanceID, offset = Vector3.zero, placementOffset = Vector3.zero, gridSize = Vector3.one) {
            WorldStorage.SetItem("TERRAIN-EDIT-LAYER", "-1");
            var context = Context.GetContext("entityPlacementContext");
            if (context == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }
            
            context.ExitDeleteMode();
            
            if (context.placingEntity != null) {
                Logging.LogWarning("[EntityPlacer] Placing Entity already assigned. Placing Entity must be stopped.");
                return;
            }
            
            if (entityToPlace == null) {
                Logging.LogWarning("[EntityPlacer] Invalid entity to place.");
                return;
            }
            
            context.gridSize = gridSize;
            context.modelOffset = offset;
            context.placingOffset = placementOffset;
            context.placingEntity = entityToPlace;
            context.placementLocked = true;
            context.entityIndex = entityIndex;
            context.variantIndex = variantIndex;
            context.entityID = entityID;
            context.variantID = variantID;
            context.instanceID = instanceID;
            context.orientationIndex = 0;
            Context.DefineContext("entityPlacementContext", context);
        }
        
        this.StopPlacing = function() {
            var context = Context.GetContext("entityPlacementContext");
            if (context == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }
            
            if (context.placingEntity == null) {
                //Logging.LogWarning("[EntityPlacer] Placing Entity not assigned. Cannot stop placing.");
                return;
            }
            
            if (context.placementLocked == true) {
                return;
            }
            
            var pos = context.placingEntity.GetPosition(false);
            var rot = context.placingEntity.GetRotation(false);
            HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/positionentity?entityID=" + context.entityID
                + "&variantID=" + context.variantID + "&instanceID='" + context.instanceID + "'&xPosition=" + pos.x + "&yPosition=" + pos.y + "&zPosition=" + pos.z
                + "&xRotation=" + rot.x + "&yRotation=" + rot.y + "&zRotation=" + rot.z + "&wRotation=" + rot.w, null);
            
            vosSynchronizer.SendEntityAddUpdate(context.instanceID, "{x:" + pos.x + ",y:" + pos.y + ",z:" + pos.z + "}",
                "{x:" + rot.x + ",y:" + rot.y + ",z:" + rot.z + ",w:" + rot.w + "}");
            
            context.placingEntity = null;
            Context.DefineContext("entityPlacementContext", context);
        }
        
        this.EnterDeleteMode = function() {
            var context = Context.GetContext("entityPlacementContext");
            if (context == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }
            
            context.StopPlacing();
            
            // TODO.
        }
        
        this.ExitDeleteMode = function() {
            var context = Context.GetContext("entityPlacementContext");
            if (context == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }
            
            // TODO.
        }
        
        this.ToggleOrientation = function() {
            var context = Context.GetContext("entityPlacementContext");
            if (context == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }
            
            if (context.placingEntity == null) {
                //Logging.LogWarning("[EntityPlacer] Placing Entity not assigned. Cannot orient.");
                return;
            }
            
            var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
            
            context.orientationIndex++;
            if (context.orientationIndex > configContext.entitiesConfig[context.entityIndex].variants[context.variantIndex].valid_orientations.length - 1) {
                context.orientationIndex = 0;
            }
            
            context.placingEntity.SetPosition(new Vector3(
                configContext.entitiesConfig[context.entityIndex].variants[context.variantIndex].valid_orientations[context.orientationIndex].model_offset.x,
                configContext.entitiesConfig[context.entityIndex].variants[context.variantIndex].valid_orientations[context.orientationIndex].model_offset.y,
                configContext.entitiesConfig[context.entityIndex].variants[context.variantIndex].valid_orientations[context.orientationIndex].model_offset.z), false);
            context.placingEntity.SetRotation(new Quaternion(
                configContext.entitiesConfig[context.entityIndex].variants[context.variantIndex].valid_orientations[context.orientationIndex].model_rotation.x,
                configContext.entitiesConfig[context.entityIndex].variants[context.variantIndex].valid_orientations[context.orientationIndex].model_rotation.y,
                configContext.entitiesConfig[context.entityIndex].variants[context.variantIndex].valid_orientations[context.orientationIndex].model_rotation.z,
                configContext.entitiesConfig[context.entityIndex].variants[context.variantIndex].valid_orientations[context.orientationIndex].model_rotation.w), false);
            context.modelOffset = configContext.entitiesConfig[context.entityIndex].variants[context.variantIndex].valid_orientations[context.orientationIndex].model_offset;
            context.placingOffset = configContext.entitiesConfig[context.entityIndex].variants[context.variantIndex].valid_orientations[context.orientationIndex].placement_offset;
            Context.DefineContext("entityPlacementContext", context);
        }
        
        this.RotateOneStep = function(axis) {
            var context = Context.GetContext("entityPlacementContext");
            if (context == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
                return;
            }
            
            if (context.placingEntity == null) {
                //Logging.LogWarning("[EntityPlacer] Placing Entity not assigned. Cannot rotate.");
                return;
            }
            
            if (axis === "y") {
                
            }
            else if (axis === "z") {
                
            }
            else {
                Logging.LogError("[EntityPlacer] Invalid placement axis.");
                return;
            }
        }
        
        Context.DefineContext("entityPlacementContext", this);
        Time.SetInterval(`
            var context = Context.GetContext("entityPlacementContext");
            if (context == null) {
                Logging.LogError("[EntityPlacer] Unable to get context.");
            }
            else {
                context.PlacementUpdate();
                context.placementLocked = false;
                Context.DefineContext("entityPlacementContext", context);
            }`,
        0.1);
        Context.DefineContext("entityPlacementContext", this);
    }
}