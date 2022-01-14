import useAuth from "../../Hook/useAuth";
import "./Dashboard.css";

import TrackSearchResult from "../TrackSearchResult/TrackSearchResult";
import Player from "../Player/Player";
import Playlist from "../Playlist/Playlist";

import SpotifyWebAPI from "spotify-web-api-node";
import { useEffect, useState } from "react";
import axios from "axios";

const spotifyAPI = new SpotifyWebAPI({ clientId: "dda37808adc24142b51d4c186d4ba38b" });

const Dashboard = ({ code }) => {
    const accessToken = useAuth(code);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();
    const [lyrics, setLyrics] = useState("");
    const [username, setUsername] = useState("");
    const [playlists, setPlaylists] = useState([]);

    const loadUserData = () => {
        spotifyAPI.getMe().then(userdata => {
            let id = userdata.body.id;
            setUsername(userdata.body.display_name);
            spotifyAPI.getUserPlaylists(id).then(playlistdata => {
                setPlaylists(playlistdata.body.items.map(playlist => {
                        const smallestImage = playlist.images.reduce((smallest, image) => {
                            if (image.height < smallest.height) return image
                            else return smallest
                        }, playlist.images[0]);

                        return {
                            name: playlist.name,
                            image: smallestImage.url,
                            length: playlist.tracks.total,
                            uri: playlist.uri
                        }
                    })
                );
            });
        });
    }

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
        loadUserData();
    }, [accessToken]);

    useEffect(() => {
        if (!search) return setSearchResults([]);
        if (!accessToken) return;

        let cancel = false;
        spotifyAPI.searchTracks(search).then(res => {
            if (cancel) return;
            setSearchResults(res.body.tracks.items.map(track => {
                const smallestImage = track.album.images.reduce((smallest, image) => {
                    if (image.height < smallest.height) return image
                    else return smallest
                }, track.album.images[0]);

                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    image: smallestImage.url
                }
            }));
        });

        return () => cancel = true;
    }, [search, accessToken]);

    return (
        <section className="flex">
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
            <div className="container flex-col">
                <h1>{username}</h1>
                <div id="Playlists" className="flex-col">
                    {playlists.map(playlist => (
                    <Playlist playlist={playlist} key={playlist.uri} chooseTrack={chooseTrack}></Playlist>))}
                </div>
            </div>
        </section>
    );
}

export default Dashboard;