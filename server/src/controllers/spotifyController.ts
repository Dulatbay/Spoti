import axios from 'axios';
import { Request, Response } from 'express';

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

const fetchAccessToken = async (): Promise<void> => {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
            }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                    ).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        accessToken = response.data.access_token;
        tokenExpiry = Date.now() + response.data.expires_in * 1000;
        console.log('Access token fetched successfully');
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
};

const isTokenExpired = (): boolean => {
    return !accessToken || Date.now() >= tokenExpiry!;
};

const searchSpotify = async (req: Request, res: Response): Promise<void> => {
    const { query, limit = 10, offset = 0 } = req.query; // Query params from frontend

    if (!query) {
        res.status(400).json({ error: 'Query is required' });
        return
    }

    if (isTokenExpired()) {
        await fetchAccessToken();
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                q: query,
                type: 'album,playlist,track', // Search for albums, playlists, and tracks
                limit,
                offset,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error searching Spotify:', error);
        res.status(500).json({ error: 'Failed to search Spotify' });
    }
};

const proxySpotify = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query; // Query params from frontend

    if (!query) {
        res.status(400).json({ error: 'Query is required' });
        return
    }

    if (isTokenExpired()) {
        await fetchAccessToken();
    }

    console.log(`Proxying request to Spotify API: ${query}`);
    try {
        const response = await axios.get(`https://api.spotify.com/v1/${query}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error searching Spotify:', error);
        res.status(500).json({ error: 'Failed to search Spotify' });
    }
}



export { searchSpotify,proxySpotify };
