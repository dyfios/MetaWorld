let SERVERADDR = "http://localhost";
let SERVERPORT = 15530;

let worldNameInput = document.getElementById("worldNameInputInput");
let dayLengthInput = document.getElementById("dayLengthInputInput");
let currentTimeDaysInput = document.getElementById("currentTimeInputDaysInput");
let currentTimeSecsInput = document.getElementById("currentTimeInputSecsInput");
let sunIntensityInput = document.getElementById("sunIntensityInputInput");
let baseLightIntensityInput = document.getElementById("baseLightIntensityInputInput");

let updateNameButton = document.getElementById("saveButton");

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

async function getSettingsFromServer() {
    json = await getData("getworldproperties");
    time = await getData("getworldtime");
    worldNameInput.value = json["world-name"];
    dayLengthInput.value = json["day-length"];
    currentTimeDaysInput.value = time["days"];
    currentTimeSecsInput.value = time["secs"];
    sunIntensityInput.value = json["sun-light-intensity"];
    baseLightIntensityInput.value = json["base-light-intensity"];
}

async function updateSettingsOnServer() {
    newProperties = {
        "world-name": worldNameInput.value,
        "day-length": dayLengthInput.value,
        "sun-light-intensity": sunIntensityInput.value, 
        "base-light-intensity": baseLightIntensityInput.value
    };

    newTime = {
        "days": currentTimeDaysInput.value,
        "secs": currentTimeSecsInput.value
    };
    
    res = await getData("updateworldproperties", "newproperties=" + JSON.stringify(newProperties));
    res2 = await getData("updateworldtime", "newtime=" + JSON.stringify(newTime));

    success = false;
    if (res != null && res2 != null) {
        if (res.success == true) {
            if (res2.success == true) {
                success = true;
            }
        }
    }

    if (success == true) {
        console.log("World settings successfully updated.");
    }
    else {
        console.log("World settings failed to update.");
    }
}

updateNameButton.onclick = function() {
    updateSettingsOnServer();
}

getSettingsFromServer();