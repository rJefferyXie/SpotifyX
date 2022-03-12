import "./Navbar.css";
import Playlist from "../Playlist/Playlist";
import TrackSearchResult from "../TrackSearchResult/TrackSearchResult";
import ArtistSearchResult from "../ArtistSearchResult/ArtistSearchResult";

const Navbar = ({ username, playlists, topTracks, topArtists, chooseTrack }) => {
    return (
        <div id="Navbar" className="flex-col">
            <div className="flex-col topList">
                <h1>Your Playlists</h1>
                {playlists.map(playlist => (
                <Playlist playlist={playlist} key={playlist.uri} chooseTrack={chooseTrack}></Playlist>))}
            </div>
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
    )
}

export default Navbar;