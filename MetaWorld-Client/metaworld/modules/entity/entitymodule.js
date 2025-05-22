class EntityModule {
    constructor() {
        Logging.Log("Initializing Entity Module...");

        this.entityPlacement = new EntityPlacement();

        Context.DefineContext("ENTITY_MODULE", this);

        Logging.Log("Entity Module Initialized.");
    }
}

function MW_Entity_LoadEntity(type, loadedEntityID, entityIndex, variantIndex,
    entityID, variantID, modelPath, wheels, offset, placementOffset,
    rotation, mass, scripts, startPlacing = true, parentEntity = null) {
    if (type == null || type == "undefined") {
        type = "mesh";
    }

    if (startPlacing) {
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.ENTITY_INDEX", entityIndex);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.VARIANT_INDEX", variantIndex);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.ENTITY_ID", entityID);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.VARIANT_ID", variantID);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.MODEL_PATH", modelPath);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.TYPE", type);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.INSTANCE_ID", loadedEntityID);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.OFFSET.X", placementOffset.x);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.OFFSET.Y", placementOffset.y);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.OFFSET.Z", placementOffset.z);
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACING.SCRIPTS", scripts == null ? "" : JSON.stringify(scripts));

        if (type == "mesh") {
            MeshEntity.Create(parentEntity, modelPath, [ modelPath ], offset, rotation,
                loadedEntityID, "MW_Entity_FinishLoadingPlacingEntity");
        }
        else if (type == "automobile") {
            if (wheels == null) {
                Logging.LogWarning("Wheels not specified for automobile entity: " + modelPath);
                return;
            }

            var automobileWheels = [];
            for (wheel in wheels) {
                automobileWheels.push(new AutomobileEntityWheel(wheels[wheel].name, wheels[wheel].radius));
            }

            AutomobileEntity.Create(parentEntity, modelPath, [ modelPath ], offset, rotation,
                automobileWheels, mass, AutomobileType.default, null, null, "MW_Entity_FinishLoadingPlacingEntity");
        }
        else if (type == "airplane") {

        }
        else {
            Logging.LogWarning("Entity type not supported: " + type);
        }
    }
    else {
        WorldStorage.SetItem("METAWORLD.ENTITY.PLACED.SCRIPTS", scripts == null ? "" : JSON.stringify(scripts));

        if (type == "mesh") {
            MeshEntity.QueueCreate(parentEntity, modelPath, [ modelPath ], offset, rotation,
                loadedEntityID, "MW_Entity_FinishLoadingPlacedEntity", false);
        }
        else if (type == "automobile") {
            if (wheels == null) {
                Logging.LogWarning("Wheels not specified for automobile entity: " + modelPath);
                return;
            }

            var automobileWheels = [];
            for (wheel in wheels) {
                automobileWheels.push(new AutomobileEntityWheel(wheels[wheel].name, wheels[wheel].radius));
            }

            AutomobileEntity.Create(parentEntity, modelPath, [ modelPath ], offset, rotation,
                automobileWheels, mass, AutomobileType.default, null, null, "MW_Entity_FinishLoadingPlacedEntity");
        }
        else if (type == "airplane") {

        }
        else {
            Logging.LogWarning("Entity type not supported: " + type);
        }
    }
}

function MW_Entity_SnapEntityToTerrain(entity) {
    var currentPos = entity.GetPosition(false);
    entity.SetPosition(new Vector3(currentPos.x, 1024, currentPos.z), false, false);

    var raycast = entity.GetRaycast(Vector3.down);
    if (raycast != null) {
        entity.SetPosition(raycast.hitPoint, false);
    }
}

function MW_Entity_FinishLoadingPlacingEntity(entity) {
    entity.SetVisibility(true);
    entity.SetInteractionState(InteractionState.Static);
    
    var entityIndex = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.ENTITY_INDEX");
    var variantIndex = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.VARIANT_INDEX");
    var entityID = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.ENTITY_ID");
    var variantID = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.VARIANT_ID");
    var type = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.TYPE");
    var modelPath = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.MODEL_PATH");
    var instanceID = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.INSTANCE_ID");
    var placementOffsetX = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.OFFSET.X");
    var placementOffsetY = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.OFFSET.Y");
    var placementOffsetZ = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.OFFSET.Z");
    var rawScripts = WorldStorage.GetItem("METAWORLD.ENTITY.PLACING.SCRIPTS");
    var scripts = null;
    if (rawScripts != null && rawScripts != "") {
        scripts = JSON.parse(rawScripts);
    }
    
    MW_Entity_Placement_StartPlacing(entity, type, entityIndex, variantIndex, entityID, variantID,
        modelPath, instanceID, entity.GetPosition(false), entity.GetRotation(false), scripts,
        new Vector3(placementOffsetX, placementOffsetY, placementOffsetZ));
}

function MW_Entity_FinishLoadingPlacedEntity(entity) {
    entity.SetVisibility(true);
    if (entity instanceof AutomobileEntity) {
        entity.SetInteractionState(InteractionState.Physical);
    }
    else {
        entity.SetInteractionState(InteractionState.Static);
    }
    pos = entity.GetPosition(false);
    if (Math.abs(pos.y + 1) < 0.01) {
        // Flora entity placed on terrain. Snap to terrain.
        MW_Entity_SnapEntityToTerrain(entity);
    }

    var rawScripts = WorldStorage.GetItem("METAWORLD.ENTITY.PLACED.SCRIPTS");
    var scripts = null;
    if (rawScripts != null && rawScripts != "") {
        scripts = JSON.parse(rawScripts);
    }

    if (scripts != null) {
        MW_Script_AddScriptEntity(entity, scripts);

        MW_Script_RunOnCreateScript(entity.id);

        if (scripts["0_25_update"]) {
            MW_Script_Add0_25IntervalScript(entity, scripts["0_25_update"]);
        }

        if (scripts["0_5_update"]) {
            MW_Script_Add0_5IntervalScript(entity, scripts["0_5_update"]);
        }

        if (scripts["1_0_update"]) {
            MW_Script_Add1_0IntervalScript(entity, scripts["1_0_update"]);
        }

        if (scripts["2_0_update"]) {
            MW_Script_Add2_0IntervalScript(entity, scripts["2_0_update"]);
        }
    }
}