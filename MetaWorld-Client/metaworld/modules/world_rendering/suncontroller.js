class SunController {
    constructor(baseLightIntensity, sunLightIntensity) {
        this.baseLightIntensity = baseLightIntensity;
        this.sunLightIntensity = sunLightIntensity;
        this.baseLightEntity = null;
        this.sunEntity = null;
        
        this.UpdateTimeOfDay = function(timeOfDaySecs) {Logging.Log("sadadfs ");
            var sunController = Context.GetContext("SUN_CONTROLLER");
            var configModule = Context.GetContext("CONFIGURATION_MODULE");
            
            if (timeOfDaySecs < 0 || timeOfDaySecs > configModule.worldConfig["day-length"]) {
                Logging.LogError("Sun: Invalid timeOfDaySecs.");
                return;
            }
            
            if (sunController.sunEntity == null) {
                Logging.LogError("Sun: sunEntity not set.");
                return;
            }
            
            sunController.sunEntity.SetEulerRotation(
                new Vector3(360 * (timeOfDaySecs / configModule.worldConfig["day-length"]) - 90, 0, 0), false);
        }
        
        Context.DefineContext("SUN_CONTROLLER", this);
        //LightEntity.Create(null, Vector3.zero,
        //    new Quaternion(0.7071, 0, 0, 0.7071), null, "BaseLight", "OnBaseLightEntityCreated");
        LightEntity.Create(null, Vector3.zero, Quaternion.identity, null, "Sun", "MW_Rend_Sun_OnSunLightEntityCreated");
    }
}

function MW_Rend_Sun_OnBaseLightEntityCreated(entity) {
    var sunController = Context.GetContext("SUN_CONTROLLER");
    entity.SetVisibility(true);
    entity.SetInteractionState(InteractionState.Static);
    entity.SetLightType(LightType.Directional);
    entity.SetLightProperties(Color.white, 1000, sunController.baseLightIntensity);
    sunController.baseLightEntity = entity;
    Context.DefineContext("SUN_CONTROLLER", sunController);
}

function MW_Rend_Sun_OnSunLightEntityCreated(entity) {
    var sunController = Context.GetContext("SUN_CONTROLLER");
    entity.SetVisibility(true);
    entity.SetInteractionState(InteractionState.Static);
    entity.SetLightType(LightType.Directional);
    entity.SetLightProperties(Color.white, 1000, sunController.sunLightIntensity);
    sunController.sunEntity = entity;
    Context.DefineContext("SUN_CONTROLLER", sunController);
}

function MW_Rend_Sun_UpdateSunTimeOfDay(timeOfDaySecs) {
    var sunController = Context.GetContext("SUN_CONTROLLER");
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    
    if (timeOfDaySecs < 0 || timeOfDaySecs > configModule.worldConfig["day-length"]) {
        Logging.LogError("Sun: Invalid timeOfDaySecs.");
        return;
    }
    
    if (sunController.sunEntity == null) {
        Logging.LogError("Sun: sunEntity not set.");
        return;
    }
    
    sunController.sunEntity.SetEulerRotation(
        new Vector3(360 * (timeOfDaySecs / configModule.worldConfig["day-length"]) - 90, 0, 0), false);
}