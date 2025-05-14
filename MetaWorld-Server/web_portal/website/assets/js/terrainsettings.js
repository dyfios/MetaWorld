let SERVERADDR = "http://localhost";
let SERVERPORT = 15530;

let biomeTableBody = document.getElementById("biomeTableBody");
let terrainLayerTableBody = document.getElementById("terrainLayerTableBody");
let generationLayerTableBody = document.getElementById("generationLayerTableBody");
let smallFoliageTableBody = document.getElementById("smallFoliageTableBody");
let mediumFoliageTableBody = document.getElementById("mediumFoliageTableBody");
let largeFoliageTableBody = document.getElementById("largeFoliageTableBody");
let biomeIDInput = document.getElementById("biomeIDInputInput");
let biomeNameInput = document.getElementById("biomeNameInputInput");
let temperatureInput = document.getElementById("temperatureInputInput");
let moistureInput = document.getElementById("moistureInputInput");
let terrainVariabilityInput = document.getElementById("terrainVariabilityInputInput");
let layerIDInput = document.getElementById("layerIDInputInput");
let generationLayerIDInput = document.getElementById("generationLayerIDInputInput");
let layerNameInput = document.getElementById("layerNameInputInput");
let maxHeightInput = document.getElementById("maxHeightInputInput");
let smallFoliageInput = document.getElementById("smallFoliageInputInput");
let mediumFoliageInput = document.getElementById("mediumFoliageInputInput");
let largeFoliageInput = document.getElementById("largeFoliageInputInput");
let colorTexturesDropdown = document.getElementById("colorTexturesDropdown");
let normalTexturesDropdown = document.getElementById("normalTexturesDropdown");
let layerDropdown = document.getElementById("layerDropdown");

let saveBiomePropertiesButton = document.getElementById("saveBiomePropertiesButton");
let saveTerrainLayerButton = document.getElementById("saveTerrainLayerButton");
let saveGenerationLayerButton = document.getElementById("saveGenerationLayerButton");
let saveFoliageButton = document.getElementById("saveFoliageButton");

let biomeTableRemoveButton = document.getElementById("biomeTableRemoveButton");
let terrainLayerTableAddButton = document.getElementById("terrainLayerTableAddButton");
let terrainLayerTableRemoveButton = document.getElementById("terrainLayerTableRemoveButton");
let generationLayerTableAddButton = document.getElementById("generationLayerTableAddButton");
let generationLayerTableRemoveButton = document.getElementById("generationLayerTableRemoveButton");
let smallFoliageTableAddButton = document.getElementById("smallFoliageTableAddButton");
let smallFoliageTableRemoveButton = document.getElementById("smallFoliageTableRemoveButton");
let mediumFoliageTableAddButton = document.getElementById("mediumFoliageTableAddButton");
let mediumFoliageTableRemoveButton = document.getElementById("mediumFoliageTableRemoveButton");
let largeFoliageTableAddButton = document.getElementById("largeFoliageTableAddButton");
let largeFoliageTableRemoveButton = document.getElementById("largeFoliageTableRemoveButton");

let biomes = {};
let terrainLayers = {};
let generationLayers = {};

let existingBiomeID = "";
let existingBiomeName = "";

let existingLayerID = "";
let existingLayerName = "";

let existingGenerationLayerID = 0;
let existingGenerationLayerLayer = 0;

let selectedSmallEntityID = 0;
let selectedSmallEntityVariant = 0;
let selectedMediumEntityID = 0;
let selectedMediumEntityVariant = 0;
let selectedLargeEntityID = 0;
let selectedLargeEntityVariant = 0;

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

async function getTerrainFromServer() {
    json = await getData("getbiomelisting");

    biomes = json["biomes"];

    biomeTableBody.innerHTML = "";
    for (biome in json["biomes"]) {
        const biomeID = biome;
        const biomeName = json["biomes"][biome]["name"];

        newRow = document.createElement('tr');
        biomeTableBody.appendChild(newRow);

        newIDCell = document.createElement('th');
        newIDCell.innerHTML = biomeID;
        newRow.appendChild(newIDCell);

        newNameCell = document.createElement('td');
        newNameCell.innerHTML = biomeName;
        newRow.appendChild(newNameCell);

        newRow.addEventListener("click", () => {
            selectBiome(biomeID);
        });
    }
    
    if (Object.values(json["biomes"]).length > 0) {
        selectBiome(0);
    }
}

