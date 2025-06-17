let maxBrushSize = 8;
let maxMaxBrushHeight = 512;
let defaultToolPath = "assets/images/tool-default.png";
let defaultEntityPath = "assets/images/entity-default.png";
let defaultTerrainPath = "assets/images/terrain-default.png";
let handPath = "assets/images/hand.png";
let squareShovelx1Path = "assets/images/square-shovel.png";
let squareShovelx2Path = "assets/images/square-shovel-x2.png";
let squareShovelx4Path = "assets/images/square-shovel-x4.png";
let squareShovelx8Path = "assets/images/square-shovel-x8.png";
let sledgeHammerPath = "assets/images/sledgehammer.png";

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
        //vrToolbarPanel.SetScale(new Vector3(0.5, 0.5, 0.5));
        context.LoadVRToolbars();
    }
}

function FinishMainToolbarCreation() {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    if (mainToolbar != null) {
        mainToolbar.SetInteractionState(InteractionState.Static);
        mainToolbar.LoadFromURL('metaworld/modules/ui/edit_toolbar/HTML/editmenu.html');
        Time.SetTimeout('SetUpToolsInMenu();', 3000);
        Time.SetTimeout('SetUpTerrainInMenu();', 5000);
        Time.SetTimeout('SetUpEntitiesInMenu();', 5000);
        Time.SetTimeout('InitializeLowerToolbarItems();', 5000);
        Time.SetTimeout('SelectEntityMenuToolbarButton(0);', 10000);
    }
}

function FinishVRMainToolbarCreation() {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
    if (mainToolbar != null) {
        mainToolbar.SetInteractionState(InteractionState.Static);
        mainToolbar.LoadFromURL('metaworld/modules/ui/edit_toolbar/HTML/editmenu-vr.html');
        Time.SetTimeout('SetUpToolsInVRMenu();', 3000);
        Time.SetTimeout('SetUpTerrainInVRMenu();', 5000);
        Time.SetTimeout('SetUpEntitiesInVRMenu();', 5000);
        Time.SetTimeout('InitializeLowerVRToolbarItems();', 5000);
        Time.SetTimeout('SelectVREntityMenuToolbarButton(0);' , 10000);
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
            vrToolbarCanvas.SetSize(new Vector2(939, 779));
            vrToolbarCanvas.SetInteractionState(InteractionState.Static);
            vrToolbarCanvas.MakeWorldCanvas();
            Input.AddLeftHandFollower(vrToolbarCanvas.GetParent());
            
            context.mainVRToolbar = HTMLEntity.Create(vrToolbarCanvas, new Vector2(0, 0),
                new Vector2(1, 1), WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"), "Toolbar",
                "HandleToolbarMessage", "FinishVRMainToolbarCreation");
        }

        this.LoadVRToolbars = function() {
            var context = Context.GetContext("mainToolbarContext");
            var vrToolbarPanel = Entity.Get(WorldStorage.GetItem("VR-TOOLBAR-PANEL-ID"));
            
            if (vrToolbarPanel != null) {
                context.vrToolbarCanvas = CanvasEntity.Create(vrToolbarPanel, new Vector3(0, 1, 0.79),
                new Quaternion(0.3827, 0, 0, 0.9239), new Vector3(0.0038, 0.003, 0.004), false,
                WorldStorage.GetItem("VR-TOOLBAR-CANVAS-ID"), "ToolbarCanvas", "FinishVRToolbarSetup");
            }
        }

        Context.DefineContext("mainToolbarContext", this);

        this.vrToolbarPanel = ContainerEntity.Create(null, Vector3.zero, Quaternion.identity,
            new Vector3(0.1, 0.1, 0.1), false, null, WorldStorage.GetItem("VR-TOOLBAR-PANEL-ID"),
            "FinishVRToolbarPanelSetup");
        this.toolbarCanvas = CanvasEntity.Create(null, Vector3.zero, Quaternion.identity,
            Vector3.one, false, WorldStorage.GetItem("TOOLBAR-CANVAS-ID"), "ToolbarCanvas", "FinishToolbarSetup");
        
        Context.DefineContext("mainToolbarContext", this);
    }
}

function MW_UI_EditToolbar_SelectLowerToolbarItem(index) {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    if (mainToolbar != null) {
        mainToolbar.ExecuteJavaScript("SelectLowerToolbarButton(" + index + ");", null);
    }
}

