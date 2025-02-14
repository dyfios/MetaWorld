this.toolbar = null;

var worldURI = World.GetQueryParam("world_uri");
var worldConfig = new WorldConfiguration(worldURI);
var startPos = GetStartPos(startPos);
let interfaceMode = null;
let runtimeMode = null;
let characterSynchronized = false;
let characterLoaded = false;
let sessionJoined = false;
let entityPlacer = new EntityPlacer();
Context.DefineContext("ENTITYPLACERCONTEXT", entityPlacer);
let thirdPersonCharacter = null;
let thirdPersonCharacterModel = null;
let thirdPersonCharacterOffset = Vector3.zero;
let thirdPersonCharacterRotation = Quaternion.identity;
let thirdPersonCharacterLabelOffset = Vector3.zero;
let worldStartPos = Vector3.zero;
HandleQueryParams();
let worldRenderer = new WorldRenderer(worldStartPos);

let vosSynchronizer = null;

Time.SetInterval(`
    if (vosSynchronizer === null) {
        var context = Context.GetContext("WORLDRENDERERCONTEXT");
        if (context.worldLoaded === true) {
            SetUpSynchronizer();
        }
    }
    
    if (!characterSynchronized) {
        if (characterLoaded && sessionJoined) {
            //vosSynchronizer.AddEntity(thirdPersonCharacter.characterEntityID, true);
            sessionJoined = true;
            characterSynchronized = true;
        }
    }
`, 0.1);

function SetUpSynchronizer() {
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    if (vosSynchronizer === null && configContext.worldConfig != null) {
        sessionInfo = {
            id: configContext.worldConfig["vos-synchronization-service"]["session-id"],
            tag: configContext.worldConfig["vos-synchronization-service"]["session-tag"]
        };
        vosSynchronizer = new VOSSynchronizer(configContext.worldConfig["vos-synchronization-service"].host, configContext.worldConfig["vos-synchronization-service"].port,
            configContext.worldConfig["vos-synchronization-service"].tls, configContext.worldConfig["vos-synchronization-service"].transport, sessionInfo, OnConnect, OnJoinSession, "OnVSSMessage");
        thirdPersonCharacter = new ThirdPersonCharacter(userName, null, -90, 90, 0.05, 0.05, startPos, OnCharacterLoaded, interfaceMode, true,
            thirdPersonCharacterModel, [ thirdPersonCharacterModel ], thirdPersonCharacterOffset, thirdPersonCharacterRotation, thirdPersonCharacterLabelOffset);
        //vosSynchronizer.Connect();
        ToggleView();
    }
}

function HandleQueryParams() {
    userName = World.GetQueryParam("USER_NAME");
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
}

function SetUpToolbar() {
    this.toolbar = new MainToolbar();
    WorldStorage.SetItem("TERRAIN-EDIT-LAYER", "-1");
    WorldStorage.SetItem("TERRAIN-BRUSH-SIZE", 1);
    WorldStorage.SetItem("TERRAIN-BRUSH-MAX-HEIGHT", 192);
}

function SetUpLoadingIndicator() {
    this.loadingIndicator = new LoadingIndicator();
}

function ToggleClientMode() {
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

function SetClientMode(mode) {
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

function ToggleView() {
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
            thirdPersonCharacter.SetMotionModePhysical();
        }
        else if (currentView == 1) {
            buttonText.SetText("Mode: Free Fly");
            thirdPersonCharacter.SetMotionModeFree();
        }
    }
}

function DecreaseSpeed() {
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
    SetMotionMultiplier(speed);
}

function IncreaseSpeed() {
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
    SetMotionMultiplier(speed);
}

function ToggleFly() {
    var buttonText = Entity.GetByTag("FlyText");
    if (buttonText != null) {
        buttonText.SetText("Fly: On");
    }
}

function ToggleConsole() {
    var buttonText = Entity.GetByTag("ConsoleText");
    if (buttonText != null) {
        buttonText.SetText("Console: Off");
    }
}

