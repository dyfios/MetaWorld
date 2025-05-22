/**
 * @file server.js
 * @brief Main server file for the MetaWorld web portal.
 */

import fs from 'fs';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuid } from 'uuid';
import { argv } from 'process';
import vosapp from '../VOS/vosapp.js';

const cwd = argv[2];
const GOOGLE_OAUTH_URL = argv[3];
const GOOGLE_CLIENT_ID = argv[4];
const GOOGLE_CLIENT_SECRET = argv[5];
const GOOGLE_ACCESS_TOKEN_URL = argv[6];
const GOOGLE_TOKEN_INFO_URL = argv[7];
const JWT_SECRET = argv[8];
const JWT_LIFETIME = argv[9];

dotenv.config();

const bannerMessageFile = path.join(cwd, 'website',  'bannermessage.txt');

const worldImageFile = path.isAbsolute(cwd) ? path.join(cwd, 'website', 'worldimage.png') :
    path.join(process.cwd(), cwd, 'website', 'worldimage.png');

/** @brief Google OAuth configuration constants. */
const GOOGLE_CALLBACK_URL = "http://192.168.1.101.nip.io:3000/google/callback";
const GOOGLE_OAUTH_SCOPES = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
];


const app = express();
const port = 3000;
const userDBPath = path.join(cwd, 'users.db');

const startX = 130048;
const startY = 200;
const startZ = 130048;
const startRotX = 0;
const startRotY = 0;
const startRotZ = 0;
const startRotW = 1;

/**
 * @function Log Log a message.
 * @param {*} text Text to log.
 */
function Log(text) {
    console.log(text);
    if (process.platform == "win32") {
        fs.appendFile(".\\portal.log", text + "\n", function(err){
            
        });
    } else {
        fs.appendFile("./portal.log", text + "\n", function(err){

        });
    }
}

/** 
 * @brief Serve static files from the 'website' directory.
 */
app.use(express.static(path.join(cwd, 'website')));

/**
 * @brief Route for the home page.
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(cwd, 'website', 'index.html'));
});

/**
 * @brief Route for the settings page.
 */
app.get('/settings', (req, res) => {
    res.sendFile(path.join(cwd, 'website', 'settings.html'));
});

/**
 * @brief Route for the entity settings page.
 */
app.get('/entitysettings', (req, res) => {
    res.sendFile(path.join(cwd, 'website', 'entitysettings.html'));
});

/**
 * @brief Route for the model settings page.
 */
app.get('/modelsettings', (req, res) => {
    res.sendFile(path.join(cwd, 'website', 'modelsettings.html'));
});

/**
 * @brief Route for the terrain settings page.
 */
app.get('/terrainsettings', (req, res) => {
    res.sendFile(path.join(cwd, 'website', 'terrainsettings.html'));
});

/**
 * @brief Route for the texture settings page.
 */
app.get('/texturesettings', (req, res) => {
    res.sendFile(path.join(cwd, 'website', 'texturesettings.html'));
});

/**
 * @brief Route for the thumbnail settings page.
 */
app.get('/thumbnailsettings', (req, res) => {
    res.sendFile(path.join(cwd, 'website', 'thumbnailsettings.html'));
});

app.get('/worldinformation', (req, res) => {
    var bannerMessage = fs.readFileSync(bannerMessageFile, 'utf8', (err, data) => {

    });
    var worldInformation = {
        name: "World Central",
        message: bannerMessage
    };
    res.send(JSON.stringify(worldInformation));
});

app.get('/worldimage', (req, res) => {
    res.sendFile(worldImageFile);
});

/**
 * @brief Route to initiate Google OAuth login.
 */
app.get("/userlogin", async (req, res) => {
    const state = "some_state";
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL
      = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
    res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
});

/**
 * @brief Route to create a new user.
 * @param email User's email address.
 * @param username User's username.
 * @param avatar User's avatar URL.
 */
app.get("/createuser", async (req, res) => {
    const { email, username, avatar } = req.query;
    const newID = uuid();
    const user = await CreateUser(db, email, username, 0, newID, avatar);
    res.send("User created successfully!");
});

/**
 * @brief Route to load client data.
 */
app.get("/loadclient", async (req, res) => {
    res.redirect("/worldbanner.html?world_uri=http://192.168.1.101:8081" +
        "&user_id=" + req.query.user_id + "&user_tag=" + req.query.user_tag +
        "&user_avatar=" + req.query.user_avatar + "&token=" + req.query.token +
        "&x_pos=" + req.query.x_pos + "&y_pos=" + req.query.y_pos + "&z_pos=" +
        req.query.z_pos + "&x_rot=" + req.query.x_rot + "&y_rot=" + req.query.y_rot +
        "&z_rot=" + req.query.z_rot + "&w_rot=" + req.query.w_rot);
});

