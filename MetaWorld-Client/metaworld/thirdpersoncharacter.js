/// @file thirdpersoncharacter.js
/// Module for a third person character.

function FinishLoadingCharacter(character) {
    var context = Context.GetContext("thirdPersonCharacterContext");
    context.characterEntity = Entity.Get(context.characterEntityID);
    if (context.mode === "vr") {
        Camera.SetPosition(position, false);
    }
    else {
        context.characterEntity.PlaceCameraOn();
        Camera.SetPosition(new Vector3(0, 2, -2), true);
    }
    context.OnLoaded();
}

class ThirdPersonCharacter {
    constructor(name, id = null, minZ = -90, maxZ = 90, motionMultiplier = 0.1, rotationMultiplier = 0.1, position = Vector3.zero, onLoaded = null, mode = "desktop",
        characterMesh = null, characterMeshResources = null, characterMeshOffset = Vector3.zero, characterMeshRotation = Quaternion.identity, labelOffset = Vector3.zero) {
        this.minZ = minZ;
        this.maxZ = maxZ;
        this.motionMultiplier = motionMultiplier
        this.rotationMultiplier = rotationMultiplier;
        
        this.currentMotion = Vector3.zero;
        this.currentRotation = Vector3.zero;
        this.currentTransform = null;
        this.characterEntity = null;
        this.mode = mode;
        this.loaded = false;
        
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
            if (mode === "vr") {
                Camera.AddCameraFollower(context.characterEntity);
                context.characterEntity.SetVisibility(false);
            }
            else {
                context.characterEntity.SetVisibility(true);
            }
        }
        
        this.GetPosition = function() {
            if (this.characterEntityID != null) {
                var ce = Entity.Get(this.characterEntityID);
                if (ce != null) {
                    return ce.GetPosition(false);
                }
            }
            
            return Vector3.zero;
        }
        
        /// @function ThirdPersonCharacter.Update
        /// Perform a single update on the character.
        this.CharacterUpdate = function() {
            context = Context.GetContext("thirdPersonCharacterContext");
            if (context.characterEntity != null) {
                context.currentTransform = context.characterEntity.GetTransform();
                if (context.currentTransform == null) {
                    return;
                }
                var newMotion = new Vector3(context.currentTransform.forward.x * context.currentMotion.x - context.currentTransform.right.x * context.currentMotion.z,
                    context.currentMotion.y, context.currentTransform.forward.z * context.currentMotion.x - context.currentTransform.right.z * context.currentMotion.z);
                if (mode === "vr") {
                    var cameraPosition = Camera.GetPosition(false);
                    var newPosition = new Vector3(cameraPosition.x + newMotion.x,
                    cameraPosition.y + newMotion.y, cameraPosition.z + newMotion.z);
                    Camera.SetPosition(newPosition, false);
                }
                else {
                    var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
                    context.currentTransform.position.y + newMotion.y, context.currentTransform.position.z + newMotion.z);
                    context.characterEntity.SetPosition(newPosition, false);
                    var entityRotation = new Vector3(context.currentRotation.x, context.currentRotation.y, 0);
                    var cameraRotation = new Vector3(context.currentRotation.z, 0, 0);
                    context.characterEntity.SetEulerRotation(entityRotation, false);
                    Camera.SetEulerRotation(cameraRotation, true);
                }
            }
        }
        
        Context.DefineContext("thirdPersonCharacterContext", this);
        
        this.characterEntity = CharacterEntity.Create(null, characterMesh, characterMeshResources, characterMeshOffset, characterMeshRotation, labelOffset, position,
            Quaternion.identity, Vector3.one, false, name, this.characterEntityID, "FinishLoadingCharacter");
        Context.DefineContext("thirdPersonCharacterContext", this);
        
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
    
    /// @function ThirdPersonCharacter.MoveCharacter
    /// Move the character by the provided amounts in the x and y directions.
    /// @param {float} x The X component of the motion.
    /// @param {float} y The Y component of the motion.
    MoveCharacter(x, y) {
        this.currentMotion.x = y * this.motionMultiplier;
        this.currentMotion.z = -1 * x * this.motionMultiplier;
        Context.DefineContext("thirdPersonCharacterContext", this);
    }
    
    /// @function ThirdPersonCharacter.EndMoveCharacter
    /// End the motion for the character.
    EndMoveCharacter() {
        this.currentMotion = Vector3.zero;
        Context.DefineContext("thirdPersonCharacterContext", this);
    }
    
    // @function ThirdPersonCharacter.LiftCharacter
    // Lift the character by the provided amount in the y direction.
    // @param {float} x Ignored.
    // @param {float} y Vertical motion.
    LiftCharacter(x, y) {
        this.currentMotion.y = y;
    }
    
    // @function ThirdPersonCharacter.EndLiftCharacter
    // End the lifting of the character.
    EndLiftCharacter() {
        this.currentMotion.y = 0;
    }
    
    /// @function ThirdPersonCharacter.MoveCharacter
    /// Move the character one step by the provided amounts in the x and y directions.
    /// @param {float} x The X component of the motion.
    /// @param {float} y The Y component of the motion.
    MoveCharacterOneStep(x, y) {
        context = this;
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
        this.currentRotation.y += x * this.rotationMultiplier;
        this.currentRotation.z -= y * this.rotationMultiplier;
        if (this.currentRotation.z > this.maxZ) {
            this.currentRotation.z = this.maxZ;
        }
        if (this.currentRotation.z < this.minZ) {
            this.currentRotation.z = this.minZ;
        }
        Context.DefineContext("thirdPersonCharacterContext", this);
    }
    
    /// @function ThirdPersonCharacter.EndLookCharacter
    /// End the look for the character.
    EndLookCharacter() {
        
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