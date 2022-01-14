import useAuth from "../../Hook/useAuth";
import "./Dashboard.css";

import TrackSearchResult from "../TrackSearchResult/TrackSearchResult";
import Player from "../Player/Player";

import SpotifyWebAPI from "spotify-web-api-node";
import { useEffect, useState } from "react";
import axios from "axios";

const spotifyAPI = new SpotifyWebAPI({
    clientId: "dda37808adc24142b51d4c186d4ba38b"
});

const Dashboard = ({ code }) => {
    const accessToken = useAuth(code);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();
    const [lyrics, setLyrics] = useState("");

    const chooseTrack = (track) => {
        setPlayingTrack(track);
        setSearch("");
        setLyrics("");
    }

    useEffect(() => {
        if (!playingTrack) return;

        axios.get("/api/lyrics", {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist
            }
        }).then(res => {
            setLyrics(res.data.lyrics);
        });
    }, [playingTrack]);

    useEffect(() => {
        if (!accessToken) return;
        spotifyAPI.setAccessToken(accessToken);
    }, [accessToken]);

    useEffect(() => {
        if (!search) return setSearchResults([]);
        if (!accessToken) return;

        let cancel = false;
        spotifyAPI.searchTracks(search).then(res => {
            if (cancel) return;
            setSearchResults(res.body.tracks.items.map(track => {
                const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                    if (image.height < smallest.height) return image
                    else return smallest
                }, track.album.images[0]);

                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumURL: smallestAlbumImage.url
                }
            }));
        });

        return () => cancel = true;
    }, [search, accessToken]);

    return (
        <section className="flex-col">
            <div className="container flex-col">
                <input type="search" placeholder="Search Songs/Artists" value={search} onChange={e => setSearch(e.target.value)}></input>
                <div id="SongList" className="flex-col">
                    {searchResults.map(track => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack}></TrackSearchResult>))}
                    {searchResults.length === 0 && (
                        <div id="SongLyrics">{lyrics}</div>
                    )}
                </div>
                <Player accessToken={accessToken} trackURI={playingTrack?.uri}></Player>
            </div>
        </section>
    );
}

export default Dashboard;