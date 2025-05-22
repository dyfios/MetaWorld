const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const baseURL = `${window.location.protocol}//${window.location.host}`;

document.getElementById('email').value = email;

async function RequestProfile(username, avatar) {
    req = baseURL + `/createuser?email=${email}&username=${username}&avatar=${avatar}`;
    response = await fetch(req, {
        method: "GET"
    });
    
    window.location.replace("/userlogin");
}

document.getElementById('submitBtn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const avatar = document.getElementById('avatar').value;
  
    // Save the data into variables
    const profileData = {
      email: email,
      username: username,
      avatar: avatar // Save the selected avatar option
    };
  
    RequestProfile(username, avatar);

    console.log(profileData);
    // Use profileData for other purposes
    alert('Profile setup completed!');
  });