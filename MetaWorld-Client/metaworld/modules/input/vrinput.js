// Copyright (c) 2019-2025 Five Squared Interactive. All rights reserved.

/**
 * @class VRInput
 * @brief Handles VR input.
 */
class VRInput {
    /**
     * @brief Constructor for the VRInput class.
     * Initializes VR input and logs the process.
     */
    constructor() {
        Logging.Log("Initializing VR Input...");
        Logging.Log("VR Input Initialized.");
    }
}

function MW_Input_VR_OnLeftTouchpadValueChange(newValue) {

}

function MW_Input_VR_OnRightTouchpadValueChange(newValue) {
    
}

function MW_Input_VR_OnLeftStickValueChange(x, y) {
    var previousLeftStickValue = WorldStorage.GetItem("LEFT-STICK-VALUE");
    if (previousLeftStickValue == null || previousLeftStickValue == "") {
        previousLeftStickValue = 0;
    }
    var currentTriggerState = WorldStorage.GetItem("LEFT-TRIGGER-STATE");
    if (currentTriggerState == "PRESSED") {
        if (previousLeftStickValue == 0) {
            if (x < -0.5) {
                SelectVREntityMenuToolbarButtonAtLeft();
            }
            else if (x > 0.5) {
                SelectVREntityMenuToolbarButtonAtRight();
            }
        }
    }
    WorldStorage.SetItem("LEFT-STICK-VALUE", x);
}

function MW_Input_VR_OnRightStickValueChange(x, y) {
    var placing = WorldStorage.GetItem("ENTITY-BEING-PLACED");
    if (placing != "TRUE") {
        return;
    }

    var previousRightStickValueX = WorldStorage.GetItem("RIGHT-STICK-VALUE-X");
    if (previousRightStickValueX == null || previousRightStickValueX == "") {
        previousRightStickValueX = 0;
    }

    var previousRightStickValueY = WorldStorage.GetItem("RIGHT-STICK-VALUE-Y");
    if (previousRightStickValueY == null || previousRightStickValueY == "") {
        previousRightStickValueY = 0;
    }

    if (x < -0.5 && previousRightStickValueX >= -0.5) {
        MW_Input_EnvMod_PerformRotate("y", true);
    }
    else if (x > 0.5 && previousRightStickValueX <= 0.5) {
        MW_Input_EnvMod_PerformRotate("y", false);
    }
    else if (y < -0.5 && previousRightStickValueY >= -0.5) {
        MW_Input_EnvMod_PerformRotate("z", true);
    }
    else if (y > 0.5 && previousRightStickValueY <= 0.5) {
        MW_Input_EnvMod_PerformRotate("z", false);
    }
    WorldStorage.SetItem("RIGHT-STICK-VALUE-X", x);
    WorldStorage.SetItem("RIGHT-STICK-VALUE-Y", y);
}

function MW_Input_VR_OnLeftPrimaryPress() {
    var currentTriggerState = WorldStorage.GetItem("LEFT-TRIGGER-STATE");
    if (currentTriggerState == "PRESSED") {
        // console and settings
    }
    else {
        ToggleVREntitySubMenu();
    }
}

function MW_Input_VR_OnRightPrimaryPress() {
    WorldStorage.SetItem("RIGHT-PRIMARY-STATE", "PRESSED");
    //MW_Input_VR_ToggleVRMenu();
}

function MW_Input_VR_OnLeftPrimaryRelease() {

}

function MW_Input_VR_OnRightPrimaryRelease() {
    WorldStorage.SetItem("RIGHT-PRIMARY-STATE", "RELEASED");
}

function MW_Input_VR_OnLeftSecondaryPress() {

}

function MW_Input_VR_OnRightSecondaryPress() {

}

function MW_Input_VR_OnLeftTouchpadPress() {
    MW_Input_VR_ToggleLeftTouchpadLocomotion();

}

function MW_Input_VR_OnRightTouchpadPress() {

}

function MW_Input_VR_OnLeftTriggerPress() {
    WorldStorage.SetItem("LEFT-TRIGGER-STATE", "PRESSED");
    Input.joystickMotionEnabled = false;
}

function MW_Input_VR_OnRightTriggerPress() {
    WorldStorage.SetItem("RIGHT-TRIGGER-STATE", "PRESSED");
    MW_Input_VR_OnTriggerPress();
}

function MW_Input_VR_OnLeftTriggerRelease() {
    WorldStorage.SetItem("LEFT-TRIGGER-STATE", "RELEASED");
    var touchpadLocomotion = WorldStorage.GetItem("LEFT-TOUCHPAD-LOCOMOTION");
    if (touchpadLocomotion == null || touchpadLocomotion == "MOVE-CONTROL") {
        Input.joystickMotionEnabled = true;
    }
}

function MW_Input_VR_OnRightTriggerRelease() {
    WorldStorage.SetItem("RIGHT-TRIGGER-STATE", "RELEASED");
}

function MW_Input_VR_OnLeftGripPress() {

}

function MW_Input_VR_OnRightGripPress() {
    MW_Input_VR_OnGripPress();
}

/**
 * @brief Handles the VR trigger press event.
 * Calls the environment modification handler for trigger press.
 */
function MW_Input_VR_OnTriggerPress() {
    MW_Input_EnvMod_HandleTriggerPress();
}

/**
 * @brief Handles the VR grip press event.
 * Calls the environment modification handler for grip press.
 */
function MW_Input_VR_OnGripPress() {
    MW_Input_EnvMod_HandleGripPress();
}

function MW_Input_VR_ToggleLeftTouchpadLocomotion() {
    var currentLocomotion = WorldStorage.GetItem("LEFT-TOUCHPAD-LOCOMOTION");
    if (currentLocomotion == null || currentLocomotion == "") {Logging.Log("1");
        currentLocomotion = "MOVE-CONTROL";
    }

    if (currentLocomotion == "MOVE-CONTROL") {Logging.Log("2");
        WorldStorage.SetItem("LEFT-TOUCHPAD-LOCOMOTION", "TELEPORT");
        Input.leftVRPointerMode = Input.VRPointerMode.Teleport;
        Input.joystickMotionEnabled = false;
    }
    else if (currentLocomotion == "TELEPORT") {Logging.Log("3");
        WorldStorage.SetItem("LEFT-TOUCHPAD-LOCOMOTION", "MOVE-CONTROL");
        Input.leftVRPointerMode = Input.VRPointerMode.None;
        Input.joystickMotionEnabled = true;
    }
}

function MW_Input_VR_ToggleVRMenu() {
    var currentState = WorldStorage.GetItem("VR-MENU-STATE");
    if (currentState == null || currentState == "") {
        currentState = "CLOSED";
    }
    if (currentState == "CLOSED") {
        WorldStorage.SetItem("VR-MENU-STATE", "OPEN");
        var vrConsoleMenu = Context.GetContext("vrConsoleContext");
        vrConsoleMenu.vrConsoleCanvas.SetVisibility(true);
        Camera.PlaceEntityInFrontOfCamera(vrConsoleMenu, 0.5);
    }
    else if (currentState == "OPEN") {
        WorldStorage.SetItem("VR-MENU-STATE", "CLOSED");
        var vrConsoleMenu = Context.GetContext("vrConsoleContext");
        vrConsoleMenu.vrConsoleCanvas.SetVisibility(false);
    }
}