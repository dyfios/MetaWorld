class UIModule {
    constructor(runtimeMode) {
        Logging.Log("Initializing UI Module...");

        this.runtimeMode = runtimeMode;

        this.viewMenu = new ViewMenu();

        this.vrConsoleMenu = new VRConsoleMenu();

        Context.DefineContext("UI_MODULE", this);

        Logging.Log("UI Module Initialized.");
    }
}

function MW_UI_SetUpEditToolbar() {
    var uiModule = Context.GetContext("UI_MODULE");
    
    //if (runtimeMode == "focused") {
        MW_UI_EditToolbar_SetUpToolbar();
    //}
}