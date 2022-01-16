import "./Login.css";

var redirect = "https://spotifyxhc.netlify.app/";
if (window.location.href === "http://localhost:3000/") {
    redirect = "http://localhost:3000/";
}

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=dda37808adc24142b51d4c186d4ba38b&response_type=code&redirect_uri=${redirect}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

const Login = () => {
    return (
        <section className="flex-col">
            <div className="container flex-col">
                <h1>Welcome to SpotifyHXC!</h1>
                <p>This website utilizes Spotify's API, and allows the user to play music or podcasts, edit playlists, and share music with others. </p>
                <strong id="Notice"> Please note that you will need a Premium Spotify account in order to access the core features of this website.</strong>
                <a id="Login-Button" href={AUTH_URL}>Login To Spotify</a>
            </div>
        </section>
    );
}

export default Login;