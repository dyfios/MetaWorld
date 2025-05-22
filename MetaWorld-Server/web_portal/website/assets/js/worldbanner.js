const urlParams = new URLSearchParams(window.location.search);

async function SetUpJoinPage() {
    const worldURI = urlParams.get('world_uri');
    const userID = urlParams.get('user_id');
    const userTag = urlParams.get('user_tag');
    const userAvatar = urlParams.get('user_avatar');
    const token = urlParams.get('token');
    const posX = urlParams.get('x_pos');
    const posY = urlParams.get('y_pos');
    const posZ = urlParams.get('z_pos');
    const rotX = urlParams.get('x_rot');
    const rotY = urlParams.get('y_rot');
    const rotZ = urlParams.get('z_rot');
    const rotW = urlParams.get('w_rot');

    const serializedWorldInfo = await fetch("http://192.168.1.101.nip.io:3000/worldinformation");
    const worldInfo = await serializedWorldInfo.json();

    // Populate dynamic content
    document.getElementById('name').textContent = userTag;
    document.getElementById('world-name').textContent = worldInfo.name;
    document.getElementById('world-image').src = 'worldimage'; // Replace with actual image path
    document.getElementById('message').textContent = worldInfo.message;
    document.getElementById('join-link').href = "http://192.168.1.101:8080/metaworld.veml?" +
        "world_uri=" + worldURI + "&user_id=" + userID + "&user_tag=" + userTag + "&WORLD_POS_X=" +
        posX + "&WORLD_POS_Y=" + posY + "&WORLD_POS_Z=" + posZ + "&WORLD_ROT_X=" + rotX +
        "&WORLD_ROT_Y=" + rotY + "&WORLD_ROT_Z=" + rotZ + "&WORLD_ROT_W=" + rotW + "&token=" + token;
}

SetUpJoinPage();