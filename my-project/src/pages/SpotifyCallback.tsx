// src/components/SpotifyCallback.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SpotifyCallback: React.FC = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        // Get the access token from the URL fragment
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const token = hashParams.get('access_token');

        if (token) {
            setAccessToken(token);
            localStorage.setItem('spotify_access_token', token); // Save token to localStorage
        }
    }, [location]);

    return (
        <div className="p-6">
            {accessToken ? (
                <p>Logged in! You can now play music.</p>
            ) : (
                <p>Error: No access token found.</p>
            )}
        </div>
    );
};

export default SpotifyCallback;
