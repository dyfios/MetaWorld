let SERVERADDR = "http://localhost";
let SERVERPORT = 15530;

let entityTableBody = document.getElementById("entityTableBody");
let variantTableBody = document.getElementById("variantTableBody");
let entityIDInput = document.getElementById("entityIDInputInput");
let entityNameInput = document.getElementById("entityNameInputInput");
let variantIDInput = document.getElementById("variantIDInputInput");
let variantNameInput = document.getElementById("variantNameInputInput");
let displayNameInput = document.getElementById("displayNameInputInput");
let onCreateInput = document.getElementById("onCreateInputInput");
let onDestroyInput = document.getElementById("onDestroyInputInput");
let UpdateInput_0_25 = document.getElementById("0_25UpdateInputInput");
let UpdateInput_0_5 = document.getElementById("0_5UpdateInputInput");
let UpdateInput_1_0 = document.getElementById("1_0UpdateInputInput");
let UpdateInput_2_0 = document.getElementById("2_0UpdateInputInput");
let onPickupInput = document.getElementById("onPickupInputInput");
let onPlaceInput = document.getElementById("onPlaceInputInput");
let onTouchInput = document.getElementById("onTouchInputInput");
let onUntouchInput = document.getElementById("onUntouchInputInput");
let modelsDropdownButton = document.getElementById("modelsDropdownButton");
let modelsDropdown = document.getElementById("modelsDropdown");
let thumbnailsDropdownButton = document.getElementById("thumbnailsDropdownButton");
let thumbnailsDropdown = document.getElementById("thumbnailsDropdown");

let saveVariantButton = document.getElementById("saveVariantButton");
let removeVariantButton = document.getElementById("removeVariantButton");
let saveEntityButton = document.getElementById("saveEntityButton");
let newEntityButton = document.getElementById("newEntityButton");
let removeEntityButton = document.getElementById("removeEntityButton");

let entities = {};

let existingEntityName = "";
let existingEntityID = "";

async function getData(resource, queryParams = null) {
    req = SERVERADDR + ":" + SERVERPORT + "/" + resource;
    if (queryParams != null) {
        req = req + "?" + queryParams;
    }
    response = await fetch(req, {
        method: "GET"
    });
    
    const json = await response.json();
    return json;
}

async function postData(resource, body, queryParams = null) {
    req = SERVERADDR + ":" + SERVERPORT + "/" + resource;
    if (queryParams != null) {
        req = req + "?" + queryParams;
    }
    response = await fetch(req, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    });
    
    const json = await response.json();
    return json;
}

async function getEntitiesFromServer() {
    json = await getData("getentitylisting");

    entities = json;

    entityTableBody.innerHTML = "";
    for (const entity in json) {
        newRow = document.createElement('tr');
        entityTableBody.appendChild(newRow);

        newIDCell = document.createElement('th');
        newIDCell.innerHTML = json[entity].id;
        newRow.appendChild(newIDCell);

        newNameCell = document.createElement('td');
        newNameCell.innerHTML = entity;
        newRow.appendChild(newNameCell);

        newRow.addEventListener("click", () => {
            selectEntity(entity);
        });
    }

    if (Object.values(json).length > 0) {
        selectEntity(Object.keys(json)[0]);
    }
}