async function removeBiomeOnServer() {
    removeBiomeRequest = {
        "id": biomeIDInput.value
    };
    
    res = await getData("removebiome", "request=" + JSON.stringify(removeBiomeRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Biome successfully removed.");
        getTerrainFromServer();
    }
    else {
        console.log("Biome failed to removed.");
    }
}

async function updateBiomePropertiesOnServer() {
    newProperties = {
        "oldid": existingBiomeID,
        "oldname": existingBiomeName,
        "id": biomeIDInput.value,
        "name": biomeNameInput.value,
        "temperature": temperatureInput.value,
        "moisture": moistureInput.value, 
        "terrain-variability": terrainVariabilityInput.value
    };
    
    res = await getData("updatebiomeproperties", "newproperties=" + JSON.stringify(newProperties));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Biome properties successfully updated.");
    }
    else {
        console.log("Biome properties failed to update.");
    }
}

async function updateTerrainLayerOnServer() {
    newProperties = {
        "biomeid": existingBiomeID,
        "biomename": existingBiomeName,
        "oldid": existingLayerID,
        "oldname": existingLayerName,
        "id": layerIDInput.value,
        "layername": layerNameInput.value,
        "color-texture": colorTexturesDropdownButton.textContent,
        "normal-texture": normalTexturesDropdownButton.textContent
    };
    
    res = await getData("updatebiometerrainlayer", "newproperties=" + JSON.stringify(newProperties));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Terrain layer successfully updated.");
    }
    else {
        console.log("Terrain layer failed to update.");
    }
}

async function addTerrainLayerOnServer() {
    newProperties = {
        "biomeid": existingBiomeID,
        "biomename": existingBiomeName,
        "id": layerIDInput.value,
        "layername": layerNameInput.value,
        "color-texture": colorTexturesDropdownButton.textContent,
        "normal-texture": normalTexturesDropdownButton.textContent
    };
    
    res = await getData("addbiometerrainlayer", "newproperties=" + JSON.stringify(newProperties));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Terrain layer successfully added.");
    }
    else {
        console.log("Terrain layer failed to added.");
    }
}

async function removeTerrainLayerOnServer() {
    newProperties = {
        "id": layerIDInput.value,
        "layername": layerNameInput.value
    };
    
    res = await getData("removebiometerrainlayer", "properties=" + JSON.stringify(newProperties));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Terrain layer successfully removed.");
    }
    else {
        console.log("Terrain layer failed to removed.");
    }
}

async function updateGenerationLayerOnServer() {
    newProperties = {
        "biomeid": existingBiomeID,
        "biomename": existingBiomeName,
        "oldgenerationlayer": existingGenerationLayerID,
        "generationlayer": generationLayerIDInput.value,
        "terrainlayer": existingGenerationLayerLayer,
        "maxheight": maxHeightInput.value
    };
    
    res = await getData("updatebiomegenerationlayer", "newproperties=" + JSON.stringify(newProperties));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Generation layer successfully updated.");
    }
    else {
        console.log("Generation layer failed to update.");
    }
}

async function addGenerationLayerOnServer() {
    newProperties = {
        "biomeid": existingBiomeID,
        "biomename": existingBiomeName,
        "generationlayer": generationLayerIDInput.value,
        "terrainlayer": existingGenerationLayerLayer,
        "maxheight": maxHeightInput.value
    };
    
    res = await getData("addbiomegenerationlayer", "newproperties=" + JSON.stringify(newProperties));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Generation layer successfully added.");
    }
    else {
        console.log("Generation layer failed to added.");
    }
}

