import "./Navbar.css";
import Playlist from "../Playlist/Playlist";

const Navbar = ({ username, playlists, chooseTrack }) => {
    return (
        <nav className="flex-col">
            <h1 style={{margin: "auto", width: "fit-content"}}>{username}</h1>
            <div id="Playlists" className="flex-col">
                {playlists.map(playlist => (
                <Playlist playlist={playlist} key={playlist.uri} chooseTrack={chooseTrack}></Playlist>))}
            </div>
        </nav>
    )
}

export default Navbar;