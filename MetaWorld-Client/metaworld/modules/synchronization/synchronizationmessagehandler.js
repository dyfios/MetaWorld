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
    else if (topic === "MESSAGE.CREATE") {
        msgFields = JSON.parse(msg);
        
        if (!msgFields.hasOwnProperty("message")) {
            Logging.LogError("OnVSSMessage: Message missing message field.");
            return;
        }
        
        if (!msgFields.hasOwnProperty("client-id")) {
            Logging.LogError("OnVSSMessage: Message missing client-id.");
            return;
        }
        
        var message = msgFields.message;
        var clientId = msgFields["client-id"];
        var clientTag = msgFields["client-tag"];

        // Check if this message is from the current client.
        if (clientId == context.clientID) {
            return;
        }

        var senderName = clientId === "system" ? "System" : `${clientTag}`;
        var timestamp = Date.Now.ToTimeString();
        
        // Check if this is a command response (sent by system)
        if (msgFields.hasOwnProperty("is-command-response") && msgFields["is-command-response"] === true) {
            // This is a command response, only show it to the original sender
            // The server already handles this, so just display it
            AddRemoteConsoleMessage(timestamp, senderName, message);
        } else {
            // Regular message, display to all
            AddRemoteConsoleMessage(timestamp, senderName, message);
        }
    }
    else if (topic === "SESSION.MESSAGE") {
        msgFields = JSON.parse(msg);
        
        if (!msgFields.hasOwnProperty("type")) {
            Logging.LogError("OnVSSMessage: Session message missing type.");
            return;
        }
        
        if (!msgFields.hasOwnProperty("content")) {
            Logging.LogError("OnVSSMessage: Session message missing content.");
            return;
        }
        
        if (!msgFields.hasOwnProperty("client-id")) {
            Logging.LogError("OnVSSMessage: Session message missing client-id.");
            return;
        }
        
        var messageType = msgFields.type.toUpperCase();
        var content = msgFields.content;
        var clientId = msgFields["client-id"];
        
        if (messageType === "MSG") {
            // Handle MSG messages by logging to console
            var senderName = clientId === "system" ? "System" : `Client ${clientId}`;
            var timestamp = Date.Now.ToTimeString();
            
            // Use the dedicated console message function
            AddRemoteConsoleMessage(timestamp, senderName, content);
        }
        // CMD messages are handled server-side and don't need client processing
    }
    else if (topic === "PLAYER.TELEPORT") {
        msgFields = JSON.parse(msg);
        
        if (!msgFields.hasOwnProperty("action") || msgFields.action !== "player-teleport") {
            Logging.LogError("OnVSSMessage: Invalid teleport message action.");
            return;
        }
        
        if (!msgFields.hasOwnProperty("position")) {
            Logging.LogError("OnVSSMessage: Teleport message missing position.");
            return;
        }
        
        if (!msgFields.hasOwnProperty("client-id")) {
            Logging.LogError("OnVSSMessage: Teleport message missing client-id.");
            return;
        }
        
        var position = msgFields.position;
        var clientId = msgFields["client-id"];
        
        // Validate position data
        if (typeof position.x !== 'number' || typeof position.y !== 'number' || typeof position.z !== 'number') {
            Logging.LogError("OnVSSMessage: Invalid teleport position coordinates.");
            return;
        }
        
        // Get the current client context to check if this teleport is for us
        var vosContext = Context.GetContext("VOSSynchronizationContext");
        
        if (vosContext && vosContext.clientID === clientId) {
            // This teleport is for our client - update our position
            var playerModule = Context.GetContext("PLAYER_MODULE");
            
            if (playerModule && playerModule.thirdPersonCharacterController && playerModule.thirdPersonCharacterController.characterEntity) {
                var newPosition = new Vector3(position.x, position.y, position.z);
                
                Logging.Log(`[Teleport] Moving player to position: ${position.x}, ${position.y}, ${position.z}`);
                
                // Update character position
                playerModule.thirdPersonCharacterController.characterEntity.SetPosition(newPosition, false);
                
                // Update camera if needed
                // Camera position will be automatically updated by the character controller
            } else {
                Logging.LogError("OnVSSMessage: Unable to teleport - player module or character not available.");
            }
        } else {
            // This teleport is for another client - we might want to update their representation
            // For now, just log it
            Logging.Log(`[Teleport] Client ${clientId} teleported to position: ${position.x}, ${position.y}, ${position.z}`);
        }
    }
}