import "./Playlist.css";

const Playlist = ({ playlist, chooseTrack }) => {
    const playPlaylist = () => {
        chooseTrack(playlist);
    }

    return (
        <div className="flex playlist" onClick={playPlaylist}>
            <img className="playlist-icon" src={playlist.image} alt=""></img>
            <div className="playlist-wrapper flex-col">
                <div className="playlist-name">{playlist.name}</div>
                <div className="playlist-length">{playlist.length}</div>
            </div>
        </div>
    )
}

export default Playlist;