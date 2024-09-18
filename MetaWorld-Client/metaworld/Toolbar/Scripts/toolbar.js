function FinishToolbarSetup() {
    var context = Context.GetContext("mainToolbarContext");
    context.SetUpToolbars();
}

function FinishMainToolbarCreation() {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    if (mainToolbar != null) {
        mainToolbar.SetInteractionState(InteractionState.Static);
        mainToolbar.LoadFromURL('metaworld/Toolbar/HTML/mainmenu.html');
        Time.SetTimeout('SetUpTerrainMenu();', 5000);
        Time.SetTimeout('SetUpEntitiesMenu();', 5000);
    }
}

class MainToolbar {
    constructor() {
        WorldStorage.SetItem("TOOLBAR-CANVAS-ID", UUID.NewUUID().ToString());
        WorldStorage.SetItem("MAIN-TOOLBAR-ID", UUID.NewUUID().ToString());
        WorldStorage.SetItem("TERRAIN-MENU-ID", UUID.NewUUID().ToString());
        WorldStorage.SetItem("ENTITY-MENU-ID", UUID.NewUUID().ToString());
        
        this.SetUpToolbars = function() {
            var context = Context.GetContext("mainToolbarContext");
            var toolbarCanvas = Entity.Get(WorldStorage.GetItem("TOOLBAR-CANVAS-ID"));
            toolbarCanvas.SetInteractionState(InteractionState.Static);
            toolbarCanvas.MakeScreenCanvas();
            
            context.mainToolbar = HTMLEntity.Create(toolbarCanvas, new Vector2(0, 0), new Vector2(1, 1), WorldStorage.GetItem("MAIN-TOOLBAR-ID"), "Toolbar", "HandleToolbarMessage", "FinishMainToolbarCreation");
        }
        Context.DefineContext("mainToolbarContext", this);
        this.toolbarCanvas = CanvasEntity.Create(null, Vector3.zero, Quaternion.identity, Vector3.one, false, WorldStorage.GetItem("TOOLBAR-CANVAS-ID"), "ToolbarCanvas", "FinishToolbarSetup");
        Context.DefineContext("mainToolbarContext", this);
    }
}

function HandleToolbarMessage(msg) {
    if (msg == "TOOLBAR.MAIN.CLOSE-TERRAIN-MENU") {
        ToggleTerrainMenu(false);
    }
    else if (msg.startsWith("TOOLBAR.CONSOLE.SEND-MESSAGE")) {
        var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
        if (mainToolbar != null) {
            mainToolbar.ExecuteJavaScript("AddMessageToConsole(\"" + Date.Now.ToString() + "\",\"" +
            msg.substring(msg.indexOf("(") + 1, msg.indexOf(")")) + "\");", null);
        }
    }
    else if (msg.startsWith("TOOLBAR.TERRAIN.MATERIAL-SELECTED")) {
        if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.0") {
            WorldStorage.SetItem("TERRAIN-EDIT-LAYER", 0);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.1") {
            WorldStorage.SetItem("TERRAIN-EDIT-LAYER", 1);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.2") {
            WorldStorage.SetItem("TERRAIN-EDIT-LAYER", 2);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.3") {
            WorldStorage.SetItem("TERRAIN-EDIT-LAYER", 3);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.4") {
            WorldStorage.SetItem("TERRAIN-EDIT-LAYER", 4);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.5") {
            WorldStorage.SetItem("TERRAIN-EDIT-LAYER", 5);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.6") {
            WorldStorage.SetItem("TERRAIN-EDIT-LAYER", 6);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.7") {
            WorldStorage.SetItem("TERRAIN-EDIT-LAYER", 7);
        }
    }
    else if (msg.startsWith("TOOLBAR.ENTITY.ENTITY-SELECTED")) {
        var worldConfig = Context.GetContext("WORLDCONFIGCONTEXT");
        
        var msgParts = msg.split(".");
        if (msgParts.length != 5) {
            Logging.LogError("HandleToolbarMessage: Invalid message received.");
            return;
        }
        
        var entityID = parseInt(msgParts[3]);
        var variantID = parseInt(msgParts[4]);
        var instanceUUID = UUID.NewUUID().ToString();
        for (var entity in worldConfig.entitiesConfig) {
            if (worldConfig.entitiesConfig[entity].id == entityID) {
                for (var variant in worldConfig.entitiesConfig[entity].variants) {
                    if (worldConfig.entitiesConfig[entity].variants[variant].variant_id == variantID) {
                        LoadEntity(instanceUUID, entity, variant,
                        worldConfig.entitiesConfig[entity].id, worldConfig.entitiesConfig[entity].variants[variant].variant_id,
                        worldConfig.entitiesConfig[entity].variants[variant].model,
                            new Vector3(worldConfig.entitiesConfig[entity].variants[variant].valid_orientations[0].model_offset.x,
                                worldConfig.entitiesConfig[entity].variants[variant].valid_orientations[0].model_offset.y,
                                worldConfig.entitiesConfig[entity].variants[variant].valid_orientations[0].model_offset.z),
                            new Vector3(worldConfig.entitiesConfig[entity].variants[variant].valid_orientations[0].placement_offset.x,
                                worldConfig.entitiesConfig[entity].variants[variant].valid_orientations[0].placement_offset.y,
                                worldConfig.entitiesConfig[entity].variants[variant].valid_orientations[0].placement_offset.z),
                            new Quaternion(worldConfig.entitiesConfig[entity].variants[variant].valid_orientations[0].model_rotation.x,
                                worldConfig.entitiesConfig[entity].variants[variant].valid_orientations[0].model_rotation.y,
                                worldConfig.entitiesConfig[entity].variants[variant].valid_orientations[0].model_rotation.z,
                                worldConfig.entitiesConfig[entity].variants[variant].valid_orientations[0].model_rotation.w),
                            new Vector3(worldConfig.entitiesConfig[entity].variants[variant].grid_size.x,
                                worldConfig.entitiesConfig[entity].variants[variant].grid_size.y,
                                worldConfig.entitiesConfig[entity].variants[variant].grid_size.z));
                        return;
                    }
                }
            }
        }
    }
}

