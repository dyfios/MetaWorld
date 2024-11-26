function GotWorldConfig(file) {
    var context = Context.GetContext("WORLDCONFIGCONTEXT");
    
    if (file != null) {
        context.worldConfig = JSON.parse(file);
        Context.DefineContext("WORLDCONFIGCONTEXT", context);
        if (context.ValidateWorldConfig(context.worldConfig) != true) {
            Logging.LogError("MetaWorld->GotWorldConfig: Invalid World Config. Aborting.");
        } else {
            context.ApplyWorldConfig();
        }
    }
}

function GotEntitiesConfig(file) {
    var context = Context.GetContext("WORLDCONFIGCONTEXT");
    
    if (file != null) {
        context.entitiesConfig = JSON.parse(file);
        Context.DefineContext("WORLDCONFIGCONTEXT", context);
        if (context.ValidateEntitiesConfig(context.entitiesConfig) != true) {
            Logging.LogError("MetaWorld->GotEntitiesConfig: Invalid Entities Config. Aborting.");
        } else {
            context.ApplyEntitiesConfig();
        }
    }
}

function GotTerrainConfig(file) {
    var context = Context.GetContext("WORLDCONFIGCONTEXT");
    
    if (file != null) {
        context.terrainConfig = JSON.parse(file);
        Context.DefineContext("WORLDCONFIGCONTEXT", context);
        if (context.ValidateTerrainConfig(context.terrainConfig) != true) {
            Logging.LogError("MetaWorld->GotTerrainConfig: Invalid Terrain Config. Aborting.");
        } else {
            context.ApplyTerrainConfig();
        }
    }
}