function HandleToolbarMessage(msg) {
    var entityModule = Context.GetContext("ENTITY_MODULE");

    if (msg == "TOOLBAR.MAIN.CLOSE-TERRAIN-MENU") {
        ToggleTerrainMenu(false);
    }
    else if (msg.startsWith("TOOLBAR.CONSOLE.SEND-MESSAGE")) {
        var message = msg.substring(msg.indexOf("(") + 1, msg.indexOf(")"));
        var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
        if (mainToolbar != null) {
            mainToolbar.ExecuteJavaScript("AddMessageToConsole(\"" + Date.Now.ToTimeString() + "\",\"You\",\"" + message + "\");", null);
        }
        // Also send through synchronization system
        MW_Sync_VSS_SendMessage(message);
    }
    else if (msg.startsWith("TOOLBAR.CONSOLE.SEND-COMMAND")) {
        var command = msg.substring(msg.indexOf("(") + 1, msg.indexOf(")"));
        // Send command through synchronization system
        MW_Sync_VSS_SendCommand(command);
    }
    else if (msg == "TOOLBAR.CONSOLE.INPUT-ACTIVE") {
        WorldStorage.SetItem("CONSOLE-INPUT-ACTIVE", "TRUE");
    }
    else if (msg == "TOOLBAR.CONSOLE.INPUT-INACTIVE") {
        WorldStorage.SetItem("CONSOLE-INPUT-ACTIVE", "FALSE");
    }
    else if (msg.startsWith("TOOLBAR.TOOLS.TOOL-SELECTED")) {
        entityModule.entityPlacement.CancelPlacing();
        if (msg == "TOOLBAR.TOOLS.TOOL-SELECTED.HAND") {
            WorldStorage.SetItem("INTERACTION-MODE", "HAND");
            WorldStorage.SetItem("SLEDGE-HAMMER-MODE", 0);
            WorldStorage.SetItem("DIG-MODE", 0);
        }
        else if (msg == "TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-1") {
            WorldStorage.SetItem("INTERACTION-MODE", "SQUARE-SHOVEL-1");
            WorldStorage.SetItem("SLEDGE-HAMMER-MODE", 0);
            WorldStorage.SetItem("DIG-MODE", 1);
        }
        else if (msg == "TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-2") {
            WorldStorage.SetItem("INTERACTION-MODE", "SQUARE-SHOVEL-2");
            WorldStorage.SetItem("SLEDGE-HAMMER-MODE", 0);
            WorldStorage.SetItem("DIG-MODE", 2);
        }
        else if (msg == "TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-4") {
            WorldStorage.SetItem("INTERACTION-MODE", "SQUARE-SHOVEL-4");
            WorldStorage.SetItem("SLEDGE-HAMMER-MODE", 0);
            WorldStorage.SetItem("DIG-MODE", 4);
        }
        else if (msg == "TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-8") {
            WorldStorage.SetItem("INTERACTION-MODE", "SQUARE-SHOVEL-8");
            WorldStorage.SetItem("SLEDGE-HAMMER-MODE", 0);
            WorldStorage.SetItem("DIG-MODE", 8);
        }
        else if (msg == "TOOLBAR.TOOLS.TOOL-SELECTED.SLEDGE-HAMMER") {
            WorldStorage.SetItem("INTERACTION-MODE", "SLEDGE-HAMMER");
            WorldStorage.SetItem("SLEDGE-HAMMER-MODE", 1);
            WorldStorage.SetItem("DIG-MODE", 0);
        }
    }
    else if (msg.startsWith("TOOLBAR.TERRAIN.MATERIAL-SELECTED")) {
        entityModule.entityPlacement.CancelPlacing();
        if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.0.1") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-0");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 1);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.0.2") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-0");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 2);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.0.4") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-0");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 4);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.0.8") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-0");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 8);
        }

        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.1.1") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-1");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 1);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.1.2") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-1");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 2);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.1.4") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-1");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 4);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.1.8") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-1");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 8);
        }

        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.2.1") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-2");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 1);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.2.2") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-2");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 2);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.2.4") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-2");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 4);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.2.8") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-2");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 8);
        }

        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.3.1") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-3");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 1);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.3.2") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-3");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 2);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.3.4") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-3");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 4);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.3.8") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-3");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 8);
        }

        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.4.1") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-4");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 1);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.4.2") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-4");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 2);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.4.4") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-4");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 4);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.4.8") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-4");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 8);
        }

        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.5.1") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-5");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 1);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.5.2") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-5");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 2);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.5.4") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-5");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 4);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.5.8") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-5");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 8);
        }

        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.6.1") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-6");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 1);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.6.2") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-6");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 2);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.6.4") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-6");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 4);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.6.8") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-6");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 8);
        }

        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.7.1") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-7");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 1);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.7.2") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-7");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 2);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.7.4") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-7");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 4);
        }
        else if (msg == "TOOLBAR.TERRAIN.MATERIAL-SELECTED.7.8") {
            WorldStorage.SetItem("INTERACTION-MODE", "TERRAIN-LAYER-7");
            WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 8);
        }
        WorldStorage.SetItem("SLEDGE-HAMMER-MODE", 0);
        WorldStorage.SetItem("DIG-MODE", 0);
        WorldStorage.SetItem("ENTITY-DELETE-ENABLED", "FALSE");
    }
    else if (msg.startsWith("TOOLBAR.ENTITY.ENTITY-SELECTED")) {
        entityModule.entityPlacement.CancelPlacing();
        var configModule = Context.GetContext("CONFIGURATION_MODULE");
        
        var msgParts = msg.split(".");
        if (msgParts.length != 5) {
            Logging.LogError("HandleToolbarMessage: Invalid message received.");
            return;
        }
        
        var entityID = parseInt(msgParts[3]);
        var variantID = parseInt(msgParts[4]);

        if (entityID == -1 && variantID == -1) {
            var entityPlacementComponent = Context.GetContext("ENTITY_PLACEMENT_COMPONENT");
            if (entityPlacementComponent != null) {
                entityPlacementComponent.EnterDeleteMode();
            }
            return;
        }

        WorldStorage.SetItem("ENTITY-DELETE-ENABLED", "FALSE");
        WorldStorage.SetItem("INTERACTION-MODE", "ENTITY-PLACING");
        var instanceUUID = UUID.NewUUID().ToString();
        for (var entity in configModule.entitiesConfig) {
            if (configModule.entitiesConfig[entity].id == entityID) {
                for (var variant in configModule.entitiesConfig[entity].variants) {
                    if (configModule.entitiesConfig[entity].variants[variant].variant_id == variantID) {
                        MW_Entity_LoadEntity(configModule.entitiesConfig[entity].variants[variant].type, instanceUUID, entity, variant,
                        configModule.entitiesConfig[entity].id, configModule.entitiesConfig[entity].variants[variant].variant_id,
                        configModule.entitiesConfig[entity].variants[variant].model,
                        configModule.entitiesConfig[entity].variants[variant].wheels, Vector3.zero, Vector3.zero, Quaternion.identity,
                        configModule.entitiesConfig[entity].variants[variant].mass,
                        configModule.entitiesConfig[entity].variants[variant].scripts);
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
    else if (msg == "TOOLBAR.ENTITY.ENABLE-GRID") {
        WorldStorage.SetItem("ENTITY-GRID-ENABLED", "TRUE");
    }
    else if (msg == "TOOLBAR.ENTITY.DISABLE-GRID") {
        WorldStorage.SetItem("ENTITY-GRID-ENABLED", "FALSE");
    }
    else if (msg.startsWith("TOOLBAR.ENTITY.SET-GRID-SIZE")) {
        WorldStorage.SetItem("ENTITY-GRID-SIZE", msg.substring(msg.indexOf("(") + 1, msg.indexOf(")")));
    }
    else if (msg == "TOOLBAR.ENTITY.KEEP-SPAWNING") {
        WorldStorage.SetItem("ENTITY-KEEP-SPAWNING", "TRUE");
    }
    else if (msg == "TOOLBAR.ENTITY.DONT-KEEP-SPAWNING") {
        WorldStorage.SetItem("ENTITY-KEEP-SPAWING", "FALSE");
    }
    else if (msg == "TOOLBAR.ENTITY.START-DELETING") {
        WorldStorage.SetItem("ENTITY-DELETE-ENABLED", "TRUE");
    }
    else if (msg == "TOOLBAR.ENTITY.STOP-DELETING") {
        WorldStorage.SetItem("ENTITY-DELETE-ENABLED", "FALSE");
    }
    else if (msg == "TOOLBAR.DISPLAY.ENABLED") {
        WorldStorage.SetItem("MENU-ACTIVE", "TRUE");
    }
    else if (msg == "TOOLBAR.DISPLAY.DISABLED") {
        WorldStorage.SetItem("MENU-ACTIVE", "FALSE");
    }
    else if (msg.startsWith("TOOLBAR.GRID.TOGGLE")) {
        var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
        if (mainToolbar != null) {
            WorldStorage.SetItem("ENTITY-GRID-ENABLED",
                msg.substring(msg.indexOf("(") + 1, msg.indexOf(")")) == "true" ? "TRUE" : "FALSE");
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

function SetUpToolsInMenu() {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    if (mainToolbar != null) {
        mainToolbar.ExecuteJavaScript("AddToolButton('Hand','" + handPath +
            "','TOOLBAR.TOOLS.TOOL-SELECTED.HAND');", null);
        mainToolbar.ExecuteJavaScript("AddToolButton('Square Shovel','" + squareShovelx1Path +
            "','TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-1');", null);
        mainToolbar.ExecuteJavaScript("AddToolButton('Square Shovel (2x)','" + squareShovelx2Path +
            "','TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-2');", null);
        mainToolbar.ExecuteJavaScript("AddToolButton('Square Shovel (4x)','" + squareShovelx4Path +
            "','TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-4');", null);
        mainToolbar.ExecuteJavaScript("AddToolButton('Square Shovel (8x)','" + squareShovelx8Path +
            "','TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-8');", null);
        mainToolbar.ExecuteJavaScript("AddToolButton('Sledge Hammer','" + sledgeHammerPath +
            "','TOOLBAR.TOOLS.TOOL-SELECTED.SLEDGE-HAMMER');", null);
    }
}

function SetUpToolsInVRMenu() {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
    if (mainToolbar != null) {
        mainToolbar.ExecuteJavaScript("AddToolButton('Hand','" + handPath +
            "','TOOLBAR.TOOLS.TOOL-SELECTED.HAND');", null);
        mainToolbar.ExecuteJavaScript("AddToolButton('Square Shovel','" + squareShovelx1Path +
            "','TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-1');", null);
        mainToolbar.ExecuteJavaScript("AddToolButton('Square Shovel (2x)','" + squareShovelx2Path +
            "','TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-2');", null);
        mainToolbar.ExecuteJavaScript("AddToolButton('Square Shovel (4x)','" + squareShovelx4Path +
            "','TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-4');", null);
        mainToolbar.ExecuteJavaScript("AddToolButton('Square Shovel (8x)','" + squareShovelx8Path +
            "','TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-8');", null);
        mainToolbar.ExecuteJavaScript("AddToolButton('Sledge Hammer','" + sledgeHammerPath +
            "','TOOLBAR.TOOLS.TOOL-SELECTED.SLEDGE-HAMMER');", null);
    }
}

function SetUpTerrainInMenu() {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    if (mainToolbar != null) {
        for (var terrainLayer in configModule.terrainConfig.layers) {
            var iconPath = configModule.terrainConfig.layers[terrainLayer].color_texture;
            if (iconPath == null || iconPath == "") {
                iconPath = defaultTerrainPath;
            }

            mainToolbar.ExecuteJavaScript("AddMaterialButton('" + terrainLayer + "','" + iconPath + "','" +
                "TOOLBAR.TERRAIN.MATERIAL-SELECTED." + configModule.terrainConfig.layers[terrainLayer].layer + ".1');", null);
            mainToolbar.ExecuteJavaScript("AddMaterialButton('" + terrainLayer + " (2x)','" + iconPath + "','" +
                "TOOLBAR.TERRAIN.MATERIAL-SELECTED." + configModule.terrainConfig.layers[terrainLayer].layer + ".2');", null);
            mainToolbar.ExecuteJavaScript("AddMaterialButton('" + terrainLayer + " (4x)','" + iconPath + "','" +
                "TOOLBAR.TERRAIN.MATERIAL-SELECTED." + configModule.terrainConfig.layers[terrainLayer].layer + ".4');", null);
            mainToolbar.ExecuteJavaScript("AddMaterialButton('" + terrainLayer + " (8x)','" + iconPath + "','" +
                "TOOLBAR.TERRAIN.MATERIAL-SELECTED." + configModule.terrainConfig.layers[terrainLayer].layer + ".8');", null);
        }
    }
}

function SetUpTerrainInVRMenu() {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
    if (mainToolbar != null) {
        for (var terrainLayer in configModule.terrainConfig.layers) {
            var iconPath = configModule.terrainConfig.layers[terrainLayer].color_texture;
            if (iconPath == null || iconPath == "") {
                iconPath = defaultTerrainPath;
            }

            mainToolbar.ExecuteJavaScript("AddMaterialButton('" + terrainLayer + "','" + iconPath + "','" +
                "TOOLBAR.TERRAIN.MATERIAL-SELECTED." + configModule.terrainConfig.layers[terrainLayer].layer + ".1');", null);
            mainToolbar.ExecuteJavaScript("AddMaterialButton('" + terrainLayer + " (2x)','" + iconPath + "','" +
                "TOOLBAR.TERRAIN.MATERIAL-SELECTED." + configModule.terrainConfig.layers[terrainLayer].layer + ".2');", null);
            mainToolbar.ExecuteJavaScript("AddMaterialButton('" + terrainLayer + " (4x)','" + iconPath + "','" +
                "TOOLBAR.TERRAIN.MATERIAL-SELECTED." + configModule.terrainConfig.layers[terrainLayer].layer + ".4');", null);
            mainToolbar.ExecuteJavaScript("AddMaterialButton('" + terrainLayer + " (8x)','" + iconPath + "','" +
                "TOOLBAR.TERRAIN.MATERIAL-SELECTED." + configModule.terrainConfig.layers[terrainLayer].layer + ".8');", null);
        }
    }
}

function SetUpVRTerrainMenu() {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
    if (mainToolbar != null) {
        for (var terrainLayer in configModule.terrainConfig.layers) {
            mainToolbar.ExecuteJavaScript("AddMaterialButton('" + terrainLayer + "','" + configModule.terrainConfig.layers[terrainLayer].color_texture + "','" +
                "TOOLBAR.TERRAIN.MATERIAL-SELECTED." + configModule.terrainConfig.layers[terrainLayer].layer + "');", null);
        }
    }
}

function SetUpEntitiesInMenu() {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));

    for (var entity in configModule.entitiesConfig) {
        for (var variant in configModule.entitiesConfig[entity].variants) {
            var iconPath = configModule.entitiesConfig[entity].variants[variant].thumbnail;
            if (iconPath == null || iconPath == "" || iconPath.endsWith(".png") == false) {
                iconPath = defaultEntityPath;
            }

            mainToolbar.ExecuteJavaScript("AddEntityButton('" + configModule.entitiesConfig[entity].variants[variant].display_name
                + "','" + iconPath + "','" + "TOOLBAR.ENTITY.ENTITY-SELECTED." + configModule.entitiesConfig[entity].id +
                "." + configModule.entitiesConfig[entity].variants[variant].variant_id + "');", null);
        }
    }
}

function SetUpEntitiesInVRMenu() {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
    
    mainToolbar.ExecuteJavaScript("AddEntityButton('Delete','TODO','TOOLBAR.ENTITY.ENTITY-SELECTED.-1.-1');", null);

    for (var entity in configModule.entitiesConfig) {
        for (var variant in configModule.entitiesConfig[entity].variants) {
            var iconPath = configModule.entitiesConfig[entity].variants[variant].thumbnail;
            if (iconPath == null || iconPath == "" || iconPath.endsWith(".png") == false) {
                iconPath = defaultEntityPath;
            }

            mainToolbar.ExecuteJavaScript("AddEntityButton('" + configModule.entitiesConfig[entity].variants[variant].display_name
                + "','" + iconPath + "','" + "TOOLBAR.ENTITY.ENTITY-SELECTED." + configModule.entitiesConfig[entity].id +
                "." + configModule.entitiesConfig[entity].variants[variant].variant_id + "');", null);
        }
    }
}

function InitializeLowerToolbarItems() {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));

    var numEntitiesInMenu = 0;
    for (var entity in configModule.entitiesConfig) {
        for (var variant in configModule.entitiesConfig[entity].variants) {
            if (numEntitiesInMenu >= 3) {
                break;
            }

            var iconPath = configModule.entitiesConfig[entity].variants[variant].thumbnail;
            if (iconPath == null || iconPath == "" || iconPath.endsWith(".png") == false) {
                iconPath = defaultEntityPath;
            }

            mainToolbar.ExecuteJavaScript("InsertButtonIntoLowerToolbar({icon:'" + iconPath +
                "',tooltip:'"+ configModule.entitiesConfig[entity].variants[variant].display_name +
                "'},0,'TOOLBAR.ENTITY.ENTITY-SELECTED." + configModule.entitiesConfig[entity].id +
                "." + configModule.entitiesConfig[entity].variants[variant].variant_id + "');", null);
            numEntitiesInMenu++;
        }
    }

    var numTerrainLayersInMenu = 0;
    for (var terrainLayer in configModule.terrainConfig.layers) {
        if (numTerrainLayersInMenu >= 3) {
            break;
        }

        var iconPath = configModule.terrainConfig.layers[terrainLayer].color_texture;
        if (iconPath == null || iconPath == "") {
            iconPath = defaultTerrainPath;
        }

        mainToolbar.ExecuteJavaScript("InsertButtonIntoLowerToolbar({icon:'" + iconPath +
            "',tooltip:'"+ terrainLayer + "'},0,'TOOLBAR.TERRAIN.MATERIAL-SELECTED." +
            configModule.terrainConfig.layers[terrainLayer].layer + ".1');", null);
        numTerrainLayersInMenu++;
    }

    mainToolbar.ExecuteJavaScript("InsertButtonIntoLowerToolbar({icon:'" + sledgeHammerPath +
        "',tooltip:'Sledge Hammer'},0,'TOOLBAR.TOOLS.TOOL-SELECTED.SLEDGE-HAMMER');", null);
    mainToolbar.ExecuteJavaScript("InsertButtonIntoLowerToolbar({icon:'" + squareShovelx1Path +
        "',tooltip:'Square Shovel'},0,'TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-1');", null);
    mainToolbar.ExecuteJavaScript("InsertButtonIntoLowerToolbar({icon:'" + handPath +
        "',tooltip:'Hand'},0,'TOOLBAR.TOOLS.TOOL-SELECTED.HAND');", null);
}

function InitializeLowerVRToolbarItems() {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));

    var numEntitiesInMenu = 0;
    for (var entity in configModule.entitiesConfig) {
        for (var variant in configModule.entitiesConfig[entity].variants) {
            if (numEntitiesInMenu >= 3) {
                break;
            }

            var iconPath = configModule.entitiesConfig[entity].variants[variant].thumbnail;
            if (iconPath == null || iconPath == "" || iconPath.endsWith(".png") == false) {
                iconPath = defaultEntityPath;
            }

            mainToolbar.ExecuteJavaScript("InsertButtonIntoLowerToolbar({icon:'" + iconPath +
                "',tooltip:'"+ configModule.entitiesConfig[entity].variants[variant].display_name +
                "'},0,'TOOLBAR.ENTITY.ENTITY-SELECTED." + configModule.entitiesConfig[entity].id +
                "." + configModule.entitiesConfig[entity].variants[variant].variant_id + "');", null);
            numEntitiesInMenu++;
        }
    }

    var numTerrainLayersInMenu = 0;
    for (var terrainLayer in configModule.terrainConfig.layers) {
        if (numTerrainLayersInMenu >= 3) {
            break;
        }

        var iconPath = configModule.terrainConfig.layers[terrainLayer].color_texture;
        if (iconPath == null || iconPath == "") {
            iconPath = defaultTerrainPath;
        }

        mainToolbar.ExecuteJavaScript("InsertButtonIntoLowerToolbar({icon:'" + iconPath +
            "',tooltip:'"+ terrainLayer + "'},0,'TOOLBAR.TERRAIN.MATERIAL-SELECTED." +
            configModule.terrainConfig.layers[terrainLayer].layer + ".1');", null);
        numTerrainLayersInMenu++;
    }

    mainToolbar.ExecuteJavaScript("InsertButtonIntoLowerToolbar({icon:'" + sledgeHammerPath +
        "',tooltip:'Sledge Hammer'},0,'TOOLBAR.TOOLS.TOOL-SELECTED.SLEDGE-HAMMER');", null);
    mainToolbar.ExecuteJavaScript("InsertButtonIntoLowerToolbar({icon:'" + squareShovelx1Path +
        "',tooltip:'Square Shovel'},0,'TOOLBAR.TOOLS.TOOL-SELECTED.SQUARE-SHOVEL-1');", null);
    mainToolbar.ExecuteJavaScript("InsertButtonIntoLowerToolbar({icon:'" + handPath +
        "',tooltip:'Hand'},0,'TOOLBAR.TOOLS.TOOL-SELECTED.HAND');", null);
}

function SetUpVREntitiesMenu() {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
    
    mainToolbar.ExecuteJavaScript("AddEntityButton('Delete','TODO','TOOLBAR.ENTITY.ENTITY-SELECTED.-1.-1');", null);

    for (var entity in configModule.entitiesConfig) {
        for (var variant in configModule.entitiesConfig[entity].variants) {
            mainToolbar.ExecuteJavaScript("AddEntityButton('" + configModule.entitiesConfig[entity].variants[variant].display_name + "','"
                + configModule.entitiesConfig[entity].variants[variant].thumbnail + "','" +
                "TOOLBAR.ENTITY.ENTITY-SELECTED." + configModule.entitiesConfig[entity].id +
                "." + configModule.entitiesConfig[entity].variants[variant].variant_id + "');", null);
        }
    }
}

function ToggleVRMenu() {
    var toolbarPanel = Entity.Get(WorldStorage.GetItem("VR-TOOLBAR-PANEL-ID"));
    if (toolbarPanel != null) {
        toolbarPanel.SetVisibility(!toolbarPanel.GetVisibility());
        toolbarPanel.SetPosition(Input.GetLeftHandPosition(), false);
        toolbarPanel.SetRotation(Input.GetLeftHandRotation(), false);
    }
}

function ToggleVREntitySubMenu() {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
    
    mainToolbar.ExecuteJavaScript("ToggleEntitiesMenu();", null);
}

function SelectEntityMenuToolbarButton(index) {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    
    mainToolbar.ExecuteJavaScript("SelectLowerToolbarButton(" + index + ");", null);
}

function SelectEntityMenuToolbarButtonAtLeft() {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    
    mainToolbar.ExecuteJavaScript("SelectLowerToolbarButtonAtLeft();", null);
}

function SelectEntityMenuToolbarButtonAtRight() {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    
    mainToolbar.ExecuteJavaScript("SelectLowerToolbarButtonAtRight();", null);
}

function SelectVREntityMenuToolbarButton(index) {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
    
    mainToolbar.ExecuteJavaScript("SelectLowerToolbarButton(" + index + ");", null);
}

function SelectVREntityMenuToolbarButtonAtLeft() {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
    
    mainToolbar.ExecuteJavaScript("SelectLowerToolbarButtonAtLeft();", null);
}

function SelectVREntityMenuToolbarButtonAtRight() {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-VR-TOOLBAR-ID"));
    
    mainToolbar.ExecuteJavaScript("SelectLowerToolbarButtonAtRight();", null);
}

// Dedicated functions for console message handling
function AddConsoleMessage(timestamp, sender, message) {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    if (mainToolbar != null) {
        mainToolbar.ExecuteJavaScript("AddMessageToConsole(\"" + timestamp + "\",\"" + sender + "\",\"" + message + "\");", null);
    }
}

function AddRemoteConsoleMessage(timestamp, sender, content) {
    var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
    if (mainToolbar != null) {
        mainToolbar.ExecuteJavaScript("AddMessageToConsole(\"" + timestamp + "\",\"" + sender + "\",\"" + content + "\");", null);
    }
}

WorldStorage.SetItem("TERRAIN-BRUSH-MIN-HEIGHT", "1");
WorldStorage.SetItem("TERRAIN-BRUSH-MAX-HEIGHT", "511");
WorldStorage.SetItem("ENTITY-GRID-SIZE", 1);
WorldStorage.SetItem("ENTITY-GRID-ENABLED", "TRUE");
WorldStorage.SetItem("ENTITY-KEEP-SPAWNING", "FALSE");