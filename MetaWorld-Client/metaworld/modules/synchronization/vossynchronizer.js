/// @file vossynchronization.js
/// Module for a VOS synchronizer.

class VOSSynchronizer {
    constructor(host, port, tls = false, transport = "tcp", sessionToConnectTo = null,
        onConnect = null, onJoinedSession = null, onMessage = null, clientID = null,
        clientToken = null) {
        this.host = host;
        this.port = port;
        this.tls = tls;
        this.transport = transport;
        this.sessionToConnectTo = sessionToConnectTo;
        this.onJoinedSession = onJoinedSession;
        this.onMessage = onMessage;
        this.clientID = clientID;
        this.clientToken = clientToken;
        
        this.OnConnected = function() {
            if (onConnect != null) {
                onConnect();
            }
        }
        
        Context.DefineContext("VOSSynchronizationContext", this);
    }

    Connect() {
        var context = Context.GetContext("VOSSynchronizationContext");
        var onJoinedAction =
        `
            var context = Context.GetContext("VOSSynchronizationContext");
            if (context.OnConnected != null) {
                context.OnConnected();
            }
            
            if (context.onMessage != null) {
                VOSSynchronization.RegisterMessageCallback(context.sessionToConnectTo.id, context.onMessage);
            }

            Logging.Log('[VOSSynchronization:Connect] Joined Session');
            if (context.onJoinedSession != null) {
                context.onJoinedSession();
            }
        `;
        
        if (context.transport === "tcp" || context.transport === "TCP") {
            VOSSynchronization.JoinSession(context.host, context.port, context.tls, context.sessionToConnectTo.id,
                context.sessionToConnectTo.tag, onJoinedAction, VSSTransport.TCP, context.clientID, context.clientToken);
        }
        else if (context.transport === "websocket" || context.transport === "WEBSOCKET") {
            VOSSynchronization.JoinSession(context.host, context.port, context.tls, context.sessionToConnectTo.id,
                context.sessionToConnectTo.tag, onJoinedAction, VSSTransport.WebSocket, context.clientID, context.clientToken);
        }
        else {
            Logging.LogError("[VOSSynchronization:Connect] Invalid transport.");
        }
    }
    
    Disconnect() {
        //VOSSynchronization.DisconnectService(this.host, this.port);
    }
    
    AddEntity(entityID, deleteWithClient = false, resources = null) {
        VOSSynchronization.StartSynchronizingEntity(this.sessionToConnectTo.id, entityID, deleteWithClient, resources);
    }
    
    SendMessage(topic, message) {
        VOSSynchronization.SendMessage(this.sessionToConnectTo.id, "CONSOLE." + topic, message);
    }
}

function MW_Sync_VSS_SendEntityAddUpdate(sessionID, entityID, position, rotation) {
    var messageInfo = {
        id: entityID,
        position: position,
        rotation: rotation
    };

    VOSSynchronization.SendMessage(sessionID, "ENTITY.ADD", JSON.stringify(messageInfo));
}

function MW_Sync_VSS_SendEntityDeleteUpdate(sessionID, entityID) {
    var messageInfo = {
        id: entityID
    };
    
    VOSSynchronization.SendMessage(sessionID, "ENTITY.DELETE", JSON.stringify(messageInfo));
}

function MW_Sync_VSS_SendEntityMoveUpdate(sessionID, entityID, position, rotation) {
    var messageInfo = {
        id: entityID,
        position: position,
        rotation: rotation
    };
    
    VOSSynchronization.SendMessage(sessionID, "ENTITY.MOVE", JSON.stringify(messageInfo));
}

function MW_Sync_VSS_SendTerrainDigUpdate(sessionID, position, brushType, lyr) {
    var messageInfo = {
        position: position,
        brushType: "'" + brushType + "'",
        lyr: lyr
    };
    
    VOSSynchronization.SendMessage(sessionID, "TERRAIN.EDIT.DIG", JSON.stringify(messageInfo));
}

function MW_Sync_VSS_SendTerrainBuildUpdate(sessionID, position, brushType, lyr) {
    var messageInfo = {
        position: position,
        brushType: "'" + brushType + "'",
        lyr: lyr
    };
    
    VOSSynchronization.SendMessage(sessionID, "TERRAIN.EDIT.BUILD", JSON.stringify(messageInfo));
}