// MetaWorld Client Modules.
let configurationModule = null;
let entityModule = null;
let identityModule = null;
let inputModule = null;
let playerModule = null;
let restModule = null;
let scriptModule = null;
let synchronizationModule = null;
let uiModule = null;
let worldRenderingModule = null;

// Query Parameter Information.
let worldURI = null;
let userID = null;
let userTag = null;
let token = null;
let tokenExpiration = null;
let interfaceMode = null;
let runtimeMode = null;
let thirdPersonCharacterModel = null;
let thirdPersonCharacterOffset = Vector3.zero;
let thirdPersonCharacterRotation = Quaternion.identity;
let thirdPersonCharacterLabelOffset = Vector3.zero;
let worldStartPos = Vector3.zero;
let startPos = Vector3.zero;
let hasExplicitStartPos = false;

function HandleQueryParams() {
    worldURI = World.GetQueryParam("world_uri");
    //userTag = World.GetQueryParam("user_tag");
    //userID = World.GetQueryParam("user_id");
    interfaceMode = World.GetQueryParam("IF_MODE");
    if (interfaceMode === "desktop") {
        
    }
    else if (interfaceMode === "vr") {
        
    }
    else if (interfaceMode === "mobile") {
        
    }
    else {
        Logging.Log("Interface Mode not set or invalid. Defaulting to desktop.");
        interfaceMode = "desktop";
    }
    runtimeMode = World.GetQueryParam("RT_MODE");
    if (runtimeMode === "webgl") {
        
    }
    else if (runtimeMode === "focused") {
        
    }
    else {
        Logging.Log("Runtime Mode not set or invalid. Defaulting to webgl.");
        runtimeMode = "webgl";
    }
    thirdPersonCharacterModel = World.GetQueryParam("AVATAR_MODEL");
    var thirdPersonCharacterOffsetX = World.GetQueryParam("AVATAR_OFFSET_X");
    var thirdPersonCharacterOffsetY = World.GetQueryParam("AVATAR_OFFSET_Y");
    var thirdPersonCharacterOffsetZ = World.GetQueryParam("AVATAR_OFFSET_Z");
    if (thirdPersonCharacterOffsetX != null && thirdPersonCharacterOffsetY != null && thirdPersonCharacterOffsetZ != null) {
        thirdPersonCharacterOffset = new Vector3(thirdPersonCharacterOffsetX, thirdPersonCharacterOffsetY, thirdPersonCharacterOffsetZ);
    }
    var thirdPersonCharacterRotationX = World.GetQueryParam("AVATAR_ROT_X");
    var thirdPersonCharacterRotationY = World.GetQueryParam("AVATAR_ROT_Y");
    var thirdPersonCharacterRotationZ = World.GetQueryParam("AVATAR_ROT_Z");
    var thirdPersonCharacterRotationW = World.GetQueryParam("AVATAR_ROT_W");
    if (thirdPersonCharacterRotationX != null && thirdPersonCharacterRotationY != null
        && thirdPersonCharacterRotationZ != null && thirdPersonCharacterRotationW != null) {
        thirdPersonCharacterRotation = new Quaternion(thirdPersonCharacterRotationX,
            thirdPersonCharacterRotationY, thirdPersonCharacterRotationZ, thirdPersonCharacterRotationW);
    }
    var thirdPersonCharacterLabelOffsetX = World.GetQueryParam("AVATAR_LABEL_OFFSET_X");
    var thirdPersonCharacterLabelOffsetY = World.GetQueryParam("AVATAR_LABEL_OFFSET_Y");
    var thirdPersonCharacterLabelOffsetZ = World.GetQueryParam("AVATAR_LABEL_OFFSET_Z");
    if (thirdPersonCharacterLabelOffsetX != null && thirdPersonCharacterLabelOffsetY != null && thirdPersonCharacterLabelOffsetZ != null) {
        thirdPersonCharacterLabelOffset = new Vector3(thirdPersonCharacterLabelOffsetX, thirdPersonCharacterLabelOffsetY, thirdPersonCharacterLabelOffsetZ);
    }

    var worldPosX = World.GetQueryParam("WORLD_POS_X");
    var worldPosY = World.GetQueryParam("WORLD_POS_Y");
    var worldPosZ = World.GetQueryParam("WORLD_POS_Z");
    if (worldPosX != null && worldPosY != null && worldPosZ != null) {
        worldStartPos = new Vector3(worldPosX, worldPosY, worldPosZ);
    }
    else {
        // Set to a default.
    }

    var startXArg = 0;
    var startYArg = 512;
    var startZArg = 0;
    startXArg = World.GetQueryParam("start_x");
    startYArg = World.GetQueryParam("start_y");
    startZArg = World.GetQueryParam("start_z");
    if (startXArg != null && startYArg != null && startZArg != null) {
        startPos = new Vector3(parseFloat(startXArg), parseFloat(startYArg), parseFloat(startZArg));
        hasExplicitStartPos = true;
    }
    //token = World.GetQueryParam("token");
}

