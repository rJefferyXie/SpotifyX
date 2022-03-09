import useAuth from "../../Hook/useAuth";
import "./Dashboard.css";

import Navbar from "../Navbar/Navbar";
import TrackSearchResult from "../TrackSearchResult/TrackSearchResult";
import ArtistSearchResult from "../ArtistSearchResult/ArtistSearchResult";
import Player from "../Player/Player";

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
    const [playlistResults, setPlaylistResults] = useState([]);
    const [episodeResults, setEpisodeResults] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [topArtists, setTopArtists] = useState([]);

    const [playingTrack, setPlayingTrack] = useState();
    const [trackName, setTrackName] = useState("");
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
            setTopTracks(res.body.items.map(track => {
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
            }));
        });
        spotifyAPI.getMyTopArtists({limit: 7}).then(res => {
            setTopArtists(res.body.items.map(artist => {
                let smallestImage = artist.images.reduce((smallest, image) => {
                    if (image.height < smallest.height) return image;
                    else return smallest;
                }, artist.images[0]);

                let artistGenres = artist.genres.slice(0, 3);

                return {
                    artist: artist.name,
                    genres: artist.genres.length > 0 ? artistGenres.map((genre, i) => {
                        return artistGenres[i] === artistGenres[artistGenres.length - 1] ? genre : genre + ", ";
                    }) : "No Genres Found",
                    popularity: artist.popularity,
                    uri: artist.uri,
                    image: smallestImage.url
                }
            }));
        })
    }, [accessToken]);

    useEffect(() => {
        if (!search) {
            setTrackResults([]);
            setAlbumResults([]);
            setArtistResults([]);
            setEpisodeResults([]);
            setPlaylistResults([]);
            return;
        }
        if (!accessToken) return;

        let cancel = false;
        spotifyAPI.search(search, ["album", "artist", "episode", "playlist", "track"], {limit: 7}).then(res => {
            if (cancel) return;
            console.log(res.body);
            setTrackResults(res.body.tracks.items.map(track => {
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
            }));
            setArtistResults(res.body.artists.items.map(artist => {
                let smallestImage = artist.images.reduce((smallest, image) => {
                    if (image.height < smallest.height) return image;
                    else return smallest;
                }, artist.images[0]);

                let artistGenres = artist.genres.slice(0, 3);

                return {
                    artist: artist.name,
                    genres: artist.genres.length > 0 ? artistGenres.map((genre, i) => {
                        return artistGenres[i] === artistGenres[artistGenres.length - 1] ? genre : genre + ", ";
                    }) : "No Genres Found",
                    popularity: artist.popularity,
                    uri: artist.uri,
                    image: smallestImage.url
                }
            }));
        });

        return () => cancel = true;
    }, [search, accessToken]);

    return (
        <section id="Dashboard" className="flex">
            <Navbar username={username} playlists={playlists} chooseTrack={chooseTrack}></Navbar>
            <div className="container flex-col">
                <input type="search" placeholder="Search Songs/Artists" value={search} onChange={e => setSearch(e.target.value)}></input>
                <div id="SearchResults" className="flex">
                    {trackResults.length === 0 && (<div id="SongLyrics">{lyrics}</div>)}
                    <div className="flex-col searchResultList">
                        {artistResults.length > 0 && (<h2>Songs</h2>)}
                        {trackResults.map(track => (
                        <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack}></TrackSearchResult>))}
                    </div>
                    <div className="flex-col searchResultList">
                        {artistResults.length > 0 && (<h2>Artists</h2>)}
                        {artistResults.map(artist => (
                        <ArtistSearchResult artist={artist} key={artist.uri} chooseTrack={chooseTrack}></ArtistSearchResult>))}
                    </div>
                </div>
                <Player accessToken={accessToken} trackURI={playingTrack?.uri} updateTrack={updateTrack}></Player>
            </div>
            <div className="flex-col topResultList">
                <div className="flex-col topList">
                    <h1>Your Top Tracks</h1>
                    {topTracks.map(track => (
                    <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack}></TrackSearchResult>))}
                </div>
                <div className="flex-col topList">
                    <h1>Your Top Artists</h1>
                    {topArtists.map(artist => (
                    <ArtistSearchResult artist={artist} key={artist.uri} chooseTrack={chooseTrack}></ArtistSearchResult>))}
                </div>
            </div>
        </section>
    );
}

export default Dashboard;