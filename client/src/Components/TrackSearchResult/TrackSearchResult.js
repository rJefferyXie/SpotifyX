import "./TrackSearchResult.css";

import Card from "@mui/material/Card"

const TrackSearchResult = ({ track, chooseTrack }) => {
    const play = () => {
        chooseTrack(track);
    }

    return (
        <Card className="flex search-result" variant="outlined" style={{borderRadius: "0px"}} onClick={play}>
            <img className="search-result-icon" src={track.image} alt=""></img>
            <div className="search-result-wrapper flex-col">
                <p className="search-result-name">{track.title}</p>
                <p className="search-result-secondary">{track.artist}</p>
                <p className="search-result-popularity">
                    Popularity: <span style={{color: `rgb(${(255 * (100 - track.popularity)) / 100}, ${180}, ${(255 * track.popularity) / 100 })`}}>{track.popularity}</span>
                </p>
            </div>
        </Card>
    )
}

export default TrackSearchResult;