function SetTouchControls() {
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

function OnConnect() {
    
}

function OnJoinSession() {
    sessionJoined = true;
}

function OnLeftPress() {
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    
    entityPlacer.StopPlacing();
    
    hitInfo = Input.GetPointerRaycast(Vector3.forward);
    
    if (hitInfo != null) {
        if (hitInfo.entity != null) {
            if (hitInfo.entity.Dig != null) {
                layerToDig = parseInt(WorldStorage.GetItem("TERRAIN-EDIT-LAYER"));
                brushSize = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-SIZE"));
                brushMinHeight = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-MIN-HEIGHT"));
                terrainIndex = GetIndexForTerrainTile(hitInfo.entity);
                if (layerToDig > -1) {
                    alignedHitPoint = new Vector3(
                        Math.round(hitInfo.hitPoint.x / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"],
                        Math.round(hitInfo.hitPoint.y / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"],
                        Math.round(hitInfo.hitPoint.z / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"]);
                    if (alignedHitPoint.y >= brushMinHeight) {
                        hitInfo.entity.Dig(alignedHitPoint, TerrainEntityBrushType.roundedCube, layerToDig, brushSize);
                        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/modifyterrain?chunkX=" +
                            terrainIndex.x + "&chunkY=" + terrainIndex.y + "&x=" + alignedHitPoint.x +
                            "&y=" + alignedHitPoint.y + "&z=" + alignedHitPoint.z + "&operation=" + "dig" +
                            "&brushType=roundedCube&layer=" + layerToDig + "&brushSize=" + brushSize, null);
                        vosSynchronizer.SendTerrainDigUpdate("{x:" + alignedHitPoint.x + ",y:" +
                            alignedHitPoint.y + ",z:" + alignedHitPoint.z + "}", "roundedcube", layerToDig); // TODO add brush size.
                    }
                }
            }

            if (WorldStorage.GetItem("ENTITY-DELETE-ENABLED") == "TRUE") {
                if (hitInfo.entity instanceof MeshEntity) {
                    terrainIndex = GetTerrainTileIndexForEntity(hitInfo.entity);
                    HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/deleteentity?chunkX=" +
                        terrainIndex.x + "&chunkY=" + terrainIndex.y + "&instanceID="
                        + hitInfo.entity.id.ToString(), null);
                    vosSynchronizer.SendEntityDeleteUpdate(hitInfo.entity.id.ToString());
                    hitInfo.entity.Delete();
                }
            }
        }
    }
}

function OnRightPress() {
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    
    entityPlacer.CancelPlacing();

    hitInfo = Input.GetPointerRaycast(Vector3.forward);
    
    if (hitInfo != null) {
        if (hitInfo.entity != null) {
            if (hitInfo.entity.Build != null) {
                layerToBuild = parseInt(WorldStorage.GetItem("TERRAIN-EDIT-LAYER"));
                brushSize = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-SIZE"));
                brushMaxHeight = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-MAX-HEIGHT"));
                terrainIndex = GetIndexForTerrainTile(hitInfo.entity);
                if (layerToBuild > -1) {
                    alignedHitPoint = new Vector3(
                        Math.round(hitInfo.hitPoint.x / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"],
                        Math.round(hitInfo.hitPoint.y / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"],
                        Math.round(hitInfo.hitPoint.z / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"]);
                    if (alignedHitPoint.y <= brushMaxHeight) {
                        hitInfo.entity.Build(alignedHitPoint, TerrainEntityBrushType.roundedCube, layerToBuild, brushSize);
                        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/modifyterrain?chunkX=" +
                            terrainIndex.x + "&chunkY=" + terrainIndex.y + "&x=" + alignedHitPoint.x +
                            "&y=" + alignedHitPoint.y + "&z=" + alignedHitPoint.z + "&operation=" + "build" +
                            "&brushType=roundedCube&layer=" + layerToBuild + "&brushSize=" + brushSize, null);
                        vosSynchronizer.SendTerrainBuildUpdate("{x:" + alignedHitPoint.x + ",y:" +
                            alignedHitPoint.y + ",z:" + alignedHitPoint.z + "}", "roundedcube", layerToBuild); // TODO add brush size.
                    }
                }
            }
        }
    }
}

function OnTriggerPress() {
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");

    entityPlacer.StopPlacing();

    hitInfo = Input.GetPointerRaycast(Vector3.forward, 1);

    if (hitInfo != null) {
        if (hitInfo.entity != null) {
            if (hitInfo.entity.Dig != null) {
                layerToDig = parseInt(WorldStorage.GetItem("TERRAIN-EDIT-LAYER"));
                brushSize = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-SIZE"));
                brushMinHeight = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-MIN-HEIGHT"));
                terrainIndex = GetIndexForTerrainTile(hitInfo.entity);
                if (layerToDig > -1) {
                    alignedHitPoint = new Vector3(
                        Math.round(hitInfo.hitPoint.x / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"],
                        Math.round(hitInfo.hitPoint.y / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"],
                        Math.round(hitInfo.hitPoint.z / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"]);
                    if (alignedHitPoint.y >= brushMinHeight) {
                        hitInfo.entity.Dig(alignedHitPoint, TerrainEntityBrushType.roundedCube, layerToDig, brushSize);
                        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/modifyterrain?chunkX=" +
                            terrainIndex.x + "&chunkY=" + terrainIndex.y + "&x=" + alignedHitPoint.x +
                            "&y=" + alignedHitPoint.y + "&z=" + alignedHitPoint.z + "&operation=" + "dig" +
                            "&brushType=roundedCube&layer=" + layerToDig + "&brushSize=" + brushSize, null);
                        vosSynchronizer.SendTerrainDigUpdate("{x:" + alignedHitPoint.x + ",y:" +
                            alignedHitPoint.y + ",z:" + alignedHitPoint.z + "}", "roundedcube", layerToDig); // TODO add brush size.
                    }
                }
            }

            if (WorldStorage.GetItem("ENTITY-DELETE-ENABLED") == "TRUE") {
                if (hitInfo.entity instanceof MeshEntity) {
                    terrainIndex = GetTerrainTileIndexForEntity(hitInfo.entity);
                    HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/deleteentity?chunkX=" +
                        terrainIndex.x + "&chunkY=" + terrainIndex.y + "&instanceID="
                        + hitInfo.entity.id.ToString(), null);
                    vosSynchronizer.SendEntityDeleteUpdate(hitInfo.entity.id.ToString());
                    hitInfo.entity.Delete();
                }
            }
        }
    }
}

function OnGripPress() {
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");

    hitInfo = Input.GetPointerRaycast(Vector3.forward, 1);

    if (hitInfo != null) {
        if (hitInfo.entity != null) {
            if (hitInfo.entity.Build != null) {
                layerToBuild = parseInt(WorldStorage.GetItem("TERRAIN-EDIT-LAYER"));
                brushSize = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-SIZE"));
                brushMaxHeight = parseInt(WorldStorage.GetItem("TERRAIN-BRUSH-MAX-HEIGHT"));
                terrainIndex = GetIndexForTerrainTile(hitInfo.entity);
                if (layerToBuild > -1) {
                    alignedHitPoint = new Vector3(
                        Math.round(hitInfo.hitPoint.x / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"],
                        Math.round(hitInfo.hitPoint.y / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"],
                        Math.round(hitInfo.hitPoint.z / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"]);
                    if (alignedHitPoint.y <= brushMaxHeight) {
                        hitInfo.entity.Build(alignedHitPoint, TerrainEntityBrushType.roundedCube, layerToBuild, brushSize);
                        HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/modifyterrain?chunkX=" +
                            terrainIndex.x + "&chunkY=" + terrainIndex.y + "&x=" + alignedHitPoint.x +
                            "&y=" + alignedHitPoint.y + "&z=" + alignedHitPoint.z + "&operation=" + "build" +
                            "&brushType=roundedCube&layer=" + layerToBuild + "&brushSize=" + brushSize, null);
                        vosSynchronizer.SendTerrainBuildUpdate("{x:" + alignedHitPoint.x + ",y:" +
                            alignedHitPoint.y + ",z:" + alignedHitPoint.z + "}", "roundedcube", layerToBuild); // TODO add brush size.
                    }
                }
            }
        }
    }
}

function GetStartPos() {
    var startPos = Vector3.zero;
    var startXArg = 0;
    var startYArg = 512;
    var startZArg = 0;
    startXArg = World.GetQueryParam("start_x");
    startYArg = World.GetQueryParam("start_y");
    startZArg = World.GetQueryParam("start_z");
    if (startXArg != null && startYArg != null && startZArg != null) {
        startPos = new Vector3(parseFloat(startXArg), parseFloat(startYArg), parseFloat(startZArg));
    }
    
    return startPos;
}

function OnVSSMessage(topic, sender, msg) {
    context = Context.GetContext("VOSSynchronizationContext");
    
    // Filter messages from this client.
    if (context.clientID == sender) {
        return;
    }
    
    if (topic === "TERRAIN.EDIT.DIG") {
        msgFields = JSON.parse(msg);
        
        if (msg.position === null || msg.position.x === null || msg.position.y === null || msg.position.z === null) {
            Logging.LogError("OnVSSMessage: Terrain edit dig message missing position.");
            return;
        }
        
        if (msg.brushType === null) {
            Logging.LogError("OnVSSMessage: Terrain edit dig message missing brushType.");
            return;
        }
        
        if (msg.lyr === null) {
            Logging.LogError("OnVSSMessage: Terrain edit dig message missing lyr.");
            return;
        }
        
        var brushType = TerrainEntityBrushType.sphere;
        if (msg.brushType === "sphere") {
            brushType = TerrainEntityBrushType.sphere;
        }
        else if (msg.brushType === "roundedcube") {
            brushType = TerrainEntityBrushType.roundedCube;
        }
        
        this.terrainEntity.Dig(new Vector3(msg.position.x, msg.position.y, msg.position.z), brushType, msg.lyr);
    }
    else if (topic === "TERRAIN.EDIT.BUILD") {
        msgFields = JSON.parse(msg);
        
        if (msg.position === null || msg.position.x === null || msg.position.y === null || msg.position.z === null) {
            Logging.LogError("OnVSSMessage: Terrain edit build message missing position.");
            return;
        }
        
        if (msg.brushType === null) {
            Logging.LogError("OnVSSMessage: Terrain edit build message missing brushType.");
            return;
        }
        
        if (msg.lyr === null) {
            Logging.LogError("OnVSSMessage: Terrain edit build message missing lyr.");
            return;
        }
        
        var brushType = TerrainEntityBrushType.sphere;
        if (msg.brushType === "sphere") {
            brushType = TerrainEntityBrushType.sphere;
        }
        else if (msg.brushType === "roundedcube") {
            brushType = TerrainEntityBrushType.roundedCube;
        }
        
        this.terrainEntity.Build(new Vector3(msg.position.x, msg.position.y, msg.position.z), brushType, msg.lyr);
    }
}

function OnCharacterLoaded() {
    characterLoaded = true;
}

function Move(x, y) {
    if (thirdPersonCharacter != null) {
        thirdPersonCharacter.MoveCharacter(x, y);
    }
}

function EndMove() {
    if (thirdPersonCharacter != null) {
        thirdPersonCharacter.EndMoveCharacter();
    }
}

function Look(x, y) {
    if (thirdPersonCharacter != null) {
        thirdPersonCharacter.LookCharacter(x, y);
    }
}

function EndLook() {
    if (thirdPersonCharacter != null) {
        thirdPersonCharacter.EndLookCharacter();
    }
}

function OnKey(key) {
    if (key === "r") {
        entityPlacer.ToggleOrientation();
    }
    else if (key === "q") {
        thirdPersonCharacter.currentMotion.y = 1;
    }
    else if (key === "z") {
        thirdPersonCharacter.currentMotion.y = -1;
    }
    else if (key == " ") {
        thirdPersonCharacter.JumpCharacter(1);
    }
}

function OnKeyRelease(key) {
    if (key === "q") {
        thirdPersonCharacter.currentMotion.y = 0;
    }
    else if (key === "z") {
        thirdPersonCharacter.currentMotion.y = 0;
    }
}

//if (runtimeMode === "focused") {
    SetUpToolbar();
//}
worldRenderer.LoadWorld();
SetClientMode("EDIT");
ToggleFly();
ToggleConsole();
SetTouchControls();