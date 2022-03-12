import "./AlbumSearchResult.css";

import Card from "@mui/material/Card";

const AlbumSearchResult = ({ album, chooseTrack, bg }) => {
    const play = () => {
        chooseTrack(album);
    }

    return (
        <Card className="flex search-result" variant="outlined" style={{borderRadius: "0px", backgroundColor: bg}} onClick={play}>
            <img className="search-result-icon" src={album.image} alt=""></img>
            <div className="search-result-wrapper flex-col">
                <p className="search-result-name" style={bg === "white" ? null : {color: "white"}}>{album.title}</p>
                <p className="search-result-secondary">{album.artist}</p>
                {bg === "white" ? <p className="search-result-popularity">
                    {album.length} songs
                </p> : null}
            </div>
        </Card>
    )
}

export default AlbumSearchResult;