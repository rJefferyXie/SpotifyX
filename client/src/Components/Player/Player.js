import "./Player.css";
import SpotifyPlayer from "react-spotify-web-playback";
import { useState, useEffect } from "react";

const Player = ({ accessToken, trackURI }) => {
    const [play, setPlay] = useState(false);

    useEffect(() => setPlay(true), [trackURI]);

    if (!accessToken) return null;

    return (
        <SpotifyPlayer token={accessToken} showSaveIcon 
        callback={state => {if (!state.isPlaying) setPlay(false)}} 
        play={play} uris={trackURI ? [trackURI] : []}></SpotifyPlayer>
    )
}

export default Player;