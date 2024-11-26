let maxBrushSize = 8;
let maxMaxBrushHeight = 512;

function FinishToolbarSetup() {
    var context = Context.GetContext("mainToolbarContext");
    context.SetUpToolbars();
}

function FinishVRToolbarSetup() {
    var context = Context.GetContext("mainToolbarContext");
    context.SetUpVRToolbars();
}

function FinishVRToolbarPanelSetup() {
    var context = Context.GetContext("mainToolbarContext");
    var vrToolbarPanel = Entity.Get(WorldStorage.GetItem("VR-TOOLBAR-PANEL-ID"));
    if (vrToolbarPanel != null) {
        vrToolbarPanel.SetVisibility(true);
        context.LoadVRToolbars();
    }
}

function FinishMainToolbarCreation() {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    if (mainToolbar != null) {
        mainToolbar.SetInteractionState(InteractionState.Static);
        mainToolbar.LoadFromURL('metaworld/EditToolbar/HTML/editmenu.html');
        Time.SetTimeout('SetUpTerrainMenu();', 5000);
        Time.SetTimeout('SetUpEntitiesMenu();', 5000);
    }
}

function FinishVRMainToolbarCreation() {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
    if (mainToolbar != null) {
        mainToolbar.SetInteractionState(InteractionState.Static);
        mainToolbar.LoadFromURL('metaworld/EditToolbar/HTML/vreditmenu.html');
        Time.SetTimeout('SetUpVRTerrainMenu();', 5000);
        Time.SetTimeout('SetUpVREntitiesMenu();', 5000);
    }
}

