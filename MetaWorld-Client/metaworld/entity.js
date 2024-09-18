function FinishLoadingPlacingEntity(entity) {
    entity.SetVisibility(true);
    entity.SetInteractionState(InteractionState.Static);
    
    var gridX = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.GRID_SIZE.X");
    var gridY = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.GRID_SIZE.Y");
    var gridZ = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.GRID_SIZE.Z");
    var entityIndex = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.ENTITY_INDEX");
    var variantIndex = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.VARIANT_INDEX");
    var entityID = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.ENTITY_ID");
    var variantID = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.VARIANT_ID");
    var instanceID = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.INSTANCE_ID");
    var placementOffsetX = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.OFFSET.X");
    var placementOffsetY = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.OFFSET.Y");
    var placementOffsetZ = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.OFFSET.Z");
    
    if (gridX == null || gridY == null || gridZ == null || gridX <= 0 || gridY <= 0 || gridZ <= 0) {
        Logging.LogError("[Entity] Invalid grid size.");
        gridX = 1;
        gridY = 1;
        gridZ = 1;
    }
    
    entityPlacer.StartPlacing(entity, entityIndex, variantIndex, entityID, variantID, instanceID, entity.GetPosition(false),
        new Vector3(placementOffsetX, placementOffsetY, placementOffsetZ), new Vector3(gridX, gridY, gridZ));
}

function FinishLoadingPlacedEntity(entity) {
    entity.SetVisibility(true);
    entity.SetInteractionState(InteractionState.Static);
}

function LoadEntity(loadedEntityID, entityIndex, variantIndex, entityID, variantID, modelPath, offset, placementOffset, rotation, gridSize, startPlacing = true) {
    if (startPlacing) {
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.GRID_SIZE.X", gridSize.x);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.GRID_SIZE.Y", gridSize.y);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.GRID_SIZE.Z", gridSize.z);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.ENTITY_INDEX", entityIndex);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.VARIANT_INDEX", variantIndex);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.ENTITY_ID", entityID);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.VARIANT_ID", variantID);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.INSTANCE_ID", loadedEntityID);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.OFFSET.X", placementOffset.x);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.OFFSET.Y", placementOffset.y);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.OFFSET.Z", placementOffset.z);
        MeshEntity.Create(null, modelPath, [ modelPath ], offset, rotation, loadedEntityID, "FinishLoadingPlacingEntity");
    }
    else {
        MeshEntity.Create(null, modelPath, [ modelPath ], offset, rotation, loadedEntityID, "FinishLoadingPlacedEntity");
    }
}