import "./TrackSearchResult.css";

const TrackSearchResult = ({ track, chooseTrack }) => {
    const playSong = () => {
        chooseTrack(track);
    }

    return (
        <div className="flex track" onClick={playSong}>
            <img className="track-icon" src={track.image} alt=""></img>
            <div className="track-wrapper flex-col">
                <div className="track-title">{track.title}</div>
                <div className="track-artist">{track.artist}</div>
            </div>
        </div>
    )
}

export default TrackSearchResult;