import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

interface Artist {
    name: string;
}

interface AlbumImage {
    url: string;
}

interface Album {
    id: string;
    name: string;
    images: AlbumImage[];
    artists: Artist[];
    release_date: string;
    preview_url: string;  // To play the preview
}

interface SearchResults {
    albums: {
        items: Album[];
    };
}


const SearchInput: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hoveredAlbum, setHoveredAlbum] = useState<Album | null>(null); // To track hovered album

    const observer = useRef<IntersectionObserver | null>(null); // Ref to handle infinite scroll
    const abortControllerRef = useRef<AbortController | null>(null); // Ref to cancel previous requests

    // Fetch search results
    const fetchResults = async (query: string, page: number) => {
        try {
            setLoading(true);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort(); // Cancel the previous request if it's still ongoing
            }

            const controller = new AbortController();
            abortControllerRef.current = controller; // Store the controller for future requests

            const response = await axios.get('http://localhost:3000/api/spotify/search', {
                params: { query, limit: 10, offset: (page - 1) * 10 },
                signal: controller.signal, // Pass the abort signal to axios
            });

            if (page === 1) {
                setResults(response.data); // Replace results with new search
            } else {
                setResults((prevResults) => ({
                    ...prevResults,
                    albums: {
                        // @ts-ignore
                        items: [...prevResults.albums.items, ...response.data.albums.items], // Append new items
                    },
                }));
            }
            setLoading(false);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message); // Ignore the canceled requests
            } else {
                console.error('Error fetching search results:', error);
                setLoading(false);
            }
        }
    };

    // Debounced search handler
    const handleSearch = debounce((query: string) => {
        if (query) {
            setPage(1); // Reset to page 1 when a new search query is entered
            fetchResults(query, 1); // Fetch the first page
        }
    }, 3000); // Wait for 3 seconds after user stops typing

    // Effect to handle query changes
    useEffect(() => {
        if (query) {
            handleSearch(query);
        } else {
            setResults(null); // Clear results if query is empty
        }
    }, [query]);

    // Infinite scroll logic
    useEffect(() => {
        const loadMore = () => {
            if (loading) return; // Prevent multiple triggers if loading is true
            setPage((prevPage) => prevPage + 1); // Increment page when scrolled to the bottom
        };

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        };

        observer.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                loadMore();
            }
        }, options);

        const lastElement = document.querySelector('#load-more');
        if (lastElement && observer.current) {
            observer.current.observe(lastElement);
        }

        return () => {
            if (observer.current && lastElement) {
                observer.current.unobserve(lastElement);
            }
        };
    }, [loading]);

    useEffect(() => {
        if (query && page > 1) {
            fetchResults(query, page); // Fetch more results on scroll
        }
    }, [page, query]);


    // Hover album to play music
    const handleHover = (album: Album) => {
        setHoveredAlbum(album);
    };

    const handleClick = (album: Album) => {
        // Handle album click (show more details or navigate)
        alert(`You clicked on album: ${album.name}`);
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
                    <div className="grid grid-cols sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {results.albums?.items.map((item: Album) => (
                            <div
                                key={item.id}
                                className="p-4 rounded-lg hover:bg-zinc-800 cursor-pointer"
                                onClick={() => handleClick(item)}
                                onMouseEnter={() => handleHover(item)} // Start hover behavior
                            >
                                <img
                                    src={item.images[0]?.url}
                                    alt={item.name}
                                    className="object-cover rounded-md mb-2"
                                />
                                <h3 className="text-sm">{item.name}</h3>
                                <p className="text-xs text-gray-400">{item.artists[0]?.name}</p>
                                {hoveredAlbum?.id === item.id && (
                                    <audio
                                        controls
                                        className="mt-2 w-full"
                                        autoPlay
                                        src={item.preview_url}
                                    >
                                        Your browser does not support the audio element.
                                    </audio>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* "More" button for infinite scroll */}
                    <div id="load-more" className="text-center mt-4">
                        {loading ? (
                            <p>Loading more...</p>
                        ) : (
                            <p className="text-sm text-gray-500">Scroll down to load more</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchInput;
