// Buttons, Images, Labels, and Button Containers.
let terrainBtn = document.getElementById("terrain-btn");
let terrainBtnImg = document.getElementById("terrain-btn-img");
let terrainBtnLbl = document.getElementById("terrain-btn-label");
let terrainBtnContainer = document.getElementById("terrain-btn-container");
let entitiesBtn = document.getElementById("entities-btn");
let entitiesBtnImg = document.getElementById("entities-btn-img");
let entitiesBtnLbl = document.getElementById("entities-btn-label");
let entitiesBtnContainer = document.getElementById("entities-btn-container");
let terrainMenu = document.getElementById("terrain-menu");
let brushIncreaseBtn = document.getElementById("brush-increase-btn");
let brushIncreaseBtnImg = document.getElementById("brush-increase-btn-img");
let brushIncreaseBtnLbl = document.getElementById("brush-increase-btn-label");
let brushIncreaseBtnContainer = document.getElementById("brush-increase-btn-container");
let brushDecreaseBtn = document.getElementById("brush-decrease-btn");
let brushDecreaseBtnImg = document.getElementById("brush-decrease-btn-img");
let brushDecreaseBtnLbl = document.getElementById("brush-decrease-btn-label");
let brushDecreaseBtnContainer = document.getElementById("brush-decrease-btn-container");
let maxHeightIncreaseBtn = document.getElementById("max-height-increase-btn");
let maxHeightIncreaseBtnImg = document.getElementById("max-height-increase-btn-img");
let maxHeightDecreaseBtn = document.getElementById("max-height-decrease-btn");
let maxHeightDecreaseBtnImg = document.getElementById("max-height-decrease-btn-img");
let terrainMaxHeightLabel = document.getElementById("terrain-max-height-label");
let entityMenu = document.getElementById("entity-menu");
let deleteBtn = document.getElementById("delete-btn");
let deleteBtnImg = document.getElementById("delete-btn-img");
let deleteBtnLbl = document.getElementById("delete-btn-label");
let deleteBtnContainer = document.getElementById("delete-btn-container");

// VR Menu Navigation Buttons.
let vrMenuBackButton = document.getElementById("prev-menu-btn");
let vrMenuForwardButton = document.getElementById("next-menu-btn");

// Terrain Menu.
let terrainBrushTypeDropdown = document.getElementById("terrain-brush-type-dropdown");
let terrainBrushSizeDecreaseButton = document.getElementById("terrain-brush-size-decrease-btn");
let terrainBrushSizeLabel = document.getElementById("terrain-brush-size-label");
let terrainBrushSizeIncreaseButton = document.getElementById("terrain-brush-size-increase-btn");
let terrainMinHeightInput = document.getElementById("terrain-min-height-input");
let terrainMinHeightPickButton = document.getElementById("terrain-min-height-pick-btn");
let terrainMaxHeightInput = document.getElementById("terrain-max-height-input");
let terrainMaxHeightPickButton = document.getElementById("terrain-max-height-pick-btn");
let terrainMaterialsContainer = document.getElementById("terrain-menu-materials-container");

// Entities Menu.
let entitiesGridToggle = document.getElementById("entities-grid-toggle");
//let entitiesGridSizeDecreaseButton = document.getElementById("entities-grid-size-decrease-btn");
let entitiesGridSizeInput = document.getElementById("entities-grid-size-input");
//let entitiesGridSizeIncreaseButton = document.getElementById("entities-grid-size-increase-btn");
let entitiesFilterInput = document.getElementById("entities-entity-filter-input");
let entitiesFilterButton = document.getElementById("entities-entity-filter-btn");
let entitiesContainer = document.getElementById("entities-menu-entities-container");
let entitiesPlaceButton = document.getElementById("entities-place-button");
let entitiesKeepSpawningToggle = document.getElementById("entities-keep-spawning-toggle");

