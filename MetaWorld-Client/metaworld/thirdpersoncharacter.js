/// @file thirdpersoncharacter.js
/// Module for a third person character.

function FinishLoadingCharacter(character) {
    var context = Context.GetContext("thirdPersonCharacterContext");
    context.characterEntity = Entity.Get(context.characterEntityID);
    context.OnLoaded();
}

class ThirdPersonCharacter {
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
            var context = Context.GetContext("thirdPersonCharacterContext");
            context.characterEntity.SetInteractionState(InteractionState.Physical);
            if (mode === "vr") {
                //Camera.AddCameraFollower(context.characterEntity);
                context.characterEntity.SetVisibility(false, false);
            }
            else {
                context.characterEntity.SetVisibility(true, false);
            }
            context.characterEntity.EnablePositionBroadcast(0.25);
            context.characterEntity.EnableRotationBroadcast(0.25);
        }
        
        this.GetPosition = function() {
            var context = Context.GetContext("thirdPersonCharacterContext");
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
            var context = Context.GetContext("thirdPersonCharacterContext");
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
                        Camera.SetPosition(new Vector3(0, 1, -2), true);
                        context.characterEntity.SetVisibility(true, false);
                        context.inVRMode = false;
                    }
                    var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
                        context.currentTransform.position.y + newMotion.y, context.currentTransform.position.z + newMotion.z);
                    
                    if (context.motionMode == "physical") {
                        context.characterEntity.Move(new Vector3(newMotion.x, 0, newMotion.z));
                    }
                    else {
                        context.characterEntity.SetPosition(newPosition, false);
                    }
                    var entityRotation = new Vector3(context.currentRotation.x, context.currentRotation.y, 0);
                    var cameraRotation = new Vector3(context.currentRotation.z, 0, 0);
                    context.characterEntity.SetEulerRotation(entityRotation, false);
                    Camera.SetEulerRotation(cameraRotation, true);
                }
            }
        }
        
        Context.DefineContext("thirdPersonCharacterContext", this);
        
        this.characterEntity = CharacterEntity.Create(null, position,
            Quaternion.identity, Vector3.one, false, name, this.characterEntityID, "FinishLoadingCharacter");
        this.characterEntity.fixHeight = findGround;
        if (findGround) {
            SetMotionModePhysical();
        }
        else {
            SetMotionModeFree();
        }
        Context.DefineContext("thirdPersonCharacterContext", this);
        if (mode === "vr") {
            
        }
        else if (!Input.IsVR) {
            this.characterEntity.PlaceCameraOn();
            Camera.SetPosition(new Vector3(0, 1, -2), true);
        }
        
        Time.SetInterval(`
            var context = Context.GetContext("thirdPersonCharacterContext");
            if (context == null) {
                Logging.LogError("[ThirdPersonCharacter] Unable to get context.");
            }
            else {
                context.CharacterUpdate();
            }`,
            0.005);
        Context.DefineContext("thirdPersonCharacterContext", this);
    }
    
    /// @function ThirdPersonCharacter.SetMotionFree
    /// Set the motion mode for the third person character to free.
    SetMotionModeFree() {
        this.motionMode = "free";
        var context = Context.GetContext("thirdPersonCharacterContext");
        var props = new EntityPhysicalProperties(null, null, null, false, null);
        context.characterEntity.SetPhysicalProperties(props);
    }

    /// @function ThirdPersonCharacter.SetMotionPhysical
    /// Set the motion mode for the third person character to physical.
    SetMotionModePhysical() {
        this.motionMode = "physical";
        var context = Context.GetContext("thirdPersonCharacterContext");
        var props = new EntityPhysicalProperties(null, null, null, true, null);
        context.characterEntity.SetPhysicalProperties(props);
    }

    /// @function ThirdPersonCharacter.SetMotionMultiplier
    /// Set the motion multiplier for the third person character.
    /// @param {float} multiplier The multiplier to apply. Must be greater than 0.
    SetMotionMultiplier(multiplier) {
        var context = Context.GetContext("thirdPersonCharacterContext");
        context.motionMultiplier = 0.1 * multiplier;
        Context.DefineContext("thirdPersonCharacterContext", context);
    }

    /// @function ThirdPersonCharacter.MoveCharacter
    /// Move the character by the provided amounts in the x and y directions.
    /// @param {float} x The X component of the motion.
    /// @param {float} y The Y component of the motion.
    MoveCharacter(x, y) {
        var context = Context.GetContext("thirdPersonCharacterContext");
        context.currentMotion.x = y * context.motionMultiplier;
        context.currentMotion.z = -1 * x * context.motionMultiplier;
        Context.DefineContext("thirdPersonCharacterContext", context);
    }
    
    /// @function ThirdPersonCharacter.EndMoveCharacter
    /// End the motion for the character.
    EndMoveCharacter() {
        var context = Context.GetContext("thirdPersonCharacterContext");
        context.currentMotion = Vector3.zero;
        Context.DefineContext("thirdPersonCharacterContext", context);
    }
    
    // @function ThirdPersonCharacter.LiftCharacter
    // Lift the character by the provided amount in the y direction.
    // @param {float} x Ignored.
    // @param {float} y Vertical motion.
    LiftCharacter(x, y) {
        var context = Context.GetContext("thirdPersonCharacterContext");
        context.currentMotion.y = y;
        Context.DefineContext("thirdPersonCharacterContext", context);
    }
    
    // @function ThirdPersonCharacter.EndLiftCharacter
    // End the lifting of the character.
    EndLiftCharacter() {
        var context = Context.GetContext("thirdPersonCharacterContext");
        context.currentMotion.y = 0;
        Context.DefineContext("thirdPersonCharacterContext", context);
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
        var context = Context.GetContext("thirdPersonCharacterContext");
        context.currentRotation.y += x * context.rotationMultiplier;
        context.currentRotation.z -= y * context.rotationMultiplier;
        if (context.currentRotation.z > context.maxZ) {
            context.currentRotation.z = context.maxZ;
        }
        if (context.currentRotation.z < context.minZ) {
            context.currentRotation.z = context.minZ;
        }
        Context.DefineContext("thirdPersonCharacterContext", context);
    }
    
    /// @function ThirdPersonCharacter.EndLookCharacter
    /// End the look for the character.
    EndLookCharacter() {
        
    }

    /// @function ThirdPersonCharacter.JumpCharacter
    /// Perform a jump on the character by the provided amount.
    /// @param {float} amount The amount by which to jump.
    JumpCharacter(amount) {
        var context = Context.GetContext("thirdPersonCharacterContext");
        
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
}

