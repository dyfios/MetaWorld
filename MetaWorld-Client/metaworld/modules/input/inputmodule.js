class InputModule {
    constructor() {
        Logging.Log("Initializing Input Module...");

        this.desktopInput = new DesktopInput();
        this.vrInput = new VRInput();
        this.touchInput = new TouchInput();
        this.environmentModifier = new EnvironmentModifier();

        Context.DefineContext("INPUT_MODULE", this);

        Logging.Log("Input Module Initialized.");
    }
}