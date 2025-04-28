import React, { useEffect } from 'react';

const SpotifyPlayer: React.FC = () => {
    const accessToken = localStorage.getItem('spotify_access_token');

    // Define the function required by the SDK
    const onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
            name: "Web Player",
            getOAuthToken: (cb: Function) => cb(accessToken),
            volume: 0.5,
        });

        player.addListener('ready', ({ device_id }: any) => {
            console.log('The Web Playback SDK is ready with Device ID', device_id);
        });

        player.addListener('player_state_changed', (state: any) => {
            console.log(state);
        });

        player.connect().then((success: boolean) => {
            if (success) {
                console.log('The player has connected');
            }
        });
    };

    // Effect to initialize the SDK when the component mounts
    useEffect(() => {
        // Check if the Spotify SDK is available
        if (window.Spotify) {
            // Initialize the SDK
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js';
            script.async = true;
            script.onload = onSpotifyWebPlaybackSDKReady;
            document.body.appendChild(script);
        }
    }, [accessToken]);

    const playTrack = (uri: string) => {
        if (window.Spotify && accessToken) {
            const player = new window.Spotify.Player({
                name: "Web Player",
                getOAuthToken: (cb: Function) => cb(accessToken),
                volume: 0.5,
            });

            player.play({
                uris: [uri], // Provide the Spotify URI of the track you want to play
            });
        }
    };

    return (
        <div>
            <button onClick={() => playTrack('spotify:track:3n3P8vwdpS5uXUEws0J0Pf')}>Play Full Song</button>
        </div>
    );
};

export default SpotifyPlayer;