/// @function SetMotionFree
/// Set the motion mode for the third person character to free.
function SetMotionModeFree() {
    var context = Context.GetContext("thirdPersonCharacterContext");
    context.motionMode = "free";
    var props = new EntityPhysicalProperties(null, null, null, false, null);
    context.characterEntity.SetPhysicalProperties(props);
    Context.DefineContext("thirdPersonCharacterContext", context);
}

/// @function SetMotionPhysical
/// Set the motion mode for the third person character to physical.
function SetMotionModePhysical() {
    var context = Context.GetContext("thirdPersonCharacterContext");
    context.motionMode = "physical";
    var props = new EntityPhysicalProperties(null, null, null, true, null);
    context.characterEntity.SetPhysicalProperties(props);
    Context.DefineContext("thirdPersonCharacterContext", context);
}

/// @function SetMotionMultiplier
/// Set the motion multiplier for the third person character.
/// @param {float} multiplier The multiplier to apply. Must be greater than 0.
function SetMotionMultiplier(multiplier) {
    var context = Context.GetContext("thirdPersonCharacterContext");
    context.motionMultiplier = 0.1 * multiplier;
    Context.DefineContext("thirdPersonCharacterContext", context);
}

/// @function MoveCharacter
/// Move the character by the provided amounts in the x and y directions.
/// @param {float} x The X component of the motion.
/// @param {float} y The Y component of the motion.
function MoveCharacter(x, y) {
    var context = Context.GetContext("thirdPersonCharacterContext");
    context.currentMotion.x = y * context.motionMultiplier;
    context.currentMotion.z = -1 * x * context.motionMultiplier;
    Context.DefineContext("thirdPersonCharacterContext", context);
}

/// @function EndMoveCharacter
/// End the motion for the character.
function EndMoveCharacter() {
    var context = Context.GetContext("thirdPersonCharacterContext");
    context.currentMotion = Vector3.zero;
    Context.DefineContext("thirdPersonCharacterContext", context);
}

// @function LiftCharacter
// Lift the character by the provided amount in the y direction.
// @param {float} x Ignored.
// @param {float} y Vertical motion.
function LiftCharacter(x, y) {
    var context = Context.GetContext("thirdPersonCharacterContext");
    context.currentMotion.y = y;
    Context.DefineContext("thirdPersonCharacterContext", context);
}

