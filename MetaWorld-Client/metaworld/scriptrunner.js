function AddScriptEntity(entity, scripts) {
    var scriptContext = Context.GetContext("ScriptRunner");

    var newScriptID = entity.id;

    scriptContext["Scripts"][newScriptID] = [ entity, scripts ];

    Context.DefineContext("ScriptRunner", scriptContext);
}

function RunOnCreateScript(id) {
    var scriptContext = Context.GetContext("ScriptRunner");

    if (scriptContext == null) {
        return;
    }

    if (scriptContext["Scripts"] == null) {
        return;
    }
    
    if (scriptContext["Scripts"][id] == null) {
        return;
    }

    if (scriptContext["Scripts"][id][1]["on_create"] == null) {
        return;
    }

    var entity = scriptContext["Scripts"][id][0];
    var script = scriptContext["Scripts"][id][1]["on_create"];

    Context.DefineContext("METAWORLD.SCRIPT_ENTITY", entity);
    Scripting.RunScript(script);
}

function RunOnDestroyScript(id) {
    var scriptContext = Context.GetContext("ScriptRunner");

    if (scriptContext == null) {
        return;
    }

    if (scriptContext["Scripts"] == null) {
        return;
    }
    
    if (scriptContext["Scripts"][id] == null) {
        return;
    }

    if (scriptContext["Scripts"][id][1]["on_destroy"] == null) {
        return;
    }

    var entity = scriptContext["Scripts"][id][0];
    var script = scriptContext["Scripts"][id][1]["on_destroy"];

    Context.DefineContext("METAWORLD.SCRIPT_ENTITY", entity);
    Scripting.RunScript(script);
}

function RunOnPickupScript(id) {
    var scriptContext = Context.GetContext("ScriptRunner");

    if (scriptContext == null) {
        return;
    }

    if (scriptContext["Scripts"] == null) {
        return;
    }
    
    if (scriptContext["Scripts"][id] == null) {
        return;
    }

    if (scriptContext["Scripts"][id][1]["on_pickup"] == null) {
        return;
    }

    var entity = scriptContext["Scripts"][id][0];
    var script = scriptContext["Scripts"][id][1]["on_pickup"];

    Context.DefineContext("METAWORLD.SCRIPT_ENTITY", entity);
    Scripting.RunScript(script);
}

function RunOnPlaceScript(id) {
    var scriptContext = Context.GetContext("ScriptRunner");

    if (scriptContext == null) {
        return;
    }

    if (scriptContext["Scripts"] == null) {
        return;
    }
    
    if (scriptContext["Scripts"][id] == null) {
        return;
    }

    if (scriptContext["Scripts"][id][1]["on_place"] == null) {
        return;
    }

    var entity = scriptContext["Scripts"][id][0];
    var script = scriptContext["Scripts"][id][1]["on_place"];

    Context.DefineContext("METAWORLD.SCRIPT_ENTITY", entity);
    Scripting.RunScript(script);
}

function RunOnTouchScript(id) {
    var scriptContext = Context.GetContext("ScriptRunner");

    if (scriptContext == null) {
        return;
    }

    if (scriptContext["Scripts"] == null) {
        return;
    }
    
    if (scriptContext["Scripts"][id] == null) {
        return;
    }

    if (scriptContext["Scripts"][id][1]["on_touch"] == null) {
        return;
    }

    var entity = scriptContext["Scripts"][id][0];
    var script = scriptContext["Scripts"][id][1]["on_touch"];

    Context.DefineContext("METAWORLD.SCRIPT_ENTITY", entity);
    Scripting.RunScript(script);
}

function RunOnUntouchScript(id) {
    var scriptContext = Context.GetContext("ScriptRunner");

    if (scriptContext == null) {
        return;
    }

    if (scriptContext["Scripts"] == null) {
        return;
    }
    
    if (scriptContext["Scripts"][id] == null) {
        return;
    }

    if (scriptContext["Scripts"][id][1]["on_untouch"] == null) {
        return;
    }

    var entity = scriptContext["Scripts"][id][0];
    var script = scriptContext["Scripts"][id][1]["on_untouch"];

    Context.DefineContext("METAWORLD.SCRIPT_ENTITY", entity);
    Scripting.RunScript(script);
}

function RemoveIntervalScripts(id) {
    Remove0_25IntervalScript(id);
    Remove0_5IntervalScript(id);
    Remove1_0IntervalScript(id);
    Remove2_0IntervalScript(id);
}

function Handle0_25IntervalScripts() {
    var scriptContext = Context.GetContext("ScriptRunner");

    if (scriptContext == null) {
        return;
    }

    for (var scriptID in scriptContext["0_25IntervalScripts"]) {
        var script = scriptContext["0_25IntervalScripts"][scriptID];
        var entity = script[0];
        var scriptFunction = script[1];

        Context.DefineContext("METAWORLD.UPDATE_ENTITY", entity);
        Scripting.RunScript(scriptFunction);
    }
}

