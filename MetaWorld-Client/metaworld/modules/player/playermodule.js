class PlayerModule {
    constructor(userName, startPos, interfaceMode, thirdPersonCharacterModel, thirdPersonCharacterOffset,
        thirdPersonCharacterRotation, thirdPersonCharacterLabelOffset) {

        this.characterLoaded = false;

        this.CharacterLoaded = function() {
            var playerModule = Context.GetContext("PLAYER_MODULE");

            playerModule.characterLoaded = true;
            Logging.Log("Character Loaded.");
            Context.DefineContext("WORLD_RENDERING_MODULE", playerModule);
        }

        Logging.Log("Initializing Player Module...");

        Context.DefineContext("PLAYER_MODULE", this);

        this.thirdPersonCharacterController = new ThirdPersonCharacterController(userName, null,
            -90, 90, 0.05, 0.05, startPos, this.CharacterLoaded, interfaceMode, true,
            thirdPersonCharacterModel, [ thirdPersonCharacterModel ], thirdPersonCharacterOffset,
            thirdPersonCharacterRotation, thirdPersonCharacterLabelOffset);

        Context.DefineContext("PLAYER_MODULE", this);

        Logging.Log("Player Module Initialized.");
    }
}