async function updateEntityOnServer() {
    updateEntityRequest = {
        "old-name": existingEntityName,
        "new-name": entityNameInput.value,
        "old-id": existingEntityID,
        "new-id": entityIDInput.value
    };
    
    res = await getData("updateentity", "request=" + JSON.stringify(updateEntityRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Entity successfully updated.");
        getEntitiesFromServer();
    }
    else {
        console.log("Entity failed to update.");
    }
}

async function createNewEntityOnServer() {
    newEntityRequest = {
        "name": entityNameInput.value,
        "id": entityIDInput.value
    };
    
    res = await getData("addentity", "request=" + JSON.stringify(newEntityRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Entity successfully updated.");
        getEntitiesFromServer();
        selectEntity("");
    }
    else {
        console.log("Entity failed to update.");
    }
}

async function removeEntityOnServer() {
    removeEntityRequest = {
        "entity-name": entityNameInput.value
    };
    
    res = await getData("removeentity", "request=" + JSON.stringify(removeEntityRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Entity successfully removed.");
        getEntitiesFromServer();
    }
    else {
        console.log("Entity failed to removed.");
    }
}

async function updateEntityVariantOnServer() {
    newVariant = {
        display_name: displayNameInput.value,
        model: modelsDropdownButton.textContent,
        thumbnail: thumbnailsDropdownButton.textContent,
        variant_id: variantIDInput.value,
        scripts: {
            on_create: onCreateInput.value,
            on_destroy: onDestroyInput.value,
            "0_25_update": UpdateInput_0_25.value,
            "0_5_update": UpdateInput_0_5.value,
            "1_0_update": UpdateInput_1_0.value,
            "2_0_update": UpdateInput_2_0.value,
            on_pickup: onPickupInput.value,
            on_place: onPlaceInput.value,
            on_touch: onTouchInput.value,
            on_untouch: onUntouchInput.value
        }
    };

    updateEntityVariantRequest = {
        "entity-name": entityNameInput.value,
        "variant-name": variantNameInput.value
    };
    
    res = await postData("setentityvariant", JSON.stringify(newVariant), "request=" + JSON.stringify(updateEntityVariantRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Entity variant successfully updated.");
        getEntitiesFromServer();
    }
    else {
        console.log("Entity variant failed to update.");
    }
}

async function removeEntityVariantOnServer() {
    removeEntityVariantRequest = {
        "entity-name": entityNameInput.value,
        "variant-name": variantNameInput.value
    };
    
    res = await getData("removeentityvariant", "request=" + JSON.stringify(removeEntityVariantRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Entity variant successfully removed.");
        getEntitiesFromServer();
    }
    else {
        console.log("Entity variant failed to removed.");
    }
}

async function selectVariant(entityName, variantName) {
    json = await getData("getmodellisting");
    json2 = await getData("getthumbnaillisting");
    variantIDInput.value = entities[entityName].variants[variantName]["variant_id"];
    variantNameInput.value = variantName;
    if (entities[entityName].variants[variantName]["scripts"] != null) {
        onCreateInput.value = entities[entityName].variants[variantName]["scripts"]["on_create"];
        onDestroyInput.value = entities[entityName].variants[variantName]["scripts"]["on_destroy"];
        UpdateInput_0_25.value = entities[entityName].variants[variantName]["scripts"]["0_25_update"];
        UpdateInput_0_5.value = entities[entityName].variants[variantName]["scripts"]["0_5_update"];
        UpdateInput_1_0.value = entities[entityName].variants[variantName]["scripts"]["1_0_update"];
        UpdateInput_2_0.value = entities[entityName].variants[variantName]["scripts"]["2_0_update"];
        onPickupInput.value = entities[entityName].variants[variantName]["scripts"]["on_pickup"];
        onPlaceInput.value = entities[entityName].variants[variantName]["scripts"]["on_place"];
        onTouchInput.value = entities[entityName].variants[variantName]["scripts"]["on_touch"];
        onUntouchInput.value = entities[entityName].variants[variantName]["scripts"]["on_untouch"];
    }

    modelsDropdownButton.textContent = entities[entityName].variants[variantName].model;

    modelsDropdown.innerHTML = "";
    for (const model in json) {
        newListItem = document.createElement('li');
        newA = document.createElement('a');
        newA.className = "dropdown-item";
        newA.onclick = function() {
            modelsDropdownButton.textContent = json[model];
        }
        newA.textContent = json[model];
        modelsDropdown.appendChild(newListItem);
        newListItem.appendChild(newA);
    }

    displayNameInput.value = entities[entityName].variants[variantName]["display_name"];

    thumbnailsDropdownButton.textContent = entities[entityName].variants[variantName].thumbnail;

    thumbnailsDropdown.innerHTML = "";
    for (const thumbnail in json2) {
        newListItem = document.createElement('li');
        newA = document.createElement('a');
        newA.className = "dropdown-item";
        newA.onclick = function() {
            thumbnailsDropdownButton.textContent = json2[thumbnail];
        }
        newA.textContent = json2[thumbnail];
        thumbnailsDropdown.appendChild(newListItem);
        newListItem.appendChild(newA);
    }
}

function selectEntity(entityName) {
    if (entityName != "") {
        entityIDInput.value = entities[entityName].id;
        entityNameInput.value = entityName;

        existingEntityID = entities[entityName].id;
        existingEntityName = entityName;
    }

    variantTableBody.innerHTML = "";
    if (entityName != "") {
        for (const variant in entities[entityName].variants) {
            newRow = document.createElement('tr');
            variantTableBody.appendChild(newRow);

            newIDCell = document.createElement('th');
            newIDCell.innerHTML = entities[entityName].variants[variant]["variant_id"];
            newRow.appendChild(newIDCell);

            newNameCell = document.createElement('td');
            newNameCell.innerHTML = variant;
            newRow.appendChild(newNameCell);

            newRow.addEventListener("click", () => {
                selectVariant(entityName, variant);
            });
        }

        if (Object.values(entities[entityName].variants).length > 0) {
            selectVariant(entityName, Object.keys(entities[entityName].variants)[0]);
        }
    }
}

saveVariantButton.onclick = function() {
    updateEntityVariantOnServer();
}

removeVariantButton.onclick = function() {
    removeEntityVariantOnServer();
}

saveEntityButton.onclick = function() {
    updateEntityOnServer();
}

newEntityButton.onclick = function() {
    createNewEntityOnServer();
}

removeEntityButton.onclick = function() {
    removeEntityOnServer();
}

getEntitiesFromServer();