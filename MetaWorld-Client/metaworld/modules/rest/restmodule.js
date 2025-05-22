class RESTModule {
    constructor() {
        Logging.Log("Initializing REST Module...");

        Logging.Log("REST Module Initialized.");
    }
}

function MW_REST_SendTerrainDigRequest(restService, terrainIndex, hitPoint, digLayer, brushSize, userID, userToken,
    onResponseReceived = null) {
    HTTPNetworking.Fetch(restService + "/modifyterrain?regionX=" +
        terrainIndex.x + "&regionY=" + terrainIndex.y +
        "&x=" + hitPoint.x + "&y=" + hitPoint.y + "&z=" + hitPoint.z + "&operation=" +
        "dig" + "&brushType=roundedCube&layer=" + digLayer + "&brushSize=" + brushSize +
        "&userID=" + userID + "&userToken=" + userToken, onResponseReceived);
}

function MW_REST_SendTerrainBuildRequest(restService, terrainIndex, hitPoint, buildLayer, brushSize, userID, userToken,
    onResponseReceived = null) {
    HTTPNetworking.Fetch(restService + "/modifyterrain?regionX=" +
        terrainIndex.x + "&regionY=" + terrainIndex.y +
        "&x=" + hitPoint.x + "&y=" + hitPoint.y + "&z=" + hitPoint.z + "&operation=" +
        "build" + "&brushType=roundedCube&layer=" + buildLayer + "&brushSize=" + brushSize + "&userID=" +
        userID + "&userToken=" + userToken, onResponseReceived);
}

function MW_REST_SendPositionEntityRequest(restService, terrainIndex, entityID, variantID, instanceID,
    position, rotation, userID, userToken, onResponseReceived = null) {
    HTTPNetworking.Fetch(restService + "/positionentity?regionX="
        + terrainIndex.x + "&regionY=" + terrainIndex.y +
        "&entityID=" + entityID + "&variantID=" + variantID + "&instanceID='" + instanceID +
        "'&xPosition=" + position.x + "&yPosition=" + position.y + "&zPosition=" + position.z +
        "&xRotation=" + rotation.x + "&yRotation=" + rotation.y + "&zRotation=" + rotation.z + "&wRotation=" + rotation.w +
        "&userID=" + userID + "&userToken=" + userToken, onResponseReceived);
}

function MW_REST_SendDeleteEntityRequest(restService, terrainIndex, entityID, userID, userToken,
    onResponseReceived = null) {
    HTTPNetworking.Fetch(restService + "/deleteentity?regionX=" +
        terrainIndex.x + "&regionY=" + terrainIndex.y + "&instanceID=" + entityID + "&userID=" +
        userID + "&userToken=" + userToken, onResponseReceived);
}

function MW_REST_SendBiomeInfoRequest(restService, onBiomeInfoReceived) {
    HTTPNetworking.Fetch(restService + "/getbiomeinfo", onBiomeInfoReceived);
}

function MW_REST_SendTimeRequest(restService, onTimeReceived) {
    HTTPNetworking.Fetch(restService + "/gettime", onTimeReceived);
}

function MW_REST_SendGetEntitiesRequest(restService, terrainIndex, userID, userToken, onEntitiesReceived) {
    HTTPNetworking.Fetch(restService + "/getentities?regionX=" + terrainIndex.x +
        "&regionY=" + terrainIndex.y + "&userID=" + userID + "&userToken=" + userToken, onEntitiesReceived);
}

function MW_REST_SendRegionInfoRequest(restService, terrainIndex, userID, userToken, onRegionInfoReceived) {
    HTTPNetworking.Fetch(restService + "/getregioninfo?regionX=" + terrainIndex.x +
        "&regionY=" + terrainIndex.y + "&userID=" + userID + "&userToken=" + userToken, onRegionInfoReceived);
}

function MW_REST_SendGetTerrainRequest(restService, regionIdx, userID, userToken, onTerrainReceived) {
    HTTPNetworking.Fetch(restService + "/getterrain?regionX=" + regionIdx.x +
        "&regionY=" + regionIdx.y + "&minX=0&maxX=512&minY=0&maxY=512" + "&userID=" +
        userID + "&userToken=" + userToken, onTerrainReceived);
}