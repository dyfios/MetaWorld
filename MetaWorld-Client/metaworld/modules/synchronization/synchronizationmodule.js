class SynchronizationModule {
    constructor(playerModule) {
        Logging.Log("Initializing Synchronization Module...");

        this.playerModule = playerModule;

        this.OnConnect = function() {
            Logging.Log("Connected to VSS.");
        }

        this.OnJoinSession = function() {
            Logging.Log("Joined VSS Session.");
        }
        
        Context.DefineContext("SYNCHRONIZATION_MODULE", this);

        Logging.Log("Synchronization Module Initialized.");
    }
}

function MW_Sync_ConnectToGlobalSynchronizer(synchronizationSettings, sessionInfo, onConnect, onJoinSession) {
    var synchModule = Context.GetContext("SYNCHRONIZATION_MODULE");
    var identityModule = Context.GetContext("IDENTITY_MODULE");

    vosSynchronizer = new VOSSynchronizer(synchronizationSettings.host, synchronizationSettings.port,
        synchronizationSettings.tls, synchronizationSettings.transport, sessionInfo, onConnect,
        onJoinSession, "OnVSSMessage", identityModule.userID, identityModule.token);
    
    // Store the global synchronizer in context for access by other functions
    Context.DefineContext("GLOBAL_SYNCHRONIZER", vosSynchronizer);
    
    vosSynchronizer.Connect();
}