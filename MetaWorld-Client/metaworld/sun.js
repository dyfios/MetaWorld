function OnBaseLightEntityCreated(entity) {
    var context = Context.GetContext("SUNCONTEXT");
    entity.SetVisibility(true);
    entity.SetInteractionState(InteractionState.Static);
    entity.SetLightType(LightType.Directional);
    entity.SetLightProperties(Color.white, 1000, context.baseLightIntensity);
    context.baseLightEntity = entity;
    Context.DefineContext("SUNCONTEXT", context);
}

function OnSunLightEntityCreated(entity) {
    var context = Context.GetContext("SUNCONTEXT");
    entity.SetVisibility(true);
    entity.SetInteractionState(InteractionState.Static);
    entity.SetLightType(LightType.Directional);
    entity.SetLightProperties(Color.white, 1000, context.sunLightIntensity);
    context.sunEntity = entity;
    Context.DefineContext("SUNCONTEXT", context);
}

class Sun {
    constructor(baseLightIntensity, sunLightIntensity) {
        this.baseLightIntensity = baseLightIntensity;
        this.sunLightIntensity = sunLightIntensity;
        this.baseLightEntity = null;
        this.sunEntity = null;
        
        this.UpdateTimeOfDay = function(timeOfDaySecs) {
            var context = Context.GetContext("SUNCONTEXT");
            var configContext = Context.GetContext("WORLDCONFIGCONTEXT");
            
            if (timeOfDaySecs < 0 || timeOfDaySecs > configContext.worldConfig["day-length"]) {
                Logging.LogError("Sun: Invalid timeOfDaySecs.");
                return;
            }
            
            if (context.sunEntity == null) {
                Logging.LogError("Sun: sunEntity not set.");
                return;
            }
            
            context.sunEntity.SetEulerRotation(new Vector3(360 * (timeOfDaySecs / configContext.worldConfig["day-length"]) - 90, 0, 0), false);
        }
        
        Context.DefineContext("SUNCONTEXT", this);
        //LightEntity.Create(null, Vector3.zero, new Quaternion(0.7071, 0, 0, 0.7071), null, "BaseLight", "OnBaseLightEntityCreated");
        LightEntity.Create(null, Vector3.zero, Quaternion.identity, null, "Sun", "OnSunLightEntityCreated");
    }
}