async function removeGenerationLayerOnServer() {
    newProperties = {
        "biomeid": existingBiomeID,
        "biomename": existingBiomeName,
        "generationlayer": generationLayerIDInput.value
    };
    
    res = await getData("removebiomegenerationlayer", "properties=" + JSON.stringify(newProperties));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Generation layer successfully removed.");
    }
    else {
        console.log("Generation layer failed to removed.");
    }
}

async function updateFoliageOnServer() {
    entityJSON = await getData("getentitylisting");

    newProperties = {
        "biomeid": existingBiomeID,
        "biomename": existingBiomeName,
        "smalllikelihood": smallFoliageInput.value,
        "mediumlikelihood": mediumFoliageInput.value,
        "largelikelihood": largeFoliageInput.value
    };
    
    smallFoliageEntities = {};
    for (let i = 0; i < smallFoliageTableBody.children.length; i++) {
        foliageEntityLabelText = smallFoliageTableBody.childNodes[i].querySelector("button").innerText;
        foliageEntityLabelElements = foliageEntityLabelText.split(":");
        idToUse = entityJSON[foliageEntityLabelElements[0]].id;
        variantIDToUse = entityJSON[foliageEntityLabelElements[0]].variants[foliageEntityLabelElements[1]]["variant_id"];
        foliageEntityProportionValue = smallFoliageTableBody.childNodes[i].querySelector("input").value;
        smallFoliageEntities[foliageEntityLabelText] = {
            "entity-id": idToUse,
            "variant-id": variantIDToUse,
            "proportion": foliageEntityProportionValue
        };
    }

    mediumFoliageEntities = {};
    for (let i = 0; i < mediumFoliageTableBody.children.length; i++) {
        foliageEntityLabelText = mediumFoliageTableBody.childNodes[i].querySelector("button").innerText;
        foliageEntityLabelElements = foliageEntityLabelText.split(":");
        idToUse = entityJSON[foliageEntityLabelElements[0]].id;
        variantIDToUse = entityJSON[foliageEntityLabelElements[0]].variants[foliageEntityLabelElements[1]]["variant_id"];
        foliageEntityProportionValue = mediumFoliageTableBody.childNodes[i].querySelector("input").value;
        mediumFoliageEntities[foliageEntityLabelText] = {
            "entity-id": idToUse,
            "variant-id": variantIDToUse,
            "proportion": foliageEntityProportionValue
        };
    }

    largeFoliageEntities = {};
    for (let i = 0; i < largeFoliageTableBody.children.length; i++) {
        foliageEntityLabelText = largeFoliageTableBody.childNodes[i].querySelector("button").innerText;
        foliageEntityLabelElements = foliageEntityLabelText.split(":");
        idToUse = entityJSON[foliageEntityLabelElements[0]].id;
        variantIDToUse = entityJSON[foliageEntityLabelElements[0]].variants[foliageEntityLabelElements[1]]["variant_id"];
        foliageEntityProportionValue = largeFoliageTableBody.childNodes[i].querySelector("input").value;
        largeFoliageEntities[foliageEntityLabelText] = {
            "entity-id": idToUse,
            "variant-id": variantIDToUse,
            "proportion": foliageEntityProportionValue
        };
    }

    foliageData = {
        "small-flora-entities": smallFoliageEntities,
        "medium-flora-entities": mediumFoliageEntities,
        "large-flora-entities": largeFoliageEntities
    };

    res = await postData("updatebiomefoliage", JSON.stringify(foliageData), "newproperties=" + JSON.stringify(newProperties));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Foliage successfully updated.");
    }
    else {
        console.log("Foliage failed to update.");
    }
}

