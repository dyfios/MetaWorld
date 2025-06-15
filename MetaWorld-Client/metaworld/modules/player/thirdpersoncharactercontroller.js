/// @file thirdpersoncharacter.js
/// Module for a third person character.

function FinishLoadingCharacter(character) {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    context.characterEntity = Entity.Get(context.characterEntityID);
    context.OnLoaded();
}

class ThirdPersonCharacterController {
    constructor(name, id = null, minZ = -90, maxZ = 90, motionMultiplier = 0.1,
        rotationMultiplier = 0.1, position = Vector3.zero, onLoaded = null,
        mode = "desktop", findGround = true) {
        this.minZ = minZ;
        this.maxZ = maxZ;
        this.motionMultiplier = motionMultiplier
        this.rotationMultiplier = rotationMultiplier;
        
        this.currentMotion = Vector3.zero;
        this.currentRotation = Vector3.zero;
        this.currentTransform = null;
        this.characterEntity = null;
        this.inVRMode = false;
        this.motionMode = "free";
        this.inVehicle = false;
        this.activeVehicle = null;
        
        // Initialize camera mode from storage or default to third person
        var savedCameraMode = WorldStorage.GetItem("METAWORLD-CAMERA-MODE");
        this.cameraMode = (savedCameraMode === "first_person") ? "first_person" : "third_person";
        
        this.characterEntityID = null;
        if (id != null)
        {
            this.characterEntityID = id;
        }
        else
        {
            this.characterEntityID = UUID.NewUUID().ToString();
        }
        
        this.OnLoaded = function() {
            if (onLoaded != null) {
                onLoaded();
            }
            var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
            context.characterEntity.SetInteractionState(InteractionState.Physical);
            if (mode === "vr") {
                context.characterEntity.SetVisibility(false, false);
            }
            else {
                // Set visibility based on camera mode
                if (context.cameraMode === "first_person") {
                    context.characterEntity.SetVisibility(false, false);
                } else {
                    context.characterEntity.SetVisibility(true, false);
                }
            }
            context.characterEntity.EnablePositionBroadcast(0.25);
            context.characterEntity.EnableRotationBroadcast(0.25);
        }
        
        this.GetPosition = function() {
            var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
            if (context.characterEntityID != null) {
                var ce = Entity.Get(context.characterEntityID);
                if (ce != null) {
                    return ce.GetPosition(false);
                }
            }
            
            return Vector3.zero;
        }
        
        /// @function ThirdPersonCharacter.Update
        /// Perform a single update on the character.
        this.CharacterUpdate = function() {
            var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
            if (context.characterEntity != null) {
                context.currentTransform = context.characterEntity.GetTransform();
                var newMotion = new Vector3(context.currentTransform.forward.x * context.currentMotion.x
                    - context.currentTransform.right.x * context.currentMotion.z,
                    context.currentMotion.y, context.currentTransform.forward.z * context.currentMotion.x
                    - context.currentTransform.right.z * context.currentMotion.z);
                if (mode === "vr" || Input.IsVR) {
                    if (!context.inVRMode) {
                        Input.AddRigFollower(context.characterEntity);
                        context.characterEntity.SetVisibility(false, false);
                        context.inVRMode = true;
                    }
                }
                else if (!Input.IsVR) {
                    if (context.inVRMode) {
                        Input.RemoveRigFollower(context.characterEntity);
                        context.characterEntity.PlaceCameraOn();
                        if (context.cameraMode === "third_person") {
                            Camera.SetPosition(new Vector3(0, 1, -2), true);
                            context.characterEntity.SetVisibility(true, false);
                        } else {
                            Camera.SetPosition(new Vector3(0, 0.1, 0), true);
                            context.characterEntity.SetVisibility(false, false);
                        }
                        context.inVRMode = false;
                    }

                    var cameraRotation = new Vector3(context.currentRotation.z, 0, 0);
                    if (context.inVehicle) {

                    }
                    else {
                        var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
                            context.currentTransform.position.y + newMotion.y, context.currentTransform.position.z + newMotion.z);
                        
                        if (context.motionMode == "physical") {
                            context.characterEntity.Move(new Vector3(newMotion.x, 0, newMotion.z));
                        }
                        else {
                            context.characterEntity.SetPosition(newPosition, false);
                        }
                        var entityRotation = new Vector3(context.currentRotation.x, context.currentRotation.y, 0);
                        context.characterEntity.SetEulerRotation(entityRotation, false);
                        
                        // Update camera position based on camera mode
                        if (context.cameraMode === "first_person") {
                            Camera.SetPosition(new Vector3(0, 0.1, 0), true);
                            context.characterEntity.SetVisibility(false, false);
                        } else {
                            Camera.SetPosition(new Vector3(0, 1, -2), true);
                            context.characterEntity.SetVisibility(true, false);
                        }
                    }
                    Camera.SetEulerRotation(cameraRotation, true);
                }
            }
        }
        
        Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", this);
        
