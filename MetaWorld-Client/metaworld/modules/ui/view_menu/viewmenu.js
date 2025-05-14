class ViewMenu {
    constructor() {
        Logging.Log("Initializing View Menu...");

        MW_UI_ViewMenu_SetTouchControls();
        MW_UI_ViewMenu_SetClientMode("EDIT");
        MW_UI_ViewMenu_ToggleView();
        MW_UI_ViewMenu_ToggleFly();
        MW_UI_ViewMenu_ToggleConsole();
        MW_UI_ToggleViewMenu();

        Context.DefineContext("VIEW_MENU", this);

        Logging.Log("View Menu Initialized.");
    }
}

function MW_UI_ToggleViewMenu() {
    var viewMenu = Entity.GetByTag("ViewMenu");
    if (viewMenu == null) {
        Logging.LogError("MetaWorld->ToggleViewMenu: Unable to get View Menu.");
        return;
    }

    var visibilityToSet = !viewMenu.GetVisibility();
    viewMenu.SetVisibility(visibilityToSet);
    WorldStorage.SetItem("VIEW-MENU-VISIBLE", visibilityToSet ? "TRUE" : "FALSE");
}

function MW_UI_ViewMenu_ToggleClientMode() {
    currentMode = WorldStorage.GetItem("METAWORLD-CLIENT-MODE");
    if (currentMode == "VIEW") {
        SetClientMode("EDIT");
    }
    else if (currentMode == "EDIT") {
        SetClientMode("VIEW");
    }
    else {
        Logging.LogError("MetaWorld->ToggleClientMode: Invalid current mode.");
    }
}

function MW_UI_ViewMenu_SetClientMode(mode) {
    if (mode == "VIEW") {
        WorldStorage.SetItem("METAWORLD-CLIENT-MODE", "VIEW");
        var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
        if (mainToolbar != null) {
            mainToolbar.SetVisibility(false);
        }
        var buttonText = Entity.GetByTag("ModeText");
        if (buttonText != null) {
            buttonText.SetText("Mode: View");
        }
    }
    else if (mode == "EDIT") {
        WorldStorage.SetItem("METAWORLD-CLIENT-MODE", "EDIT");
        var mainToolbar = Entity.Get(WorldStorage.GetItem("MAIN-TOOLBAR-ID"));
        if (mainToolbar != null) {
            mainToolbar.SetVisibility(true);
        }
        var buttonText = Entity.GetByTag("ModeText");
        if (buttonText != null) {
            buttonText.SetText("Mode: Edit");
        }
    }
    else {
        Logging.LogError("MetaWorld->SetClientMode: Invalid mode.");
    }
}

function MW_UI_ViewMenu_ToggleView() {
    var currentView = WorldStorage.GetItem("METAWORLD-VIEW-MODE");
    if (currentView == null) {
        currentView = 0;
    }
    else if (currentView == 0) {
        currentView = 1;
    }
    else if (currentView == 1) {
        currentView = 0;
    }
    else {
        currentView = 1;
    }
    WorldStorage.SetItem("METAWORLD-VIEW-MODE", currentView);

    var buttonText = Entity.GetByTag("ViewText");
    if (buttonText != null) {
        if (currentView == 0) {
            buttonText.SetText("Mode: Surface");
            MW_Player_ThirdPerson_SetMotionModePhysical();
        }
        else if (currentView == 1) {
            buttonText.SetText("Mode: Free Fly");
            MW_Player_ThirdPerson_SetMotionModeFree();
        }
    }
}

function MW_UI_ViewMenu_DecreaseSpeed() {
    speedText = Entity.GetByTag("SpeedText");
    if (speedText == null) {
        Logging.LogError("Unable to get speed text.");
        return;
    }

    speed = parseFloat(speedText.GetText()) / 2;
    if (speed <= 0.125) {
        speed = 0.125
    }
    
    speedText.SetText(speed.toString());
    MW_Player_ThirdPerson_SetMotionMultiplier(speed);
}

function MW_UI_ViewMenu_IncreaseSpeed() {
    speedText = Entity.GetByTag("SpeedText");
    if (speedText == null) {
        Logging.LogError("Unable to get speed text.");
        return;
    }

    speed = parseFloat(speedText.GetText()) * 2;
    if (speed >= 32) {
        speed = 32
    }
    
    speedText.SetText(speed.toString());
    MW_Player_ThirdPerson_SetMotionMultiplier(speed);
}

function MW_UI_ViewMenu_ToggleFly() {
    var buttonText = Entity.GetByTag("FlyText");
    if (buttonText != null) {
        buttonText.SetText("Fly: On");
    }
}

function MW_UI_ViewMenu_ToggleConsole() {
    var buttonText = Entity.GetByTag("ConsoleText");
    if (buttonText != null) {
        buttonText.SetText("Console: Off");
    }
}

function MW_UI_ViewMenu_SetTouchControls() {
    var upControlEntity = Entity.GetByTag("Up");
    if (upControlEntity === null) {
        Logging.LogError("SetButtonControls: Could not get control: Up.");
        return;
    }

    var downControlEntity = Entity.GetByTag("Down");
    if (downControlEntity === null) {
        Logging.LogError("SetButtonControls: Could not get control: Down.");
        return;
    }
    
    var leftControlEntity = Entity.GetByTag("Left");
    if (leftControlEntity === null) {
        Logging.LogError("SetButtonControls: Could not get control: Left.");
        return;
    }

    var rightControlEntity = Entity.GetByTag("Right");
    if (rightControlEntity === null) {
        Logging.LogError("SetButtonControls: Could not get control: Right.");
        return;
    }

    var jumpControlEntity = Entity.GetByTag("Jump");
    if (jumpControlEntity === null) {
        Logging.LogError("SetButtonControls: Could not get control: Jump.");
        return;
    }

    var dropControlEntity = Entity.GetByTag("Drop");
    if (dropControlEntity === null) {
        Logging.LogError("SetButtonControls: Could not get control: Drop.");
        return;
    }

    if (interfaceMode === "mobile") {
        upControlEntity.SetVisibility(true);
    }
    else {
        upControlEntity.SetVisibility(false);
    }
    
    if (interfaceMode === "mobile") {
        downControlEntity.SetVisibility(true);
    }
    else {
        downControlEntity.SetVisibility(false);
    }

    if (interfaceMode === "mobile") {
        leftControlEntity.SetVisibility(true);
    }
    else {
        leftControlEntity.SetVisibility(false);
    }

    if (interfaceMode === "mobile") {
        rightControlEntity.SetVisibility(true);
    }
    else {
        rightControlEntity.SetVisibility(false);
    }

    if (interfaceMode === "mobile") {
        jumpControlEntity.SetVisibility(true);
    }
    else {
        jumpControlEntity.SetVisibility(false);
    }

    if (interfaceMode === "mobile") {
        dropControlEntity.SetVisibility(true);
    }
    else {
        dropControlEntity.SetVisibility(false);
    }
}