async function addSmallFoliageOnServer() {
    const newRow = document.createElement('tr');
    smallFoliageTableBody.appendChild(newRow);

    newRowCell = document.createElement('th');
    newRow.appendChild(newRowCell);

    newDiv = document.createElement('div');
    newDiv.className = "dropdown-mb3";
    newRowCell.appendChild(newDiv);

    const newBtn = document.createElement('button');
    newBtn.className = "btn btn-secondary dropdown-toggle";
    newBtn.type = "button";
    newBtn.setAttribute("data-bs-toggle", "dropdown");
    newBtn.setAttribute("aria-expanded", "false");

    newDiv.appendChild(newBtn);

    newUL = document.createElement('ul');
    newUL.className = "dropdown-menu";
    newDiv.appendChild(newUL);

    for (const entity in entityJSON) {
        for (const variant in entityJSON[entity].variants) {
            newListItem = document.createElement('li');
            newA = document.createElement('a');
            newA.className = "dropdown-item";
            newA.textContent = entity + ":" + variant;
            newUL.appendChild(newListItem);
            newA.onclick = function() {
                newBtn.innerHTML = entity + ":" + variant;
            }
            newListItem.appendChild(newA);
        }
    }

    newTD = document.createElement('td');
    newRow.appendChild(newTD);

    newInput = document.createElement('input');
    newInput.type = "number";
    newInput.min = "0";
    newTD.appendChild(newInput);
}

async function removeSmallFoliageOnServer() {
    for (let i = 0; i < smallFoliageTableBody.children.length; i++) {
        foliageEntityLabelText = smallFoliageTableBody.childNodes[i].querySelector("button").innerText;
        foliageEntityLabelElements = foliageEntityLabelText.split(":");
        idToUse = entityJSON[foliageEntityLabelElements[0]].id;
        variantIDToUse = entityJSON[foliageEntityLabelElements[0]].variants[foliageEntityLabelElements[1]]["variant_id"];
        foliageEntityProportionValue = smallFoliageTableBody.childNodes[i].querySelector("input").value;
        if (idToUse == selectedSmallEntityID && variantIDToUse == selectedSmallEntityVariant) {
            smallFoliageTableBody.childNodes[i].remove();
        }
    }
}

async function addMediumFoliageOnServer() {
    const newRow = document.createElement('tr');
    mediumFoliageTableBody.appendChild(newRow);

    newRowCell = document.createElement('th');
    newRow.appendChild(newRowCell);

    newDiv = document.createElement('div');
    newDiv.className = "dropdown-mb3";
    newRowCell.appendChild(newDiv);

    const newBtn = document.createElement('button');
    newBtn.className = "btn btn-secondary dropdown-toggle";
    newBtn.type = "button";
    newBtn.setAttribute("data-bs-toggle", "dropdown");
    newBtn.setAttribute("aria-expanded", "false");

    newDiv.appendChild(newBtn);

    newUL = document.createElement('ul');
    newUL.className = "dropdown-menu";
    newDiv.appendChild(newUL);

    for (const entity in entityJSON) {
        for (const variant in entityJSON[entity].variants) {
            newListItem = document.createElement('li');
            newA = document.createElement('a');
            newA.className = "dropdown-item";
            newA.textContent = entity + ":" + variant;
            newUL.appendChild(newListItem);
            newA.onclick = function() {
                newBtn.innerHTML = entity + ":" + variant;
            }
            newListItem.appendChild(newA);
        }
    }

    newTD = document.createElement('td');
    newRow.appendChild(newTD);

    newInput = document.createElement('input');
    newInput.type = "number";
    newInput.min = "0";
    newTD.appendChild(newInput);
}

async function removeMediumFoliageOnServer() {
    for (let i = 0; i < mediumFoliageTableBody.children.length; i++) {
        foliageEntityLabelText = mediumFoliageTableBody.childNodes[i].querySelector("button").innerText;
        foliageEntityLabelElements = foliageEntityLabelText.split(":");
        idToUse = entityJSON[foliageEntityLabelElements[0]].id;
        variantIDToUse = entityJSON[foliageEntityLabelElements[0]].variants[foliageEntityLabelElements[1]]["variant_id"];
        foliageEntityProportionValue = mediumFoliageTableBody.childNodes[i].querySelector("input").value;
        if (idToUse == selectedMediumEntityID && variantIDToUse == selectedMediumEntityVariant) {
            mediumFoliageTableBody.childNodes[i].remove();
        }
    }
}