        this.characterEntity = CharacterEntity.Create(null, position,
            Quaternion.identity, Vector3.one, false, name, this.characterEntityID, "FinishLoadingCharacter");
        this.characterEntity.fixHeight = findGround;
        if (findGround) {
            MW_Player_ThirdPerson_SetMotionModePhysical();
        }
        else {
            MW_Player_ThirdPerson_SetMotionModeFree();
        }
        Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", this);
        if (mode === "vr") {
            
        }
        else if (!Input.IsVR) {
            this.characterEntity.PlaceCameraOn();
            // Initialize camera position based on default camera mode
            if (this.cameraMode === "first_person") {
                Camera.SetPosition(new Vector3(0, 0.1, 0), true);
            } else {
                Camera.SetPosition(new Vector3(0, 1, -2), true);
            }
        }
        
        Time.SetInterval(`
            var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
            if (context == null) {
                Logging.LogError("[ThirdPersonCharacter] Unable to get context.");
            }
            else {
                context.CharacterUpdate();
            }`,
            0.005);
        Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", this);
    }
    
    /// @function ThirdPersonCharacter.SetMotionFree
    /// Set the motion mode for the third person character to free.
    SetMotionModeFree() {
        this.motionMode = "free";
        var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
        var props = new EntityPhysicalProperties(null, null, null, false, null);
        context.characterEntity.SetPhysicalProperties(props);
    }

    /// @function ThirdPersonCharacter.SetMotionPhysical
    /// Set the motion mode for the third person character to physical.
    SetMotionModePhysical() {
        this.motionMode = "physical";
        var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
        var props = new EntityPhysicalProperties(null, null, null, true, null);
        context.characterEntity.SetPhysicalProperties(props);
    }

    /// @function ThirdPersonCharacter.SetMotionMultiplier
    /// Set the motion multiplier for the third person character.
    /// @param {float} multiplier The multiplier to apply. Must be greater than 0.
    SetMotionMultiplier(multiplier) {
        var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
        context.motionMultiplier = 0.1 * multiplier;
        Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
    }

    /// @function ThirdPersonCharacter.MoveCharacter
    /// Move the character by the provided amounts in the x and y directions.
    /// @param {float} x The X component of the motion.
    /// @param {float} y The Y component of the motion.
    MoveCharacter(x, y) {
        var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
        context.currentMotion.x = y * context.motionMultiplier;
        context.currentMotion.z = -1 * x * context.motionMultiplier;
        Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
    }
    
    /// @function ThirdPersonCharacter.EndMoveCharacter
    /// End the motion for the character.
    EndMoveCharacter() {
        var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
        context.currentMotion = Vector3.zero;
        Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
    }
    
    // @function ThirdPersonCharacter.LiftCharacter
    // Lift the character by the provided amount in the y direction.
    // @param {float} x Ignored.
    // @param {float} y Vertical motion.
    LiftCharacter(x, y) {
        var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
        context.currentMotion.y = y;
        Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
    }
    
    // @function ThirdPersonCharacter.EndLiftCharacter
    // End the lifting of the character.
    EndLiftCharacter() {
        var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
        context.currentMotion.y = 0;
        Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
    }

    // @function ThirdPersonCharacter.LiftCharacterOneStep
    // Lift the character one step in the y direction.
    LiftCharacterOneStep() {
        var context = this;
        if (context.characterEntity != null) {
            context.currentTransform = context.characterEntity.GetTransform();
            var newMotion = new Vector3(0, context.motionMultiplier, 0);
            var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
                context.currentTransform.position.y + newMotion.y, context.currentTransform.position.z + newMotion.z);
            context.characterEntity.SetPosition(newPosition, false);
        }
    }

    // @function ThirdPersonCharacter.DropCharacterOneStep
    // Drop the character one step in the y direction.
    DropCharacterOneStep() {
        var context = this;
        if (context.characterEntity != null) {
            context.currentTransform = context.characterEntity.GetTransform();
            var newMotion = new Vector3(0, -1 * context.motionMultiplier, 0);
            var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
                context.currentTransform.position.y + newMotion.y, context.currentTransform.position.z + newMotion.z);
            context.characterEntity.SetPosition(newPosition, false);
        }
    }
    
    /// @function ThirdPersonCharacter.MoveCharacter
    /// Move the character one step by the provided amounts in the x and y directions.
    /// @param {float} x The X component of the motion.
    /// @param {float} y The Y component of the motion.
    MoveCharacterOneStep(x, y) {
        var context = this;
        if (context.characterEntity != null) {
            context.currentTransform = context.characterEntity.GetTransform();
            var newMotion = new Vector3(context.currentTransform.forward.x * (x * context.motionMultiplier) - context.currentTransform.right.x * (y * context.motionMultiplier),
                0, context.currentTransform.forward.z * (x * context.motionMultiplier) - context.currentTransform.right.z * (y * context.motionMultiplier));
            var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
                context.currentTransform.position.y, context.currentTransform.position.z + newMotion.z);
            context.characterEntity.SetPosition(newPosition, false);
        }
    }
    
    /// @function ThirdPersonCharacter.LookCharacter
    /// Perform a look on the character by the provided amounts in the x and y directions.
    /// @param {float} x The X component of the look.
    /// @param {float} y The Y component of the look.
    LookCharacter(x, y) {
        var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
        context.currentRotation.y += x * context.rotationMultiplier;
        context.currentRotation.z -= y * context.rotationMultiplier;
        if (context.currentRotation.z > context.maxZ) {
            context.currentRotation.z = context.maxZ;
        }
        if (context.currentRotation.z < context.minZ) {
            context.currentRotation.z = context.minZ;
        }
        Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
    }
    
    /// @function ThirdPersonCharacter.EndLookCharacter
    /// End the look for the character.
    EndLookCharacter() {
        
    }

    /// @function ThirdPersonCharacter.JumpCharacter
    /// Perform a jump on the character by the provided amount.
    /// @param {float} amount The amount by which to jump.
    JumpCharacter(amount) {
        var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
        
        context.characterEntity.Jump(amount);
    }
    
    // @function ThirdPersonCharacter.OnKeyPress
    // @param {string} key The key that was pressed.
    // Handle a key press.
    OnKeyPress(key) {
        if (key === "q") {
            this.currentMotion.y = 1;
        }
        else if (key === "z") {
            this.currentMotion.y = -1;
        }
        else if (key === " ") {
            this.JumpCharacter(1);
        }
    }
    
    // @function ThirdPersonCharacter.OnKeyRelease
    // @param {string} key The key that was released.
    // Handle a key release.
    OnKeyRelease(key) {
        if (key === "q") {
            this.currentMotion.y = 0;
        }
        else if (key === "z") {
            this.currentMotion.y = 0;
        }
    }

    /// @function ToggleCameraMode
    /// Toggle between first person and third person camera modes.
    ToggleCameraMode() {
        var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
        if (context.cameraMode === "third_person") {
            context.cameraMode = "first_person";
        } else {
            context.cameraMode = "third_person";
        }
        
        // Save to storage
        WorldStorage.SetItem("METAWORLD-CAMERA-MODE", context.cameraMode);
        
        // Immediately update camera position and character visibility
        if (context.characterEntity != null) {
            if (context.cameraMode === "first_person") {
                Camera.SetPosition(new Vector3(0, 0.1, 0), true);
                context.characterEntity.SetVisibility(false, false);
            } else {
                Camera.SetPosition(new Vector3(0, 1, -2), true);
                context.characterEntity.SetVisibility(true, false);
            }
        }
        
        Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
    }

    /// @function SetCameraMode
    /// Set the camera mode to first person or third person.
    /// @param {string} mode The camera mode: "first_person" or "third_person"
    SetCameraMode(mode) {
        var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
        if (mode === "first_person" || mode === "third_person") {
            context.cameraMode = mode;
            
            // Save to storage
            WorldStorage.SetItem("METAWORLD-CAMERA-MODE", context.cameraMode);
            
            // Immediately update camera position and character visibility
            if (context.characterEntity != null) {
                if (context.cameraMode === "first_person") {
                    Camera.SetPosition(new Vector3(0, 0.1, 0), true);
                    context.characterEntity.SetVisibility(false, false);
                } else {
                    Camera.SetPosition(new Vector3(0, 1, -2), true);
                    context.characterEntity.SetVisibility(true, false);
                }
            }
            
            Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
        }
    }

    /// @function GetCameraMode
    /// Get the current camera mode.
    /// @returns {string} The current camera mode: "first_person" or "third_person"
    GetCameraMode() {
        var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
        return context.cameraMode;
    }
}