// Entity Info Menu.
let entityInfoIDText = document.getElementById("entity-info-id-text");
let entityInfoNameInput = document.getElementById("entity-info-name-input");
let entityInfoMoveButton = document.getElementById("entity-info-move-button");

function ToggleVRMenu() {
    terrainMenuObject = document.getElementById("terrain-menu-vr");
    entitiesMenuObject = document.getElementById("entities-menu-vr");

    if (terrainMenuObject == null || entitiesMenuObject == null) {
        return;
    }

    if (terrainMenuObject.hidden == true) {
        if (entitiesMenuObject.hidden == true) {
            terrainMenuObject.hidden = false;
        }
        else {
            terrainMenuObject.hidden = false;
            entitiesMenuObject.hidden = true;
        }
    }
    else {
        if (entitiesMenuObject.hidden = true) {
            terrainMenuObject.hidden = true;
            entitiesMenuObject.hidden = false;
        }
        else {
            terrainMenuObject.hidden = false;
            entitiesMenuObject.hidden = true;
        }
    }
}

function EnableEntityButton(index) {
    if (index === 0) {
        entity1BtnContainer.style.display = "inline-block";
    }
    else if (index === 1) {
        entity2BtnContainer.style.display = "inline-block";
    }
    else if (index === 2) {
        entity3BtnContainer.style.display = "inline-block";
    }
    else if (index === 3) {
        entity4BtnContainer.style.display = "inline-block";
    }
    else {
        console.error("EnableEntityButton: Invalid Index.");
    }
}

function DisableEntityButton(index) {
    if (index === 0) {
        entity1BtnContainer.style.display = "none";
    }
    else if (index === 1) {
        entity2BtnContainer.style.display = "none";
    }
    else if (index === 2) {
        entity3BtnContainer.style.display = "none";
    }
    else if (index === 3) {
        entity4BtnContainer.style.display = "none";
    }
    else {
        console.error("DisableEntityButton: Invalid Index.");
    }
}

function SetEntityButtonName(index, name) {
    if (index === 0) {
        entity1BtnLbl.innerHTML = name;
    }
    else if (index === 1) {
        entity2BtnLbl.innerHTML = name;
    }
    else if (index === 2) {
        entity3BtnLbl.innerHTML = name;
    }
    else if (index === 3) {
        entity4BtnLbl.innerHTML = name;
    }
    else {
        console.error("SetEntityButtonName: Invalid Index.");
    }
}

function SetEntityButtonImage(index, path) {
    if (index === 0) {
        entity1BtnImg.src = path;
    }
    else if (index === 1) {
        entity2BtnImg.src = path;
    }
    else if (index === 2) {
        entity3BtnImg.src = path;
    }
    else if (index === 3) {
        entity4BtnImg.src = path;
    }
    else {
        console.error("SetEntityButtonImage: Invalid Index.");
    }
}

if (vrMenuBackButton != null) {
    vrMenuBackButton.onclick = function() {
        ToggleVRMenu();
    }
}

if (vrMenuForwardButton != null) {
    vrMenuForwardButton.onclick = function() {
        ToggleVRMenu();
    }
}

terrainBrushSizeDecreaseButton.onclick = function() {
    postWorldMessage("TOOLBAR.TERRAIN.DECREASE-BRUSH");
}

terrainBrushSizeIncreaseButton.onclick = function() {
    postWorldMessage("TOOLBAR.TERRAIN.INCREASE-BRUSH");
}

terrainMinHeightInput.onchange = function() {
    postWorldMessage("TOOLBAR.TERRAIN.SET-BRUSH-MIN-HEIGHT(" + terrainMinHeightInput.value + ")");
}

terrainMaxHeightInput.onchange = function() {
    postWorldMessage("TOOLBAR.TERRAIN.SET-BRUSH-MAX-HEIGHT(" + terrainMaxHeightInput.value + ")");
}

terrainMinHeightInput.value = 1;
terrainMaxHeightInput.value = 511;

