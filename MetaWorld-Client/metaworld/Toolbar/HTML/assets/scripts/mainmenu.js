// Buttons, Images, Labels, and Button Containers.
let terrainBtn = document.getElementById("terrain-btn");
let terrainBtnImg = document.getElementById("terrain-btn-img");
let terrainBtnLbl = document.getElementById("terrain-btn-label");
let terrainBtnContainer = document.getElementById("terrain-btn-container");
let entitiesBtn = document.getElementById("entities-btn");
let entitiesBtnImg = document.getElementById("entities-btn-img");
let entitiesBtnLbl = document.getElementById("entities-btn-label");
let entitiesBtnContainer = document.getElementById("entities-btn-container");
let entity1Btn = document.getElementById("entity-1-btn");
let entity1BtnImg = document.getElementById("entity-1-btn-img");
let entity1BtnLbl = document.getElementById("entity-1-btn-label");
let entity1BtnContainer = document.getElementById("entity-1-btn-container");
let entity2Btn = document.getElementById("entity-2-btn");
let entity2BtnImg = document.getElementById("entity-2-btn-img");
let entity2BtnLbl = document.getElementById("entity-2-btn-label");
let entity2BtnContainer = document.getElementById("entity-2-btn-container");
let entity3Btn = document.getElementById("entity-3-btn");
let entity3BtnImg = document.getElementById("entity-3-btn-img");
let entity3BtnLbl = document.getElementById("entity-3-btn-label");
let entity3BtnContainer = document.getElementById("entity-3-btn-container");
let entity4Btn = document.getElementById("entity-4-btn");
let entity4BtnImg = document.getElementById("entity-4-btn-img");
let entity4BtnLbl = document.getElementById("entity-4-btn-label");
let entity4BtnContainer = document.getElementById("entity-4-btn-container");
let consoleBtn = document.getElementById("console-btn");
let consoleBtnImg = document.getElementById("console-btn-img");
let consoleBtnLbl = document.getElementById("console-btn-label");
let consoleBtnContainer = document.getElementById("console-btn-container");
let terrainMenu = document.getElementById("terrain-menu");
let buildBtn = document.getElementById("build-btn");
let buildBtnImg = document.getElementById("build-btn-img");
let buildBtnLbl = document.getElementById("build-btn-label");
let buildBtnContainer = document.getElementById("build-btn-container");
let digBtn = document.getElementById("dig-btn");
let digBtnImg = document.getElementById("dig-btn-img");
let digBtnLbl = document.getElementById("dig-btn-label");
let digBtnContainer = document.getElementById("dig-btn-container");
let entityMenu = document.getElementById("entity-menu");
let materialsContainer = document.getElementById("terrain-menu-materials-container");
let deleteBtn = document.getElementById("delete-btn");
let deleteBtnImg = document.getElementById("delete-btn-img");
let deleteBtnLbl = document.getElementById("delete-btn-label");
let deleteBtnContainer = document.getElementById("delete-btn-container");
let entitiesContainer = document.getElementById("entity-menu-entities-container");
let consoleElement = document.getElementById("console");
let consoleMessagesContainer = document.getElementById("console-menu-messages-container");
let consoleInput = document.getElementById("console-input");
let sendBtn = document.getElementById("console-send-btn");
let sendBtnImg = document.getElementById("send-btn-img");
let sendBtnLbl = document.getElementById("send-btn-label");
let sendBtnContainer = document.getElementById("send-btn-container");

// Button State Information.
let terrainBtnSelected = false;
let entitiesBtnSelected = false;
let consoleBtnSelected = false;
let selectedEntityBtn = null;
let buildBtnSelected = false;
let digBtnSelected = false;
let deleteBtnSelected = false;

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

window.addEventListener("keydown", (event) => {
    if (event.code == "Enter") {
        if (consoleInput.value != "") {
            SendWorldMessage(consoleInput.value);
            consoleInput.value = "";
        }
    }
});

