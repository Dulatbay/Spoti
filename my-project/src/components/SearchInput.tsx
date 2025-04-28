import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {debounce} from 'lodash';
import {spotifySearch} from "../services/spotifyService.ts";
import TrackCard from "./TrackCard.tsx";
import {useNavigate} from "react-router-dom";

export interface Artist {
    name: string;
}

export interface AlbumImage {
    url: string;
}

export type Track = {
    type: "track";
    id: string;
    name: string;
    preview_url: string;
    artists: Artist[];
    album: {
        name: string;
        images: AlbumImage[];
    };
    href: string;
    duration_ms: number;
    release_date: string;
}

export type Playlist = {
    type: "PLAYLIST";
    id: string;
    name: string;
    images: AlbumImage[];
    owner: {
        display_name: string;
    };
    external_urls: {
        spotify: string;
    };
    href: string;
}

export type Album = {
    type: "ALBUM";
    id: string;
    name: string;
    images: AlbumImage[];
    artists: Artist[];
    release_date: string;
    preview_url: string;
    href: string;
}

interface SearchResults {
    tracks: {
        items: Track[];
    };
    albums: {
        items: Album[];
    };
    playlists: {
        items: Playlist[];
    };
}

const getUrl = (href: string) => {
    const regex = /v1\/(.*)/; // Matches everything after 'v1/'

    const match = href.match(regex);

    if (match) {
        return match[1];
    } else {
        return null
    }
}

const SearchInput: React.FC = () => {
    const [query, setQuery] = useState<string>('kendrik');
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate()
    const abortControllerRef = useRef<AbortController | null>(null);

    // Fetch search results
    const fetchResults = async (query: string) => {
        try {
            setLoading(true);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const response = await spotifySearch(query);


            setResults(response.data);
            setLoading(false);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                console.error('Error fetching search results:', error);
                setLoading(false);
            }
        }
    };

    // Create a debounced function using useCallback
    const handleSearch = useCallback(
        debounce((query: string) => {
            if (query) {
                fetchResults(query); // Fetch the first page
            }
        }, 3000), // Debounce delay of 3 seconds
        [] // Empty dependency array ensures debounce function is created once
    );

    // Effect to handle query changes
    useEffect(() => {
        if (query) {
            handleSearch(query);
        } else {
            setResults(null); // Clear results if query is empty
        }
    }, [query]);


    const handleClick = async (item: Track | Album | Playlist) => {
        const url = getUrl(item.href);

        if (!url) {
            alert('Invalid URL');
            return;
        }

        console.log(item);
        if (item.type === "track") {
            // Handle track click
            console.log('Track clicked:', item);
        } else {
            navigate("/albums?q=" + url);
        }
    };

    return (
        <div className="dark:text-white p-6 max-w-[1200px] mx-auto">
            <input
                type="text"
                className="w-full p-4 font-medium rounded-lg bg-gray-600 text-white placeholder-gray-400"
                placeholder="Search for albums, playlists, or tracks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {loading && <p className="mt-4">Loading...</p>}

            {results && (
                <div className="mt-6">
                    <div className="space-y-6">
                        {/* Render Tracks */}
                        {results.tracks?.items.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold">Tracks</h2>
                                <div className="flex flex-col space-y-2 mt-4">
                                    {results.tracks.items
                                        .filter((item: Track) => item)
                                        .map((item: Track) => (
                                            <div
                                                key={item.id}
                                                onClick={() => handleClick(item)}>
                                                <TrackCard track={item}/>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Render Albums */}
                        {results.albums?.items.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold">Albums</h2>
                                <div className="grid grid-cols sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {results.albums.items
                                        .filter((item: Album) => item)
                                        .map((item: Album) => (
                                            <div
                                                key={item.id}
                                                className="p-4 rounded-lg hover:bg-zinc-800 cursor-pointer"
                                                onClick={() => handleClick(item)}
                                            >
                                                <img
                                                    src={item.images[0]?.url}
                                                    alt={item.name}
                                                    className="object-cover rounded-md mb-2"
                                                />
                                                <h3 className="text-sm">{item.name}</h3>
                                                <p className="text-xs text-gray-400">{item.artists[0]?.name}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Render Playlists */}
                        {/*{results.playlists?.items.length > 0 && (*/}
                        {/*    <div>*/}
                        {/*        <h2 className="text-lg font-bold">Playlists</h2>*/}
                        {/*        <div className="grid grid-cols sm:grid-cols-3 md:grid-cols-4 gap-4">*/}
                        {/*            {results.playlists.items*/}
                        {/*                .filter((item: Playlist) => item)*/}
                        {/*                .map((item: Playlist) => (*/}
                        {/*                    <div*/}
                        {/*                        key={item.id}*/}
                        {/*                        className="p-4 rounded-lg hover:bg-zinc-800 cursor-pointer"*/}
                        {/*                        onClick={() => handleClick(item)}*/}
                        {/*                    >*/}
                        {/*                        <img*/}
                        {/*                            src={item?.images[0]?.url}*/}
                        {/*                            alt={item?.name}*/}
                        {/*                            className="object-cover rounded-md mb-2"*/}
                        {/*                        />*/}
                        {/*                        <h3 className="text-sm">{item?.name}</h3>*/}
                        {/*                        <p className="text-xs text-gray-400">{item?.owner?.display_name}</p>*/}
                        {/*                    </div>*/}
                        {/*                ))}*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*)}*/}

                    </div>

                </div>
            )}
        </div>
    );
};

export default SearchInput;