/**
 * @brief Callback route for Google OAuth.
 * @param code Authorization code from Google.
 */
app.get("/google/callback", async (req, res) => {
    const { code } = req.query;

    const data = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `http://192.168.1.101.nip.io:${port}/google/callback`,
        grant_type: "authorization_code"
    };

    // exchange authorization code for access token & id_token
    const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });

    const access_token_data = await response.json();

    const { id_token } = access_token_data;

    // verify and extract the information in the id token
    const token_info_response = await fetch(
        `${GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
    );
    const token_info_data = await token_info_response.json();
    
    const { email, name } = token_info_data;

    let user = await GetUserByEmail(db, email);
    if (user) {
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: JWT_LIFETIME
        });
        await UpdateUserToken(db, user.ID, token);
        res.status(token_info_response.status).redirect("/loadclient?token=" + token
            + "&user_id=" + user.ID + "&user_tag=" + user.TAG + "&user_access_level="
            + user.ACCESS_LEVEL + "&user_avatar=" + user.AVATAR + "&x_pos=" + user.X_POS
            + "&y_pos=" + user.Y_POS + "&z_pos=" + user.Z_POS + "&x_rot=" + user.X_ROT
            + "&y_rot=" + user.Y_ROT + "&z_rot=" + user.Z_ROT + "&w_rot=" + user.W_ROT);
        vosApp.PublishOnVOS("vos/app/rest/usertoken", `{
            "user_id":"${user.ID}",
            "user_tag":"${user.TAG}",
            "user_access_level":"${user.ACCESS_LEVEL}",
            "user_avatar":"${user.AVATAR}",
            "token":"${token}"
        }`);
        vosApp.PublishOnVOS("vos/app/sync/usertoken", `{
            "user_id":"${user.ID}",
            "user_tag":"${user.TAG}",
            "user_access_level":"${user.ACCESS_LEVEL}",
            "user_avatar":"${user.AVATAR}",
            "token":"${token}"
        }`);
    }
    else {
        res.status(token_info_response.status).redirect("/createprofile.html?&email=" + email);
    }
});

/**
 * @brief Initialize and open the user database.
 * @param userDBPath Path to the SQLite database file.
 * @return Database connection object.
 */
const InitializeUserDatabase = async (userDBPath) => {
    const db = await open({
        filename: userDBPath,
        driver: sqlite3.Database
    });
    return db;
};

/**
 * @brief Fetch a user by email.
 * @param db Database connection object.
 * @param email User's email address.
 * @return User object if found, otherwise null.
 */
const GetUserByEmail = async (db, email) => {
    return await db.get("SELECT * FROM USERS WHERE EMAIL = ?", email);
};

/**
 * @brief Insert a new user into the database.
 * @param db Database connection object.
 * @param email User's email address.
 * @param tag User's tag.
 * @param accessLevel User's access level.
 * @param id User's unique ID.
 * @param avatar User's avatar URL.
 * @return Newly created user object.
 */
const CreateUser = async (db, email, tag, accessLevel, id, avatar) => {
    const result = await db.run(
        "INSERT INTO users (EMAIL, TAG, ACCESS_LEVEL, ID, AVATAR, \
            X_POS, Y_POS, Z_POS, X_ROT, Y_ROT, Z_ROT, W_ROT) VALUES \
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)",
        email,
        tag,
        accessLevel,
        id,
        avatar,
        startX,
        startY,
        startZ,
        startRotX,
        startRotY,
        startRotZ,
        startRotW
    );
    return { ID: result.id, EMAIL: result.email, TAG: result.tag, ACCESS_LEVEL: result.accessLevel, AVATAR: result.avatar,
        POS_X: startX, POS_Y: startY, POS_Z: startZ, ROT_X: startRotX, ROT_Y: startRotY, ROT_Z: startRotZ, ROT_W: startRotW
    };
};

const UpdateUserToken = async (db, id, token) => {
    await db.run(
        "UPDATE users SET TOKEN = ? WHERE ID = ?",
        token,
        id
    );
}

function ConnectToVOS() {
    vosApp.ConnectToVOS("webportal", () => {
        vosApp.SubscribeToVOS("webportal", "vos/app/portal/#", (topic, msg) => {
            if (topic == "vos/app/portal/none") {
                
            }
            else {
                vosApp.Log("Invalid VOS message topic: " + topic);
            }
        });
    });
}

let vosApp = new vosapp();

ConnectToVOS();

const db = await InitializeUserDatabase(userDBPath);

/**
 * @brief Start the server.
 */
app.listen(port, () => {
    vosApp.Log(`Server is running on http://192.168.1.101.nip.io:${port}`);
});