function InitializeModules() {
    configurationModule = new ConfigurationModule(worldURI, PerformPostWorldConfigLoadActions);
    entityModule = new EntityModule();
    identityModule = new IdentityModule(userID, userTag, token);
    inputModule = new InputModule();
    playerModule = new PlayerModule(userTag, startPos, interfaceMode,
        thirdPersonCharacterModel, thirdPersonCharacterOffset,
        thirdPersonCharacterRotation, thirdPersonCharacterLabelOffset, hasExplicitStartPos);
    restModule = new RESTModule();
    scriptModule = new ScriptModule();
    synchronizationModule = new SynchronizationModule(playerModule);
    uiModule = new UIModule(runtimeMode);
    worldRenderingModule = new WorldRenderingModule(worldStartPos);

    GetWorldConfiguration();
}

function GetWorldConfiguration() {
    Logging.Log("Getting World Configuration...");

    var configModule = Context.GetContext("CONFIGURATION_MODULE");

    configModule.LoadWorldConfig();
}

function PerformPostWorldConfigLoadActions() {
    Logging.Log("Performing Post World Config Load Actions...");
    ConnectToGlobalSynchronizer();
    MW_UI_SetUpEditToolbar()
}

function PerformPostSynchronizerConnectActions() {
    Logging.Log("Performing Post Synchronizer Connect Actions...");
}

function PerformPostSessionJoinedActions() {
    Logging.Log("Performing Post Session Joined Actions...");
    MW_Rend_LoadWorld();
}

function ConnectToGlobalSynchronizer() {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    var synchronizationModule = Context.GetContext("SYNCHRONIZATION_MODULE");

    synchronizationSession = {
        host: configModule.worldConfig["vos-synchronization-service"]["host"],
        port: configModule.worldConfig["vos-synchronization-service"]["port"],
        tls: configModule.worldConfig["vos-synchronization-service"]["tls"],
        transport: configModule.worldConfig["vos-synchronization-service"]["transport"]
    };

    sessionInfo = {
        id: configModule.worldConfig["vos-synchronization-service"]["global-session-id"],
        tag: configModule.worldConfig["vos-synchronization-service"]["global-session-tag"]
    };
    MW_Sync_ConnectToGlobalSynchronizer(synchronizationSession, sessionInfo,
        PerformPostSynchronizerConnectActions, PerformPostSessionJoinedActions);
}

function FinishLoginPanelSetup() {
    var loginContext = Context.GetContext("LOGIN_CONTEXT");
    var loginPanel = Entity.Get(WorldStorage.GetItem("LOGIN-PANEL-ID"));

    if (loginPanel == null) {
        Logging.Log("Login Panel not found. Cannot finish setup.");
        return;
    }

    loginPanel.SetInteractionState(InteractionState.Static);
    loginPanel.LoadFromURL('https://dylanworld.webverse.info:3000/userlogin');

    Context.DefineContext("LOGIN_CONTEXT", loginContext);
}

function HandleUserLoginMessage(message) {
    if (msg.startsWith("WHID.AUTH.COMPLETE")) {
        var rawMsgParams = msg.substring(msg.indexOf("(") + 1, msg.indexOf(")"));
        if (rawMsgParams == null) {
            Logging.LogError("HandleUserLoginMessage: Invalid Authentication Complete message received.");
            return;
        }

        var msgParams = rawMsgParams.split(",");
        if (msgParams.length != 3) {
            Logging.LogError("HandleToolbarMessage: Invalid Authentication Complete message received.");
            return;
        }
        
        var mwTopLevelContext = Context.GetContext("MW_TOP_LEVEL_CONTEXT");
        if (mwTopLevelContext == null) {
            Logging.LogError("MW_TOP_LEVEL_CONTEXT not found. Cannot handle user login message.");
            return;
        }

        mwTopLevelContext.userID = msgParams[0];
        mwTopLevelContext.userTag = msgParams[1];
        mwTopLevelContext.token = msgParams[2];
        mwTopLevelContext.tokenExpiration = msgParams[3];

        InitializeModules();
    }
}

function FinishLoginCanvasSetup() {
    var loginContext = Context.GetContext("LOGIN_CONTEXT");

    var loginCanvas = Entity.Get(WorldStorage.GetItem("TOOLBAR-CANVAS-ID"));
    loginCanvas.SetInteractionState(InteractionState.Static);
        toolbarCanvas.MakeScreenCanvas();
    var loginPanel = HTMLEntity.Create(loginCanvas, new Vector2(0, 0), new Vector2(1, 1),
        null, "UserLoginPanel", "HandleUserLoginMessage", "FinishUserLoginPanelCreation");
    
    Context.DefineContext("LOGIN_CONTEXT", loginContext);
}

function StartUserLogin() {
    Logging.Log("Starting User Login...");

    var loginContext = {};
    WorldStorage.SetItem("LOGIN-CANVAS-ID", UUID.NewUUID().ToString());

    loginContext.loginCanvas = CanvasEntity.Create(null, Vector3.zero, Quaternion.identity,
        Vector3.one, false, WorldStorage.GetItem("LOGIN-CANVAS-ID"), "LoginCanvas", "FinishLoginCanvasSetup");
    
    Context.DefineContext("LOGIN_CONTEXT", loginContext);
}

HandleQueryParams();
Context.DefineContext("MW_TOP_LEVEL_CONTEXT", this);

StartUserLogin();