class WorldConfiguration {
    constructor(worldURI) {
        this.worldURI = worldURI;
        this.worldConfig = null;
        this.entitiesConfig = null;
        
        this.ApplyEntitiesConfig = function() {
            var context = Context.GetContext("WORLDCONFIGCONTEXT");
            for (var entity in context.entitiesConfig) {
                if (context.entitiesConfig[entity].id == null) {
                    Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity config: " + entity + " missing id");
                }
                else {
                    WorldStorage.SetItem("METAWORLD.CONFIGURATION.ENTITYID." + context.entitiesConfig[entity].id, entity);
                }
                
                if (context.entitiesConfig[entity].variants == null) {
                    Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity config: " + entity + " missing variants");
                }
                
                for (var variant in context.entitiesConfig[entity].variants) {
                    if (context.entitiesConfig[entity].variants[variant].variant_id == null) {
                        Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: " + entity + ":" + variant + " missing variant_id");
                    }
                    else {
                        WorldStorage.SetItem("METAWORLD.CONFIGURATION.VARIANTID."
                            + context.entitiesConfig[entity].id + "." + context.entitiesConfig[entity].variants[variant].variant_id, variant);
                    }
                    
                    if (context.entitiesConfig[entity].variants[variant].model == null) {
                        Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: " + entity + ":" + variant + " missing model");
                    }
                    else if (context.entitiesConfig[entity].variants[variant].grid_size == null) {
                        Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: " + entity + ":" + variant + " missing grid_size");
                    }
                    else if (context.entitiesConfig[entity].variants[variant].grid_size.x == null ||
                        context.entitiesConfig[entity].variants[variant].grid_size.y == null ||
                        context.entitiesConfig[entity].variants[variant].grid_size.z == null) {
                        Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: " + entity + ":" + variant + " incomplete grid_size");
                    }
                    else if (context.entitiesConfig[entity].variants[variant].valid_orientations == null) {
                        Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: " + entity + ":" + variant + " missing valid_orientations");
                    }
                    else if (context.entitiesConfig[entity].variants[variant].display_name == null) {
                        Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: " + entity + ":" + variant + " missing display_name");
                    }
                    else if (context.entitiesConfig[entity].variants[variant].thumbnail == null) {
                        Logging.LogError("MetaWorld->ApplyEntitiesConfig: Invalid entity variant: " + entity + ":" + variant + " missing thumbnail");
                    }
                    else {
                        context.entitiesConfig[entity].variants[variant].model =
                            context.worldURI + "/" + context.worldConfig["entities-directory"] + "/"
                            + entity + "/" + context.entitiesConfig[entity].variants[variant].model;
                        context.entitiesConfig[entity].variants[variant].thumbnail =
                            context.worldURI + "/" + context.worldConfig["entities-directory"] + "/"
                            + entity + "/" + context.entitiesConfig[entity].variants[variant].thumbnail;
                    }
                    
                    for (var valid_orientation in context.entitiesConfig[entity].variants[variant].valid_orientations) {
                        var curr_orientation = context.entitiesConfig[entity].variants[variant].valid_orientations[valid_orientation];
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
                    
                    if (context.entitiesConfig[entity].variants[variant].model.startsWith("/") ||
                        context.entitiesConfig[entity].variants[variant].model[1] == ":") {
                        context.entitiesConfig[entity].variants[variant].model = "file://" + context.entitiesConfig[entity].variants[variant].model;
                    }
                }
            }
        }
        
        this.ApplyTerrainConfig = function() {
            var context = Context.GetContext("WORLDCONFIGCONTEXT");
            
            if (context.terrainConfig["grid-size"] === null) {
                Logging.LogError("MetaWorld->ApplyTerrainConfig: Invalid terrain config: missing grid-size");
            }
            
            if (context.terrainConfig.layers === null) {
                Logging.LogError("MetaWorld->ApplyTerrainConfig: Invalid terrain config: missing layers");
            }
            else {
                for (var terrainLayer in context.terrainConfig.layers) {
                    if (context.terrainConfig.layers[terrainLayer].layer == null) {
                        Logging.LogError("MetaWorld->ApplyTerrainConfig: Invalid terrain config: " + terrainLayer + " missing layer");
                    }
                    
                    if (context.terrainConfig.layers[terrainLayer].color_texture == null) {
                        Logging.LogError("MetaWorld->ApplyTerrainConfig: Invalid terrain config: " + terrainLayer + " missing color_texture");
                    }
                    else {
                        context.terrainConfig.layers[terrainLayer].color_texture = context.worldURI + "/" + context.worldConfig["terrain-directory"]
                            + "/" + context.terrainConfig.layers[terrainLayer].color_texture;
                    }
                    
                    if (context.terrainConfig.layers[terrainLayer].color_texture.startsWith("/") ||
                        context.terrainConfig.layers[terrainLayer].color_texture[1] == ":") {
                        context.terrainConfig.layers[terrainLayer].color_texture = "file://" + context.terrainConfig.layers[terrainLayer].color_texture;
                    }
                    
                    if (context.terrainConfig.layers[terrainLayer].normal_texture == null) {
                        Logging.LogError("MetaWorld->ApplyTerrainConfig: Invalid terrain config: " + terrainLayer + " missing normal_texture");
                    }
                    else {
                        context.terrainConfig.layers[terrainLayer].normal_texture = context.worldURI + "/" + context.worldConfig["terrain-directory"]
                            + "/" + context.terrainConfig.layers[terrainLayer].normal_texture;
                    }
                    
                    if (context.terrainConfig.layers[terrainLayer].normal_texture.startsWith("/") ||
                        context.terrainConfig.layers[terrainLayer].normal_texture[1] == ":") {
                        context.terrainConfig.layers[terrainLayer].normal_texture = "file://" + context.terrainConfig.layers[terrainLayer].normal_texture;
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
            var context = Context.GetContext("WORLDCONFIGCONTEXT");
            HTTPNetworking.Fetch(context.worldURI + "/" + context.worldConfig["entities-directory"] + "/entities.json", "GotEntitiesConfig");
        }
        
        this.GetWorldTerrain = function() {
            var context = Context.GetContext("WORLDCONFIGCONTEXT");
            HTTPNetworking.Fetch(context.worldURI + "/" + context.worldConfig["terrain-directory"] + "/terrain.json", "GotTerrainConfig");
        }
        
        this.ApplyWorldConfig = function(config) {
            var context = Context.GetContext("WORLDCONFIGCONTEXT");
            context.GetWorldEntities();
            context.GetWorldTerrain();
        }
        
        this.ValidateWorldConfig = function(config) {
            return true;
        }
        
        this.GetWorldConfig = function(pathToWorldConfig, onConfigReceived) {
            HTTPNetworking.Fetch(pathToWorldConfig, onConfigReceived);
        }
        
        this.GetEntityVariantByID = function(id, variantID) {
            var context = Context.GetContext("WORLDCONFIGCONTEXT");
            
            if (context.entitiesConfig == null) {
                Logging.LogError("MetaWorld->GetEntityVariantByID: Entities Config not set.");
                return null;
            }
            
            for (var entity in context.entitiesConfig) {
                if (context.entitiesConfig[entity].id != null) {
                    if (context.entitiesConfig[entity].id == id) {
                        if (context.entitiesConfig[entity].variants != null) {
                            for (var variant in context.entitiesConfig[entity].variants) {
                                if (context.entitiesConfig[entity].variants[variant].variant_id != null) {
                                    if (context.entitiesConfig[entity].variants[variant].variant_id == variantID) {
                                        return context.entitiesConfig[entity].variants[variant];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            return null;
        }
        
        Context.DefineContext("WORLDCONFIGCONTEXT", this);
        this.GetWorldConfig(this.worldURI + "/world.json", "GotWorldConfig");
        Context.DefineContext("WORLDCONFIGCONTEXT", this);
    }
}