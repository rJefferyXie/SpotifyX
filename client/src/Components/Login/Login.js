import "./Login.css";

const redirect = process.env.REDIRECT_URI || "http://localhost:3000";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=dda37808adc24142b51d4c186d4ba38b&response_type=code&redirect_uri=${redirect}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

const Login = () => {
    return (
        <section className="flex-col">
            <div className="container flex-col">
                <a id="Login-Button" href={AUTH_URL}>Login To Spotify</a>
            </div>
        </section>
    );
}

export default Login;