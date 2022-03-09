import "./Login.css";

import Button from "@mui/material/Button";

var redirect = "https://spotifyxhc.netlify.app/";
if (window.location.href === "http://localhost:3000/") {
    redirect = "http://localhost:3000/";
}

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=dda37808adc24142b51d4c186d4ba38b&response_type=code&redirect_uri=${redirect}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-top-read%20playlist-modify-public`;

const Login = () => {
    return (
        <section className="flex-col" style={{height: "100vh"}}>
            <div className="container flex-col">
                <h1>Welcome to SpotifyHXC!</h1>
                <p style={{margin: "auto"}}>This website utilizes Spotify's API, and allows the user to play music or podcasts, edit playlists, and share music with others. </p>
                <strong id="Notice"> Please note that you will need a Premium Spotify account in order to access the core features of this website.</strong>
                <Button className="mui-button" href={AUTH_URL} style={{backgroundColor: "#1DB954", color: "white", width: "fit-content", margin: "auto"}}>Login To Spotify</Button>
            </div>
        </section>
    );
}

export default Login;