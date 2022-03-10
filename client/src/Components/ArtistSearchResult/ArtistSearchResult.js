import "./ArtistSearchResult.css";

import Card from "@mui/material/Card"

const ArtistSearchResult = ({ artist, chooseTrack, bg }) => {
    const play = () => {
        chooseTrack(artist);
    }

    return (
        <Card className="flex search-result" variant="outlined" style={{borderRadius: "0px", backgroundColor: bg}} onClick={play}>
            <img className="search-result-icon" src={artist.image} alt=""></img>
            <div className="search-result-wrapper flex-col">
                <p className="search-result-name" style={bg === "white" ? null : {color: "white"}}>{artist.artist}</p>
                <p className="search-result-secondary">{artist.genres}</p>
                {bg === "white" ? <p className="search-result-popularity">
                    Popularity: <span style={{color: `rgb(${(255 * (100 - artist.popularity)) / 100}, ${180}, ${(255 * artist.popularity) / 100 })`}}>{artist.popularity}</span>
                </p> : null}
            </div>
        </Card>
    )
}

export default ArtistSearchResult;