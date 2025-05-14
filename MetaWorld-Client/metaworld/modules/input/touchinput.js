class TouchInput {
    constructor() {
        Logging.Log("Initializing Touch Input...");

        Logging.Log("Touch Input Initialized.");
    }
}

function MW_Input_Touch_SetTouchControls() {
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