async function addLargeFoliageOnServer() {
    const newRow = document.createElement('tr');
    largeFoliageTableBody.appendChild(newRow);

    newRowCell = document.createElement('th');
    newRow.appendChild(newRowCell);

    newDiv = document.createElement('div');
    newDiv.className = "dropdown-mb3";
    newRowCell.appendChild(newDiv);

    const newBtn = document.createElement('button');
    newBtn.className = "btn btn-secondary dropdown-toggle";
    newBtn.type = "button";
    newBtn.setAttribute("data-bs-toggle", "dropdown");
    newBtn.setAttribute("aria-expanded", "false");

    newDiv.appendChild(newBtn);

    newUL = document.createElement('ul');
    newUL.className = "dropdown-menu";
    newDiv.appendChild(newUL);

    for (const entity in entityJSON) {
        for (const variant in entityJSON[entity].variants) {
            newListItem = document.createElement('li');
            newA = document.createElement('a');
            newA.className = "dropdown-item";
            newA.textContent = entity + ":" + variant;
            newUL.appendChild(newListItem);
            newA.onclick = function() {
                newBtn.innerHTML = entity + ":" + variant;
            }
            newListItem.appendChild(newA);
        }
    }

    newTD = document.createElement('td');
    newRow.appendChild(newTD);

    newInput = document.createElement('input');
    newInput.type = "number";
    newInput.min = "0";
    newTD.appendChild(newInput);
}

async function removeLargeFoliageOnServer() {
    for (let i = 0; i < largeFoliageTableBody.children.length; i++) {
        foliageEntityLabelText = largeFoliageTableBody.childNodes[i].querySelector("button").innerText;
        foliageEntityLabelElements = foliageEntityLabelText.split(":");
        idToUse = entityJSON[foliageEntityLabelElements[0]].id;
        variantIDToUse = entityJSON[foliageEntityLabelElements[0]].variants[foliageEntityLabelElements[1]]["variant_id"];
        foliageEntityProportionValue = largeFoliageTableBody.childNodes[i].querySelector("input").value;
        if (idToUse == selectedLargeEntityID && variantIDToUse == selectedLargeEntityVariant) {
            largeFoliageTableBody.childNodes[i].remove();
        }
    }
}

async function selectTerrainLayer(layerName) {
    json = await getData("gettexturelisting");
    colorTexturesDropdown.innerHTML = "";
    colorTexturesDropdownButton.textContent = terrainLayers[layerName]["color_texture"];
    normalTexturesDropdownButton.textContent = terrainLayers[layerName]["normal_texture"];

    layerIDInput.value = terrainLayers[layerName].layer;
    layerNameInput.value = layerName;

    existingLayerID = terrainLayers[layerName].layer;
    existingLayerName = layerName;

    for (const texture in json) {
        // Color Texture.
        newListItem = document.createElement('li');
        newA = document.createElement('a');
        newA.className = "dropdown-item";
        newA.onclick = function() {
            colorTexturesDropdownButton.textContent = json[texture];
        }
        newA.textContent = json[texture];
        colorTexturesDropdown.appendChild(newListItem);
        newListItem.appendChild(newA);

        // Normal Texture.
        newListItem = document.createElement('li');
        newA = document.createElement('a');
        newA.className = "dropdown-item";
        newA.onclick = function() {
            normalTexturesDropdownButton.textContent = json[texture];
        }
        newA.textContent = json[texture];
        normalTexturesDropdown.appendChild(newListItem);
        newListItem.appendChild(newA);
    }
}

async function selectGenerationLayer(layerID) {
    generationLayerIDInput.value = layerID;
    maxHeightInput.value = generationLayers[layerID]["max-height"];

    existingGenerationLayerID = layerID;

    layerDropdown.innerHTML = "";
    layerDropdownButton.textContent = generationLayers[layerID]["layer"]
        + " - " + Object.keys(terrainLayers)[generationLayers[layerID]["layer"]];
    existingGenerationLayerLayer = generationLayers[layerID]["layer"];
    for (const layer in terrainLayers) {
        newListItem = document.createElement('li');
        newA = document.createElement('a');
        newA.className = "dropdown-item";
        newA.onclick = function() {
            layerDropdownButton.textContent = terrainLayers[layer]["layer"] + " - " + layer;
            existingGenerationLayerLayer = terrainLayers[layer]["layer"];
        }
        newA.textContent = terrainLayers[layer]["layer"] + " - " + layer;
        layerDropdown.appendChild(newListItem);
        newListItem.appendChild(newA);
    }
}