function ToggleTerrainMenu(state) {
    var terrainMenu = Entity.Get(WorldStorage.GetItem("TERRAIN-MENU-ID"));
    
    if (terrainMenu == null) {
        Logging.LogError("ToggleTerrainMenu: No terrain menu.");
        return;
    }
    
    if (state == true) {
        terrainMenu.SetInteractionState(InteractionState.Static);
    }
    else {
        terrainMenu.SetInteractionState(InteractionState.Hidden);
    }
}

function ToggleEntityMenu(state) {
    var entityMenu = Entity.Get(WorldStorage.GetItem("ENTITY-MENU-ID"));
    
    if (entityMenu == null) {
        Logging.LogError("ToggleEntityMenu: No entity menu.");
        return;
    }
    
    if (state == true) {
        entityMenu.SetInteractionState(InteractionState.Static);
    }
    else {
        entityMenu.SetInteractionState(InteractionState.Hidden);
    }
}

function SetUpTerrainMenu() {
    var worldConfig = Context.GetContext("WORLDCONFIGCONTEXT");
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    if (mainToolbar != null) {
        for (var terrainLayer in worldConfig.terrainConfig.layers) {
            mainToolbar.ExecuteJavaScript("AddMaterialButton('" + terrainLayer + "','" + worldConfig.terrainConfig.layers[terrainLayer].color_texture + "','" +
                "TOOLBAR.TERRAIN.MATERIAL-SELECTED." + worldConfig.terrainConfig.layers[terrainLayer].layer + "');", null);
        }
    }
}

function SetUpEntitiesMenu() {
    var worldConfig = Context.GetContext("WORLDCONFIGCONTEXT");
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    
    for (var entity in worldConfig.entitiesConfig) {
        for (var variant in worldConfig.entitiesConfig[entity].variants) {
            mainToolbar.ExecuteJavaScript("AddEntityButton('" + worldConfig.entitiesConfig[entity].variants[variant].display_name + "','"
                + worldConfig.entitiesConfig[entity].variants[variant].thumbnail + "','" +
                "TOOLBAR.ENTITY.ENTITY-SELECTED." + worldConfig.entitiesConfig[entity].id +
                "." + worldConfig.entitiesConfig[entity].variants[variant].variant_id + "');", null);
        }
    }
}