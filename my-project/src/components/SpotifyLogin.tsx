// src/components/SpotifyLogin.tsx
import React from 'react';

const SpotifyLogin: React.FC = () => {
    const handleLogin = () => {
        const redirect_uri = "http://localhost:5174/callback"; // Change this to your redirect URI
        const client_id = "4e0b1f4317544fd9b1099fa529f965cb"; // Replace with your actual Spotify Client ID
        const scope = "streaming user-read-email user-read-private"; // Scopes required for playback
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}&scope=${scope}`; // Redirect to Spotify login page
    };

    return (
        <div className="p-6">
            <button
                onClick={handleLogin}
                className="bg-green-600 text-white p-4 rounded-lg"
            >
                Log in with Spotify
            </button>
        </div>
    );
};

export default SpotifyLogin;