async function selectBiome(biomeID) {
    entityJSON = await getData("getentitylisting");

    terrainLayerTableBody.innerHTML = "";
    generationLayerTableBody.innerHTML = "";
    biomeIDInput.value = biomeID;
    biomeNameInput.value = biomes[biomeID].name;
    temperatureInput.value = biomes[biomeID].temperature;
    moistureInput.value = biomes[biomeID].moisture;
    terrainVariabilityInput.value = biomes[biomeID]["terrain-variability"];

    existingBiomeID = biomeID;
    existingBiomeName = biomes[biomeID].name;

    terrainLayers = biomes[biomeID]["terrain-materials"];
    for (const terrainMaterial in terrainLayers) {
        const layerID = terrainLayers[terrainMaterial].layer;

        newRow = document.createElement('tr');
        terrainLayerTableBody.appendChild(newRow);

        newIDCell = document.createElement('th');
        newIDCell.innerHTML = layerID;
        newRow.appendChild(newIDCell);

        newNameCell = document.createElement('td');
        newNameCell.innerHTML = terrainMaterial;
        newRow.appendChild(newNameCell);

        newRow.addEventListener("click", () => {
            selectTerrainLayer(terrainMaterial);
        });
    }

    generationLayers = biomes[biomeID]["terrain-layers"];
    for (const generationLayer in generationLayers) {
        newRow = document.createElement('tr');
        generationLayerTableBody.appendChild(newRow);

        newIDCell = document.createElement('th');
        newIDCell.innerHTML = generationLayer;
        newRow.appendChild(newIDCell);

        newRow.addEventListener("click", () => {
            selectGenerationLayer(generationLayer);
        });
    }

    if (Object.values(biomes[biomeID]["terrain-materials"]).length > 0) {
        selectTerrainLayer(Object.keys(biomes[biomeID]["terrain-materials"])[0]);
    }

    if (Object.values(biomes[biomeID]["terrain-layers"]).length > 0) {
        selectGenerationLayer(0);
    }

    smallFoliageInput.value = biomes[biomeID]["small-flora"];
    mediumFoliageInput.value = biomes[biomeID]["medium-flora"];
    largeFoliageInput.value = biomes[biomeID]["large-flora"];

    smallFoliageTableBody.innerHTML = "";
    for (const floraEntity in biomes[biomeID]["small-flora-entities"]) {
        const entityID = biomes[biomeID]["small-flora-entities"][floraEntity]["entity-id"];
        const variantID = biomes[biomeID]["small-flora-entities"][floraEntity]["variant-id"];

        const newRow = document.createElement('tr');
        smallFoliageTableBody.appendChild(newRow);

        newRowCell = document.createElement('th');
        newRow.appendChild(newRowCell);

        newDiv = document.createElement('div');
        newDiv.className = "dropdown-mb3";
        newRowCell.appendChild(newDiv);

        const newBtn = document.createElement('button');
        newBtn.className = "btn btn-secondary dropdown-toggle";
        newBtn.type = "button";
        newBtn.setAttribute("data-bs-toggle", "dropdown");
        newBtn.setAttribute("aria-expanded", "false");
        newRow.onclick = function() {
            selectedSmallEntityID = entityID;
            selectedSmallEntityVariant = variantID;
        }
        

        idx = 0;
        for (val in Object.values(entityJSON)) {
            if (entityID == Object.values(entityJSON)[val].id) {
                varidx = 0
                for (varval in Object.values(Object.values(entityJSON)[val].variants)) {
                    if (Object.values(Object.values(entityJSON)[val].variants)[varval]["variant_id"] == variantID) {
                        newBtn.innerHTML = Object.keys(entityJSON)[idx]
                            + ":" + Object.keys(Object.values(entityJSON)[val].variants)[varidx];
                        break;
                    }
                    varidx++;
                }
                break;
            }
            idx++;
        }
        newDiv.appendChild(newBtn);

        newUL = document.createElement('ul');
        newUL.className = "dropdown-menu";
        newDiv.appendChild(newUL);

        for (const entity in entityJSON) {
            for (const variant in entityJSON[entity].variants) {
                newListItem = document.createElement('li');
                newA = document.createElement('a');
                newA.className = "dropdown-item";
                newA.textContent = entity + ":" + variant;
                newUL.appendChild(newListItem);
                newA.onclick = function() {
                    newBtn.innerHTML = entity + ":" + variant;
                }
                newListItem.appendChild(newA);
            }
        }

        newTD = document.createElement('td');
        newRow.appendChild(newTD);

        newInput = document.createElement('input');
        newInput.type = "number";
        newInput.min = "0";
        newInput.value = biomes[biomeID]["small-flora-entities"][floraEntity].proportion;
        newTD.appendChild(newInput);

        //newRow.addEventListener("click", () => {
        //    selectGenerationLayer(generationLayer);
        //});
        console.log(floraEntity);
        console.log(biomes[biomeID]["small-flora-entities"][floraEntity].proportion);
    }
    
    mediumFoliageTableBody.innerHTML = "";
    for (const floraEntity in biomes[biomeID]["medium-flora-entities"]) {
        const entityID = biomes[biomeID]["medium-flora-entities"][floraEntity]["entity-id"];
        const variantID = biomes[biomeID]["medium-flora-entities"][floraEntity]["variant-id"];

        const newRow = document.createElement('tr');
        mediumFoliageTableBody.appendChild(newRow);

        newRowCell = document.createElement('th');
        newRow.appendChild(newRowCell);

        newDiv = document.createElement('div');
        newDiv.className = "dropdown-mb3";
        newRowCell.appendChild(newDiv);

        const newBtn = document.createElement('button');
        newBtn.className = "btn btn-secondary dropdown-toggle";
        newBtn.type = "button";
        newBtn.setAttribute("data-bs-toggle", "dropdown");
        newBtn.setAttribute("aria-expanded", "false");
        newRow.onclick = function() {
            selectedMediumEntityID = entityID;
            selectedMediumEntityVariant = variantID;
        }

        idx = 0;
        for (val in Object.values(entityJSON)) {
            if (entityID == Object.values(entityJSON)[val].id) {
                varidx = 0
                for (varval in Object.values(Object.values(entityJSON)[val].variants)) {
                    if (Object.values(Object.values(entityJSON)[val].variants)[varval]["variant_id"] == variantID) {
                        newBtn.innerHTML = Object.keys(entityJSON)[idx]
                            + ":" + Object.keys(Object.values(entityJSON)[val].variants)[varidx];
                        break;
                    }
                    varidx++;
                }
                break;
            }
            idx++;
        }
        newDiv.appendChild(newBtn);

        newUL = document.createElement('ul');
        newUL.className = "dropdown-menu";
        newDiv.appendChild(newUL);

        for (const entity in entityJSON) {
            for (const variant in entityJSON[entity].variants) {
                newListItem = document.createElement('li');
                newA = document.createElement('a');
                newA.className = "dropdown-item";
                newA.textContent = entity + ":" + variant;
                newUL.appendChild(newListItem);
                newA.onclick = function() {
                    newBtn.innerHTML = entity + ":" + variant;
                }
                newListItem.appendChild(newA);
            }
        }

        newTD = document.createElement('td');
        newRow.appendChild(newTD);

        newInput = document.createElement('input');
        newInput.type = "number";
        newInput.min = "0";
        newInput.value = biomes[biomeID]["medium-flora-entities"][floraEntity].proportion;
        newTD.appendChild(newInput);

        //newRow.addEventListener("click", () => {
        //    selectGenerationLayer(generationLayer);
        //});
        console.log(floraEntity);
        console.log(biomes[biomeID]["medium-flora-entities"][floraEntity].proportion);
    }

    largeFoliageTableBody.innerHTML = "";
    for (const floraEntity in biomes[biomeID]["large-flora-entities"]) {
        const entityID = biomes[biomeID]["large-flora-entities"][floraEntity]["entity-id"];
        const variantID = biomes[biomeID]["large-flora-entities"][floraEntity]["variant-id"];

        const newRow = document.createElement('tr');
        largeFoliageTableBody.appendChild(newRow);

        newRowCell = document.createElement('th');
        newRow.appendChild(newRowCell);

        newDiv = document.createElement('div');
        newDiv.className = "dropdown-mb3";
        newRowCell.appendChild(newDiv);

        const newBtn = document.createElement('button');
        newBtn.className = "btn btn-secondary dropdown-toggle";
        newBtn.type = "button";
        newBtn.setAttribute("data-bs-toggle", "dropdown");
        newBtn.setAttribute("aria-expanded", "false");
        newRow.onclick = function() {
            selectedLargeEntityID = entityID;
            selectedLargeEntityVariant = variantID;
        }

        idx = 0;
        for (val in Object.values(entityJSON)) {
            if (entityID == Object.values(entityJSON)[val].id) {
                varidx = 0
                for (varval in Object.values(Object.values(entityJSON)[val].variants)) {
                    if (Object.values(Object.values(entityJSON)[val].variants)[varval]["variant_id"] == variantID) {
                        newBtn.innerHTML = Object.keys(entityJSON)[idx]
                            + ":" + Object.keys(Object.values(entityJSON)[val].variants)[varidx];
                        break;
                    }
                    varidx++;
                }
                break;
            }
            idx++;
        }
        newDiv.appendChild(newBtn);

        newUL = document.createElement('ul');
        newUL.className = "dropdown-menu";
        newDiv.appendChild(newUL);

        for (const entity in entityJSON) {
            for (const variant in entityJSON[entity].variants) {
                newListItem = document.createElement('li');
                newA = document.createElement('a');
                newA.className = "dropdown-item";
                newA.textContent = entity + ":" + variant;
                newUL.appendChild(newListItem);
                newA.onclick = function() {
                    newBtn.innerHTML = entity + ":" + variant;
                }
                newListItem.appendChild(newA);
            }
        }

        newTD = document.createElement('td');
        newRow.appendChild(newTD);

        newInput = document.createElement('input');
        newInput.type = "number";
        newInput.min = "0";
        newInput.value = biomes[biomeID]["large-flora-entities"][floraEntity].proportion;
        newTD.appendChild(newInput);

        //newRow.addEventListener("click", () => {
        //    selectGenerationLayer(generationLayer);
        //});
        console.log(floraEntity);
        console.log(biomes[biomeID]["large-flora-entities"][floraEntity].proportion);
    }
}

