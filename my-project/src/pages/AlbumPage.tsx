import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {spotifyProxy} from "../services/spotifyService.ts";

interface Artist {
    name: string;
}

interface AlbumImage {
    url: string;
}

interface Track {
    id: string;
    name: string;
    preview_url: string;
    duration_ms: number;
}

interface Album {
    id: string;
    name: string;
    images: AlbumImage[];
    artists: Artist[];
    release_date: string;
    tracks: {
        items: Track[];
    }
}

const AlbumPage: React.FC = () => {
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Extract query parameter 'q' from URL
    const queryParams = new URLSearchParams(location.search);
    const href = queryParams.get('q');

    useEffect(() => {
        if (!href) {
            navigate('/'); // Redirect to homepage if 'q' param is not found
            return;
        }

        const fetchAlbum = async (href: string) => {
            try {
                setLoading(true);
                const response = await spotifyProxy(href);
                setAlbum(response.data); // Assuming the API returns album data in the required format
                setLoading(false);
            } catch (error) {
                console.error('Error fetching album data:', error);
                setLoading(false);
            }
        };

        fetchAlbum(href);
    }, [href, navigate]);

    if (loading) {
        return <div className="text-white p-6">Loading...</div>;
    }

    if (!album) {
        return <div className="text-white p-6">Album not found</div>;
    }

    // Format track duration (milliseconds to mm:ss)
    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    return (
        <div className="bg-black text-white p-6 rounded-lg max-w-[900px] mx-auto">
            {/* Album Cover and Title */}
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                <img
                    src={album.images[0]?.url}
                    alt={album.name}
                    className="w-full sm:w-48 sm:h-48 object-cover rounded-md"
                />
                <div className="flex flex-col justify-between">
                    <h2 className="text-3xl font-bold">{album.name}</h2>
                    {
                        album?.artists &&
                        <p className="text-lg text-gray-400">by {album?.artists?.map(artist => artist.name).join(', ')}</p>
                    }
                    <p className="text-sm text-gray-500">{album.release_date}</p>
                </div>
            </div>

            {/* Tracklist */}
            <div className="mt-6 space-y-4">
                {album.tracks.items.map((track, index) => (
                    <div key={track.id} className="flex justify-between items-center py-2 px-4 hover:bg-gray-800 rounded-md"
                         onClick={() => {
                             console.log("track", track)
                             navigate(`/player/${track.id}`)
                         }}
                    >
                        <div className="flex items-center space-x-4">
                            <span className="text-white">{index + 1}. {track.name}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{formatDuration(track.duration_ms)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlbumPage;