function Handle0_5IntervalScripts() {
    var scriptContext = Context.GetContext("ScriptRunner");

    if (scriptContext == null) {
        return;
    }

    for (var scriptID in scriptContext["0_5IntervalScripts"]) {
        var script = scriptContext["0_5IntervalScripts"][scriptID];
        var entity = script[0];
        var scriptFunction = script[1];

        Context.DefineContext("METAWORLD.UPDATE_ENTITY", entity);
        Scripting.RunScript(scriptFunction);
    }
}

function Handle1_0IntervalScripts() {
    var scriptContext = Context.GetContext("ScriptRunner");

    if (scriptContext == null) {
        return;
    }

    for (var scriptID in scriptContext["1_0IntervalScripts"]) {
        var script = scriptContext["1_0IntervalScripts"][scriptID];
        var entity = script[0];
        var scriptFunction = script[1];

        Context.DefineContext("METAWORLD.UPDATE_ENTITY", entity);
        Scripting.RunScript(scriptFunction);
    }
}

function Handle2_0IntervalScripts() {
    var scriptContext = Context.GetContext("ScriptRunner");

    if (scriptContext == null) {
        return;
    }

    for (var scriptID in scriptContext["2_0IntervalScripts"]) {
        var script = scriptContext["2_0IntervalScripts"][scriptID];
        var entity = script[0];
        var scriptFunction = script[1];

        Context.DefineContext("METAWORLD.UPDATE_ENTITY", entity);
        Scripting.RunScript(scriptFunction);
    }
}

function Add0_25IntervalScript(entity, script) {
    var scriptContext = Context.GetContext("ScriptRunner");

    var newScriptID = entity.id;

    scriptContext["0_25IntervalScripts"][newScriptID] = [ entity, script ];

    Context.DefineContext("ScriptRunner", scriptContext);
}

function Remove0_25IntervalScript(id) {
    var scriptContext = Context.GetContext("ScriptRunner");

    var script = scriptContext["0_25IntervalScripts"][id];
    if (script == null) {
        return;
    }

    delete scriptContext["0_25IntervalScripts"][id];

    Context.DefineContext("ScriptRunner", scriptContext);
}

function Add0_5IntervalScript(entity, script) {
    var scriptContext = Context.GetContext("ScriptRunner");

    var newScriptID = entity.id;

    scriptContext["0_5IntervalScripts"][newScriptID] = [ entity, script ];

    Context.DefineContext("ScriptRunner", scriptContext);
}

function Remove0_5IntervalScript(id) {
    var scriptContext = Context.GetContext("ScriptRunner");

    var script = scriptContext["0_5IntervalScripts"][id];
    if (script == null) {
        return;
    }

    delete scriptContext["0_5IntervalScripts"][id];

    Context.DefineContext("ScriptRunner", scriptContext);
}

function Add1_0IntervalScript(entity, script) {
    var scriptContext = Context.GetContext("ScriptRunner");

    var newScriptID = entity.id;

    scriptContext["1_0IntervalScripts"][newScriptID] = [ entity, script ];

    Context.DefineContext("ScriptRunner", scriptContext);
}

function Remove1_0IntervalScript(id) {
    var scriptContext = Context.GetContext("ScriptRunner");

    var script = scriptContext["1_0IntervalScripts"][id];
    if (script == null) {
        return;
    }

    delete scriptContext["1_0IntervalScripts"][id];

    Context.DefineContext("ScriptRunner", scriptContext);
}

function Add2_0IntervalScript(entity, script) {
    var scriptContext = Context.GetContext("ScriptRunner");

    var newScriptID = entity.id;

    scriptContext["2_0IntervalScripts"][newScriptID] = [ entity, script ];

    Context.DefineContext("ScriptRunner", scriptContext);
}

function Remove2_0IntervalScript(id) {
    var scriptContext = Context.GetContext("ScriptRunner");

    var script = scriptContext["2_0IntervalScripts"][id];
    if (script == null) {
        return;
    }

    delete scriptContext["2_0IntervalScripts"][id];

    Context.DefineContext("ScriptRunner", scriptContext);
}

class ScriptRunner {
    constructor() {
        var scriptContext = {
            "Scripts": {},
            "0_25IntervalScripts": {},
            "0_5IntervalScripts": {},
            "1_0IntervalScripts": {},
            "2_0IntervalScripts": {}
        }

        Context.DefineContext("ScriptRunner", scriptContext);

        Time.SetInterval("Handle0_25IntervalScripts();", 0.25);
        Time.SetInterval("Handle0_5IntervalScripts();", 0.5);
        Time.SetInterval("Handle1_0IntervalScripts();", 1);
        Time.SetInterval("Handle2_0IntervalScripts();", 2);
    }
}