entitiesGridToggle.onclick = function() {
    if (entitiesGridToggle.checked === true) {
        postWorldMessage("TOOLBAR.ENTITY.ENABLE-GRID");
    }
    else {
        postWorldMessage("TOOLBAR.ENTITY.DISABLE-GRID");
    }
}

entitiesGridSizeInput.onchange = function() {
    postWorldMessage("TOOLBAR.ENTITY.SET-GRID-SIZE(" + entitiesGridSizeInput.value + ")");
}

entitiesKeepSpawningToggle.onclick = function() {
    if (entitiesKeepSpawningToggle.checked === true) {
        postWorldMessage("TOOLBAR.ENTITY.KEEP-SPAWNING");
    }
    else {
        postWorldMessage("TOOLBAR.ENTITY.DONT-KEEP-SPAWNING");
    }
}

entitiesGridToggle.checked = true;
entitiesGridSizeInput.value = 1;
entitiesKeepSpawningToggle.checked = false;

function SelectEntityButton(btn) {
    selectedEntityBtn = btn;
    HighlightButton(btn);
}

function DeSelectEntityButton(btn) {
    selectedEntityBtn = null;
    UnHighlightButton(btn);
}

function HighlightButton(btn) {
    btn.style.border = "2px solid #292929";
}

function UnHighlightButton(btn) {
    btn.style.border = "none";
}

function AddMaterialButton(matName, imgPath, onClickMsg) {
    const newBtnContainer = document.createElement("div");
    newBtnContainer.classList.add("terrain-menu-materials-btn-container");
    terrainMaterialsContainer.appendChild(newBtnContainer);
    
    const newBtn = document.createElement("button");
    newBtn.classList.add("terrain-menu-materials-btn");
    newBtnContainer.appendChild(newBtn);
    
    const newImg = document.createElement("img");
    newImg.draggable = false;
    newImg.src = imgPath;
    newImg.width = "25";
    newBtn.appendChild(newImg);
    newBtn.onclick = function() {
        postWorldMessage(onClickMsg);
    };
    
    const newLbl = document.createElement("div");
    newLbl.classList.add("terrain-menu-mat-label");
    newLbl.innerHTML = matName;
    newBtnContainer.appendChild(newLbl);
}

function AddEntityButton(entityName, imgPath, onClickMsg) {
    const newBtnContainer = document.createElement("div");
    newBtnContainer.classList.add("entities-menu-entities-btn-container");
    entitiesContainer.appendChild(newBtnContainer);
    
    const newBtn = document.createElement("button");
    newBtn.classList.add("entities-menu-entities-btn");
    newBtnContainer.appendChild(newBtn);
    
    const newImg = document.createElement("img");
    newImg.draggable = false;
    newImg.src = imgPath;
    newImg.width = "25";
    newBtn.appendChild(newImg);
    newBtn.onclick = function() {
        postWorldMessage(onClickMsg);
    };
    
    const newLbl = document.createElement("div");
    newLbl.classList.add("entities-menu-entity-label");
    newLbl.innerHTML = entityName;
    newBtnContainer.appendChild(newLbl);
}

function SendWorldMessage(message) {
    postWorldMessage("TOOLBAR.CONSOLE.SEND-MESSAGE(" + message + ")");
}

function UpdateTerrainBrushSize(brushSize) {
    terrainBrushSizeLabel.innerHTML = brushSize;
}

function UpdateTerrainMinHeight(minTerrainHeight) {
    terrainMinHeightInput.value = minTerrainHeight
}

function UpdateMaxTerrainHeight(maxTerrainHeight) {
    terrainMaxHeightLabel.innerHTML = "Max Height: " + maxTerrainHeight
}

function OpenTerrainMenu() {
    terrainMenu.style.visibility = "visible";
}

function CloseTerrainMenu() {
    terrainMenu.style.visibility = "hidden";
}

function OpenEntityMenu() {
    entityMenu.style.visibility = "visible";
}

function CloseEntityMenu() {
    entityMenu.style.visibility = "hidden";
}

ToggleVRMenu();