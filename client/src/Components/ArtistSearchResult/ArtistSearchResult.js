import "./ArtistSearchResult.css";

const ArtistSearchResult = ({ artist, chooseTrack }) => {
    const play = () => {
        chooseTrack(artist);
    }

    return (
        <div className="flex search-result" onClick={play}>
            <img className="search-result-icon" src={artist.image} alt=""></img>
            <div className="search-result-wrapper flex-col">
                <p className="search-result-name">{artist.name}</p>
                <p className="search-result-secondary">{artist.genres}</p>
                <p className="search-result-popularity">
                    Popularity: <span style={{color: `rgb(${(255 * (100 - artist.popularity)) / 100}, ${180}, ${(255 * artist.popularity) / 100 })`}}>{artist.popularity}</span>
                </p>
            </div>
        </div>
    )
}

export default ArtistSearchResult;