// @function EndLiftCharacter
// End the lifting of the character.
function EndLiftCharacter() {
    var context = Context.GetContext("thirdPersonCharacterContext");
    context.currentMotion.y = 0;
    Context.DefineContext("thirdPersonCharacterContext", context);
}

// @function LiftCharacterOneStep
// Lift the character one step in the y direction.
function LiftCharacterOneStep() {
    var context = Context.GetContext("thirdPersonCharacterContext");
    if (context.characterEntity != null) {
        context.currentTransform = context.characterEntity.GetTransform();
        var newMotion = new Vector3(0, context.motionMultiplier, 0);
        var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
            context.currentTransform.position.y + newMotion.y, context.currentTransform.position.z + newMotion.z);
        context.characterEntity.SetPosition(newPosition, false);
    }
    Context.DefineContext("thirdPersonCharacterContext", context);
}

// @function DropCharacterOneStep
// Drop the character one step in the y direction.
function DropCharacterOneStep() {
    var context = Context.GetContext("thirdPersonCharacterContext");
    if (context.characterEntity != null) {
        context.currentTransform = context.characterEntity.GetTransform();
        var newMotion = new Vector3(0, -1 * context.motionMultiplier, 0);
        var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
            context.currentTransform.position.y + newMotion.y, context.currentTransform.position.z + newMotion.z);
        context.characterEntity.SetPosition(newPosition, false);
    }
    Context.DefineContext("thirdPersonCharacterContext", context);
}

/// @function MoveCharacterOneStep
/// Move the character one step by the provided amounts in the x and y directions.
/// @param {float} x The X component of the motion.
/// @param {float} y The Y component of the motion.
function MoveCharacterOneStep(x, y) {
    var context = Context.GetContext("thirdPersonCharacterContext");
    if (context.characterEntity != null) {
        context.currentTransform = context.characterEntity.GetTransform();
        var newMotion = new Vector3(context.currentTransform.forward.x * (x * context.motionMultiplier) - context.currentTransform.right.x * (y * context.motionMultiplier),
            0, context.currentTransform.forward.z * (x * context.motionMultiplier) - context.currentTransform.right.z * (y * context.motionMultiplier));
        var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
            context.currentTransform.position.y, context.currentTransform.position.z + newMotion.z);
        context.characterEntity.SetPosition(newPosition, false);
    }
    Context.DefineContext("thirdPersonCharacterContext", context);
}

/// @function LookCharacter
/// Perform a look on the character by the provided amounts in the x and y directions.
/// @param {float} x The X component of the look.
/// @param {float} y The Y component of the look.
function LookCharacter(x, y) {
    var context = Context.GetContext("thirdPersonCharacterContext");
    context.currentRotation.y += x * context.rotationMultiplier;
    context.currentRotation.z -= y * context.rotationMultiplier;
    if (context.currentRotation.z > context.maxZ) {
        context.currentRotation.z = context.maxZ;
    }
    if (context.currentRotation.z < context.minZ) {
        context.currentRotation.z = context.minZ;
    }
    Context.DefineContext("thirdPersonCharacterContext", context);
}

/// @function EndLookCharacter
/// End the look for the character.
function EndLookCharacter() {

}

/// @function JumpCharacter
/// Perform a jump on the character by the provided amount.
/// @param {float} amount The amount by which to jump.
function JumpCharacter(amount) {
    var context = Context.GetContext("thirdPersonCharacterContext");
    context.characterEntity.Jump(amount);
}

// @function OnKeyPress
// @param {string} key The key that was pressed.
// Handle a key press.
function OnKeyPress(key) {
    var context = Context.GetContext("thirdPersonCharacterContext");
    if (key === "q") {
        context.currentMotion.y = 1;
    }
    else if (key === "z") {
        context.currentMotion.y = -1;
    }
    else if (key === " ") {
        JumpCharacter(1);
    }
    Context.DefineContext("thirdPersonCharacterContext", context);
}

// @function OnKeyRelease
// @param {string} key The key that was released.
// Handle a key release.
function OnKeyRelease(key) {
    var context = Context.GetContext("thirdPersonCharacterContext");
    if (key === "q") {
        context.currentMotion.y = 0;
    }
    else if (key === "z") {
        context.currentMotion.y = 0;
    }
    Context.DefineContext("thirdPersonCharacterContext", context);
}