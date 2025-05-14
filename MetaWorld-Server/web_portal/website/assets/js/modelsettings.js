let SERVERADDR = "http://localhost";
let SERVERPORT = 15530;

let modelsDropdown = document.getElementById("modelsDropdown");
let modelsDropdownButton = document.getElementById("modelsDropdownButton");
let modelNameInput = document.getElementById("modelNameInputInput");

let deleteButton = document.getElementById("deleteButton");
let newButton = document.getElementById("newButton");

let updateNameButton = document.getElementById("updateNameButton");

let selectedModel = "";

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

async function getModelsFromServer() {
    json = await getData("getmodellisting");
    modelsDropdown.innerHTML = "";
    if (json.length > 0) {
        modelsDropdownButton.textContent = json[0];
        selectedModel = json[0];
        modelNameInput.value = json[0]
    }
    
    for (const model in json) {
        newListItem = document.createElement('li');
        newA = document.createElement('a');
        newA.className = "dropdown-item";
        newA.onclick = function() {
            modelsDropdownChanged(json[model]);
        }
        newA.textContent = json[model];
        modelsDropdown.appendChild(newListItem);
        newListItem.appendChild(newA);
    }
}

async function updateModelNameOnServer() {
    updateModelNameRequest = {
        "old-model-name": selectedModel,
        "new-model-name": modelNameInput.value
    };
    
    res = await getData("renamemodel", "request=" + JSON.stringify(updateModelNameRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Model name successfully updated.");
        getModelsFromServer();
    }
    else {
        console.log("Model name failed to update.");
    }
}

async function deleteModelOnServer() {
    deleteModelRequest = {
        "model-name": modelNameInput.value
    };
    
    res = await getData("deletemodel", "request=" + JSON.stringify(deleteModelRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Model successfully deleted.");
        getModelsFromServer();
    }
    else {
        console.log("Model failed to delete.");
    }
}

async function addModelOnServer() {
    try {
        [fileHandle] = await window.showOpenFilePicker();
    } catch (err) {
        console.log(err);
        return;
    }
    const file = await fileHandle.getFile();
    const contents = new Blob([await file.arrayBuffer()]);
    
    addModelRequest = {
        "model-name": file.name
    };
    
    res = await postData("addmodel", contents, "request=" + JSON.stringify(addModelRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Model successfully added.");
        getModelsFromServer();
    }
    else {
        console.log("Model failed to add.");
    }
}

function modelsDropdownChanged(item) {
    selectedModel = item;
    modelNameInput.value = item;
    modelsDropdownButton.textContent = item;
}

updateNameButton.onclick = function() {
    updateModelNameOnServer();
}

deleteButton.onclick = function() {
    deleteModelOnServer();
}

newButton.onclick = function() {
    addModelOnServer();
}

getModelsFromServer();