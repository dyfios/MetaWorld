// Copyright (c) 2019-2025 Five Squared Interactive. All rights reserved.

class DesktopInput {
    constructor() {
        Logging.Log("Initializing Desktop Input...");

        Logging.Log("Desktop Input Initialized.");
    }
}

function MW_Input_Desktop_OnLeftPress() {
    MW_Input_EnvMod_HandleLeftPress();
}

function MW_Input_Desktop_OnRightPress() {
    MW_Input_EnvMod_HandleRightPress();
}

function MW_Input_Desktop_Move(x, y) {
    var consoleActive = WorldStorage.GetItem("CONSOLE-INPUT-ACTIVE") == "TRUE";
    var menuActive = WorldStorage.GetItem("MENU-ACTIVE") == "TRUE";
    var viewMenuActive = WorldStorage.GetItem("VIEW-MENU-VISIBLE") == "TRUE";
    if (consoleActive || menuActive || viewMenuActive) {
        return;
    }

    MW_Player_ThirdPerson_MoveCharacter(x, y);
}

function MW_Input_Desktop_EndMove() {
    MW_Player_ThirdPerson_EndMoveCharacter();
}

function MW_Input_Desktop_Look(x, y) {
    var consoleActive = WorldStorage.GetItem("CONSOLE-INPUT-ACTIVE") == "TRUE";
    var menuActive = WorldStorage.GetItem("MENU-ACTIVE") == "TRUE";
    var viewMenuActive = WorldStorage.GetItem("VIEW-MENU-VISIBLE") == "TRUE";
    if (menuActive || consoleActive || viewMenuActive) {
        return;
    }
    MW_Player_ThirdPerson_LookCharacter(x, y);
}

function MW_Input_Desktop_EndLook() {
    var menuActive = WorldStorage.GetItem("MENU-ACTIVE") == "TRUE";
    if (menuActive) {
        return;
    }
    MW_Player_ThirdPerson_EndLookCharacter();
}

function MW_Input_Desktop_OnKey(key) {
    var thirdPersonCharacterController = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    var entityPlacementComponent = Context.GetContext("ENTITY_PLACEMENT_COMPONENT");
    if (key === "r") {
        entityPlacementComponent.ToggleOrientation();
    }
    else if (key === "q") {
        thirdPersonCharacterController.currentMotion.y = 1;
    }
    else if (key === "z") {
        thirdPersonCharacterController.currentMotion.y = -1;
    }
    else if (key == " ") {
        MW_Player_ThirdPerson_JumpCharacter(1);
    }
    else if (key == "e") {
        MW_Player_ThirdPerson_StartVehicleEngine();
    }
    else if (key == "w") {
        MW_Player_ThirdPerson_MoveVehicleForward();
    }
    else if (key == "s") {
        MW_Player_ThirdPerson_MoveVehicleBackward();
    }
    else if (key == "a") {
        MW_Player_ThirdPerson_SteerVehicleLeft();
    }
    else if (key == "d") {
        MW_Player_ThirdPerson_SteerVehicleRight();
    }
    else if (key == "i") {
        MW_Input_EnvMod_PerformRotate("z", false);
    }
    else if (key == "j") {
        MW_Input_EnvMod_PerformRotate("y", true);
    }
    else if (key == "k") {
        MW_Input_EnvMod_PerformRotate("z", true);
    }
    else if (key == "l") {
        MW_Input_EnvMod_PerformRotate("y", false);
    }
    else if (key == "x") {
        MW_Player_ThirdPerson_ExitVehicle();
    }
    else if (key == "1") {
        MW_UI_EditToolbar_SelectLowerToolbarItem(0);
    }
    else if (key == "2") {
        MW_UI_EditToolbar_SelectLowerToolbarItem(1);
    }
    else if (key == "3") {
        MW_UI_EditToolbar_SelectLowerToolbarItem(2);
    }
    else if (key == "4") {
        MW_UI_EditToolbar_SelectLowerToolbarItem(3);
    }
    else if (key == "5") {
        MW_UI_EditToolbar_SelectLowerToolbarItem(4);
    }
    else if (key == "6") {
        MW_UI_EditToolbar_SelectLowerToolbarItem(5);
    }
    else if (key == "7") {
        MW_UI_EditToolbar_SelectLowerToolbarItem(6);
    }
    else if (key == "8") {
        MW_UI_EditToolbar_SelectLowerToolbarItem(7);
    }
    else if (key == "9") {
        MW_UI_EditToolbar_SelectLowerToolbarItem(8);
    }
    else if (key == "`") {
        MW_UI_ToggleViewMenu();
    }
}

function MW_Input_Desktop_OnKeyRelease(key) {
    var thirdPersonCharacterController = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    if (key === "q") {
        thirdPersonCharacterController.currentMotion.y = 0;
    }
    else if (key === "z") {
        thirdPersonCharacterController.currentMotion.y = 0;
    }
    else if (key == "w") {
        MW_Player_ThirdPerson_StopMovingVehicle();
    }
    else if (key == "s") {
        MW_Player_ThirdPerson_StopMovingVehicle();
    }
    else if (key == "a") {
        MW_Player_ThirdPerson_StopSteeringVehicle();
    }
    else if (key == "d") {
        MW_Player_ThirdPerson_StopSteeringVehicle();
    }
}