/// @function SetMotionFree
/// Set the motion mode for the third person character to free.
function MW_Player_ThirdPerson_SetMotionModeFree() {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    context.motionMode = "free";
    var props = new EntityPhysicalProperties(null, null, null, false, null);
    context.characterEntity.SetPhysicalProperties(props);
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

/// @function SetMotionPhysical
/// Set the motion mode for the third person character to physical.
function MW_Player_ThirdPerson_SetMotionModePhysical() {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    context.motionMode = "physical";
    var props = new EntityPhysicalProperties(null, null, null, true, null);
    context.characterEntity.SetPhysicalProperties(props);
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

/// @function SetMotionMultiplier
/// Set the motion multiplier for the third person character.
/// @param {float} multiplier The multiplier to apply. Must be greater than 0.
function MW_Player_ThirdPerson_SetMotionMultiplier(multiplier) {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    context.motionMultiplier = 0.1 * multiplier;
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

/// @function MoveCharacter
/// Move the character by the provided amounts in the x and y directions.
/// @param {float} x The X component of the motion.
/// @param {float} y The Y component of the motion.
function MW_Player_ThirdPerson_MoveCharacter(x, y) {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    context.currentMotion.x = y * context.motionMultiplier;
    context.currentMotion.z = -1 * x * context.motionMultiplier;
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

/// @function EndMoveCharacter
/// End the motion for the character.
function MW_Player_ThirdPerson_EndMoveCharacter() {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    context.currentMotion = Vector3.zero;
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

// @function LiftCharacter
// Lift the character by the provided amount in the y direction.
// @param {float} x Ignored.
// @param {float} y Vertical motion.
function MW_Player_ThirdPerson_LiftCharacter(x, y) {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    context.currentMotion.y = y;
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

// @function EndLiftCharacter
// End the lifting of the character.
function MW_Player_ThirdPerson_EndLiftCharacter() {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    context.currentMotion.y = 0;
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

// @function LiftCharacterOneStep
// Lift the character one step in the y direction.
function MW_Player_ThirdPerson_LiftCharacterOneStep() {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    if (context.characterEntity != null) {
        context.currentTransform = context.characterEntity.GetTransform();
        var newMotion = new Vector3(0, context.motionMultiplier, 0);
        var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
            context.currentTransform.position.y + newMotion.y, context.currentTransform.position.z + newMotion.z);
        context.characterEntity.SetPosition(newPosition, false);
    }
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

// @function DropCharacterOneStep
// Drop the character one step in the y direction.
function MW_Player_ThirdPerson_DropCharacterOneStep() {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    if (context.characterEntity != null) {
        context.currentTransform = context.characterEntity.GetTransform();
        var newMotion = new Vector3(0, -1 * context.motionMultiplier, 0);
        var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
            context.currentTransform.position.y + newMotion.y, context.currentTransform.position.z + newMotion.z);
        context.characterEntity.SetPosition(newPosition, false);
    }
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

/// @function MoveCharacterOneStep
/// Move the character one step by the provided amounts in the x and y directions.
/// @param {float} x The X component of the motion.
/// @param {float} y The Y component of the motion.
function MW_Player_ThirdPerson_MoveCharacterOneStep(x, y) {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    if (context.characterEntity != null) {
        context.currentTransform = context.characterEntity.GetTransform();
        var newMotion = new Vector3(context.currentTransform.forward.x * (x * context.motionMultiplier) - context.currentTransform.right.x * (y * context.motionMultiplier),
            0, context.currentTransform.forward.z * (x * context.motionMultiplier) - context.currentTransform.right.z * (y * context.motionMultiplier));
        var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
            context.currentTransform.position.y, context.currentTransform.position.z + newMotion.z);
        context.characterEntity.SetPosition(newPosition, false);
    }
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

/// @function LookCharacter
/// Perform a look on the character by the provided amounts in the x and y directions.
/// @param {float} x The X component of the look.
/// @param {float} y The Y component of the look.
function MW_Player_ThirdPerson_LookCharacter(x, y) {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    context.currentRotation.y += x * context.rotationMultiplier;
    context.currentRotation.z -= y * context.rotationMultiplier;
    if (context.currentRotation.z > context.maxZ) {
        context.currentRotation.z = context.maxZ;
    }
    if (context.currentRotation.z < context.minZ) {
        context.currentRotation.z = context.minZ;
    }
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

/// @function EndLookCharacter
/// End the look for the character.
function MW_Player_ThirdPerson_EndLookCharacter() {

}

/// @function JumpCharacter
/// Perform a jump on the character by the provided amount.
/// @param {float} amount The amount by which to jump.
function MW_Player_ThirdPerson_JumpCharacter(amount) {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    context.characterEntity.Jump(amount);
}

// @function OnKeyPress
// @param {string} key The key that was pressed.
// Handle a key press.
function MW_Player_ThirdPerson_OnKeyPress(key) {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    if (key === "q") {
        context.currentMotion.y = 1;
    }
    else if (key === "z") {
        context.currentMotion.y = -1;
    }
    else if (key === " ") {
        JumpCharacter(1);
    }
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

// @function OnKeyRelease
// @param {string} key The key that was released.
// Handle a key release.
function MW_Player_ThirdPerson_OnKeyRelease(key) {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    if (key === "q") {
        context.currentMotion.y = 0;
    }
    else if (key === "z") {
        context.currentMotion.y = 0;
    }
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

function MW_Player_ThirdPerson_PlaceCharacterInAutomobileEntity(automobileEntity) {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");

    context.characterEntity.SetParent(automobileEntity);
    context.characterEntity.SetPosition(Vector3.zero, true, false);
    context.characterEntity.SetRotation(Quaternion.identity, true, false);
    context.characterEntity.SetInteractionState(InteractionState.Static);
    context.characterEntity.SetVisibility(false, false);
    context.inVehicle = true;
    context.activeVehicle = automobileEntity;

    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

/// @function ToggleCameraMode
/// Toggle between first person and third person camera modes.
function MW_Player_ThirdPerson_ToggleCameraMode() {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    if (context.cameraMode === "third_person") {
        context.cameraMode = "first_person";
    } else {
        context.cameraMode = "third_person";
    }
    
    // Save to storage
    WorldStorage.SetItem("METAWORLD-CAMERA-MODE", context.cameraMode);
    
    // Immediately update camera position and character visibility
    if (context.characterEntity != null) {
        if (context.cameraMode === "first_person") {
            Camera.SetPosition(new Vector3(0, 0.1, 0), true);
            context.characterEntity.SetVisibility(false, false);
        } else {
            Camera.SetPosition(new Vector3(0, 1, -2), true);
            context.characterEntity.SetVisibility(true, false);
        }
    }
    
    Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
}

/// @function SetCameraMode
/// Set the camera mode to first person or third person.
/// @param {string} mode The camera mode: "first_person" or "third_person"
function MW_Player_ThirdPerson_SetCameraMode(mode) {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    if (mode === "first_person" || mode === "third_person") {
        context.cameraMode = mode;
        
        // Save to storage
        WorldStorage.SetItem("METAWORLD-CAMERA-MODE", context.cameraMode);
        
        // Immediately update camera position and character visibility
        if (context.characterEntity != null) {
            if (context.cameraMode === "first_person") {
                Camera.SetPosition(new Vector3(0, 0.1, 0), true);
                context.characterEntity.SetVisibility(false, false);
            } else {
                Camera.SetPosition(new Vector3(0, 1, -2), true);
                context.characterEntity.SetVisibility(true, false);
            }
        }
        
        Context.DefineContext("THIRD_PERSON_CHARACTER_CONTROLLER", context);
    }
}

/// @function GetCameraMode
/// Get the current camera mode.
/// @returns {string} The current camera mode: "first_person" or "third_person"
function MW_Player_ThirdPerson_GetCameraMode() {
    var context = Context.GetContext("THIRD_PERSON_CHARACTER_CONTROLLER");
    return context.cameraMode;
}