terrainBtn.onclick = function() {
    if (terrainBtnSelected) {
        // Close Terrain Menu.
        CloseTerrainMenu();
        UnHighlightButton(terrainBtn);
        terrainBtnSelected = false;
    }
    else if (entitiesBtnSelected) {
        // Close Entities Menu.
        CloseEntityMenu();
        UnHighlightButton(entitiesBtn);
        entitiesBtnSelected = false;
        
        // Open Terrain Menu.
        OpenTerrainMenu();
        HighlightButton(terrainBtn);
        terrainBtnSelected = true;
    }
    else if (consoleBtnSelected) {
        // Close Console.
        CloseConsole();
        UnHighlightButton(consoleBtn);
        consoleBtnSelected = false;
        
        // Open Terrain Menu.
        OpenTerrainMenu();
        HighlightButton(terrainBtn);
        terrainBtnSelected = true;
    }
    else {
        // Open Terrain Menu.
        OpenTerrainMenu();
        HighlightButton(terrainBtn);
        terrainBtnSelected = true;
    }
}

entitiesBtn.onclick = function() {
    if (entitiesBtnSelected) {
        // Close Entities Menu.
        CloseEntityMenu();
        UnHighlightButton(entitiesBtn);
        entitiesBtnSelected = false;
    }
    else if (terrainBtnSelected) {
        // Close Terrain Menu.
        CloseTerrainMenu();
        UnHighlightButton(terrainBtn);
        terrainBtnSelected = false;
        
        // Open Entities Menu.
        OpenEntityMenu();
        HighlightButton(entitiesBtn);
        entitiesBtnSelected = true;
    }
    else if (consoleBtnSelected) {
        // Close Console.
        CloseConsole();
        UnHighlightButton(consoleBtn);
        consoleBtnSelected = false;
        
        // Open Entities Menu.
        OpenEntityMenu();
        HighlightButton(entitiesBtn);
        entitiesBtnSelected = true;
    }
    else {
        // Open Entities Menu.
        OpenEntityMenu();
        HighlightButton(entitiesBtn);
        entitiesBtnSelected = true;
    }
}

consoleBtn.onclick = function() {
    if (consoleBtnSelected) {
        // Close Console.
        CloseConsole();
        UnHighlightButton(consoleBtn);
        consoleBtnSelected = false;
    }
    else if (terrainBtnSelected) {
        // Close Terrain Menu.
        CloseTerrainMenu();
        UnHighlightButton(terrainBtn);
        terrainBtnSelected = false;
        
        // Open Console.
        OpenConsole();
        HighlightButton(consoleBtn);
        consoleBtnSelected = true;
    }
    else if (entitiesBtnSelected) {
        // Close Entities Menu.
        CloseEntityMenu();
        UnHighlightButton(entitiesBtn);
        entitiesBtnSelected = false;
        
        // Open Console.
        OpenConsole();
        HighlightButton(consoleBtn);
        consoleBtnSelected = true;
    }
    else {
        // Open Console.
        OpenConsole();
        HighlightButton(consoleBtn);
        consoleBtnSelected = true;
    }
}

entity1Btn.onclick = function() {
    if (selectedEntityBtn === null) {
        SelectEntityButton(entity1Btn);
    }
    else if (selectedEntityBtn === entity1Btn) {
        DeSelectEntityButton(entity1Btn);
    }
    else {
        DeSelectEntityButton(selectedEntityBtn);
        SelectEntityButton(entity1Btn);
    }
}

entity2Btn.onclick = function() {
    if (selectedEntityBtn === null) {
        SelectEntityButton(entity2Btn);
    }
    else if (selectedEntityBtn === entity2Btn) {
        DeSelectEntityButton(entity2Btn);
    }
    else {
        DeSelectEntityButton(selectedEntityBtn);
        SelectEntityButton(entity2Btn);
    }
}

entity3Btn.onclick = function() {
    if (selectedEntityBtn === null) {
        SelectEntityButton(entity3Btn);
    }
    else if (selectedEntityBtn === entity3Btn) {
        DeSelectEntityButton(entity3Btn);
    }
    else {
        DeSelectEntityButton(selectedEntityBtn);
        SelectEntityButton(entity3Btn);
    }
}

