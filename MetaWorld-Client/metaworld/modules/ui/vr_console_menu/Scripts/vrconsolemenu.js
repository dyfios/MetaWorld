function FinishVRConsoleMenuPanelSetup() {
    var context = Context.GetContext("vrConsoleContext");
    var vrConsoleMenuPanel = Entity.Get(WorldStorage.GetItem("VR-CONSOLE-MENU-PANEL-ID"));
    if (vrConsoleMenuPanel != null) {
        vrConsoleMenuPanel.SetVisibility(true);
        context.LoadVRConsole();
    }
}

function FinishVRConsoleMenuSetup() {
    var context = Context.GetContext("vrConsoleContext");
    context.SetUpVRConsole();
}

function FinishVRConsoleMenuCreation() {
    var vrConsole = Entity.Get(WorldStorage.GetItem("VR-CONSOLE-MENU-ID"));
    if (vrConsole != null) {
        vrConsole.SetInteractionState(InteractionState.Static);
        vrConsole.LoadFromURL('metaworld/modules/ui/vr_console_menu/HTML/vrconsolemenu.html');
    }
}

class VRConsoleMenu {
    constructor() {
        WorldStorage.SetItem("VR-CONSOLE-MENU-PANEL-ID", UUID.NewUUID().ToString());
        WorldStorage.SetItem("VR-CONSOLE-MENU-CANVAS-ID", UUID.NewUUID().ToString());
        WorldStorage.SetItem("VR-CONSOLE-MENU-ID", UUID.NewUUID().ToString());
        
        this.SetUpVRConsole = function() {
            var context = Context.GetContext("vrConsoleContext");
            var vrConsoleCanvas = Entity.Get(WorldStorage.GetItem("VR-CONSOLE-MENU-CANVAS-ID"));
            vrConsoleCanvas.SetSize(new Vector2(939, 779));
            vrConsoleCanvas.SetInteractionState(InteractionState.Static);
            vrConsoleCanvas.MakeWorldCanvas();
            
            context.vrConsole = HTMLEntity.Create(vrConsoleCanvas, new Vector2(0, 0),
                new Vector2(1, 1), WorldStorage.GetItem("VR-CONSOLE-MENU-ID"), "Console Menu",
                "HandleConsoleMenuMessage", "FinishVRConsoleMenuCreation");
        }

        this.LoadVRConsole = function() {
            var context = Context.GetContext("vrConsoleContext");
            var vrConsoleMenuPanel = Entity.Get(WorldStorage.GetItem("VR-CONSOLE-MENU-PANEL-ID"));
            
            if (vrConsoleMenuPanel != null) {
                context.vrConsoleCanvas = CanvasEntity.Create(vrConsoleMenuPanel, new Vector3(0, 1, 0.79),
                new Quaternion(0.3827, 0, 0, 0.9239), new Vector3(0.0038, 0.003, 0.004), false,
                WorldStorage.GetItem("VR-CONSOLE-MENU-CANVAS-ID"), "ConsoleMenuCanvas", "FinishVRConsoleMenuSetup");
            }
        }

        Context.DefineContext("vrConsoleContext", this);

        this.vrConsolePanel = ContainerEntity.Create(null, Vector3.zero, Quaternion.identity,
            new Vector3(0.1, 0.1, 0.1), false, null, WorldStorage.GetItem("VR-CONSOLE-MENU-PANEL-ID"),
            "FinishVRConsoleMenuPanelSetup");
        
        Context.DefineContext("vrConsoleContext", this);
    }
}

function HandleConsoleMenuMessage(msg) {
    if (msg.startsWith("CONSOLE.TOGGLE_MODE")) {
        var mode = msg.substring(msg.indexOf("(") + 1, msg.indexOf(")"));
        if (mode == "Free Fly") {
            WorldStorage.SetItem("METAWORLD-VIEW-MODE", 1);
            MW_Player_ThirdPerson_SetMotionModeFree();
        }
        else if (mode == "Ground") {
            WorldStorage.SetItem("METAWORLD-VIEW-MODE", 0);
            MW_Player_ThirdPerson_SetMotionModePhysical();
        }
        else {
            Logging.Log("[HandleConsoleMenuMessage] Received invalid mode: " + mode);
        }
    }
    else if (msg.startsWith("CONSOLE.SET_SPEED")) {
        var speed = msg.substring(msg.indexOf("(") + 1, msg.indexOf(")"));
        WorldStorage.SetItem("VR-MOVEMENT-SPEED", speed);
    }
    else if (msg.startsWith("CONSOLE.SUBMIT_COMMAND")) {
        var command = msg.substring(msg.indexOf("(") + 1, msg.indexOf(")"));
        // Send command through synchronization system
        MW_Sync_VSS_SendCommand(command);
    }
    else if (msg.startsWith("CONSOLE.SEND_MESSAGE")) {
        var message = msg.substring(msg.indexOf("(") + 1, msg.indexOf(")"));
        // Send message through synchronization system
        MW_Sync_VSS_SendMessage(message);
        // Also add to local console for immediate feedback
        var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
        if (mainToolbar != null) {
            mainToolbar.ExecuteJavaScript("AddMessageToConsole(\"" + Date.Now.ToTimeString() + "\",\"You\",\"" + message + "\");", null);
        }
    }
    else {
        Logging.Log("[HandleConsoleMenuMessage] Received invalid message: " + msg);

    }
}