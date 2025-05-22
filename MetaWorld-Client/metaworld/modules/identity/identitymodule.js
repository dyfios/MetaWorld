class IdentityModule {
    constructor(userID, userTag, token) {
        Logging.Log("Initializing Identity Module...");

        this.userID = userID;
        this.userTag = userTag;
        this.token = token;

        Context.DefineContext("IDENTITY_MODULE", this);

        Logging.Log("Identity Module Initialized.");
    }
}