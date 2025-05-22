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