entity4Btn.onclick = function() {
    if (selectedEntityBtn === null) {
        SelectEntityButton(entity4Btn);
    }
    else if (selectedEntityBtn === entity4Btn) {
        DeSelectEntityButton(entity4Btn);
    }
    else {
        DeSelectEntityButton(selectedEntityBtn);
        SelectEntityButton(entity4Btn);
    }
}

buildBtn.onclick = function() {
    if (buildBtnSelected) {
        // Stop Building.
        postWorldMessage("TOOLBAR.TERRAIN.STOP-BUILDING");
        UnHighlightButton(buildBtn);
        buildBtnSelected = false;
    }
    else if (digBtnSelected) {
        // Stop Digging.
        postWorldMessage("TOOLBAR.TERRAIN.STOP-DIGGING");
        UnHighlightButton(digBtn);
        digBtnSelected = false;
        
        // Start Building.
        postWorldMessage("TOOLBAR.TERRAIN.START-BUILDING");
        HighlightButton(buildBtn);
        buildBtnSelected = true;
    }
    else {
        // Start Building.
        postWorldMessage("TOOLBAR.TERRAIN.START-BUILDING");
        HighlightButton(buildBtn);
        buildBtnSelected = true;
    }
}

digBtn.onclick = function() {
    if (digBtnSelected) {
        // Stop Digging.
        postWorldMessage("TOOLBAR.TERRAIN.STOP-DIGGING");
        UnHighlightButton(digBtn);
        digBtnSelected = false;
    }
    else if (buildBtnSelected) {
        // Stop Building.
        postWorldMessage("TOOLBAR.TERRAIN.STOP-BUILDING");
        UnHighlightButton(buildBtn);
        buildBtnSelected = false;
        
        // Start Digging.
        postWorldMessage("TOOLBAR.TERRAIN.START-DIGGING");
        HighlightButton(digBtn);
        digBtnSelected = true;
    }
    else {
        // Start Digging.
        postWorldMessage("TOOLBAR.TERRAIN.START-DIGGING");
        HighlightButton(digBtn);
        digBtnSelected = true;
    }
}

deleteBtn.onclick = function() {
    if (deleteBtnSelected) {
        // Stop Deleting.
        postWorldMessage("TOOLBAR.ENTITY.STOP-DELETING");
        UnHighlightButton(deleteBtn);
        deleteBtnSelected = false;
    }
    else {
        // Start Deleting.
        postWorldMessage("TOOLBAR.TERRAIN.START-DELETING");
        HighlightButton(deleteBtn);
        deleteBtnSelected = true;
    }
}

sendBtn.onclick = function() {
    if (consoleInput.value != "") {
        SendWorldMessage(consoleInput.value);
        consoleInput.value = "";
    }
}

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
    materialsContainer.appendChild(newBtnContainer);
    
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
    newBtnContainer.classList.add("entity-menu-entities-btn-container");
    entitiesContainer.appendChild(newBtnContainer);
    
    const newBtn = document.createElement("button");
    newBtn.classList.add("entity-menu-entities-btn");
    newBtnContainer.appendChild(newBtn);
    
    const newImg = document.createElement("img");
    newImg.draggable = false;
    newImg.src = imgPath;
    newImg.width = "68";
    newBtn.appendChild(newImg);
    newBtn.onclick = function() {
        postWorldMessage(onClickMsg);
    };
    
    const newLbl = document.createElement("div");
    newLbl.classList.add("entity-menu-mat-label");
    newLbl.innerHTML = entityName;
    newBtnContainer.appendChild(newLbl);
}

function SendWorldMessage(message) {
    postWorldMessage("TOOLBAR.CONSOLE.SEND-MESSAGE(" + message + ")");
}

function AddMessageToConsole(time, message) {
    consoleMessagesContainer.innerHTML = consoleMessagesContainer.innerHTML + "<br>[" + time + "] " + message;
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

function OpenConsole() {
    consoleElement.style.visibility = "visible";
}

function CloseConsole() {
    consoleElement.style.visibility = "hidden";
}

CloseTerrainMenu();
CloseEntityMenu();
CloseConsole();