class MainToolbar {
    constructor() {
        WorldStorage.SetItem("TOOLBAR-CANVAS-ID", UUID.NewUUID().ToString());
        WorldStorage.SetItem("VR-TOOLBAR-PANEL-ID", UUID.NewUUID().ToString());
        WorldStorage.SetItem("VR-TOOLBAR-CANVAS-ID", UUID.NewUUID().ToString());
        WorldStorage.SetItem("MAIN-TOOLBAR-ID", UUID.NewUUID().ToString());
        WorldStorage.SetItem("MAIN-VR-TOOLBAR-ID", UUID.NewUUID().ToString());
        WorldStorage.SetItem("TERRAIN-MENU-ID", UUID.NewUUID().ToString());
        WorldStorage.SetItem("ENTITY-MENU-ID", UUID.NewUUID().ToString());
        
        this.SetUpToolbars = function() {
            var context = Context.GetContext("mainToolbarContext");
            var toolbarCanvas = Entity.Get(WorldStorage.GetItem("TOOLBAR-CANVAS-ID"));
            toolbarCanvas.SetInteractionState(InteractionState.Static);
            toolbarCanvas.MakeScreenCanvas();
            
            context.mainToolbar = HTMLEntity.Create(toolbarCanvas, new Vector2(0, 0),
                new Vector2(1, 1), WorldStorage.GetItem("MAIN-TOOLBAR-ID"), "Toolbar",
                "HandleToolbarMessage", "FinishMainToolbarCreation");
        }

        this.SetUpVRToolbars = function() {
            var context = Context.GetContext("mainToolbarContext");
            var vrToolbarCanvas = Entity.Get(WorldStorage.GetItem("VR-TOOLBAR-CANVAS-ID"));
            vrToolbarCanvas.SetSize(new Vector2(939, 539));
            vrToolbarCanvas.SetInteractionState(InteractionState.Static);
            vrToolbarCanvas.MakeWorldCanvas();
            
            context.mainVRToolbar = HTMLEntity.Create(vrToolbarCanvas, new Vector2(0, 0),
                new Vector2(1, 1), WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"), "Toolbar",
                "HandleToolbarMessage", "FinishVRMainToolbarCreation");
        }

        this.LoadVRToolbars = function() {
            var context = Context.GetContext("mainToolbarContext");
            var vrToolbarPanel = Entity.Get(WorldStorage.GetItem("VR-TOOLBAR-PANEL-ID"));
            
            if (vrToolbarPanel != null) {
                context.vrToolbarCanvas = CanvasEntity.Create(vrToolbarPanel, new Vector3(1.79, 0.025, 0.06),
                new Quaternion(0.7071, 0, 0, 0.7071), new Vector3(0.0038, 0.003, 0.004), false,
                WorldStorage.GetItem("VR-TOOLBAR-CANVAS-ID"), "ToolbarCanvas", "FinishVRToolbarSetup");
            }
        }

        Context.DefineContext("mainToolbarContext", this);

        this.vrToolbarPanel = MeshEntity.Create(null, "metaworld/EditToolbar/Models/StandardPanel.glb",
            [ "metaworld/EditToolbar/Models/StandardPanel.glb" ], Vector3.zero, Quaternion.identity,
            WorldStorage.GetItem("VR-TOOLBAR-PANEL-ID"), "FinishVRToolbarPanelSetup");
        this.toolbarCanvas = CanvasEntity.Create(null, Vector3.zero, Quaternion.identity,
            Vector3.one, false, WorldStorage.GetItem("TOOLBAR-CANVAS-ID"), "ToolbarCanvas", "FinishToolbarSetup");
        
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
        WorldStorage.SetItem("ENTITY-DELETE-ENABLED", "FALSE");
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

        if (entityID == -1 && variantID == -1) {
            var entityPlacer = Context.GetContext("ENTITYPLACERCONTEXT");
            if (entityPlacer != null) {
                entityPlacer.EnterDeleteMode();
            }
            return;
        }

        WorldStorage.SetItem("ENTITY-DELETE-ENABLED", "FALSE");
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
    else if (msg == "TOOLBAR.TERRAIN.INCREASE-BRUSH") {
        var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
        if (mainToolbar != null) {
            brushSize = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-SIZE"));
            if (brushSize + 1 < maxBrushSize) {
                mainToolbar.ExecuteJavaScript("UpdateTerrainBrushSize(" + (brushSize + 1) + ");", null);
                WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", brushSize + 1);
            }
            else {
                mainToolbar.ExecuteJavaScript("UpdateTerrainBrushSize(" + (maxBrushSize) + ");", null);
                WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", maxBrushSize);
            }
        }
    }
    else if (msg == "TOOLBAR.TERRAIN.DECREASE-BRUSH") {
        var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
        if (mainToolbar != null) {
            brushSize = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-SIZE"));
            if (brushSize - 1 > 0) {
                mainToolbar.ExecuteJavaScript("UpdateTerrainBrushSize(" + (brushSize - 1) + ");", null);
                WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", brushSize - 1);
            }
            else {
                mainToolbar.ExecuteJavaScript("UpdateTerrainBrushSize(" + "1" + ");", null);
                WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 1);
            }
        }
    }
    else if (msg.startsWith("TOOLBAR.TERRAIN.SET-BRUSH-MIN-HEIGHT")) {
        var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
        if (mainToolbar != null) {
            WorldStorage.SetItem("TERRAIN-BRUSH-MIN-HEIGHT", msg.substring(msg.indexOf("(") + 1, msg.indexOf(")")));
        }
    }
    else if (msg.startsWith("TOOLBAR.TERRAIN.SET-BRUSH-MAX-HEIGHT")) {
        var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
        if (mainToolbar != null) {
            WorldStorage.SetItem("TERRAIN-BRUSH-MAX-HEIGHT", msg.substring(msg.indexOf("(") + 1, msg.indexOf(")")));
        }
    }
    else if (msg == "TOOLBAR.TERRAIN.INCREASE-BRUSH-MAX-HEIGHT") {
        var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
        if (mainToolbar != null) {
            brushMaxHeight = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-MAX-HEIGHT"));
            if (brushMaxHeight + 1 < maxMaxBrushHeight) {
                mainToolbar.ExecuteJavaScript("UpdateMaxTerrainHeight(" + (brushMaxHeight + 1) + ");", null);
                WorldStorage.SetItem("TERRAIN-BRUSH-MAX-HEIGHT", brushMaxHeight + 1);
            }
            else {
                mainToolbar.ExecuteJavaScript("UpdateMaxTerrainHeight(" + (maxMaxBrushHeight) + ");", null);
                WorldStorage.SetItem("TERRAIN-BRUSH-MAX-HEIGHT", maxMaxBrushHeight);
            }
        }
    }
    else if (msg == "TOOLBAR.TERRAIN.DECREASE-BRUSH-MAX-HEIGHT") {
        var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
        if (mainToolbar != null) {
            brushMaxHeight = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-MAX-HEIGHT"));
            if (brushMaxHeight - 1 > 0) {
                mainToolbar.ExecuteJavaScript("UpdateMaxTerrainHeight(" + (brushMaxHeight - 1) + ");", null);
                WorldStorage.SetItem("TERRAIN-BRUSH-MAX-HEIGHT", brushMaxHeight - 1);
            }
            else {
                mainToolbar.ExecuteJavaScript("UpdateMaxTerrainHeight(" + "1" + ");", null);
                WorldStorage.SetItem("TERRAIN-BRUSH-MAX-HEIGHT", 1);
            }

            mainToolbar.ExecuteJavaScript("UpdateMaxTerrainHeight(" + "5" + ");", null);
            WorldStorage.SetItem("TERRAIN-BRUSH-MAX-HEIGHT", brushSize - 1);
        }
    }
    else if (msg == "TOOLBAR.ENTITY.START-DELETING") {
        WorldStorage.SetItem("ENTITY-DELETE-ENABLED", "TRUE");
    }
    else if (msg == "TOOLBAR.ENTITY.STOP-DELETING") {
        WorldStorage.SetItem("ENTITY-DELETE-ENABLED", "FALSE");
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

function SetUpVRTerrainMenu() {
    var worldConfig = Context.GetContext("WORLDCONFIGCONTEXT");
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
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
    
    mainToolbar.ExecuteJavaScript("AddEntityButton('Delete','TODO','TOOLBAR.ENTITY.ENTITY-SELECTED.-1.-1');", null);

    for (var entity in worldConfig.entitiesConfig) {
        for (var variant in worldConfig.entitiesConfig[entity].variants) {
            mainToolbar.ExecuteJavaScript("AddEntityButton('" + worldConfig.entitiesConfig[entity].variants[variant].display_name + "','"
                + worldConfig.entitiesConfig[entity].variants[variant].thumbnail + "','" +
                "TOOLBAR.ENTITY.ENTITY-SELECTED." + worldConfig.entitiesConfig[entity].id +
                "." + worldConfig.entitiesConfig[entity].variants[variant].variant_id + "');", null);
        }
    }
}

function SetUpVREntitiesMenu() {
    var worldConfig = Context.GetContext("WORLDCONFIGCONTEXT");
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
    
    mainToolbar.ExecuteJavaScript("AddEntityButton('Delete','TODO','TOOLBAR.ENTITY.ENTITY-SELECTED.-1.-1');", null);

    for (var entity in worldConfig.entitiesConfig) {
        for (var variant in worldConfig.entitiesConfig[entity].variants) {
            mainToolbar.ExecuteJavaScript("AddEntityButton('" + worldConfig.entitiesConfig[entity].variants[variant].display_name + "','"
                + worldConfig.entitiesConfig[entity].variants[variant].thumbnail + "','" +
                "TOOLBAR.ENTITY.ENTITY-SELECTED." + worldConfig.entitiesConfig[entity].id +
                "." + worldConfig.entitiesConfig[entity].variants[variant].variant_id + "');", null);
        }
    }
}

function ToggleVRMenu() {
    var toolbarPanel = Entity.Get(WorldStorage.GetItem("VR-TOOLBAR-PANEL-ID"));
    if (toolbarPanel != null) {
        toolbarPanel.SetVisibility(!toolbarPanel.GetVisibility());
    }
}