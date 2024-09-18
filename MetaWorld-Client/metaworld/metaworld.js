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
let worldRenderer = new WorldRenderer(Vector3.zero);
let thirdPersonCharacter = null;
let thirdPersonCharacterModel = null;
let thirdPersonCharacterOffset = Vector3.zero;
let thirdPersonCharacterRotation = Quaternion.identity;
let thirdPersonCharacterLabelOffset = Vector3.zero;
HandleQueryParams();

let vosSynchronizer = null;

Time.SetInterval(`
    if (vosSynchronizer === null) {
        SetUpSynchronizer();
    }
    
    if (!characterSynchronized) {
        if (characterLoaded && sessionJoined) {
            vosSynchronizer.AddEntity(thirdPersonCharacter.characterEntityID, true);
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
        thirdPersonCharacter = new ThirdPersonCharacter(userName, null, -90, 90, 1, 0.1, startPos, OnCharacterLoaded, interfaceMode,
            thirdPersonCharacterModel, [ thirdPersonCharacterModel ], thirdPersonCharacterOffset, thirdPersonCharacterRotation, thirdPersonCharacterLabelOffset);
        //thirdPersonCharacter = new ThirdPersonCharacter(userName, null, -90, 90, 1, 0.1, startPos, OnCharacterLoaded, interfaceMode,
        //    "file://C:/Users/dbake/Desktop/world/character.glb", [ "file://C:/Users/dbake/Desktop/world/character.glb" ], new Vector3(0, 0.45, 0), new Quaternion(0, 0, 0, 1), new Vector3(0, 2, 0));
        vosSynchronizer.Connect();
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
}

function SetUpToolbar() {
    this.toolbar = new MainToolbar();
    WorldStorage.SetItem("TERRAIN-EDIT-LAYER", "-1");
}

function SetUpLoadingIndicator() {
    this.loadingIndicator = new LoadingIndicator();
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
                if (layerToDig > -1) {
                    alignedHitPoint = new Vector3(
                        Math.round(hitInfo.hitPoint.x / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"],
                        Math.round(hitInfo.hitPoint.y / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"],
                        Math.round(hitInfo.hitPoint.z / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"]);
                    hitInfo.entity.Dig(alignedHitPoint, TerrainEntityBrushType.roundedCube, layerToDig);
                    HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/modifyterrain?x=" + alignedHitPoint.x +
                        "&y=" + alignedHitPoint.y + "&z=" + alignedHitPoint.z + "&operation=" + "dig" +
                        "&brushType=roundedCube&layer=" + layerToDig, null);
                    vosSynchronizer.SendTerrainDigUpdate("{x:" + alignedHitPoint.x + ",y:" +
                        alignedHitPoint.y + ",z:" + alignedHitPoint.z + "}", "roundedcube", layerToDig);
                }
            }
        }
    }
}

function OnRightPress() {
    var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
    
    hitInfo = Input.GetPointerRaycast(Vector3.forward);
    
    if (hitInfo != null) {
        if (hitInfo.entity != null) {
            if (hitInfo.entity.Build != null) {
                layerToBuild = parseInt(WorldStorage.GetItem("TERRAIN-EDIT-LAYER"));
                if (layerToBuild > -1) {
                    alignedHitPoint = new Vector3(
                        Math.round(hitInfo.hitPoint.x / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"],
                        Math.round(hitInfo.hitPoint.y / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"],
                        Math.round(hitInfo.hitPoint.z / configContext.terrainConfig["grid-size"]) * configContext.terrainConfig["grid-size"]);
                    hitInfo.entity.Build(alignedHitPoint, TerrainEntityBrushType.roundedCube, layerToBuild);
                    HTTPNetworking.Fetch(configContext.worldConfig["world-state-service"] + "/modifyterrain?x=" + alignedHitPoint.x +
                        "&y=" + alignedHitPoint.y + "&z=" + alignedHitPoint.z + "&operation=" + "build" +
                        "&brushType=roundedCube&layer=" + layerToBuild, null);
                    vosSynchronizer.SendTerrainBuildUpdate("{x:" + alignedHitPoint.x + ",y:" +
                        alignedHitPoint.y + ",z:" + alignedHitPoint.z + "}", "roundedcube", layerToBuild);
                }
            }
        }
    }
}

function GetStartPos() {
    var startPos = Vector3.zero;
    var startXArg = World.GetQueryParam("start_x");
    var startYArg = World.GetQueryParam("start_y");
    var startZArg = World.GetQueryParam("start_z");
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
}

//if (runtimeMode === "focused") {
    SetUpToolbar();
//}
worldRenderer.LoadWorld();