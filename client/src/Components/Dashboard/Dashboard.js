import useAuth from "../../Hook/useAuth";
import "./Dashboard.css";

import Navbar from "../Navbar/Navbar";
import TrackSearchResult from "../TrackSearchResult/TrackSearchResult";
import ArtistSearchResult from "../ArtistSearchResult/ArtistSearchResult";
import Player from "../Player/Player";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import SpotifyWebAPI from "spotify-web-api-node";
import { useEffect, useState } from "react";
import axios from "axios";

const spotifyAPI = new SpotifyWebAPI({ clientId: "dda37808adc24142b51d4c186d4ba38b" });

const Dashboard = ({ code }) => {
    const accessToken = useAuth(code);

    const [search, setSearch] = useState("");
    const [trackResults, setTrackResults] = useState([]);
    const [albumResults, setAlbumResults] = useState([]);
    const [artistResults, setArtistResults] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [artistSeeds, setArtistSeeds] = useState([]);
    const [recommendedTracks, setRecommendedTracks] = useState([]);

    const [playingTrack, setPlayingTrack] = useState();
    const [trackName, setTrackName] = useState("");
    const [lyrics, setLyrics] = useState("");
    const [username, setUsername] = useState("");
    const [playlists, setPlaylists] = useState([]);

    const mapTracks = (tracks) => {
        return tracks.map(track => {
            let smallestImage = track.album.images.reduce((smallest, image) => {
                if (image.height < smallest.height) return image
                else return smallest
            }, track.album.images[0]);

            return {
                artist: track.artists[0].name,
                title: track.name,
                popularity: track.popularity,
                uri: track.uri,
                image: smallestImage.url
            }
        })
    }

    const mapArtists = (artists, top) => {
        return artists.map(artist => {
            let smallestImage = artist.images.reduce((smallest, image) => {
                if (image.height < smallest.height) return image;
                else return smallest;
            }, artist.images[0]);

            let artistGenres = artist.genres.slice(0, 2);

            if (top) { 
                setArtistSeeds(artistSeeds => 
                    [...artistSeeds, artist.uri.replace("spotify:artist:", "")]);
            }

            return {
                artist: artist.name,
                genres: artist.genres.length > 0 ? artistGenres.map((genre, i) => {
                    return artistGenres[i] === artistGenres[artistGenres.length - 1] ? genre : genre + ", ";
                }) : "No Genres Found",
                popularity: artist.popularity,
                uri: artist.uri,
                image: smallestImage.url
            }
        })
    }

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

    const updateTrack = (track) => {
        setTrackName(track);
    }

    useEffect(() => {
        if (!playingTrack) return;
        axios.get("/api/lyrics", {
            params: {
                track: trackName,
                artist: playingTrack.artist
            }
        }).then(res => {
            setLyrics(res.data.lyrics);
        });
    }, [trackName]);

    useEffect(() => {
        if (!accessToken) return;
        spotifyAPI.setAccessToken(accessToken);
        loadUserData();
        spotifyAPI.getMyTopTracks({limit: 7}).then(res => {
            setTopTracks(mapTracks(res.body.items));
        });
        spotifyAPI.getMyTopArtists({limit: 7}).then(res => {
            setTopArtists(mapArtists(res.body.items, "true"));
        });
    }, [accessToken]);

    useEffect(() => {
        spotifyAPI.getRecommendations({
            seed_artists: artistSeeds.slice(0, 5),
            limit: 50
        }).then(res => {
            setRecommendedTracks(mapTracks(res.body.tracks));
        });
    }, [topArtists])

    useEffect(() => {
        if (!search) {
            setTrackResults([]);
            setAlbumResults([]);
            setArtistResults([]);
            return;
        }
        if (!accessToken) return;

        let cancel = false;
        spotifyAPI.search(search, ["album", "artist", "track"], {limit: 7}).then(res => {
            if (cancel) return;
            setTrackResults(mapTracks(res.body.tracks.items));
            setArtistResults(mapArtists(res.body.artists.items, false));
        });

        return () => cancel = true;
    }, [search, accessToken]);

    return (
        <section id="Dashboard" className="flex">
            <Navbar username={username} playlists={playlists} chooseTrack={chooseTrack}></Navbar>
            <div className="container flex-col">
                <TextField type="search" label="Search for Songs, Artists or Albums..." value={search} onChange={e => setSearch(e.target.value)}></TextField>
                {/* <Button onClick={() => test()} variant="contained" style={{width: "fit-content", margin: "4px auto"}}>Test</Button> */}
                <div id="SearchResults" className="flex">
                    {lyrics === "" ? null : <div id="SongLyrics">{lyrics}</div>}
                    {trackResults.length === 0 && artistResults.length === 0 &&
                    (<div id="Recommendation-container" className="flex-col">
                        <h2>Recommendations</h2>
                        <div id="Recommendations" className="flex">
                            {recommendedTracks.map(track => (
                            <TrackSearchResult track={track} key={track.uri} bg={"white"} chooseTrack={chooseTrack}></TrackSearchResult>))}
                        </div>
                    </div>)}
                    {trackResults.length > 0 ? 
                    <div className="flex-col searchResultList">
                        <h2>Songs</h2>
                        {trackResults.map(track => (
                        <TrackSearchResult track={track} key={track.uri} bg={"white"} chooseTrack={chooseTrack}></TrackSearchResult>))}
                    </div> : null}
                    {artistResults.length > 0 ? 
                    <div className="flex-col searchResultList">
                        <h2>Artists</h2>
                        {artistResults.map(artist => (
                        <ArtistSearchResult artist={artist} key={artist.uri} bg={"white"} chooseTrack={chooseTrack}></ArtistSearchResult>))}
                    </div> : null}
                </div>
                <Player accessToken={accessToken} trackURI={playingTrack?.uri} updateTrack={updateTrack} setLyrics={setLyrics}></Player>
            </div>
            <div className="flex-col topResultList">
                <div className="flex-col topList">
                    <h1>Your Top Tracks</h1>
                    {topTracks.map(track => (
                    <TrackSearchResult track={track} key={track.uri} bg={"#191414"} chooseTrack={chooseTrack}></TrackSearchResult>))}
                </div>
                <div className="flex-col topList">
                    <h1>Your Top Artists</h1>
                    {topArtists.map(artist => (
                    <ArtistSearchResult artist={artist} key={artist.uri} bg={"#191414"} chooseTrack={chooseTrack}></ArtistSearchResult>))}
                </div>
            </div>
        </section>
    );
}

export default Dashboard;