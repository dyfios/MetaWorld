let SERVERADDR = "http://localhost";
let SERVERPORT = 15530;

let texturesDropdown = document.getElementById("texturesDropdown");
let texturesDropdownButton = document.getElementById("texturesDropdownButton");
let textureNameInput = document.getElementById("textureNameInputInput");

let deleteButton = document.getElementById("deleteButton");
let newButton = document.getElementById("newButton");

let updateNameButton = document.getElementById("updateNameButton");

let selectedTexture = "";

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
            'Content-Type': 'application/octet-stream'
        },
        body: body
    });
    
    const json = await response.json();
    return json;
}

async function getTexturesFromServer() {
    json = await getData("gettexturelisting");
    texturesDropdown.innerHTML = "";
    if (json.length > 0) {
        texturesDropdownButton.textContent = json[0];
        selectedTexture = json[0];
        textureNameInput.value = json[0]
    }
    
    for (const texture in json) {
        newListItem = document.createElement('li');
        newA = document.createElement('a');
        newA.className = "dropdown-item";
        newA.onclick = function() {
            texturesDropdownChanged(json[texture]);
        }
        newA.textContent = json[texture];
        texturesDropdown.appendChild(newListItem);
        newListItem.appendChild(newA);
    }
}

async function updateTextureNameOnServer() {
    updateTextureNameRequest = {
        "old-texture-name": selectedTexture,
        "new-texture-name": textureNameInput.value
    };
    
    res = await getData("renametexture", "request=" + JSON.stringify(updateTextureNameRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Texture name successfully updated.");
        getTexturesFromServer();
    }
    else {
        console.log("Texture name failed to update.");
    }
}

async function deleteTextureOnServer() {
    deleteTextureRequest = {
        "texture-name": textureNameInput.value
    };
    
    res = await getData("deletetexture", "request=" + JSON.stringify(deleteTextureRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Texture successfully deleted.");
        getTexturesFromServer();
    }
    else {
        console.log("Texture failed to delete.");
    }
}

async function addTextureOnServer() {
    try {
        [fileHandle] = await window.showOpenFilePicker();
    } catch (err) {
        console.log(err);
        return;
    }
    const file = await fileHandle.getFile();
    const contents = new Blob([await file.arrayBuffer()]);
    
    addTextureRequest = {
        "texture-name": file.name
    };
    
    res = await postData("addtexture", contents, "request=" + JSON.stringify(addTextureRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Texture successfully added.");
        getTexturesFromServer();
    }
    else {
        console.log("Texture failed to add.");
    }
}

function texturesDropdownChanged(item) {
    selectedTexture = item;
    textureNameInput.value = item;
    texturesDropdownButton.textContent = item;
}

updateNameButton.onclick = function() {
    updateTextureNameOnServer();
}

deleteButton.onclick = function() {
    deleteTextureOnServer();
}

newButton.onclick = function() {
    addTextureOnServer();
}

getTexturesFromServer();