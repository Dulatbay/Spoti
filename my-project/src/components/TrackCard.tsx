import {Track} from "./SearchInput.tsx";
import {useNavigate} from "react-router-dom";

const TrackCard: React.FC<{ track: Track }> = ({ track }) => {
    const navigate = useNavigate();

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    const handleClick = () => {
        navigate(`/player/${track.id}`);
    };

    return (
        <div className="p-4 bg-[#282828] rounded-lg hover:bg-zinc-700 cursor-pointer flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-2" onClick={handleClick} >
            {/* Album Image */}
            <img
                src={track.album.images[0]?.url}
                alt={track.name}
                className="w-full sm:w-24 h-24 sm:h-24 object-cover rounded-md"
            />

            <div className="flex flex-col justify-between">
                {/* Track Name and Artist */}
                <div className="text-white text-lg font-semibold">{track.name}</div>
                <div className="text-gray-400 text-sm">{track.artists.map((artist) => artist.name).join(', ')}</div>

                {/* Conditionally render the rest based on screen size */}
                <div className="hidden sm:block text-gray-500 text-xs">
                    <div className="truncate">{track.album.name}</div>
                    <div>{track.release_date}</div>
                    <div>{formatDuration(track.duration_ms)}</div>
                </div>
            </div>
        </div>
    );
};

export default TrackCard;
