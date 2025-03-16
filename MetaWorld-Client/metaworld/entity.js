function FinishLoadingPlacingEntity(entity) {
    entity.SetVisibility(true);
    entity.SetInteractionState(InteractionState.Static);
    
    var entityIndex = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.ENTITY_INDEX");
    var variantIndex = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.VARIANT_INDEX");
    var entityID = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.ENTITY_ID");
    var variantID = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.VARIANT_ID");
    var modelPath = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.MODEL_PATH");
    var instanceID = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.INSTANCE_ID");
    var placementOffsetX = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.OFFSET.X");
    var placementOffsetY = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.OFFSET.Y");
    var placementOffsetZ = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.OFFSET.Z");
    var rawScripts = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.SCRIPTS");
    var scripts = null;
    if (rawScripts != null) {
        scripts = JSON.parse(rawScripts);
    }
    
    entityPlacer.StartPlacing(entity, entityIndex, variantIndex, entityID, variantID, modelPath, instanceID, entity.GetPosition(false),
        entity.GetRotation(false), scripts, new Vector3(placementOffsetX, placementOffsetY, placementOffsetZ));
}

function FinishLoadingPlacedEntity(entity) {
    entity.SetVisibility(true);
    entity.SetInteractionState(InteractionState.Static);
    pos = entity.GetPosition(false);
    if (Math.abs(pos.y + 1) < 0.01) {
        // Flora entity placed on terrain. Snap to terrain.
        SnapEntityToTerrain(entity);
    }

    var rawScripts = WorldStorage.GetItem("METAWORLD.ENTITY.PLACED.SCRIPTS");
    var scripts = null;
    if (rawScripts != null) {
        scripts = JSON.parse(rawScripts);
    }

    if (scripts != null) {
        AddScriptEntity(entity, scripts);

        RunOnCreateScript(entity.id);

        if (scripts["0_25_update"]) {
            Add0_25IntervalScript(entity, scripts["0_25_update"]);
        }

        if (scripts["0_5_update"]) {
            Add0_5IntervalScript(entity, scripts["0_5_update"]);
        }

        if (scripts["1_0_update"]) {
            Add1_0IntervalScript(entity, scripts["1_0_update"]);
        }

        if (scripts["2_0_update"]) {
            Add2_0IntervalScript(entity, scripts["2_0_update"]);
        }
    }
}

function LoadEntity(loadedEntityID, entityIndex, variantIndex, entityID, variantID, modelPath, offset, placementOffset,
    rotation, scripts, startPlacing = true, parentEntity = null) {
    if (startPlacing) {
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.ENTITY_INDEX", entityIndex);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.VARIANT_INDEX", variantIndex);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.ENTITY_ID", entityID);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.VARIANT_ID", variantID);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.MODEL_PATH", modelPath);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.INSTANCE_ID", loadedEntityID);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.OFFSET.X", placementOffset.x);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.OFFSET.Y", placementOffset.y);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.OFFSET.Z", placementOffset.z);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.SCRIPTS", JSON.stringify(scripts));
        MeshEntity.Create(parentEntity, modelPath, [ modelPath ], offset, rotation, loadedEntityID, "FinishLoadingPlacingEntity");
    }
    else {
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACED.SCRIPTS", scripts == null ? null : JSON.stringify(scripts));
        MeshEntity.QueueCreate(parentEntity, modelPath, [ modelPath ], offset, rotation, loadedEntityID, "FinishLoadingPlacedEntity", false);
    }
}

function SnapEntityToTerrain(entity) {
    currentPos = entity.GetPosition(false);
    entity.SetPosition(new Vector3(currentPos.x, 1024, currentPos.z), false, false);

    raycast = entity.GetRaycast(Vector3.down);
    if (raycast != null) {
        entity.SetPosition(raycast.hitPoint, false);
    }
}