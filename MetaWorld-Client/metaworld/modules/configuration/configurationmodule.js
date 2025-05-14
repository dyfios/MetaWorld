class ConfigurationModule {
    constructor(worldURI, onLoadComplete) {
        Logging.Log("Initializing Configuration Module...");

        this.worldURI = worldURI;
        this.worldConfig = null;
        this.entitiesConfig = null;
        this.terrainConfig = null;
        this.onLoadCompleted = onLoadComplete;

        this.ApplyEntitiesConfig = function() {
            var configModule = Context.GetContext("CONFIGURATION_MODULE");
            for (var entity in configModule.entitiesConfig) {
                if (configModule.entitiesConfig[entity].id == null) {
                    Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity config: " + entity + " missing id");
                }
                else {
                    WorldStorage.SetItem("METAWORLD.CONFIGURATION.ENTITYID." + configModule.entitiesConfig[entity].id, entity);
                }
                
                if (configModule.entitiesConfig[entity].variants == null) {
                    Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity config: " + entity + " missing variants");
                }
                
                for (var variant in configModule.entitiesConfig[entity].variants) {
                    if (configModule.entitiesConfig[entity].variants[variant].variant_id == null) {
                        Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: " + entity + ":" + variant + " missing variant_id");
                    }
                    else {
                        WorldStorage.SetItem("METAWORLD.CONFIGURATION.VARIANTID."
                            + configModule.entitiesConfig[entity].id + "." + configModule.entitiesConfig[entity].variants[variant].variant_id, variant);
                    }
                    
                    if (configModule.entitiesConfig[entity].variants[variant].model == null) {
                        Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: " + entity + ":" + variant + " missing model");
                    }
                    else if (configModule.entitiesConfig[entity].variants[variant].display_name == null) {
                        Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: " + entity + ":" + variant + " missing display_name");
                    }
                    else if (configModule.entitiesConfig[entity].variants[variant].thumbnail == null) {
                        Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: " + entity + ":" + variant + " missing thumbnail");
                    }
                    else {
                        configModule.entitiesConfig[entity].variants[variant].model =
                            configModule.worldURI + "/" + configModule.worldConfig["entities-directory"] + "/"
                            + configModule.entitiesConfig[entity].variants[variant].model;
                        configModule.entitiesConfig[entity].variants[variant].thumbnail =
                            configModule.worldURI + "/" + configModule.worldConfig["entities-directory"] + "/"
                            + configModule.entitiesConfig[entity].variants[variant].thumbnail;
                    }
                    
                    for (var valid_orientation in configModule.entitiesConfig[entity].variants[variant].valid_orientations) {
                        var curr_orientation = configModule.entitiesConfig[entity].variants[variant].valid_orientations[valid_orientation];
                        if (curr_orientation.model_offset == null || curr_orientation.model_offset.x == null
                            || curr_orientation.model_offset.y == null || curr_orientation.model_offset.z == null) {
                            Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: "
                                + entity + ":" + variant + " invalid valid_orientation model_offset.");
                        }
                        if (curr_orientation.model_rotation == null || curr_orientation.model_rotation.x == null
                            || curr_orientation.model_rotation.y == null || curr_orientation.model_rotation.z == null
                            || curr_orientation.model_rotation.w == null) {
                            Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: "
                                + entity + ":" + variant + " invalid valid_orientation model_rotation.");
                        }
                        if (curr_orientation.placement_offset == null || curr_orientation.placement_offset.x == null
                            || curr_orientation.placement_offset.y == null || curr_orientation.placement_offset.z == null) {
                            Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: "
                                 + entity + ":" + variant + " invalid valid_orientation placement_offset.");
                        }
                    }
                    
                    if (configModule.entitiesConfig[entity].variants[variant].model.startsWith("/") ||
                        configModule.entitiesConfig[entity].variants[variant].model[1] == ":") {
                        configModule.entitiesConfig[entity].variants[variant].model = "file://" + configModule.entitiesConfig[entity].variants[variant].model;
                    }
                }
            }

            Context.DefineContext("CONFIGURATION_MODULE", configModule);

            if (configModule.terrainConfig != null
                && configModule.entitiesConfig != null && configModule.terrainConfig != null) {
                if (configModule.onLoadCompleted != null) {
                    if (configModule.onLoadCompleted != null) {
                        configModule.onLoadCompleted();
                    }
                }
            }
        }

        this.ApplyTerrainConfig = function() {
            var configModule = Context.GetContext("CONFIGURATION_MODULE");
            
            if (configModule.terrainConfig["grid-size"] === null) {
                Logging.LogError("MetaWorld->ApplyTerrainConfig: Invalid terrain config: missing grid-size");
            }
            
            if (configModule.terrainConfig.layers === null) {
                Logging.LogError("MetaWorld->ApplyTerrainConfig: Invalid terrain config: missing layers");
            }
            else {
                for (var terrainLayer in configModule.terrainConfig.layers) {
                    if (configModule.terrainConfig.layers[terrainLayer].layer == null) {
                        Logging.LogError("MetaWorld->ApplyTerrainConfig: Invalid terrain config: " + terrainLayer + " missing layer");
                    }
                    
                    if (configModule.terrainConfig.layers[terrainLayer].color_texture == null) {
                        Logging.LogError("MetaWorld->ApplyTerrainConfig: Invalid terrain config: " + terrainLayer + " missing color_texture");
                    }
                    else {
                        configModule.terrainConfig.layers[terrainLayer].color_texture = configModule.worldURI + "/" + configModule.worldConfig["terrain-directory"]
                            + "/" + configModule.terrainConfig.layers[terrainLayer].color_texture;
                    }
                    
                    if (configModule.terrainConfig.layers[terrainLayer].color_texture.startsWith("/") ||
                        configModule.terrainConfig.layers[terrainLayer].color_texture[1] == ":") {
                        configModule.terrainConfig.layers[terrainLayer].color_texture = "file://" + configModule.terrainConfig.layers[terrainLayer].color_texture;
                    }
                    
                    if (configModule.terrainConfig.layers[terrainLayer].normal_texture == null) {
                        Logging.LogError("MetaWorld->ApplyTerrainConfig: Invalid terrain config: " + terrainLayer + " missing normal_texture");
                    }
                    else {
                        configModule.terrainConfig.layers[terrainLayer].normal_texture = configModule.worldURI + "/" + configModule.worldConfig["terrain-directory"]
                            + "/" + configModule.terrainConfig.layers[terrainLayer].normal_texture;
                    }
                    
                    if (configModule.terrainConfig.layers[terrainLayer].normal_texture.startsWith("/") ||
                        configModule.terrainConfig.layers[terrainLayer].normal_texture[1] == ":") {
                        configModule.terrainConfig.layers[terrainLayer].normal_texture = "file://" + configModule.terrainConfig.layers[terrainLayer].normal_texture;
                    }
                }
            }

            Context.DefineContext("CONFIGURATION_MODULE", configModule);

            if (configModule.terrainConfig != null
                && configModule.entitiesConfig != null && configModule.terrainConfig != null) {
                if (configModule.onLoadCompleted != null) {
                    if (configModule.onLoadCompleted != null) {
                        configModule.onLoadCompleted();
                    }
                }
            }
        }

        this.ValidateEntitiesConfig = function(config) {
            return true;
        }
        
        this.ValidateTerrainConfig = function(config) {
            return true;
        }
        
        this.GetWorldEntities = function() {
            var configModule = Context.GetContext("CONFIGURATION_MODULE");
            HTTPNetworking.Fetch(configModule.worldURI + "/entities.json", "GotEntitiesConfig");
        }
        
        this.GetWorldTerrain = function() {
            var configModule = Context.GetContext("CONFIGURATION_MODULE");
            HTTPNetworking.Fetch(configModule.worldURI + "/terrain.json", "GotTerrainConfig");
        }

        this.ApplyWorldConfig = function(config) {
            var configModule = Context.GetContext("CONFIGURATION_MODULE");

            Logging.Log("Applying World Config...");

            configModule.GetWorldEntities();
            configModule.GetWorldTerrain();
        }
        
        this.ValidateWorldConfig = function(config) {
            return true;
        }
        
        this.GetEntityVariantByID = function(id, variantID) {
            var configModule = Context.GetContext("CONFIGURATION_MODULE");
            
            if (configModule.entitiesConfig == null) {
                Logging.LogError("MetaWorld->GetEntityVariantByID: Entities Config not set.");
                return null;
            }
            
            for (var entity in configModule.entitiesConfig) {
                if (configModule.entitiesConfig[entity].id != null) {
                    if (configModule.entitiesConfig[entity].id == id) {
                        if (configModule.entitiesConfig[entity].variants != null) {
                            for (var variant in configModule.entitiesConfig[entity].variants) {
                                if (configModule.entitiesConfig[entity].variants[variant].variant_id != null) {
                                    if (configModule.entitiesConfig[entity].variants[variant].variant_id == variantID) {
                                        return configModule.entitiesConfig[entity].variants[variant];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            return null;
        }

        this.LoadWorldConfig = function() {
            const configModule = Context.GetContext("CONFIGURATION_MODULE");

            GetWorldConfig(configModule.worldURI + "/world.json", "GotWorldConfig");
        }

        Context.DefineContext("CONFIGURATION_MODULE", this);

        Logging.Log("Configuration Module Initialized.");
    }
}

function GetWorldConfig(pathToWorldConfig, onConfigReceived) {
    HTTPNetworking.Fetch(pathToWorldConfig, onConfigReceived);
}

function GotWorldConfig(file) {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    
    if (file != null) {
        configModule.worldConfig = JSON.parse(file);
        Context.DefineContext("CONFIGURATION_MODULE", configModule);
        if (configModule.ValidateWorldConfig(configModule.worldConfig) != true) {
            Logging.LogError("MetaWorld->GotWorldConfig: Invalid World Config. Aborting.");
        } else {
            configModule.ApplyWorldConfig();
        }
    }
}

function GotEntitiesConfig(file) {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    
    if (file != null) {
        configModule.entitiesConfig = JSON.parse(file);
        Context.DefineContext("CONFIGURATION_MODULE", configModule);
        if (configModule.ValidateEntitiesConfig(configModule.entitiesConfig) != true) {
            Logging.LogError("MetaWorld->GotEntitiesConfig: Invalid Entities Config. Aborting.");
        } else {
            configModule.ApplyEntitiesConfig();
        }
    }
}

function GotTerrainConfig(file) {
    var configModule = Context.GetContext("CONFIGURATION_MODULE");
    
    if (file != null) {
        configModule.terrainConfig = JSON.parse(file);
        Context.DefineContext("CONFIGURATION_MODULE", configModule);
        if (configModule.ValidateTerrainConfig(configModule.terrainConfig) != true) {
            Logging.LogError("MetaWorld->GotTerrainConfig: Invalid Terrain Config. Aborting.");
        } else {
            configModule.ApplyTerrainConfig();
        }
    }
}