import React from 'react';

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
    tracks: Track[];
}

const AlbumComponent: React.FC<{ album: Album }> = ({ album }) => {
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
                    <p className="text-lg text-gray-400">by {album.artists.map(artist => artist.name).join(', ')}</p>
                    <p className="text-sm text-gray-500">{album.release_date}</p>
                </div>
            </div>

            {/* Tracklist */}
            <div className="mt-6 space-y-4">
                {album.tracks.map((track, index) => (
                    <div key={track.id} className="flex justify-between items-center py-2 px-4 hover:bg-gray-800 rounded-md">
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

export default AlbumComponent;
