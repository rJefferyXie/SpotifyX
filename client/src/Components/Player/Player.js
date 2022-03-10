import "./Player.css";
import SpotifyPlayer from "react-spotify-web-playback";
import { useState, useEffect } from "react";

const Player = ({ accessToken, trackURI, updateTrack, setLyrics }) => {
    const [play, setPlay] = useState(false);

    useEffect(() => setPlay(true), [trackURI]);

    const playerChanged = (state) => {
        if (!state.isPlaying) {
            setPlay(false);
            setLyrics("");
        } else {
            try {
                let player = document.getElementsByClassName("PlayerRSWP");
                updateTrack(player[0].children[1].children[0].children[0].children[0].title.replace("on SPOTIFY", ""));
            } catch (e) {}
        }
    }

    if (!accessToken) return null;

    return (
        <SpotifyPlayer token={accessToken} showSaveIcon 
        callback={(state) => playerChanged(state)} 
        play={play} uris={trackURI ? [trackURI] : []}></SpotifyPlayer>
    )
}

export default Player;