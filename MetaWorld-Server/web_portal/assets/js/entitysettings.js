let SERVERADDR = "http://localhost";
let SERVERPORT = 15530;

let entityTableBody = document.getElementById("entityTableBody");
let variantTableBody = document.getElementById("variantTableBody");
let entityIDInput = document.getElementById("entityIDInputInput");
let entityNameInput = document.getElementById("entityNameInputInput");
let variantIDInput = document.getElementById("variantIDInputInput");
let variantNameInput = document.getElementById("variantNameInputInput");
let displayNameInput = document.getElementById("displayNameInputInput");
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
        variant_id: variantIDInput.value
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