require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const SpotifyWebAPI = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3001;

app.post("/api/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyAPI = new SpotifyWebAPI({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    });

    spotifyAPI.refreshAccessToken().then(data => { 
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in
        });
    }).catch(() => { res.sendStatus(400); });
});

app.get("/api/lyrics", async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics Found." 
    res.json({ lyrics });
})

app.post("/api/login", (req, res) => {
    const code = req.body.code;
    const spotifyAPI = new SpotifyWebAPI({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    });

    spotifyAPI.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        });
    }).catch(() => {
        res.sendStatus(400);
    });
});

app.listen(port, () => console.log(`Server is up and running on ${port}`));