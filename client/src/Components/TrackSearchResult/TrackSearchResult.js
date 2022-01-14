import "./TrackSearchResult.css";

const TrackSearchResult = ({ track, chooseTrack }) => {
    const handlePlay = () => {
        chooseTrack(track);
    }

    return (
        <div className="flex track" onClick={handlePlay}>
            <img className="track-icon" src={track.albumURL} alt=""></img>
            <div className="track-wrapper flex-col">
                <div className="track-title">{track.title}</div>
                <div className="track-artist">{track.artist}</div>
            </div>
        </div>
    )
}

export default TrackSearchResult;