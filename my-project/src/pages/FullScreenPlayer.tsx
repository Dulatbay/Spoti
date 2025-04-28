import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {spotifyProxy} from "../services/spotifyService.ts";

interface Track {
    id: string;
    name: string;
    preview_url: string;
    artists: { name: string }[];
    album: { name: string; images: { url: string }[] };
}

const FullScreenPlayer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [track, setTrack] = useState<Track | null>(null);
    const [lyrics, setLyrics] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showLyrics, setShowLyrics] = useState<boolean>(false);

    // Fetch track data from the backend or API
    useEffect(() => {
        const fetchTrack = async () => {
            setLoading(true);
            try {
                const response = await spotifyProxy(`tracks/${id}`) // Assuming you have an endpoint that fetches the track by ID
                setTrack(response.data);
            } catch (error) {
                console.error('Error fetching track data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrack();
    }, [id]);

    // Fetch lyrics for the track
    const fetchLyrics = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/lyrics?artist=${encodeURIComponent(track?.artists[0]?.name || '')}&title=${encodeURIComponent(track?.name || '')}`);
            setLyrics(response.data.lyrics || 'Лирики не найдены');
        } catch (error) {
            setLyrics('Ошибка при загрузке лирик');
        } finally {
            setLoading(false);
        }
    };

    const toggleLyrics = () => {
        if (!lyrics) {
            fetchLyrics();
        }
        setShowLyrics(!showLyrics);
    };

    if (loading) {
        return <div className="text-white p-6">Загрузка...</div>;
    }

    if (!track) {
        return <div className="text-white p-6">Трек не найден</div>;
    }

    return (
        <div className="inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg max-w-4xl w-full relative">
                <button onClick={() => window.history.back()} className="absolute top-2 right-2 text-white text-xl">×</button>

                <div className="flex flex-col items-center sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                    <img
                        src={track.album.images[0]?.url}
                        alt={track.name}
                        className="w-full sm:w-48 sm:h-48 object-cover rounded-md"
                    />
                    <div className="flex flex-col justify-between text-center sm:text-left">
                        <h2 className="text-4xl font-bold text-white">{track.name}</h2>
                        <p className="text-lg text-gray-400">{track.artists.map(artist => artist.name).join(', ')}</p>
                        <audio controls className="mt-4 w-full" src={track.preview_url} />
                    </div>
                </div>

                <button onClick={toggleLyrics} className="mt-4 w-full py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
                    {showLyrics ? 'Скрыть лирику' : 'Показать лирику'}
                </button>

                {showLyrics && (
                    <div className="mt-4 text-white">
                        {loading ? <p>Загрузка...</p> : <pre>{lyrics}</pre>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FullScreenPlayer;
