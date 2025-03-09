let SERVERADDR = "http://localhost";
let SERVERPORT = 15530;

let thumbnailsDropdown = document.getElementById("thumbnailsDropdown");
let thumbnailsDropdownButton = document.getElementById("thumbnailsDropdownButton");
let thumbnailNameInput = document.getElementById("thumbnailNameInputInput");

let deleteButton = document.getElementById("deleteButton");
let newButton = document.getElementById("newButton");

let updateNameButton = document.getElementById("updateNameButton");

let selectedThumbnail = "";

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

async function getThumbnailsFromServer() {
    json = await getData("getthumbnaillisting");
    thumbnailsDropdown.innerHTML = "";
    if (json.length > 0) {
        thumbnailsDropdownButton.textContent = json[0];
        selectedThumbnail = json[0];
        thumbnailNameInput.value = json[0]
    }
    
    for (const thumbnail in json) {
        newListItem = document.createElement('li');
        newA = document.createElement('a');
        newA.className = "dropdown-item";
        newA.onclick = function() {
            thumbnailsDropdownChanged(json[thumbnail]);
        }
        newA.textContent = json[thumbnail];
        thumbnailsDropdown.appendChild(newListItem);
        newListItem.appendChild(newA);
    }
}

async function updateThumbnailNameOnServer() {
    updateThumbnailNameRequest = {
        "old-thumbnail-name": selectedThumbnail,
        "new-thumbnail-name": thumbnailNameInput.value
    };
    
    res = await getData("renamethumbnail", "request=" + JSON.stringify(updateThumbnailNameRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Thumbnail name successfully updated.");
        getThumbnailsFromServer();
    }
    else {
        console.log("Thumbnail name failed to update.");
    }
}

async function deleteThumbnailOnServer() {
    deleteThumbnailRequest = {
        "thumbnail-name": thumbnailNameInput.value
    };
    
    res = await getData("deletethumbnail", "request=" + JSON.stringify(deleteThumbnailRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Thumbnail successfully deleted.");
        getThumbnailsFromServer();
    }
    else {
        console.log("Thumbnail failed to delete.");
    }
}

async function addThumbnailOnServer() {
    try {
        [fileHandle] = await window.showOpenFilePicker();
    } catch (err) {
        console.log(err);
        return;
    }
    const file = await fileHandle.getFile();
    const contents = new Blob([await file.arrayBuffer()]);
    
    addThumbnailRequest = {
        "thumbnail-name": file.name
    };
    
    res = await postData("addthumbnail", contents, "request=" + JSON.stringify(addThumbnailRequest));

    success = false;
    if (res != null) {
        if (res.success == true) {
            success = true;
        }
    }

    if (success == true) {
        console.log("Thumbnail successfully added.");
        getThumbnailsFromServer();
    }
    else {
        console.log("Thumbnail failed to add.");
    }
}

function thumbnailsDropdownChanged(item) {
    selectedThumbnail = item;
    thumbnailNameInput.value = item;
    thumbnailsDropdownButton.textContent = item;
}

updateNameButton.onclick = function() {
    updateThumbnailNameOnServer();
}

deleteButton.onclick = function() {
    deleteThumbnailOnServer();
}

newButton.onclick = function() {
    addThumbnailOnServer();
}

getThumbnailsFromServer();