saveBiomePropertiesButton.onclick = function() {
    updateBiomePropertiesOnServer();
}

saveTerrainLayerButton.onclick = function() {
    updateTerrainLayerOnServer();
}

saveGenerationLayerButton.onclick = function() {
    updateGenerationLayerOnServer();
}

saveFoliageButton.onclick = function() {
    updateFoliageOnServer();
}

terrainLayerTableAddButton.onclick = function() {
    addTerrainLayerOnServer();
}

terrainLayerTableRemoveButton.onclick = function() {
    removeTerrainLayerOnServer();
}

generationLayerTableAddButton.onclick = function() {
    addGenerationLayerOnServer();
}

generationLayerTableRemoveButton.onclick = function() {
    removeGenerationLayerOnServer();
}

smallFoliageTableAddButton.onclick = function() {
    addSmallFoliageOnServer();
}

smallFoliageTableRemoveButton.onclick = function() {
    removeSmallFoliageOnServer();
}

mediumFoliageTableAddButton.onclick = function() {
    addMediumFoliageOnServer();
}

mediumFoliageTableRemoveButton.onclick = function() {
    removeMediumFoliageOnServer();
}

largeFoliageTableAddButton.onclick = function() {
    addLargeFoliageOnServer();
}

largeFoliageTableRemoveButton.onclick = function() {
    removeLargeFoliageOnServer();
}

biomeTableRemoveButton.onclick = function() {
    removeBiomeOnServer();
}

getTerrainFromServer();